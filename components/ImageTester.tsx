
import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';

interface Props {
  gemini: GeminiService;
}

export const ImageTester: React.FC<Props> = ({ gemini }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const url = await gemini.generateImage(prompt, aspectRatio);
      setImageUrl(url);
    } catch (error) {
      console.error(error);
      alert('生成失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="glass-card p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <label className="block text-sm font-semibold text-slate-700">绘制咒语 (Prompt)</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none"
              placeholder="输入绘画提示词，建议使用英文以获得最佳效果..."
            />
          </div>
          <div className="w-full md:w-64 space-y-4">
            <label className="block text-sm font-semibold text-slate-700">画幅比例 (Aspect Ratio)</label>
            <div className="grid grid-cols-2 gap-2">
              {['1:1', '3:4', '4:3', '16:9', '9:16'].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                    aspectRatio === ratio
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full h-12 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-play"></i>}
              {loading ? '正在绘制中...' : '生成测试图片'}
            </button>
          </div>
        </div>
      </div>

      {imageUrl && (
        <div className="glass-card p-6 rounded-2xl shadow-xl border border-slate-100 animate-slideUp">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">生成结果</h3>
            <a 
              href={imageUrl} 
              download="generated-image.png" 
              className="text-indigo-600 hover:underline text-sm font-medium flex items-center gap-1"
            >
              <i className="fas fa-download"></i> 保存图片
            </a>
          </div>
          <div className="rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center min-h-[400px]">
            <img src={imageUrl} alt="Generated" className="max-w-full h-auto shadow-sm" />
          </div>
        </div>
      )}
    </div>
  );
};
