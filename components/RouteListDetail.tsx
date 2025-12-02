import React from 'react';
import { Route, Spot } from '../types';
import { Icon } from './common/Icon';

interface RouteListDetailProps {
  routes: Route[];
  onSelectSpot: (spot: Spot, category: Route['category']) => void;
  onBack: () => void;
}

/**
 * 路线分类详情页面
 * 展示所有路线的完整列表
 */
const RouteListDetail: React.FC<RouteListDetailProps> = ({
  routes,
  onSelectSpot,
  onBack
}) => {
  const categoryConfig: Record<string, { 
    badge: string; 
    bgGradient: string;
    icon: string;
  }> = {
    '历史文化': { 
      badge: 'bg-red-600/90 text-white shadow-red-500/20',
      bgGradient: 'from-red-50 to-orange-50',
      icon: '🏛️'
    },
    '自然风景': { 
      badge: 'bg-teal-600/90 text-white shadow-teal-500/20',
      bgGradient: 'from-teal-50 to-cyan-50',
      icon: '🌿'
    },
    '美食体验': { 
      badge: 'bg-amber-500/90 text-white shadow-amber-500/20',
      bgGradient: 'from-amber-50 to-yellow-50',
      icon: '🍜'
    },
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-stone-700 hover:text-emerald-600 transition-colors duration-300 group"
            aria-label="返回首页"
          >
            <svg 
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">返回</span>
          </button>
          <h1 className="flex-1 text-center text-lg font-serif-brand font-bold text-stone-800">
            推荐路线
          </h1>
          <div className="w-16"></div> {/* 占位保持标题居中 */}
        </div>
      </div>

      {/* 路线列表 */}
      <div className="max-w-[1200px] mx-auto px-4 pt-6 pb-6">
        <div className="space-y-6">
          {routes.map((route, index) => {
            const config = categoryConfig[route.category] || categoryConfig['历史文化'];
            
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in-up border border-stone-100 hover:shadow-xl transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* 路线头部 */}
                <div className={`bg-gradient-to-r ${config.bgGradient} p-6 border-b border-stone-100`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">{config.icon}</span>
                        <h2 className="text-xl font-serif-brand font-bold text-stone-800">
                          {route.name}
                        </h2>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide shadow-md backdrop-blur-md border border-white/10 ${config.badge}`}>
                          {route.category}
                        </span>
                      </div>
                      <p className="text-sm text-stone-600 leading-relaxed">
                        {route.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 景点列表 */}
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Icon name="location" className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-semibold text-stone-700">
                      包含景点 ({route.spots.length})
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {route.spots.map((spot, spotIndex) => (
                      <button
                        key={spot.id}
                        onClick={() => onSelectSpot(spot, route.category)}
                        className="text-left p-4 rounded-xl border border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all duration-300 group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                                {spotIndex + 1}
                              </span>
                              <h4 className="font-semibold text-stone-800 group-hover:text-emerald-700 transition-colors">
                                {spot.name}
                              </h4>
                            </div>
                            <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                              {spot.intro_short}
                            </p>
                            {spot.distance && (
                              <p className="text-[10px] text-stone-400 mt-1">
                                📍 {spot.distance}
                              </p>
                            )}
                          </div>
                          <svg 
                            className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 transform group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 ml-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        
                        {/* 标签 */}
                        {spot.tags && spot.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {spot.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span 
                                key={tagIndex}
                                className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-medium bg-stone-100 text-stone-600 border border-stone-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RouteListDetail;
