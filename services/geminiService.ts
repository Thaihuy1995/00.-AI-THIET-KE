import { GoogleGenAI } from "@google/genai";
import { AppState, RenderMode, Creativity } from "../types";
import { ADMIN_POSITIVE_PARAMS, ADMIN_NEGATIVE_CONSTRAINTS } from "../constants";

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateRender = async (
  state: AppState, 
  presetContent: string,
  onProgress?: (val: number) => void
): Promise<string[]> => {
  
  if (!process.env.API_KEY) {
    throw new Error("API Key not found in environment. Please connect API Key.");
  }

  // Always create new instance to get latest key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Model Selection
  // Render Nhanh -> gemini-2.5-flash-image
  // Render Cao (Nano Bananapro) -> gemini-3-pro-image-preview
  const modelName = state.settings.mode === RenderMode.FAST 
    ? 'gemini-2.5-flash-image' 
    : 'gemini-3-pro-image-preview';

  // Construct Prompt based on System Core Identity
  let fullPrompt = "IMAGE GENERATION REQUEST:\n";
  
  // 1. Core Instruction: Transform Sketch to Photorealistic
  fullPrompt += "TASK: Transform the provided input architectural sketch/drawing (Geometry) into a photorealistic 8K render.\n";
  
  // 2. Geometry Lock
  if (state.settings.creativity === Creativity.LOW) {
    fullPrompt += "GEOMETRY CONSTRAINT: STRICTLY LOCK the geometry, massing, and perspective of the input image. Do not add floors, change the building shape, or alter the camera angle.\n";
  } else {
    fullPrompt += "GEOMETRY CONSTRAINT: Respect the main massing but you may enhance details, add realistic materials, and improve the surroundings while keeping the core structure identifiable.\n";
  }

  // 3. User Prompt & Preset
  fullPrompt += `\nSTYLE & CONTEXT DESCRIPTION:\n${presetContent}\n`;
  if (state.userPrompt) {
    fullPrompt += `ADDITIONAL USER REQUESTS: ${state.userPrompt}\n`;
  }

  // 4. Clean Up / Remove Text Logic
  if (state.settings.removeText) {
    fullPrompt += "\nCLEANUP INSTRUCTION (CRITICAL): REMOVE ALL existing text, signboards, billboards, and logos from the building facade in the input image. The final render must contain NO TEXT, NO LETTERS, and NO LOGOS on the building or in the background. Surfaces should be clean materials only.\n";
  }

  // 5. Admin Protocol (Unlock specific specs if key is valid)
  if (state.isLicenseValid) {
    fullPrompt += `\n${ADMIN_POSITIVE_PARAMS}\n`;
    fullPrompt += `\n${ADMIN_NEGATIVE_CONSTRAINTS}\n`;
  } else {
    // Basic quality instructions for free users
    fullPrompt += "\nQUALITY: High quality, photorealistic, architectural visualization, 4k.\n";
    fullPrompt += "\nNEGATIVE PROMPT: text, watermark, signature, logo, writing, words, branding, graphic design elements.\n";
  }

  // STRICT RULE FOR AI - REINFORCED
  fullPrompt += "\nIMPORTANT: Do NOT generate any text, sign, or logo in the image. The image must be clean photography only.\n";

  const parts: any[] = [];
  
  // Input Image (Geometry) - Required
  if (state.inputImage) {
    const base64Data = await fileToGenerativePart(state.inputImage);
    parts.push({
      inlineData: {
        data: base64Data,
        mimeType: state.inputImage.type
      }
    });
  }

  // Ref Image (Optional)
  if (state.refImage) {
     const base64Data = await fileToGenerativePart(state.refImage);
    parts.push({
      inlineData: {
        data: base64Data,
        mimeType: state.refImage.type
      }
    });
    fullPrompt += "REFERENCE: Use the second image as a style/material reference only.\n";
  }

  parts.push({ text: fullPrompt });
  
  const generatedImages: string[] = [];
  const count = state.settings.count;
  
  const config: any = {};
  if (modelName === 'gemini-3-pro-image-preview') {
     config.imageConfig = {
         imageSize: state.settings.resolution === '4K' ? '4K' : (state.settings.resolution === '2K' ? '2K' : '1K')
     };
  }
  
  // Execution Loop
  for (let i = 0; i < count; i++) {
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: { parts: parts },
            config: config
        });

        // Parse response
        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    generatedImages.push(`data:image/png;base64,${part.inlineData.data}`);
                }
            }
        }
        
        if (onProgress) onProgress(((i + 1) / count) * 90);

    } catch (e: any) {
        console.error("Generation failed for iteration", i, e);
        if (e.message?.includes("403") || e.status === 403 || e.status === "PERMISSION_DENIED") {
           throw new Error("Lỗi Quyền Truy Cập (403): API Key chưa được chọn hoặc không có quyền.");
        }
        if (e.message?.includes("500") || e.status === 500) {
           // Continue loop for transient 500
           console.warn("Transient 500 error, retrying next iteration if available.");
        }
    }
  }

  if (generatedImages.length === 0) {
      throw new Error("Không tạo được ảnh (Lỗi 403/500). Vui lòng kiểm tra API Key và thử lại.");
  }

  if (onProgress) onProgress(100);
  return generatedImages;
};

// NEW FUNCTION: UPSCALE 4K
export const upscaleImage = async (
    imageFile: File,
    onProgress?: (val: number) => void
): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API Key not found");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelName = 'gemini-3-pro-image-preview'; // Required for High Res

    let prompt = "UPSCALING REQUEST:\n";
    prompt += "TASK: Enhance this image to 4K resolution (Super Resolution). \n";
    prompt += "DETAILS: Sharpen all textures, enhance lighting, remove noise/artifacts, and make it photorealistic 8K quality. \n";
    prompt += "CONSTRAINT: STRICTLY KEEP the original composition, colors, and content. Do not change the building design. Just improve quality to the maximum possible level.\n";
    prompt += "NEGATIVE: No text, no blur, no low resolution, no artifacts.\n";

    const base64Data = await fileToGenerativePart(imageFile);
    
    const parts = [
        {
            inlineData: {
                data: base64Data,
                mimeType: imageFile.type
            }
        },
        { text: prompt }
    ];

    if (onProgress) onProgress(30);

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: { parts: parts },
            config: {
                imageConfig: { imageSize: '4K' }
            }
        });

        if (onProgress) onProgress(90);

        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    if (onProgress) onProgress(100);
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
            }
        }
    } catch (e: any) {
        console.error("Upscale failed", e);
        if (e.message?.includes("403") || e.status === 403) {
            throw new Error("Lỗi Quyền Truy Cập (403): API Key không hợp lệ.");
         }
        throw e;
    }

    throw new Error("Không thể Upscale ảnh này. Vui lòng thử lại.");
}