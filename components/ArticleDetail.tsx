
import React from 'react';
import { Celebrity } from '../types';
import { UniversalDetailView, ContentData } from './common/ContentTemplates';
import { Icon } from './common/Icon';

interface ArticleDetailProps {
  data: Celebrity;
  onBack: () => void;
  onHookTrigger: (hook: string) => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ data, onBack, onHookTrigger }) => {
  
  // Adapter: Convert Celebrity to ContentData
  const articleData: ContentData = {
      id: data.id,
      title: data.name,
      subtitle: data.title, // "辛亥革命元老"
      imageUrl: data.imageUrl,
      description: data.description,
      detailText: data.detailText,
      tags: data.tags || ['名人故事'],
      metaInfo: [
          { label: '年代', value: data.era || '历史', icon: 'clock' },
          { label: '身份', value: data.role || '先辈', icon: 'user' }
      ]
  };

  return (
    <UniversalDetailView 
        data={articleData} 
        onClose={onBack}
        // Custom Bottom Action for Article Context
        renderBottomActions={() => (
            <div className="flex space-x-3">
                <button 
                    onClick={onBack}
                    className="flex-1 bg-white border border-stone-200 text-stone-600 py-3 rounded-xl font-bold shadow-sm active:scale-95 transition"
                >
                    返回列表
                </button>
                <button 
                    onClick={() => onHookTrigger('朗读这篇文章')}
                    className="flex-[2] bg-stone-800 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center space-x-2 active:scale-95 transition"
                >
                    <Icon name="play" className="w-4 h-4" />
                    <span>AI 朗读全文</span>
                </button>
            </div>
        )}
    >
        {/* Children Slot: Interactive Hooks */}
        <div className="mt-8 bg-stone-50 rounded-2xl p-6 border border-stone-100">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4 flex items-center">
                <Icon name="chat-bubble" className="w-3 h-3 mr-2" />
                延伸阅读 (AI 互动)
            </h3>
            <div className="flex flex-wrap gap-2">
                {['革命贡献', '家族后代', '相关遗址', '历史评价'].map(tag => (
                    <button 
                        key={tag}
                        onClick={() => onHookTrigger(tag)}
                        className="bg-white border border-stone-200 px-4 py-2 rounded-xl text-stone-600 text-xs font-medium hover:border-teal-400 hover:text-teal-600 transition shadow-sm active:scale-95"
                    >
                        #{tag}
                    </button>
                ))}
            </div>
        </div>
    </UniversalDetailView>
  );
};

export default ArticleDetail;
