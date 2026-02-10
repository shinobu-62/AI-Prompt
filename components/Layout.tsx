
import React from 'react';
import { ModuleType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
}

const navItems = [
  { id: ModuleType.IMAGE_ENHANCE, label: '图片增强', icon: 'fa-image' },
  { id: ModuleType.VIDEO_ENHANCE, label: '视频增强', icon: 'fa-video' },
  { id: ModuleType.STORYBOARD, label: '分镜脚本', icon: 'fa-film' },
  { id: ModuleType.LOVART_STYLE, label: 'Lovart专属', icon: 'fa-gem' },
  { id: ModuleType.IMAGE_GEN_TEST, label: '图片生成', icon: 'fa-wand-magic-sparkles' },
  { id: ModuleType.IMAGE_ANALYSIS, label: '提示词反推', icon: 'fa-magnifying-glass' },
  { id: ModuleType.IMAGE_EDIT, label: 'AI修图', icon: 'fa-brush' },
];

export const Layout: React.FC<LayoutProps> = ({ children, activeModule, onModuleChange }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <i className="fas fa-bolt text-lg"></i>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            PromptMaster
          </h1>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
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
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-500">
            <p>基于 Gemini 3.0 全力驱动</p>
            <p className="mt-1">体验前沿 AI 优化技术</p>
          </div>
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
            <h2 className="text-lg font-semibold text-slate-800">
              {navItems.find(n => n.id === activeModule)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-indigo-600">
              <i className="far fa-bell text-xl"></i>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-400"></div>
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
