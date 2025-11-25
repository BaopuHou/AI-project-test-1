import React, { useRef, useState } from 'react';
import { Camera, Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageInputProps {
  onImageSelected: (base64: string) => void;
  isAnalyzing: boolean;
}

const ImageInput: React.FC<ImageInputProps> = ({ onImageSelected, isAnalyzing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      // Remove data URL prefix for API
      const base64 = result.split(',')[1];
      onImageSelected(base64);
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (preview) {
    return (
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200 group">
        <img 
          src={preview} 
          alt="Food Preview" 
          className="w-full h-64 sm:h-80 object-cover"
        />
        {!isAnalyzing && (
          <button
            onClick={clearImage}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-sm backdrop-blur-sm transition-all"
            title="移除图片"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <div className="flex flex-col items-center text-white">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mb-3"></div>
              <p className="font-medium">正在分析卡路里...</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div 
        onClick={triggerUpload}
        className="border-2 border-dashed border-emerald-200 hover:border-emerald-400 bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl p-10 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[300px] text-center"
      >
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <Camera className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          拍摄您的美餐
        </h3>
        <p className="text-gray-500 mb-6 max-w-xs mx-auto">
          拍照或上传图片，即可立即获取卡路里和营养成分分析。
        </p>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            上传照片
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageInput;