import React from 'react';
import { NutritionAnalysis } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Flame, Info } from 'lucide-react';

interface AnalysisDisplayProps {
  data: NutritionAnalysis;
}

const COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#059669'];

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in">
      {/* Header Summary */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider">总热量</h2>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-gray-900">{data.totalCalories}</span>
            <span className="text-emerald-600 font-medium">千卡 (kcal)</span>
          </div>
        </div>
        <div className="bg-orange-50 p-3 rounded-full">
          <Flame className="w-6 h-6 text-orange-500" />
        </div>
      </div>

      {/* Macros */}
      {data.macroEstimate && (
        <div className="grid grid-cols-3 gap-2 mb-8">
            <div className="bg-blue-50 p-3 rounded-xl text-center">
                <span className="block text-xs text-blue-600 font-semibold mb-1">蛋白质</span>
                <span className="block text-gray-900 font-bold">{data.macroEstimate.protein}</span>
            </div>
            <div className="bg-yellow-50 p-3 rounded-xl text-center">
                <span className="block text-xs text-yellow-600 font-semibold mb-1">碳水化合物</span>
                <span className="block text-gray-900 font-bold">{data.macroEstimate.carbs}</span>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl text-center">
                <span className="block text-xs text-purple-600 font-semibold mb-1">脂肪</span>
                <span className="block text-gray-900 font-bold">{data.macroEstimate.fat}</span>
            </div>
        </div>
      )}

      {/* Breakdown Chart & List */}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Chart */}
        <div className="w-full sm:w-1/3 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.items}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={5}
                dataKey="calories"
              >
                {data.items.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} kcal`, '热量']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* List */}
        <div className="w-full sm:w-2/3 space-y-3">
          <h3 className="font-semibold text-gray-900 mb-2">热量明细</h3>
          {data.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="font-medium text-gray-800">{item.name}</span>
              </div>
              <span className="text-gray-600 font-mono text-sm">{item.calories}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Summary */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex gap-2 text-emerald-700 bg-emerald-50 p-4 rounded-lg text-sm leading-relaxed">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{data.summary}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay;