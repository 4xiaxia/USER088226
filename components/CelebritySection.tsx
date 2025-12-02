import React, { useState } from 'react';
import { Celebrity } from '../types';
import { CELEBRITY_DATA } from '../services/staticData';
import { ContentCard, ContentDetailModal, ContentData } from './common/ContentTemplates';
import ModuleTitle from './common/ModuleTitle';
import './CelebritySection.css';

interface CelebritySectionProps {
    onNavigateToArticle?: (c: Celebrity) => void;
    onInteraction?: (name: string) => void;
    id?: string;
    className?: string;
    onViewCelebrityList?: () => void; // 查看名人堂列表
}

const CelebritySection: React.FC<CelebritySectionProps> = ({ onNavigateToArticle, onInteraction, id, className = '', onViewCelebrityList }) => {
  // 分类数据配置
  const categories = [
    { 
      key: '革命先辈' as const, 
      label: '革命先辈', 
      icon: '🎖️',
      description: '革命岁月，铁骨铮铮',
      count: CELEBRITY_DATA.filter(c => c.category === '革命先辈').length,
      bgGradient: 'from-red-500 to-orange-500',
      imageUrl: CELEBRITY_DATA.find(c => c.category === '革命先辈')?.imageUrl || 'https://via.placeholder.com/400x600?text=革命先辈'
    },
    { 
      key: '历届乡贤' as const, 
      label: '历届乡贤', 
      icon: '📚',
      description: '德高望重，泽被乡里',
      count: CELEBRITY_DATA.filter(c => c.category === '历届乡贤').length,
      bgGradient: 'from-emerald-500 to-teal-500',
      imageUrl: CELEBRITY_DATA.find(c => c.category === '历届乡贤')?.imageUrl || 'https://via.placeholder.com/400x600?text=历届乡贤'
    },
    { 
      key: '优秀后生' as const, 
      label: '优秀后生', 
      icon: '🌟',
      description: '后起之秀，未来可期',
      count: CELEBRITY_DATA.filter(c => c.category === '优秀后生').length,
      bgGradient: 'from-blue-500 to-cyan-500',
      imageUrl: CELEBRITY_DATA.find(c => c.category === '优秀后生')?.imageUrl || 'https://via.placeholder.com/400x600?text=优秀后生'
    }
  ];

  // 点击分类卡片，直接进入列表页
  const handleCategoryClick = (categoryKey: string) => {
    if (onViewCelebrityList) {
      onViewCelebrityList();
    }
    if (onInteraction) onInteraction(`名人堂-${categoryKey}`);
  };

  return (
    <div id={id} className={`mt-12 mb-4 animate-fade-in-up ${className}`}>
      {/* 统一模块标题 */}
      <ModuleTitle 
        title="名人堂" 
        subtitle="往昔峕嵘 风骨长隑"
        announcement={{
          text: "新活动上线  点击跳转",
          onClick: () => {
            // TODO: 跳转到活动页面
            console.log('跳转到活动页面');
          }
        }}
        onMoreClick={onViewCelebrityList}
      />

      {/* 分类卡片网格 */}
      <div className="px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-3 gap-3">
          {categories.map((category, index) => (
            <button
              key={category.key}
              onClick={() => handleCategoryClick(category.key)}
              className="group relative h-[200px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* 背景图片 */}
              <div className="absolute inset-0">
                <img
                  src={category.imageUrl}
                  alt={category.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/400x600/e2e8f0/64748b?text=${encodeURIComponent(category.label)}`;
                  }}
                />
                {/* 渐变遮罩 */}
                <div className={`absolute inset-0 bg-gradient-to-t ${category.bgGradient} opacity-60 group-hover:opacity-70 transition-opacity duration-500`}></div>
              </div>

              {/* 内容层 */}
              <div className="relative h-full flex flex-col justify-end p-6 text-white">
                {/* 图标 */}
                <div className="mb-4 text-5xl transform group-hover:scale-110 transition-transform duration-500">
                  {category.icon}
                </div>
                
                {/* 标题 */}
                <h3 className="text-2xl font-serif-brand font-bold mb-2 group-hover:tracking-wider transition-all duration-500">
                  {category.label}
                </h3>
                
                {/* 描述 */}
                <p className="text-sm text-white/90 mb-3 font-light">
                  {category.description}
                </p>
                
                {/* 统计信息 */}
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                    {category.count} 位名人
                  </span>
                  <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>

              {/* 边框光晕效果 */}
              <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/40 rounded-2xl transition-all duration-500"></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CelebritySection;