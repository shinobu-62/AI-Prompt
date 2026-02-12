
import React, { useState } from 'react';
import { ModuleType, OptimizedPrompt } from '../types';
import { GeminiService } from '../services/geminiService';
import { decodeAudioData, playAudioBuffer } from '../utils/audio';

interface Props {
  type: ModuleType;
  gemini: GeminiService;
}

export const PromptGenerator: React.FC<Props> = ({ type, gemini }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizedPrompt | null>(null);
  const [playingAudio, setPlayingAudio] = useState(false);

  const handleOptimize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const optimized = await gemini.optimizePrompt(input, type);
      setResult(optimized);
    } catch (error) {
      console.error(error);
      alert('优化失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  const handleTTS = async () => {
    if (!result || playingAudio) return;
    setPlayingAudio(true);
    try {
      const audioBytes = await gemini.generateSpeech(result.optimized);
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const buffer = await decodeAudioData(audioBytes, ctx, 24000, 1);
      playAudioBuffer(buffer, ctx);
    } catch (error) {
      console.error(error);
    } finally {
      setPlayingAudio(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('已复制到剪贴板');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
      <div className="space-y-6">
        <div className="glass-card p-6 rounded-2xl shadow-sm border border-slate-100">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            输入你的基础想法
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
            placeholder="例如：一个穿着赛博朋克风格衣服的猫在喝咖啡，背景是下雨的东京街头..."
          />
          <button
            onClick={handleOptimize}
            disabled={loading || !input.trim()}
            className={`w-full mt-4 py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg shadow-indigo-100 ${
              loading 
              ? 'bg-indigo-400 text-white cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-magic"></i>
            )}
            {loading ? '正在魔法加持中...' : '开始优化提示词'}
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
          <i className="fas fa-lightbulb text-blue-500 mt-1"></i>
          <p className="text-sm text-blue-700 leading-relaxed">
            提示：输入越具体，优化的效果越接近你的理想场景。目前的模型已开启 Google Search 增强。
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {result ? (
          <div className="glass-card p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full uppercase tracking-wider">
                优化结果
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={handleTTS}
                  disabled={playingAudio}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"
                  title="朗读提示词"
                >
                  <i className={`fas ${playingAudio ? 'fa-circle-notch fa-spin' : 'fa-volume-high'}`}></i>
                </button>
                <button 
                  onClick={() => copyToClipboard(result.optimized)}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"
                  title="复制代码"
                >
                  <i className="far fa-copy"></i>
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto bg-slate-900 text-slate-100 p-6 rounded-xl font-mono text-sm leading-relaxed mb-4 min-h-[250px] whitespace-pre-wrap">
              {result.optimized}
            </div>

            {/* Displaying Google Search grounding sources */}
            {result.sources && result.sources.length > 0 && (
              <div className="mb-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <p className="text-xs text-slate-400 mb-2 font-semibold">参考来源:</p>
                <div className="flex flex-col gap-1">
                  {result.sources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-300 text-[11px] hover:underline flex items-center gap-1 truncate"
                    >
                      <i className="fas fa-external-link-alt text-[9px]"></i>
                      {source.title || source.uri}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-auto">
              {result.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded-md border border-slate-200">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-wand-sparkles text-3xl opacity-20"></i>
            </div>
            <p className="font-medium text-slate-500">等待咒语输入</p>
            <p className="text-sm mt-2">优化后的提示词将在这里显示</p>
          </div>
        )}
      </div>
    </div>
  );
};
