
import React, { useState } from 'react';

interface AuthWallProps {
  onLogin: (key: string) => void;
}

export const AuthWall: React.FC<AuthWallProps> = ({ onLogin }) => {
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (keyInput.trim().length < 10) {
      setError('请输入有效的 API Key');
      return;
    }
    onLogin(keyInput.trim());
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* 动态背景光效 */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>

      <div className="max-w-md w-full glass-card p-10 rounded-3xl shadow-2xl border border-white/10 text-center relative z-10 backdrop-blur-xl">
        <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center text-white text-4xl mb-8 mx-auto shadow-2xl shadow-indigo-500/30">
          <i className="fas fa-bolt"></i>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">PromptMaster AI</h1>
        <p className="text-slate-400 mb-10 font-medium">输入 API Key 开启创作之旅</p>
        
        <div className="space-y-5">
          <div className="relative">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => {
                setKeyInput(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="在此粘贴您的 API Key"
              className={`w-full py-4 px-6 bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-2xl text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-mono`}
            />
            {error && <p className="text-red-400 text-xs mt-2 text-left ml-2">{error}</p>}
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/30 active:scale-[0.98] flex items-center justify-center gap-3 group"
          >
            <i className="fas fa-sign-in-alt group-hover:translate-x-1 transition-transform"></i>
            立即登录
          </button>
          
          <div className="pt-8 border-t border-white/5 mt-4">
            <div className="flex items-center justify-center gap-6 text-slate-500 text-sm">
              <span className="flex items-center gap-2"><i className="fas fa-shield-halved text-green-500"></i> 本地存储</span>
              <span className="flex items-center gap-2"><i className="fas fa-bolt text-yellow-500"></i> 中转支持</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
