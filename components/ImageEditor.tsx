
import React, { useState, useRef } from 'react';
import { GeminiService } from '../services/geminiService';

interface Props {
  gemini: GeminiService;
}

export const ImageEditor: React.FC<Props> = ({ gemini }) => {
  const [image, setImage] = useState<string | null>(null);
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setEditedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image || !instruction.trim()) return;
    setLoading(true);
    try {
      const result = await gemini.editImage(image, instruction);
      setEditedImage(result);
    } catch (error) {
      console.error(error);
      alert('编辑失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
      <div className="space-y-6">
        <div className="glass-card p-6 rounded-2xl shadow-sm border border-slate-100">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            上传图片
          </label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-video border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all overflow-hidden"
          >
            {image ? (
              <img src={image} alt="Upload" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-8">
                <i className="fas fa-cloud-arrow-up text-3xl text-slate-300 mb-2"></i>
                <p className="text-sm text-slate-400">点击上传需要修改的图片</p>
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
        </div>

        <div className="glass-card p-6 rounded-2xl shadow-sm border border-slate-100">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            修图指令
          </label>
          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="例如：把背景变成海滩、添加一副墨镜、移除背景里的人..."
          />
          <button
            onClick={handleEdit}
            disabled={loading || !image || !instruction.trim()}
            className="w-full mt-4 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
            {loading ? '正在魔法修图中...' : '立即修改图片'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {editedImage ? (
          <div className="glass-card p-6 rounded-2xl shadow-xl border border-slate-100 animate-slideUp h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">修改结果</h3>
              <a href={editedImage} download="edited-image.png" className="text-indigo-600 text-sm font-medium">
                下载结果
              </a>
            </div>
            <div className="flex-1 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
              <img src={editedImage} alt="Edited" className="max-w-full max-h-[500px] object-contain" />
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-white/50">
            <i className="fas fa-wand-magic-sparkles text-3xl opacity-20 mb-4"></i>
            <p>修改后的图片将在这里实时预览</p>
          </div>
        )}
      </div>
    </div>
  );
};
