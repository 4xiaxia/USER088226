import React, { useState } from 'react';
import { Celebrity } from '../types';
import { CELEBRITY_DATA } from '../services/staticData';

interface CelebrityListDetailProps {
  onSelectCelebrity: (celebrity: Celebrity) => void;
  onBack: () => void;
}

const CelebrityListDetail: React.FC<CelebrityListDetailProps> = ({
  onSelectCelebrity,
  onBack
}) => {
  const [activeCategory, setActiveCategory] = useState<'革命先辈' | '历届乡贤' | '优秀后生' | '全部'>('全部');

  // 分类数据
  const categories = [
    { key: '全部' as const, label: '全部' },
    { key: '革命先辈' as const, label: '革命先辈' },
    { key: '历届乡贤' as const, label: '历届乡贤' },
    { key: '优秀后生' as const, label: '优秀后生' }
  ];

  // 根据分类筛选数据
  const filteredData = activeCategory === '全部' 
    ? CELEBRITY_DATA 
    : CELEBRITY_DATA.filter(c => c.category === activeCategory);

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
          <h1 className="flex-1 text-center text-xl font-serif-brand font-bold text-stone-800">名人堂</h1>
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
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
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

      {/* 名人列表 */}
      <div className="px-6 py-6 space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((celebrity, index) => (
            <div
              key={celebrity.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* 名人卡片 */}
              <button
                onClick={() => onSelectCelebrity(celebrity)}
                className="w-full p-4 flex items-center space-x-4 text-left hover:bg-stone-50 transition-colors"
              >
                {/* 头像 */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-stone-200 ring-2 ring-stone-100">
                    <img
                      src={celebrity.imageUrl}
                      alt={celebrity.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/80?text=' + encodeURIComponent(celebrity.name);
                      }}
                    />
                  </div>
                </div>

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-bold text-stone-800 font-serif-brand">{celebrity.name}</h3>
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-medium rounded-full">
                      {celebrity.role || '历史名人'}
                    </span>
                  </div>
                  <p className="text-sm text-stone-600 mb-2">{celebrity.title}</p>
                  <p className="text-xs text-stone-500 line-clamp-2">{celebrity.description}</p>
                </div>

                {/* 箭头 */}
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-stone-400">
            <p className="text-sm">该分类暂无数据</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CelebrityListDetail;
