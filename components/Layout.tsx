
import React from 'react';
import { ModuleType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
  onSwitchKey: () => void;
  onLogout: () => void;
}

const navItems = [
  { id: ModuleType.IMAGE_ENHANCE, label: '图片增强', icon: 'fa-image' },
  { id: ModuleType.VIDEO_ENHANCE, label: '视频增强', icon: 'fa-video' },
  { id: ModuleType.STORYBOARD, label: '分镜脚本', icon: 'fa-film' },
  { id: ModuleType.LOVART_STYLE, label: 'Lovart专属', icon: 'fa-gem' },
  { id: ModuleType.IMAGE_GEN_TEST, label: '图片生成预览', icon: 'fa-wand-magic-sparkles' },
  { id: ModuleType.IMAGE_ANALYSIS, label: '提示词反推', icon: 'fa-magnifying-glass' },
  { id: ModuleType.IMAGE_EDIT, label: 'AI修图', icon: 'fa-brush' },
];

export const Layout: React.FC<LayoutProps> = ({ children, activeModule, onModuleChange, onSwitchKey, onLogout }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <i className="fas fa-bolt text-lg"></i>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            PromptMaster
          </h1>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onModuleChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeModule === item.id
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <i className={`fas ${item.icon} w-5`}></i>
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <div className="bg-slate-50 p-4 rounded-xl text-[10px] text-slate-500 border border-slate-100">
            <p className="flex items-center gap-2 mb-1"><i className="fas fa-check-circle text-green-500"></i> 系统运行正常</p>
            <p>Gemini 3.0 模型已就绪</p>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg text-xs font-semibold transition-colors"
          >
            <i className="fas fa-power-off"></i>
            退出登录
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full bg-slate-50">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center md:hidden">
             <i className="fas fa-bolt text-indigo-600 mr-2 text-xl"></i>
             <span className="font-bold text-lg">PromptMaster</span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">
              Prompt Engineering Workbench
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onSwitchKey}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 text-xs font-bold transition-all flex items-center gap-2"
              title="修改 API Key"
            >
              <i className="fas fa-key text-indigo-500"></i>
              管理密钥
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 ring-4 ring-slate-100 shadow-sm flex items-center justify-center text-white">
              <i className="fas fa-user-astronaut"></i>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
