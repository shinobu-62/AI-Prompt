
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { ModuleType } from './types';
import { PromptGenerator } from './components/PromptGenerator';
import { ImageTester } from './components/ImageTester';
import { ImageEditor } from './components/ImageEditor';
import { ImageAnalyzer } from './components/ImageAnalyzer';
import { AuthWall } from './components/AuthWall';
import { GeminiService } from './services/geminiService';

const STORAGE_KEY = 'PROMPT_MASTER_USER_KEY';

const App: React.FC = () => {
  const [userApiKey, setUserApiKey] = useState<string | null>(localStorage.getItem(STORAGE_KEY));
  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.IMAGE_ENHANCE);
  
  // 当密钥更新时，GeminiService 会自动响应
  const gemini = useMemo(() => new GeminiService(userApiKey || undefined), [userApiKey]);

  const handleLogin = (key: string) => {
    localStorage.setItem(STORAGE_KEY, key);
    setUserApiKey(key);
  };

  const handleLogout = () => {
    if (window.confirm('确定要退出并清除 API Key 吗？')) {
      localStorage.removeItem(STORAGE_KEY);
      setUserApiKey(null);
    }
  };

  const handleSwitchKey = () => {
    const newKey = window.prompt('请输入新的 API Key:', userApiKey || '');
    if (newKey && newKey.trim()) {
      handleLogin(newKey.trim());
    }
  };

  if (!userApiKey) {
    return <AuthWall onLogin={handleLogin} />;
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
      onLogout={handleLogout}
    >
      <div className="animate-fadeIn">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
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
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            API Connected
          </div>
        </div>
        
        {renderModule()}
      </div>
    </Layout>
  );
};

export default App;
