
export enum ModuleType {
  IMAGE_ENHANCE = 'IMAGE_ENHANCE',
  VIDEO_ENHANCE = 'VIDEO_ENHANCE',
  STORYBOARD = 'STORYBOARD',
  LOVART_STYLE = 'LOVART_STYLE',
  IMAGE_GEN_TEST = 'IMAGE_GEN_TEST',
  IMAGE_ANALYSIS = 'IMAGE_ANALYSIS',
  IMAGE_EDIT = 'IMAGE_EDIT'
}

export interface OptimizedPrompt {
  original: string;
  optimized: string;
  explanation: string;
  tags: string[];
}

export interface StoryboardItem {
  scene: number;
  description: string;
  camera: string;
  lighting: string;
  duration: string;
}

export interface AppState {
  currentModule: ModuleType;
  apiKeySet: boolean;
}
