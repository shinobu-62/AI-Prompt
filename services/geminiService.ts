
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { ModuleType, OptimizedPrompt, StoryboardItem } from "../types";

export class GeminiService {
  private apiKey: string;
  private baseUrl?: string;

  constructor(apiKey: string, baseUrl?: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    
    // Clean trailing slash from base URL if present
    if (this.baseUrl && this.baseUrl.endsWith('/')) {
      this.baseUrl = this.baseUrl.slice(0, -1);
    }
  }

  private getClient() {
    // Use user-provided key and URL
    return new GoogleGenAI({ 
      apiKey: this.apiKey,
      baseUrl: this.baseUrl 
    });
  }

  async optimizePrompt(input: string, type: ModuleType): Promise<OptimizedPrompt> {
    const ai = this.getClient();
    const systemInstructions: Record<string, string> = {
      [ModuleType.IMAGE_ENHANCE]: "你是一个顶级的AI绘画提示词专家。你的任务是将用户简单的描述转化成专业、详细、具有艺术感的Midjourney或Stable Diffusion提示词。包含：主体细节、环境灯光、构图、画质术语（如8k, unreal engine 5, ray tracing）、艺术风格。",
      [ModuleType.VIDEO_ENHANCE]: "你是一个顶级的AI视频提示词专家。你的任务是为Runway Gen-2, Pika, Sora等模型优化提示词。必须包含：镜头运动描述（Zoom in, Pan, Dolly shot）、光影动态、材质细节、每秒帧感、情绪氛围。",
      [ModuleType.STORYBOARD]: "你是一个电影分镜规划专家。请将用户的创意需求拆解成专业的分镜脚本。请按JSON格式输出：{ scenes: [{ scene: 1, description: '', camera: '', lighting: '', duration: '' }] }。",
      [ModuleType.LOVART_STYLE]: "你是一个专注于Lovart风格（优雅、奢华、高级感色彩）的提示词专家。将用户需求转化为具有强烈Lovart艺术风格的描述。",
    };

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: input,
        config: {
          systemInstruction: systemInstructions[type] || "你是一个AI提示词优化专家。",
          responseMimeType: type === ModuleType.STORYBOARD ? "application/json" : "text/plain",
          tools: [{ googleSearch: {} }]
        },
      });

      // Extract URLs from groundingChunks for Google Search
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map((chunk: any) => chunk.web)
        .filter((web: any) => web && web.uri);

      if (type === ModuleType.STORYBOARD) {
        try {
          const data = JSON.parse(response.text || '{}');
          return {
            original: input,
            optimized: JSON.stringify(data, null, 2),
            explanation: "已生成专业分镜列表",
            tags: ["分镜", "专业脚本"],
            sources: sources
          };
        } catch (e) {
          return { original: input, optimized: response.text || '', explanation: "解析失败", tags: [], sources: sources };
        }
      }

      return {
        original: input,
        optimized: response.text || '',
        explanation: "已根据最新流行趋势完成优化",
        tags: ["AI增强", "专业构图"],
        sources: sources
      };
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      throw new Error(error.message || "API 调用失败，请检查配置。");
    }
  }

  async generateImage(prompt: string, aspectRatio: string = "1:1"): Promise<string> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: { aspectRatio: aspectRatio as any }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("图片生成失败。");
  }

  async analyzeImage(base64Image: string, prompt: string = "请详细描述这张图片的内容，以便我能用来生成类似的图片。"): Promise<string> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] } },
          { text: prompt }
        ]
      }
    });
    return response.text || '';
  }

  async editImage(base64Image: string, instruction: string): Promise<string> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] } },
          { text: instruction }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("图像编辑失败");
  }

  async generateSpeech(text: string): Promise<Uint8Array> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `用温柔自然的语气读出：${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("语音生成失败");
    return this.decodeBase64(base64Audio);
  }

  private decodeBase64(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
}
