
import React, { useState } from 'react';

interface AuthWallProps {
  onLogin: (key: string, baseUrl: string) => void;
}

export const AuthWall: React.FC<AuthWallProps> = ({ onLogin }) => {
  const [keyInput, setKeyInput] = useState('');
  const [urlInput, setUrlInput] = useState('https://generativelanguage.googleapis.com');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (keyInput.trim().length < 5) {
      setError('请输入有效的 API Key');
      return;
    }
    onLogin(keyInput.trim(), urlInput.trim() || 'https://generativelanguage.googleapis.com');
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* 动态背景光效 */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>

      <div className="max-w-md w-full glass-card p-10 rounded-3xl shadow-2xl border border-white/10 text-center relative z-10 backdrop-blur-xl">
        <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center text-white text-3xl mb-8 mx-auto shadow-2xl shadow-indigo-500/30">
          <i className="fas fa-bolt"></i>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">PromptMaster AI</h1>
        <p className="text-slate-400 mb-10 font-medium">输入 API 配置开启创作之旅</p>
        
        <div className="space-y-6">
          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">API 密钥 (API Key)</label>
            <div className="relative">
              <input
                type="password"
                value={keyInput}
                onChange={(e) => {
                  setKeyInput(e.target.value);
                  setError('');
                }}
                placeholder="在此粘贴您的 API Key"
                className={`w-full py-3.5 px-6 bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-2xl text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-mono text-sm`}
              />
            </div>
            {error && <p className="text-red-400 text-[10px] mt-1 ml-1">{error}</p>}
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">中转/代理地址 (Base URL)</label>
            <div className="relative">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="默认: https://generativelanguage.googleapis.com"
                className="w-full py-3.5 px-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-mono text-sm"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1 ml-1 italic">若使用淘宝中转，请填写购买处提供的 Base URL 地址</p>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/30 active:scale-[0.98] flex items-center justify-center gap-3 group mt-4"
          >
            <i className="fas fa-rocket group-hover:-translate-y-1 transition-transform"></i>
            进入系统
          </button>
          
          <div className="pt-6 border-t border-white/5 mt-4">
            <div className="flex flex-col gap-3 text-slate-500 text-xs">
              <div className="flex items-center justify-center gap-2">
                <i className="fas fa-shield-halved text-green-500 opacity-70"></i>
                <span>设置将安全地存储在本地 LocalStorage</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <i className="fas fa-plug text-yellow-500 opacity-70"></i>
                <span>完美适配国内 API 中转服务</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
