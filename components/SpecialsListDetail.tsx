import React, { useState } from 'react';
import { SpecialItem } from '../types';
import { SPECIALS_DATA } from '../services/staticData';

interface SpecialsListDetailProps {
  onSelectSpecial: (special: SpecialItem) => void;
  onBack: () => void;
}

const SpecialsListDetail: React.FC<SpecialsListDetailProps> = ({
  onSelectSpecial,
  onBack
}) => {
  const [activeCategory, setActiveCategory] = useState<'文化民俗' | '风物特产' | '全部'>('全部');

  // 分类数据
  const categories = [
    { key: '全部' as const, label: '全部' },
    { key: '文化民俗' as const, label: '文化民俗' },
    { key: '风物特产' as const, label: '风物特产' }
  ];

  // 根据分类筛选数据
  const filteredData = activeCategory === '全部' 
    ? SPECIALS_DATA 
    : SPECIALS_DATA.filter(s => s.subcategory === activeCategory);

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-100">
        <div className="flex items-center px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center text-stone-600 hover:text-stone-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">返回</span>
          </button>
          <h1 className="flex-1 text-center text-xl font-serif-brand font-bold text-stone-800">风物志</h1>
          <div className="w-16"></div>
        </div>
        
        {/* 分类标签页 */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`
                  flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                  ${
                    activeCategory === cat.key
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }
                `}
              >
                <span>{cat.label}</span>
                {activeCategory === cat.key && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-white/30 rounded-full">
                    {filteredData.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 分类列表 */}
      <div className="px-6 py-6 space-y-4">
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredData.map((special, index) => {
              const categoryConfig: Record<string, { icon: string; color: string; bgColor: string }> = {
                '特产': { icon: '🏆', color: 'text-amber-600', bgColor: 'bg-amber-50' },
                '美食': { icon: '🍜', color: 'text-orange-600', bgColor: 'bg-orange-50' },
                '活动': { icon: '🎨', color: 'text-purple-600', bgColor: 'bg-purple-50' }
              };
              const config = categoryConfig[special.category] || { icon: '📦', color: 'text-stone-600', bgColor: 'bg-stone-50' };

              return (
                <div
                  key={special.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <button
                    onClick={() => onSelectSpecial(special)}
                    className="w-full text-left"
                  >
                    {/* 图片 */}
                    <div className="relative h-40 bg-stone-200 overflow-hidden">
                      <img
                        src={special.imageUrl}
                        alt={special.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(special.title);
                        }}
                      />
                      {/* 标签 */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 ${config.bgColor} ${config.color} text-xs font-bold rounded-full shadow-sm`}>
                          {special.category}
                        </span>
                      </div>
                    </div>

                    {/* 信息 */}
                    <div className="p-4">
                      <h3 className="text-base font-bold text-stone-800 mb-2 line-clamp-1">{special.title}</h3>
                      <p className="text-xs text-stone-500 mb-3 line-clamp-2">{special.description}</p>
                      
                      {/* 底部信息 */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-teal-600">{special.priceOrTime}</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-amber-500">{special.rating || '⭐⭐⭐⭐'}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-stone-400">
            <p className="text-sm">该分类暂无数据</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialsListDetail;
