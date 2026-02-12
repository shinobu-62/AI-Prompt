
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { ModuleType } from './types';
import { PromptGenerator } from './components/PromptGenerator';
import { ImageTester } from './components/ImageTester';
import { ImageEditor } from './components/ImageEditor';
import { ImageAnalyzer } from './components/ImageAnalyzer';
import { AuthWall } from './components/AuthWall';
import { GeminiService } from './services/geminiService';

declare global {
  // Use the predefined AIStudio interface to avoid type mismatch and modifier conflict errors.
  interface Window {
    readonly aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.IMAGE_ENHANCE);
  
  // Create GeminiService instance. Internal logic will handle per-call client creation.
  const gemini = useMemo(() => new GeminiService(), []);

  useEffect(() => {
    const checkAuth = async () => {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        try {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setIsAuthorized(hasKey);
        } catch (err) {
          console.error("Auth check failed", err);
          setIsAuthorized(false);
        }
      } else {
        // Fallback for environments without the plugin
        setIsAuthorized(true);
      }
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthorized(true);
  };

  const handleSwitchKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      // Assume selection was successful to avoid race conditions
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">加载中...</div>;
  }

  if (!isAuthorized) {
    return <AuthWall onLogin={handleLoginSuccess} />;
  }

  const renderModule = () => {
    switch (activeModule) {
      case ModuleType.IMAGE_GEN_TEST:
        return <ImageTester gemini={gemini} />;
      case ModuleType.IMAGE_EDIT:
        return <ImageEditor gemini={gemini} />;
      case ModuleType.IMAGE_ANALYSIS:
        return <ImageAnalyzer gemini={gemini} />;
      default:
        return <PromptGenerator type={activeModule} gemini={gemini} />;
    }
  };

  return (
    <Layout 
      activeModule={activeModule} 
      onModuleChange={setActiveModule}
      onSwitchKey={handleSwitchKey}
    >
      <div className="animate-fadeIn">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">
            {activeModule === ModuleType.IMAGE_ENHANCE && '图片提示词描述增强'}
            {activeModule === ModuleType.VIDEO_ENHANCE && '视频提示词描述增强'}
            {activeModule === ModuleType.STORYBOARD && '分镜格式提示词生成'}
            {activeModule === ModuleType.LOVART_STYLE && 'Lovart 专属艺术风格'}
            {activeModule === ModuleType.IMAGE_GEN_TEST && '测试生成图片'}
            {activeModule === ModuleType.IMAGE_ANALYSIS && '图片反推 (Image-to-Prompt)'}
            {activeModule === ModuleType.IMAGE_EDIT && 'AI 智能修图 (Edit by Prompt)'}
          </h3>
          <p className="text-slate-500">
            {activeModule === ModuleType.IMAGE_ENHANCE && '将普通描述转化为专业绘画咒语，适配 Midjourney / SD'}
            {activeModule === ModuleType.VIDEO_ENHANCE && '生成极具动感与电影质感的视频控制指令'}
            {activeModule === ModuleType.STORYBOARD && '专业电影工业标准的分镜脚本拆解'}
            {activeModule === ModuleType.LOVART_STYLE && '开启高级、优雅、充满细节的艺术美学模式'}
            {activeModule === ModuleType.IMAGE_GEN_TEST && '验证优化后的提示词，即刻预览生成效果'}
            {activeModule === ModuleType.IMAGE_ANALYSIS && '上传参考图，让 AI 深度解析并提取咒语'}
            {activeModule === ModuleType.IMAGE_EDIT && '通过文字描述，让 AI 为你的图片进行局部修改或风格变换'}
          </p>
        </div>
        
        {renderModule()}
      </div>
    </Layout>
  );
};

export default App;
