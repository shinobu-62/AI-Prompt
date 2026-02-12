
import React from 'react';

interface AuthWallProps {
  onLogin: () => void;
}

export const AuthWall: React.FC<AuthWallProps> = ({ onLogin }) => {
  const handleConnect = async () => {
    try {
      if (window.aistudio && window.aistudio.openSelectKey) {
        await window.aistudio.openSelectKey();
        // 按照指令：假设选择成功并继续
        onLogin();
      } else {
        alert('环境异常：未检测到 API 控制插件');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景动态装饰 */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full glass-card p-10 rounded-3xl shadow-2xl border border-white/10 text-center relative z-10">
        <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl mb-8 mx-auto shadow-lg shadow-indigo-500/20 animate-pulse">
          <i className="fas fa-bolt"></i>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">PromptMaster AI</h1>
        <p className="text-slate-400 mb-8">专业级提示词优化平台</p>
        
        <div className="space-y-4">
          <button
            onClick={handleConnect}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <i className="fas fa-key"></i>
            连接我的 API Key 登录
          </button>
          
          <div className="pt-6 border-t border-white/5">
            <p className="text-xs text-slate-500 leading-relaxed">
              * 提示：本应用需要您提供有效的 API Key 才能运行。<br/>
              您可以从 <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-indigo-400 hover:underline">Google AI Studio</a> 获取付费项目的 Key。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
