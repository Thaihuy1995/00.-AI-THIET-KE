export enum RenderMode {
  FAST = 'fast',
  HIGH = 'high' // Nano Bananapro
}

export enum Resolution {
  RES_1K = '1K',
  RES_2K = '2K',
  RES_4K = '4K'
}

export enum Creativity {
  LOW = 'low', // Bám sát
  HIGH = 'high' // Sáng tạo
}

export interface PresetPrompt {
  id: number;
  name: string;
  content: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  imageUrls: string[];
  prompt: string;
  presetId?: number;
}

export interface RenderSettings {
  mode: RenderMode;
  resolution: Resolution;
  count: number; // 1, 2, 4
  creativity: Creativity;
  removeText: boolean; // New setting: Remove logo/text
}

export interface AppState {
  inputImage: File | null;
  inputImagePreview: string | null;
  refImage: File | null;
  refImagePreview: string | null;
  userPrompt: string;
  selectedPresetId: number | null; // 0 for none
  settings: RenderSettings;
  licenseKey: string;
  isLicenseValid: boolean;
  credits: number;
  maxCredits: number;
}

// Global Window interface for AI Studio
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}