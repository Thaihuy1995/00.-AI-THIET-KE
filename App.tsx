import React, { useState, useEffect, useRef } from 'react';
import ImageUploader from './components/ImageUploader';
import TanPhatLogo from './components/TanPhatLogo';
import { AppState, RenderMode, Resolution, Creativity, HistoryItem } from './types';
import { PRESET_PROMPTS, ASPECT_RATIOS, ADMIN_KEY, getLogoSvg } from './constants';
import { generateRender, upscaleImage } from './services/geminiService';

const App: React.FC = () => {
  // --- STATE ---
  const [apiKeyReady, setApiKeyReady] = useState(false);
  const [state, setState] = useState<AppState>({
    inputImage: null,
    inputImagePreview: null,
    refImage: null,
    refImagePreview: null,
    userPrompt: "",
    selectedPresetId: 0,
    settings: {
      mode: RenderMode.FAST,
      resolution: Resolution.RES_1K,
      count: 1,
      creativity: Creativity.LOW,
      removeText: false 
    },
    licenseKey: "",
    isLicenseValid: false,
    credits: 20,
    maxCredits: 20
  });

  // Upscale State
  const [upscaleImageFile, setUpscaleImageFile] = useState<File | null>(null);
  const [upscalePreview, setUpscalePreview] = useState<string | null>(null);
  const [isUpscaling, setIsUpscaling] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentViewImage, setCurrentViewImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // UI State
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(true); // Default expanded

  // --- API KEY CHECK ---
  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (hasKey) {
          setApiKeyReady(true);
        }
      } else {
        // Fallback for dev/manual env
        if (process.env.API_KEY) setApiKeyReady(true);
      }
    };
    checkKey();
  }, []);

  const handleConnectKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setApiKeyReady(true);
      } catch (e) {
        console.error("Key selection failed", e);
        alert("Không thể kết nối API Key. Vui lòng thử lại.");
      }
    }
  };

  // --- HANDLERS ---

  const handleInputImageUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setState(prev => ({ ...prev, inputImage: file, inputImagePreview: url }));
  };

  const handleRefImageUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setState(prev => ({ ...prev, refImage: file, refImagePreview: url }));
  };

  const handleUpscaleImageUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setUpscaleImageFile(file);
    setUpscalePreview(url);
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    setState(prev => ({ ...prev, selectedPresetId: id }));
  };

  const handleKeySubmit = () => {
    if (state.licenseKey === ADMIN_KEY) {
      setState(prev => ({ 
        ...prev, 
        isLicenseValid: true, 
        credits: 70, 
        maxCredits: 70,
        settings: { ...prev.settings, mode: RenderMode.HIGH } // Auto upgrade to high
      }));
      alert("Kích hoạt License TANPHAT thành công! Đã mở khóa tính năng 4K & Upscale & Xóa Logo.");
    } else {
      alert("Mã Key không hợp lệ.");
    }
  };

  const handleGenerate = async () => {
    // Re-check API Key
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
       alert("API Key chưa được chọn. Vui lòng chọn Key.");
       setApiKeyReady(false);
       return;
    }

    if (!state.inputImage) {
      alert("Vui lòng tải lên ảnh kiến trúc (Input Geometry) trước.");
      return;
    }
    if (state.credits <= 0) {
      alert("Bạn đã hết lượt tạo ảnh trong ngày.");
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    const timer = setInterval(() => {
      setProgress(old => (old >= 90 ? old : old + (Math.random() * 5)));
    }, 500);

    try {
      const preset = PRESET_PROMPTS.find(p => p.id === state.selectedPresetId);
      const presetContent = preset ? preset.content : "Tự do sáng tạo dựa trên hình khối.";

      const images = await generateRender(state, presetContent, (val) => setProgress(val));
      
      clearInterval(timer);
      setProgress(100);

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageUrls: images,
        prompt: preset ? preset.name : "Custom Prompt",
        presetId: state.selectedPresetId || undefined
      };

      setHistory(prev => [newItem, ...prev]);
      setCurrentViewImage(images[0]);
      setState(prev => ({ ...prev, credits: prev.credits - 1 }));

    } catch (error: any) {
      clearInterval(timer);
      console.error(error);
      if (error.message?.includes("403")) {
         alert("Lỗi 403: Vui lòng chọn API Key hợp lệ cho Model.");
         setApiKeyReady(false);
      } else {
         alert("Lỗi Render: " + error.message);
      }
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const handleUpscale = async () => {
      if (!upscaleImageFile) {
          alert("Vui lòng tải ảnh cần Upscale lên.");
          return;
      }
      if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
        alert("API Key chưa được chọn.");
        setApiKeyReady(false);
        return;
      }

      setIsUpscaling(true);
      setProgress(0);
      
      const timer = setInterval(() => {
        setProgress(old => (old >= 80 ? old : old + 2));
      }, 200);

      try {
          const upscaledImageUrl = await upscaleImage(upscaleImageFile, (val) => setProgress(val));
          
          clearInterval(timer);
          setProgress(100);

          const newItem: HistoryItem = {
            id: `upscale-${Date.now()}`,
            timestamp: Date.now(),
            imageUrls: [upscaledImageUrl],
            prompt: "Upscale 4K Enhancement",
          };

          setHistory(prev => [newItem, ...prev]);
          setCurrentViewImage(upscaledImageUrl);
          setState(prev => ({ ...prev, credits: prev.credits - 1 }));
          
      } catch (e: any) {
          clearInterval(timer);
          alert("Lỗi Upscale: " + e.message);
          if (e.message?.includes("403")) setApiKeyReady(false);
      } finally {
          setIsUpscaling(false);
          setProgress(0);
      }
  };

  const handleUseAsInput = async () => {
    if (currentViewImage) {
      try {
        const res = await fetch(currentViewImage);
        const blob = await res.blob();
        const file = new File([blob], "reused_input.png", { type: "image/png" });
        handleInputImageUpload(file);
      } catch (e) {
        console.error("Error reusing image", e);
      }
    }
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Bạn có chắc chắn muốn xóa ảnh này không?")) {
      const itemToDelete = history.find(item => item.id === id);
      setHistory(prev => prev.filter(item => item.id !== id));
      if (itemToDelete && currentViewImage && itemToDelete.imageUrls.includes(currentViewImage)) {
         setCurrentViewImage(null);
      }
    }
  };

  // Zoom logic
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.5, 1));
  
  const handleDownload = async () => {
    if (!currentViewImage) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = currentViewImage;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Draw Main Image
      ctx.drawImage(img, 0, 0);

      // --- CONDITIONAL LOGO ---
      // ONLY draw logo if the license is NOT valid.
      // If Key is valid, skip this block => No logo on download.
      if (!state.isLicenseValid) {
        const logoSvgString = getLogoSvg('original');
        const base64Svg = btoa(unescape(encodeURIComponent(logoSvgString)));
        const logoImg = new Image();
        logoImg.src = `data:image/svg+xml;base64,${base64Svg}`;

        await new Promise((resolve, reject) => {
          logoImg.onload = resolve;
          logoImg.onerror = reject;
        });

        const targetLogoWidth = canvas.width * 0.30;
        const aspectRatio = 600 / 100;
        const targetLogoHeight = targetLogoWidth / aspectRatio;
        const padding = canvas.width * 0.03;

        ctx.save();
        ctx.shadowColor = "rgba(255, 255, 255, 1)";
        ctx.shadowBlur = 15;
        ctx.drawImage(logoImg, padding, padding, targetLogoWidth, targetLogoHeight);
        ctx.restore();
      }

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `TANPHAT_RENDER_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (e) {
      console.error("Download failed", e);
      const link = document.createElement('a');
      link.href = currentViewImage;
      link.download = `TANPHAT_RENDER_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // --- RENDER SPLASH SCREEN IF NO KEY ---
  if (!apiKeyReady) {
    return (
      <div className="h-screen w-screen bg-tp-dark flex flex-col items-center justify-center text-center p-8">
        <TanPhatLogo variant="white" className="w-96 mb-8" />
        <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">Hệ Thống Yêu Cầu Kết Nối</h1>
        <p className="text-tp-muted mb-8 max-w-md">
          Để sử dụng công nghệ AI tạo ảnh kiến trúc siêu thực tế (Gemini 3 Pro), 
          vui lòng kết nối API Key từ Google AI Studio.
        </p>
        <button 
          onClick={handleConnectKey}
          className="bg-tp-accent hover:bg-tp-accentHover text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-red-900/50 transition-all flex items-center space-x-2"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
          <span>KẾT NỐI API KEY</span>
        </button>
        <div className="mt-8 text-xs text-tp-muted opacity-50">
          Powered by Google Gemini 3 Pro
        </div>
      </div>
    );
  }

  // --- RENDER MAIN APP ---
  return (
    <div className="flex h-screen bg-tp-dark text-gray-300 font-sans selection:bg-tp-accent selection:text-white">
      
      {/* --- SIDEBAR (Controls) --- */}
      <div className="w-[350px] bg-tp-panel border-r border-tp-border flex flex-col h-full z-20 shadow-xl">
        {/* Header */}
        <div className="p-5 border-b border-tp-border bg-tp-dark/50 flex flex-col items-start">
          <TanPhatLogo variant="white" className="w-56 mb-2" />
          <div className="flex items-center space-x-2">
            <span className="text-[10px] bg-tp-accent text-white px-1.5 py-0.5 rounded font-bold">V1.2</span>
            <p className="text-[10px] text-tp-muted uppercase tracking-widest">Kernel System Ready</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* MỤC 1: INPUT */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-tp-accent text-white text-xs font-bold">1</span>
              <h2 className="text-sm font-bold text-white uppercase">Tải Lên Ảnh</h2>
            </div>
            <ImageUploader 
              label="Ảnh Phác Thảo / Geometry (Bắt buộc)" 
              preview={state.inputImagePreview} 
              onUpload={handleInputImageUpload}
              onClear={() => setState(prev => ({...prev, inputImage: null, inputImagePreview: null}))}
              heightClass="h-40"
              required
            />
            <p className="text-[10px] text-tp-muted italic border-l-2 border-tp-accent pl-2">
              *Geometry (Hình khối) của ảnh này sẽ được khóa cứng làm cơ sở phát triển.
            </p>
          </section>

          {/* MỤC 2: STYLE & PROMPT */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-tp-accent text-white text-xs font-bold">2</span>
              <h2 className="text-sm font-bold text-white uppercase">Mô Tả & Style</h2>
            </div>
            
            <ImageUploader 
              label="Ảnh Tham Chiếu (Optional)" 
              preview={state.refImagePreview} 
              onUpload={handleRefImageUpload}
              onClear={() => setState(prev => ({...prev, refImage: null, refImagePreview: null}))}
              heightClass="h-24"
            />

            <div className="mb-3">
              <label className="text-xs font-semibold block mb-1">Mẫu Prompt (Preset)</label>
              <select 
                className="w-full bg-tp-dark border border-tp-border rounded p-2 text-xs focus:border-tp-accent focus:outline-none"
                value={state.selectedPresetId || 0}
                onChange={handlePresetChange}
              >
                <option value={0}>-- Chọn Mẫu --</option>
                {PRESET_PROMPTS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="text-xs font-semibold block mb-1">Mô Tả Thêm</label>
              <textarea 
                className="w-full bg-tp-dark border border-tp-border rounded p-2 text-xs focus:border-tp-accent focus:outline-none h-20"
                placeholder="Mô tả chi tiết vật liệu, ánh sáng..."
                value={state.userPrompt}
                onChange={(e) => setState(prev => ({...prev, userPrompt: e.target.value}))}
              />
            </div>

            <div className="mb-3">
              <label className="text-xs font-semibold block mb-1">Tỉ Lệ Ảnh</label>
              <select className="w-full bg-tp-dark border border-tp-border rounded p-2 text-xs">
                {ASPECT_RATIOS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </section>

          {/* MỤC 3: CÀI ĐẶT (COLLAPSIBLE) */}
          <section className="bg-tp-dark/30 p-3 rounded border border-tp-border">
            <div 
              className="flex items-center space-x-2 mb-1 cursor-pointer select-none" 
              onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-tp-accent text-white text-xs font-bold">3</span>
              <h2 className="text-sm font-bold text-white uppercase flex-1">Cài Đặt Hệ Thống</h2>
              <svg 
                className={`w-4 h-4 transform transition-transform duration-200 ${isSettingsExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Collapsible Content */}
            {isSettingsExpanded && (
              <div className="space-y-3 mt-3 animate-fadeIn">
                <div>
                  <label className="text-[10px] text-tp-muted block mb-1">CHẾ ĐỘ RENDER</label>
                  <div className="flex bg-tp-dark rounded p-1">
                    <button 
                      onClick={() => setState(prev => ({...prev, settings: {...prev.settings, mode: RenderMode.FAST}}))}
                      className={`flex-1 text-[10px] py-1 rounded transition-colors ${state.settings.mode === RenderMode.FAST ? 'bg-tp-accent text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      Nhanh
                    </button>
                    <button 
                      onClick={() => setState(prev => ({...prev, settings: {...prev.settings, mode: RenderMode.HIGH}}))}
                      className={`flex-1 text-[10px] py-1 rounded transition-colors ${state.settings.mode === RenderMode.HIGH ? 'bg-tp-accent text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      Cao (Nano)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-tp-muted block mb-1">ĐỘ PHÂN GIẢI</label>
                  <div className="flex bg-tp-dark rounded p-1">
                    {[Resolution.RES_1K, Resolution.RES_2K, Resolution.RES_4K].map(res => {
                      // Logic: 4K is locked if NOT valid license OR mode is FAST
                      const is4K = res === Resolution.RES_4K;
                      const isLocked = is4K && (!state.isLicenseValid || state.settings.mode === RenderMode.FAST);
                      
                      return (
                        <button 
                          key={res}
                          disabled={isLocked}
                          onClick={() => setState(prev => ({...prev, settings: {...prev.settings, resolution: res}}))}
                          className={`
                            flex-1 text-[10px] py-1 rounded transition-colors relative
                            ${state.settings.resolution === res ? 'bg-tp-accent text-white' : 'text-gray-400'} 
                            ${isLocked ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'}
                          `}
                        >
                          {res}
                          {is4K && !state.isLicenseValid && (
                            <span className="absolute -top-1 -right-1 text-[8px] text-tp-accent">🔒</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-tp-muted block mb-1">SỐ LƯỢNG ẢNH</label>
                  <select 
                    className="w-full bg-tp-dark border border-tp-border rounded p-1 text-[10px]"
                    value={state.settings.count}
                    onChange={(e) => setState(prev => ({...prev, settings: {...prev.settings, count: parseInt(e.target.value)}}))}
                  >
                    <option value={1}>1 Ảnh</option>
                    <option value={2}>2 Ảnh</option>
                    <option value={4}>4 Ảnh</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-tp-muted block mb-1">SÁNG TẠO</label>
                  <div className="flex bg-tp-dark rounded p-1">
                    <button 
                      onClick={() => setState(prev => ({...prev, settings: {...prev.settings, creativity: Creativity.LOW}}))}
                      className={`flex-1 text-[10px] py-1 rounded transition-colors ${state.settings.creativity === Creativity.LOW ? 'bg-tp-accent text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      Bám Sát
                    </button>
                    <button 
                      onClick={() => setState(prev => ({...prev, settings: {...prev.settings, creativity: Creativity.HIGH}}))}
                      className={`flex-1 text-[10px] py-1 rounded transition-colors ${state.settings.creativity === Creativity.HIGH ? 'bg-tp-accent text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      Sáng Tạo
                    </button>
                  </div>
                </div>

                {/* Setting: Remove Text/Logo */}
                <div className="pt-1">
                  <div 
                    className="flex items-center justify-between cursor-pointer group"
                    onClick={() => setState(prev => ({...prev, settings: {...prev.settings, removeText: !prev.settings.removeText}}))}
                  >
                      <label className="text-[10px] text-tp-muted cursor-pointer group-hover:text-white transition-colors">XÓA LOGO & CHỮ VIẾT</label>
                      <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${state.settings.removeText ? 'bg-tp-accent' : 'bg-gray-600'}`}>
                          <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${state.settings.removeText ? 'translate-x-4' : 'translate-x-0'}`}></div>
                      </div>
                  </div>
                  <p className="text-[9px] text-tp-muted mt-1 italic opacity-70">
                    *Tự động xóa biển bảng, logo, và chữ viết rác.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* MỤC 4: UPSCALE (Locked if no key) */}
          <section className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-3 rounded border border-indigo-500/30 relative overflow-hidden">
             
             {/* LOCK OVERLAY - Covers entire section if License is invalid */}
             {!state.isLicenseValid && (
                <div className="absolute inset-0 bg-tp-dark/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-center p-4 border border-tp-border">
                   <svg className="w-8 h-8 text-tp-muted mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                   </svg>
                   <p className="text-xs font-bold text-white uppercase">Tính Năng Premium</p>
                   <p className="text-[10px] text-tp-muted">Nhập Key để mở khóa Upscale 4K</p>
                </div>
             )}

             <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl -translate-y-10 translate-x-10 pointer-events-none"></div>
             <div className="flex items-center space-x-2 mb-3 relative z-10">
               <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500 text-white text-xs font-bold">4</span>
               <h2 className="text-sm font-bold text-indigo-200 uppercase">Siêu Phân Giải (4K)</h2>
             </div>
             
             <ImageUploader 
               label="Tải Ảnh Cần Làm Nét" 
               preview={upscalePreview} 
               onUpload={handleUpscaleImageUpload}
               onClear={() => { setUpscaleImageFile(null); setUpscalePreview(null); }}
               heightClass="h-24"
             />

             {/* BUTTON - Disabled state enforced by both 'disabled' attr and Overlay */}
             <button 
                onClick={handleUpscale}
                disabled={isUpscaling || !upscaleImageFile || !state.isLicenseValid}
                className={`w-full py-2 rounded font-bold text-xs uppercase tracking-wider shadow-lg transition-all mt-2
                  ${isUpscaling || !state.isLicenseValid
                    ? 'bg-indigo-900/50 text-indigo-400/50 cursor-not-allowed border border-indigo-500/10' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
             >
                {isUpscaling ? `Đang Xử Lý ${Math.round(progress)}%` : 'KÍCH HOẠT UPSCALE 4K'}
             </button>
             {isUpscaling && (
                <div className="w-full bg-indigo-900 h-0.5 mt-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-400 h-full transition-all duration-300" style={{width: `${progress}%`}}></div>
                </div>
             )}
          </section>

          {/* QUẢN LÝ TÀI KHOẢN */}
          <section className="border-t border-tp-border pt-4">
             <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-tp-muted">QUẢN LÝ TÀI KHOẢN</span>
                <span className="text-xs text-tp-accent font-mono">{state.credits}/{state.maxCredits} lượt</span>
             </div>
             <div className="flex space-x-2">
               <input 
                  type="password" 
                  placeholder="Nhập mã Key..." 
                  className="flex-1 bg-tp-dark border border-tp-border rounded px-2 py-1 text-xs"
                  value={state.licenseKey}
                  onChange={(e) => setState(prev => ({...prev, licenseKey: e.target.value}))}
               />
               <button 
                onClick={handleKeySubmit}
                className="bg-tp-accent hover:bg-tp-accentHover text-white px-3 py-1 rounded text-xs font-bold"
              >
                 OK
               </button>
             </div>
             {state.isLicenseValid && <p className="text-[10px] text-green-500 mt-1">✓ Đã mở khóa tính năng Premium</p>}
          </section>

        </div>

        {/* Generate Button */}
        <div className="p-4 border-t border-tp-border bg-tp-dark">
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !state.inputImage}
            className={`w-full py-3 rounded-lg font-black text-sm uppercase tracking-wider shadow-lg transition-all 
              ${isGenerating 
                ? 'bg-tp-border text-tp-muted cursor-not-allowed' 
                : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-orange-500 text-white transform hover:-translate-y-0.5'
              }`}
          >
            {isGenerating ? `Đang Xử Lý ${Math.round(progress)}%` : 'AI TÂN PHÁT TẠO ẢNH'}
          </button>
          {isGenerating && (
             <div className="w-full bg-tp-dark h-1 mt-2 rounded-full overflow-hidden">
               <div className="bg-tp-accent h-full transition-all duration-300" style={{width: `${progress}%`}}></div>
             </div>
          )}
        </div>
      </div>

      {/* --- MAIN DISPLAY --- */}
      <div className="flex-1 flex flex-col h-full bg-[#05070a] relative">
        
        {/* Top Bar */}
        <div className="h-12 border-b border-tp-border flex justify-between items-center px-4 bg-tp-panel">
          <h2 className="text-sm font-bold text-white">Kết Quả Render</h2>
          <div className="flex items-center space-x-4 text-xs text-tp-muted">
            <a href="https://tanphatcompany.com" target="_blank" rel="noreferrer" className="hover:text-tp-accent">tanphatcompany.com</a>
            <span>|</span>
            <span className="text-tp-accent font-bold">0789131777 (KTS Huy)</span>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8">
           {currentViewImage ? (
             <div className="relative shadow-2xl border border-tp-border/50 group" style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-out' }}>
                <img src={currentViewImage} alt="Render Result" className="max-h-[80vh] max-w-full object-contain" />
                
                {/* Branding Overlay (Visual only) */}
                {/* CONDITIONAL: Only show logo if License is NOT valid */}
                {!state.isLicenseValid && (
                  <div className="absolute top-6 left-6 z-10 opacity-90 pointer-events-none drop-shadow-md" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }}>
                     <TanPhatLogo variant="original" className="w-48" />
                  </div>
                )}

                {/* Floating Controls on Image */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                   <button onClick={handleZoomIn} className="bg-tp-dark/80 hover:bg-tp-accent text-white p-2 rounded backdrop-blur-sm border border-tp-border">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                   </button>
                   <button onClick={handleZoomOut} className="bg-tp-dark/80 hover:bg-tp-accent text-white p-2 rounded backdrop-blur-sm border border-tp-border">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                   </button>
                   <button onClick={handleUseAsInput} title="Dùng làm Geometry Input" className="bg-tp-dark/80 hover:bg-tp-accent text-white p-2 rounded backdrop-blur-sm border border-tp-border">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                   </button>
                   <button onClick={handleDownload} title={state.isLicenseValid ? "Tải Về (Không Logo)" : "Tải Về (Có Logo)"} className="bg-tp-dark/80 hover:bg-tp-accent text-white p-2 rounded backdrop-blur-sm border border-tp-border">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                   </button>
                </div>
             </div>
           ) : (
             <div className="text-center text-tp-muted opacity-20 select-none">
                <div className="mb-4 flex justify-center">
                  <TanPhatLogo variant="white" className="w-96" />
                </div>
                <p className="text-xl">Waiting for Input...</p>
             </div>
           )}
        </div>

        {/* History Strip */}
        <div className="h-40 bg-tp-panel border-t border-tp-border flex flex-col">
           <div className="px-4 py-2 border-b border-tp-border/50 flex justify-between">
              <span className="text-xs font-bold text-white uppercase flex items-center gap-2">
                 <svg className="w-4 h-4 text-tp-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 Lịch Sử Ảnh
              </span>
           </div>
           <div className="flex-1 overflow-x-auto p-3 flex space-x-3 items-center">
              {history.length === 0 && (
                <div className="w-full text-center text-xs text-tp-muted italic">Chưa có lịch sử tạo ảnh</div>
              )}
              {history.map(item => (
                <div key={item.id} className="relative group flex-shrink-0 h-full">
                  <div className="flex gap-1 h-full bg-tp-dark p-1 rounded border border-tp-border hover:border-tp-accent transition-colors cursor-pointer">
                     {item.imageUrls.map((url, idx) => (
                       <img 
                        key={idx} 
                        src={url} 
                        alt="History" 
                        className={`h-full w-auto aspect-square object-cover rounded hover:opacity-80 ${currentViewImage === url ? 'ring-2 ring-tp-accent' : ''}`}
                        onClick={() => {
                          setCurrentViewImage(url);
                          setZoomLevel(1);
                        }}
                       />
                     ))}
                  </div>
                  {/* Delete Button */}
                  <button 
                    onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                    className="absolute -top-1 -right-1 bg-tp-accent hover:bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title="Xóa ảnh này"
                  >
                     <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default App;