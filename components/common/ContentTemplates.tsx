
import React, { useEffect, useState } from 'react';
import { Icon, IconName } from './Icon';
import BottomSheet from './BottomSheet';
import './ContentTemplates.css';

// --- Types ---

export interface ContentData {
  id: string;
  title: string;
  subtitle?: string; // e.g., Title, Category, Distance
  tags?: string[];
  imageUrl: string;
  description: string;
  detailText?: string; // Long content
  metaInfo?: { label: string; value: string; icon?: IconName }[]; // e.g. Price, Time
}

// --- 1. Section Header (Unified Home Headers) ---

export const SectionHeader: React.FC<{
  title: string;
  subtitle: string;
  actionText?: string;
  onAction?: () => void;
}> = ({ title, subtitle, actionText, onAction }) => (
  <div className="flex items-baseline justify-between mb-4 px-1">
    <div>
      <h2 className="text-xl font-serif-brand font-bold text-stone-800">{title}</h2>
      <p className="text-xs text-stone-500 mt-1 tracking-widest font-light">{subtitle}</p>
    </div>
    {actionText && (
      <button 
        onClick={onAction}
        className="text-[10px] text-teal-600 font-medium flex items-center space-x-0.5"
      >
        <span>{actionText}</span>
        <Icon name="arrow-left" className="w-3 h-3 transform rotate-180" />
      </button>
    )}
  </div>
);

// --- 2. Content Card (Unified List Item) ---

interface ContentCardProps {
  data: ContentData;
  variant?: 'portrait' | 'square' | 'landscape';
  onClick: () => void;
  className?: string;
}

export const ContentCard: React.FC<ContentCardProps> = ({ data, variant = 'square', onClick, className = '' }) => {
  // 移动端降低高度,避免图片占据太多空间
  const heightClass = 
    variant === 'portrait' ? 'h-[180px]' : 
    variant === 'landscape' ? 'h-[140px]' : 
    'h-[160px]';

  return (
    <div 
      onClick={onClick}
      className={`relative ${heightClass} rounded-2xl overflow-hidden shadow-sm cursor-pointer group btn-press border border-stone-100 ${className}`}
    >
      <div className="absolute inset-0 bg-stone-200 animate-pulse"></div>
      <img 
        src={data.imageUrl} 
        alt={data.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 lomo-filter relative z-0"
        onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x600/e2e8f0/64748b?text=No+Image'; }}
      />
      <div className="vignette-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 z-10"></div>
      
      <div className="absolute bottom-0 left-0 right-0 p-3 text-white z-20">
        {data.subtitle && (
          <span className={`
            inline-block text-[9px] px-1.5 py-0.5 rounded backdrop-blur-md mb-1.5 font-medium shadow-sm
            ${variant === 'portrait' ? 'bg-blue-600/80' : 'bg-teal-600/80'}
          `}>
            {data.subtitle}
          </span>
        )}
        <h4 className={`font-serif-brand font-bold leading-tight shadow-black drop-shadow-md ${variant === 'portrait' ? 'text-base' : 'text-sm'}`}>
          {data.title}
        </h4>
        {variant === 'portrait' && data.description && (
          <p className="text-[9px] opacity-80 line-clamp-2 mt-1 font-light leading-relaxed">
            {data.description}
          </p>
        )}
      </div>
    </div>
  );
};

// --- 3. Universal Detail View (The "One Template") ---

interface UniversalDetailViewProps {
  data: ContentData;
  onClose: () => void;
  /** Inject custom buttons (e.g., Navigation, Voice) */
  renderBottomActions?: () => React.ReactNode; 
  /** Inject extra content (e.g., Audio Player, Map) */
  children?: React.ReactNode; 
}

export const UniversalDetailView: React.FC<UniversalDetailViewProps> = ({ data, onClose, renderBottomActions, children }) => {
  const [offsetY, setOffsetY] = useState(0);

  // Parallax Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setOffsetY(window.scrollY * 0.4);
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on mount
  useEffect(() => {
      window.scrollTo(0, 0);
  }, []);

  return (
    // [FIX] Increased pb-48 (approx 12rem) to allow content to scroll above the stacked sticky footers (Action Bar + Agent Widget)
    <div className="bg-white min-h-full pb-48 animate-fade-in relative overflow-hidden">
        {/* Parallax Hero */}
        <div className="relative h-[45vh] w-full overflow-hidden bg-stone-200">
            <div 
              className="parallax-hero-image"
              style={{ transform: `translateY(${offsetY}px)` }}
            >
              <img 
                src={data.imageUrl} 
                alt={data.title} 
                className="w-full h-full object-cover lomo-filter" 
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/800x600/e2e8f0/64748b?text=No+Image'; }}
              />
            </div>
            
            <div className="vignette-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/30 z-10"></div>
            
            <button 
                onClick={onClose}
                className="absolute top-6 left-6 w-10 h-10 bg-black/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white z-20 active:scale-90 transition shadow-lg"
                aria-label="关闭"
            >
                <Icon name="arrow-left" className="w-5 h-5" />
            </button>
        </div>

        {/* Content Body */}
        <div className="px-5 -mt-8 relative z-10">
            <div className="bg-white rounded-t-[32px] p-6 shadow-premium-sm min-h-[50vh] border-t border-stone-50">
                {/* Header Info */}
                <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                        {data.tags?.map(tag => (
                            <span key={tag} className="text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg">
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-3xl font-serif-brand font-bold text-stone-900 mb-2 leading-tight">
                        {data.title}
                    </h1>
                    {data.subtitle && (
                        <p className="text-stone-500 text-sm font-medium border-l-2 border-teal-500 pl-3 italic">
                            {data.subtitle}
                        </p>
                    )}
                </div>

                {/* Meta Grid (Optional) */}
                {data.metaInfo && (
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        {data.metaInfo.map((meta, i) => (
                            <div key={i} className="bg-stone-50 p-3 rounded-xl border border-stone-100 flex items-center space-x-3">
                                {meta.icon && <div className="text-teal-600"><Icon name={meta.icon} className="w-5 h-5" /></div>}
                                <div>
                                    <div className="text-[10px] text-stone-400 uppercase tracking-wider">{meta.label}</div>
                                    <div className="text-sm font-bold text-stone-800">{meta.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Main Description */}
                <article className="prose prose-stone prose-sm max-w-none text-justify leading-loose text-stone-600 font-light">
                   <p className="first-letter:text-4xl first-letter:font-serif-brand first-letter:mr-2 first-letter:float-left first-letter:text-stone-800 font-serif-brand text-lg mb-4 text-stone-700">
                       {data.description}
                   </p>
                   {data.detailText && (
                       <div className="mt-4 whitespace-pre-wrap">
                           {data.detailText}
                       </div>
                   )}
                </article>

                {/* Injection Slot for Extra Content */}
                {children && <div className="mt-8">{children}</div>}
            </div>
        </div>

        {/* Bottom Actions Bar (Sticky) */}
        {renderBottomActions && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-stone-100 z-30 max-w-[1200px] mx-auto pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                {renderBottomActions()}
            </div>
        )}
    </div>
  );
};

// --- 4. Content Detail Modal (The "One Modal" Wrapper) ---

export const ContentDetailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  data: ContentData | null;
  renderBottomActions?: () => React.ReactNode;
  children?: React.ReactNode;
}> = ({ isOpen, onClose, data, renderBottomActions, children }) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
        {data && (
            <UniversalDetailView 
                data={data} 
                onClose={onClose} 
                renderBottomActions={renderBottomActions}
            >
                {children}
            </UniversalDetailView>
        )}
    </BottomSheet>
  );
};
