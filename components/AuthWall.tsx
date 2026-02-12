
import React, { useState } from 'react';

interface AuthWallProps {
  onLogin: (key: string, baseUrl: string) => void;
}

export const AuthWall: React.FC<AuthWallProps> = ({ onLogin }) => {
  const [keyInput, setKeyInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (keyInput.trim().length < 5) {
      setError('请输入有效的 API Key (支持 sk- 格式)');
      return;
    }
    const finalUrl = urlInput.trim() || 'https://generativelanguage.googleapis.com';
    onLogin(keyInput.trim(), finalUrl);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* 背景艺术装饰 */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full glass-card p-10 rounded-3xl shadow-2xl border border-white/10 text-center relative z-10 backdrop-blur-2xl">
        <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center text-white text-3xl mb-8 mx-auto shadow-2xl shadow-indigo-500/20">
          <i className="fas fa-microchip"></i>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">PromptMaster AI</h1>
        <p className="text-slate-400 mb-10 font-medium">适配官方及淘宝/中转站密钥</p>
        
        <div className="space-y-6">
          <div className="space-y-2 text-left">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-slate-500 uppercase">API Key (支持 sk-)</label>
              <span className="text-[10px] text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full">加密存储</span>
            </div>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => {
                setKeyInput(e.target.value);
                setError('');
              }}
              placeholder="在此输入 API Key (如 sk-xxxx...)"
              className={`w-full py-4 px-6 bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-2xl text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono text-sm`}
            />
            {error && <p className="text-red-400 text-[10px] mt-1 ml-1">{error}</p>}
          </div>

          <div className="space-y-2 text-left">
            <label className="text-xs font-bold text-slate-500 uppercase px-1">中转 Base URL (选填)</label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="例如: https://api.your-midstation.com"
              className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono text-sm"
            />
            <p className="text-[10px] text-slate-500 mt-1 px-1 leading-relaxed">
              <i className="fas fa-info-circle mr-1"></i>
              如果您购买的是淘宝/中转密钥，请务必填写卖家提供的接口地址。若不填写则默认使用 Google 官方地址。
            </p>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-3 group mt-4"
          >
            <i className="fas fa-bolt group-hover:scale-125 transition-transform"></i>
            开启创作
          </button>
          
          <div className="pt-6 border-t border-white/5 mt-4 text-[10px] text-slate-500 italic">
            本应用不存储您的任何密钥，所有配置仅保存在您的浏览器本地。
          </div>
        </div>
      </div>
    </div>
  );
};
