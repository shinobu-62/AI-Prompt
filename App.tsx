
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { ModuleType } from './types';
import { PromptGenerator } from './components/PromptGenerator';
import { ImageTester } from './components/ImageTester';
import { ImageEditor } from './components/ImageEditor';
import { ImageAnalyzer } from './components/ImageAnalyzer';
import { AuthWall } from './components/AuthWall';
import { GeminiService } from './services/geminiService';

const KEY_STORAGE = 'PROMPT_MASTER_API_KEY';
const URL_STORAGE = 'PROMPT_MASTER_BASE_URL';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem(KEY_STORAGE));
  const [baseUrl, setBaseUrl] = useState<string | null>(localStorage.getItem(URL_STORAGE));
  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.IMAGE_ENHANCE);
  
  const gemini = useMemo(() => {
    if (apiKey) {
      return new GeminiService(apiKey, baseUrl || undefined);
    }
    return null;
  }, [apiKey, baseUrl]);

  const handleLogin = (key: string, url: string) => {
    localStorage.setItem(KEY_STORAGE, key);
    localStorage.setItem(URL_STORAGE, url);
    setApiKey(key);
    setBaseUrl(url);
  };

  const handleLogout = () => {
    if (window.confirm('确定要退出并清除所有配置吗？')) {
      localStorage.removeItem(KEY_STORAGE);
      localStorage.removeItem(URL_STORAGE);
      setApiKey(null);
      setBaseUrl(null);
    }
  };

  const handleSwitchKey = () => {
    const newKey = window.prompt('请输入新的 API Key (支持 sk- 格式):', apiKey || '');
    if (newKey !== null) {
      const newUrl = window.prompt('请输入新的 Base URL (中转地址):', baseUrl || 'https://generativelanguage.googleapis.com');
      if (newKey.trim()) {
        handleLogin(newKey.trim(), newUrl?.trim() || 'https://generativelanguage.googleapis.com');
      }
    }
  };

  if (!apiKey || !gemini) {
    return <AuthWall onLogin={handleLogin} />;
  }

  // 截取 Key 的前 4 位和后 4 位显示
  const displayKey = apiKey.startsWith('sk-') 
    ? `sk-...${apiKey.slice(-4)}` 
    : `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;

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
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              {apiKey.startsWith('sk-') ? 'OpenAI Style Proxy' : 'Google Native Auth'}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">{displayKey}</span>
            <span className="text-[9px] text-slate-300 truncate max-w-[150px]">{baseUrl}</span>
          </div>
        </div>
        
        {renderModule()}
      </div>
    </Layout>
  );
};

export default App;
