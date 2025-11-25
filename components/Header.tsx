import React from 'react';
import { Leaf } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 p-2 rounded-full">
              <Leaf className="w-6 h-6 text-emerald-600" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              NutriScan AI
            </h1>
          </div>
          <div className="text-sm text-gray-500 font-medium hidden sm:block">
            由 Gemini 2.5 提供支持
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;