
import React, { useState, useRef } from 'react';
import { GeminiService } from '../services/geminiService';

interface Props {
  gemini: GeminiService;
}

export const ImageAnalyzer: React.FC<Props> = ({ gemini }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const result = await gemini.analyzeImage(image);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      alert('分析失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
      <div className="glass-card p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          上传需要反推的图片
        </label>
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all overflow-hidden"
        >
          {image ? (
            <img src={image} alt="Target" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-8">
              <i className="fas fa-image text-3xl text-slate-300 mb-2"></i>
              <p className="text-sm text-slate-400">选择一张你喜欢的图，反推它的提示词</p>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading || !image}
          className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
        >
          {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magnifying-glass-chart"></i>}
          {loading ? '深度分析中...' : '开始反推提示词'}
        </button>
      </div>

      <div className="space-y-6">
        {analysis ? (
          <div className="glass-card p-6 rounded-2xl shadow-xl border border-slate-100 animate-slideUp">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-full">反推结果</span>
              <button 
                onClick={() => {navigator.clipboard.writeText(analysis); alert('已复制')}}
                className="text-slate-400 hover:text-indigo-600"
              >
                <i className="far fa-copy"></i>
              </button>
            </div>
            <div className="bg-slate-900 text-slate-100 p-6 rounded-xl font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {analysis}
            </div>
            <p className="mt-4 text-xs text-slate-500 leading-relaxed italic">
              提示：你可以将上述描述复制到“图片生成”模块进行测试。
            </p>
          </div>
        ) : (
          <div className="h-full min-h-[300px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-white/50">
            <i className="fas fa-brain text-3xl opacity-20 mb-4"></i>
            <p>AI 将通过视觉分析还原图片的艺术特征和提示词构图</p>
          </div>
        )}
      </div>
    </div>
  );
};
