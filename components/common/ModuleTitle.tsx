import React from 'react';

interface ModuleTitleProps {
  title: string;
  subtitle: string;
  align?: 'left' | 'center';
  className?: string;
  onMoreClick?: () => void; // 查看更多按钮点击事件
  moreText?: string; // 查看更多按钮文字，默认"查看更多"
  announcement?: { // 公告信息
    text: string;
    onClick?: () => void;
  };
}

/**
 * 模块标题组件
 * 统一所有模块的标题样式
 */
const ModuleTitle: React.FC<ModuleTitleProps> = ({ 
  title, 
  subtitle, 
  align = 'center',
  className = '',
  onMoreClick,
  moreText = '查看更多',
  announcement
}) => {
  return (
    <div className={`module-title px-6 mb-6 ${className} animate-fade-in-up`}>
      {/* 标题 */}
      <div className={`${align === 'center' ? 'text-center' : ''}`}>
        <h2 className="text-xl font-serif-brand font-bold bg-gradient-to-r from-stone-800 via-stone-900 to-stone-800 bg-clip-text text-transparent tracking-wide animate-shimmer">
          {title}
        </h2>
      </div>
      
      {/* 副标题 */}
      <p className={`text-xs text-stone-500 mt-2 tracking-widest font-light ${align === 'center' ? 'text-center' : ''}`}>
        {subtitle}
      </p>
      
      {/* 底部区域：公告 + 查看更多 */}
      {(announcement || onMoreClick) && (
        <div className="flex items-center justify-between mt-3">
          {/* 左侧公告 - 小粉色 */}
          {announcement && (
            <button
              onClick={announcement.onClick}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-pink-600 text-xs font-medium rounded-full transition-all duration-300 group"
            >
              {/* 小喇叭图标 */}
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
              <span>{announcement.text}</span>
            </button>
          )}
          
          {/* 右侧查看更多按钮 - 绿色标签圆角 */}
          {onMoreClick && (
            <button
              onClick={onMoreClick}
              className="inline-flex items-center px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-full transition-all duration-300 shadow-sm hover:shadow-md group"
              aria-label={moreText}
            >
              <span>{moreText}</span>
              <svg 
                className="w-3 h-3 ml-1 transform group-hover:translate-x-0.5 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
      
      {/* 装饰性分割线 */}
      <div className="mt-3 flex justify-center">
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
      </div>
    </div>
  );
};

export default ModuleTitle;
