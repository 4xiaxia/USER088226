import React, { useState } from 'react';
import { SPECIALS_DATA } from '../services/staticData';
import { SpecialItem } from '../types';
import { ContentCard, ContentDetailModal, ContentData } from './common/ContentTemplates';
import ModuleTitle from './common/ModuleTitle';
import { Icon } from './common/Icon';
import './LocalSpecialsSection.css';

interface LocalSpecialsSectionProps {
    onInteraction?: (itemName: string) => void;
    id?: string;
    className?: string;
    onViewSpecialsList?: () => void; // 查看风物志列表
}

const LocalSpecialsSection: React.FC<LocalSpecialsSectionProps> = ({ onInteraction, id, className = '', onViewSpecialsList }) => {
  const [selectedItem, setSelectedItem] = useState<SpecialItem | null>(null);
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

  // Adapter: Convert SpecialItem to generic ContentData
  const toContentData = (s: SpecialItem): ContentData => ({
      id: s.id,
      title: s.title,
      subtitle: s.category,
      imageUrl: s.imageUrl,
      description: s.description,
      metaInfo: [
          { label: '价格/时间', value: s.priceOrTime, icon: 'price-tag' },
          { label: '推荐指数', value: s.rating || '⭐⭐⭐⭐', icon: 'check-circle' }
      ],
      tags: s.tags || ['地道风物', s.category]
  });

  const handleSelect = (item: SpecialItem) => {
      setSelectedItem(item);
      if (onInteraction) onInteraction(item.title);
  };

  return (
    <div id={id} className={`mt-12 mb-4 animate-fade-in-up local-specials-section ${className}`}>
      {/* 统一模块标题 */}
      <ModuleTitle 
        title="风物志" 
        subtitle="地道风物 人间烟火"
        announcement={{
          text: "新活动上线  点击跳转",
          onClick: () => {
            // TODO: 跳转到活动页面
            console.log('跳转到活动页面');
          }
        }}
        onMoreClick={onViewSpecialsList}
      />

      {/* 分类标签页 */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`
                flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                ${
                  activeCategory === cat.key
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30 scale-105'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:shadow-md'
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

      {/* Grid Layout */}
      <div className="px-6">
        {filteredData.length > 0 ? (
          <div className="max-w-[1400px] mx-auto grid grid-cols-3 gap-3">
            {filteredData.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ContentCard 
                      data={toContentData(item)}
                      variant="portrait"
                      onClick={() => handleSelect(item)}
                      className="h-full"
                  />
                </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-stone-400">
            <p className="text-sm">该分类暂无数据</p>
          </div>
        )}
      </div>

      {/* Use the new encapsulated Modal */}
      <ContentDetailModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          data={selectedItem ? toContentData(selectedItem) : null}
          renderBottomActions={() => (
              <div className="flex space-x-3">
                  <button className="flex-1 py-3 rounded-xl bg-white border border-stone-200 text-stone-600 font-bold shadow-sm active:bg-stone-50">
                      加入收藏
                  </button>
                  <button className="flex-[2] py-3 rounded-xl bg-teal-600 text-white font-bold shadow-lg flex items-center justify-center space-x-2 active:scale-95 transition">
                      <Icon name="bag" className="w-4 h-4" />
                      <span>联系农户购买</span>
                  </button>
              </div>
          )}
      />
    </div>
  );
};

export default LocalSpecialsSection;