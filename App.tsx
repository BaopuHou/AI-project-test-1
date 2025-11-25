import React, { useState } from 'react';
import Header from './components/Header';
import ImageInput from './components/ImageInput';
import AnalysisDisplay from './components/AnalysisDisplay';
import ChatAssistant from './components/ChatAssistant';
import { analyzeImageConfig } from './services/geminiService';
import { NutritionAnalysis, AppState } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<NutritionAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageSelected = async (base64: string) => {
    setCurrentImage(base64);
    setAppState(AppState.ANALYZING);
    setErrorMsg(null);
    setAnalysis(null);

    try {
      const result = await analyzeImageConfig(base64);
      setAnalysis(result);
      setAppState(AppState.RESULT);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("分析图片失败。请确保 API 密钥有效且图片清晰。");
      setAppState(AppState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro / Input Section */}
        <div className={`transition-all duration-500 ease-in-out ${appState !== AppState.IDLE ? 'mb-8' : 'flex items-center justify-center min-h-[80vh]'}`}>
          <div className={`w-full ${appState === AppState.IDLE ? 'max-w-xl' : 'grid grid-cols-1 lg:grid-cols-12 gap-8'}`}>
            
            {/* Left Column: Image & Analysis */}
            <div className={`lg:col-span-7 flex flex-col gap-6`}>
              {/* Only show Image Input with reduced size if we have a result, otherwise full size */}
              <div className={`${appState === AppState.IDLE ? '' : ''}`}>
                <ImageInput 
                  onImageSelected={handleImageSelected} 
                  isAnalyzing={appState === AppState.ANALYZING} 
                />
              </div>

              {/* Error Message */}
              {appState === AppState.ERROR && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="text-red-800 font-medium">分析失败</h4>
                    <p className="text-red-600 text-sm mt-1">{errorMsg}</p>
                    <button 
                      onClick={() => setAppState(AppState.IDLE)}
                      className="mt-3 text-sm font-semibold text-red-700 hover:text-red-900 underline"
                    >
                      重试
                    </button>
                  </div>
                </div>
              )}

              {/* Analysis Result */}
              {appState === AppState.RESULT && analysis && (
                <AnalysisDisplay data={analysis} />
              )}
            </div>

            {/* Right Column: Chat Assistant (Only shown when we have an image) */}
            {currentImage && (appState === AppState.RESULT || appState === AppState.ANALYZING) && (
              <div className="lg:col-span-5 h-full">
                <div className="sticky top-24">
                  <ChatAssistant base64Image={currentImage} />
                </div>
              </div>
            )}

          </div>
        </div>

      </main>

      <footer className="bg-white border-t border-gray-100 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} NutriScan AI. 由 Google Gemini 提供支持。
          <p className="text-xs mt-1">估算结果仅供参考。</p>
        </div>
      </footer>
    </div>
  );
};

export default App;