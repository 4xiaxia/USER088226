import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Spot, Route, Celebrity } from '../types';
import * as geminiService from '../services/geminiService';
import * as staticData from '../services/staticData';
import SpotDetail from './SpotDetail';
import BottomChatWidget from './BottomChatWidget';
import PresenterMode from './PresenterMode';
import ArticleDetail from './ArticleDetail';
import HomeView from './home/HomeView';
import RouteListDetail from './RouteListDetail';
import CelebrityListDetail from './CelebrityListDetail';
import SpecialsListDetail from './SpecialsListDetail';
import { PAGE_HOOKS_CONFIG } from '../utils/constants';
import { Icon } from './common/Icon';
// import { ASSETS } from '../utils/constants'; // 未使用，已注释

interface TourGuideProps {
  userId: string;
  onLogout: () => void;
  coordinates: { lat: number; lng: number } | null;
  geoLoading: boolean;
  geoError: GeolocationPositionError | null;
  initialView?: string | null;
}

const TourGuide: React.FC<TourGuideProps> = ({ geoLoading, initialView }) => {
  const [routes, setRoutes] = useState<Route[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // View Routing State
  const [viewMode, setViewMode] = useState<'home' | 'map' | 'spot_detail' | 'article' | 'route_list' | 'celebrity_list' | 'specials_list'>('home');
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [selectedCelebrity, setSelectedCelebrity] = useState<Celebrity | null>(null);

  // Agent State
  const [activeHooks, setActiveHooks] = useState<string[]>(PAGE_HOOKS_CONFIG['home']);
  const [pendingIntent, setPendingIntent] = useState<string | null>(null);
  
  // [NEW] Agent Reaction State
  const [agentReaction, setAgentReaction] = useState<string | null>(null);
  const reactionTimeoutRef = useRef<any>(null);
  
  // Cache Status State
  const [cacheInfo, setCacheInfo] = useState<{ cached: boolean; message: string } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // [LOGIC] Debounced Interaction Handler
  const handleInteraction = useCallback((text: string) => {
      // Clear previous timeout to prevent flickering
      if (reactionTimeoutRef.current) clearTimeout(reactionTimeoutRef.current);
      
      // Set new reaction
      setAgentReaction(text);
      
      // Auto-hide after 3.5s (sync with BottomChatWidget animation)
      reactionTimeoutRef.current = setTimeout(() => {
          setAgentReaction(null);
      }, 3500);
  }, []);

  // 初始化：从 Google Sheets 加载数据（首次加载）
  useEffect(() => {
      const loadData = async () => {
          try {
              await staticData.initializeData();
              setCacheInfo(staticData.getCacheInfo());
          } catch (error) {
              console.error('Failed to load data from Google Sheets:', error);
          }
      };
      loadData();
  }, []);

  useEffect(() => {
      if (!geoLoading) {
          geminiService.getRoutes("118.2,25.2", "Dongli").then(data => {
              setRoutes(data.routes);
              setIsLoading(false);
          }).catch(() => setIsLoading(false));
      }
  }, [geoLoading]);
  
  // 手动刷新数据
  const handleRefreshData = async () => {
      setIsRefreshing(true);
      try {
          await staticData.refreshData();
          // 触发 routes 重新加载
          geminiService.getRoutes("118.2,25.2", "Dongli").then(data => {
              setRoutes(data.routes);
          });
          setCacheInfo(staticData.getCacheInfo());
          handleInteraction("✅ 数据已刷新");
      } catch (error) {
          console.error('Refresh failed:', error);
          handleInteraction("❌ 刷新失败");
      } finally {
          setIsRefreshing(false);
      }
  };

  // Handle Initial Deep Link
  useEffect(() => {
      if (initialView && !isLoading) {
          setTimeout(() => {
              // 检查是否是聊天意图
              if (initialView.startsWith('chat:')) {
                  const question = initialView.substring(5); // 去掉 'chat:' 前缀
                  setPendingIntent(question);
                  handleInteraction('正在为您解答...');
              } else if (initialView === 'guide' || initialView === 'route-red' || initialView === 'war-site' || initialView === 'tour-guide') {
                  // 红色文旅/抗战旧址/风景导游 -> 路线区域
                  document.getElementById('routes-section')?.scrollIntoView({ behavior: 'smooth' });
                  handleInteraction("为您推荐：特色路线");
              } else if (initialView === 'celebrity' || initialView === 'culture') {
                  // 名人先辈/侨乡文化 -> 名人堂区域
                  document.getElementById('celebrity-section')?.scrollIntoView({ behavior: 'smooth' });
                  handleInteraction("这里是名人堂");
              } else if (initialView === 'news') {
                  // 村子动态 -> 动态区域
                  document.getElementById('news-section')?.scrollIntoView({ behavior: 'smooth' });
                  handleInteraction("查看最新动态");
              } else if (initialView === 'map') {
                  setViewMode('map');
                  handleInteraction("进入地图模式");
              }
          }, 300);
      }
  }, [initialView, isLoading, handleInteraction]);

  // Dynamic Hooks & Reactions Updater
  useEffect(() => {
      if (viewMode === 'home') {
          setActiveHooks(PAGE_HOOKS_CONFIG['home']);
          // Only trigger welcome if not navigating back
          if (!agentReaction) handleInteraction("欢迎回到首页");
      }
      else if (viewMode === 'map') {
          setActiveHooks(PAGE_HOOKS_CONFIG['map_view']);
          handleInteraction("查看地图总览");
      }
      else if (viewMode === 'spot_detail') {
          setActiveHooks(PAGE_HOOKS_CONFIG['spot_detail']);
          handleInteraction("正在查看景点详情");
      }
      else if (viewMode === 'article') {
          setActiveHooks(PAGE_HOOKS_CONFIG['article_celebrity']);
          handleInteraction("阅读名人故事");
      }
      else if (viewMode === 'route_list') {
          setActiveHooks(PAGE_HOOKS_CONFIG['home']); // 使用首页的hooks
          handleInteraction("查看所有路线");
      }
      else if (viewMode === 'celebrity_list') {
          setActiveHooks(PAGE_HOOKS_CONFIG['home']);
          handleInteraction("浏览名人堂");
      }
      else if (viewMode === 'specials_list') {
          setActiveHooks(PAGE_HOOKS_CONFIG['home']);
          handleInteraction("探索风物志");
      }
  }, [viewMode]); // Removed handleInteraction from dependency to avoid loop, though useCallback handles it.

  // Navigation Handlers
  const handleSelectSpot = (spot: Spot) => {
      setSelectedSpot(spot);
      setViewMode('spot_detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToArticle = (celebrity: Celebrity) => {
      setSelectedCelebrity(celebrity);
      setViewMode('article');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewRouteList = () => {
      setViewMode('route_list');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewCelebrityList = () => {
      setViewMode('celebrity_list');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewSpecialsList = () => {
      setViewMode('specials_list');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
      setViewMode('home');
      setSelectedSpot(null);
      setSelectedCelebrity(null);
  };

  const handleGridNavigate = (id: string) => {
      if (id === 'route-red' || id === 'route-nature') {
          document.getElementById('routes-section')?.scrollIntoView({ behavior: 'smooth' });
          handleInteraction("为您精选路线");
      } else if (id === 'celebrity') {
          document.getElementById('celebrity-section')?.scrollIntoView({ behavior: 'smooth' });
          handleInteraction("瞻仰先辈风采");
      } else if (id === 'map') {
          setViewMode('map');
      }
  };

  // Main Render Logic
  const renderContent = () => {
      if (viewMode === 'map') {
          return <PresenterMode routes={routes} activeSpot={null} activeSpotCategory={null} onSelectSpotFromMap={(s: Spot) => handleSelectSpot(s)} isLoading={false} error={null} geoError={null} />;
      }
      
      if (viewMode === 'spot_detail' && selectedSpot) {
          return <SpotDetail spot={selectedSpot} onBack={handleBackToHome} onNext={handleBackToHome} navigationInfo={null} isNavLoading={false} onAskAI={(q) => setPendingIntent(q)} />;
      }

      if (viewMode === 'article' && selectedCelebrity) {
          return <ArticleDetail data={selectedCelebrity} onBack={handleBackToHome} onHookTrigger={(h) => setPendingIntent(h)} />;
      }
      
      // 路线分类详情页面
      if (viewMode === 'route_list' && routes) {
          return <RouteListDetail routes={routes} onSelectSpot={handleSelectSpot} onBack={handleBackToHome} />;
      }

      // 名人堂列表页面
      if (viewMode === 'celebrity_list') {
          return <CelebrityListDetail onSelectCelebrity={handleNavigateToArticle} onBack={handleBackToHome} />;
      }

      // 风物志列表页面
      if (viewMode === 'specials_list') {
          return <SpecialsListDetail onSelectSpecial={(special) => {
              // TODO: 可以添加风物详情页面
              console.log('选择风物:', special);
              handleInteraction(`查看${special.title}`);
          }} onBack={handleBackToHome} />;
      }

      // 首页 - 使用模块化的 HomeView
      return (
          <HomeView 
              routes={routes}
              onNavigate={handleGridNavigate}
              onSelectSpot={handleSelectSpot}
              onViewMap={() => setViewMode('map')}
              onNavigateToArticle={handleNavigateToArticle}
              onInteraction={handleInteraction}
              onViewRouteList={handleViewRouteList}
              onViewCelebrityList={handleViewCelebrityList}
              onViewSpecialsList={handleViewSpecialsList}
          />
      );
  };

  const getWidgetBottomOffset = () => {
      if (viewMode === 'spot_detail') return 100;
      if (viewMode === 'map') return 30;
      return 20; 
  };

  // [LOGIC] Determine active context for the Agent (e.g. "Zheng Yuzhi" vs "Red Route")
  const getActiveContextName = () => {
      if (viewMode === 'spot_detail' && selectedSpot) return selectedSpot.name;
      if (viewMode === 'article' && selectedCelebrity) return selectedCelebrity.name;
      if (viewMode === 'map') return "全景地图";
      return "东里村";
  };

  // 判断是否为子页面（列表详情页）
  const isSubPage = viewMode === 'celebrity_list' || viewMode === 'specials_list' || viewMode === 'route_list';

  return (
    <div className="max-w-[1200px] mx-auto bg-stone-50 min-h-screen relative shadow-2xl overflow-hidden">
       {/* 主头部导航栏，子页面时隐藏 */}
       {!isSubPage && (
         <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-between p-4 px-5">
              <div className="flex items-center space-x-3">
                   <div>
                      <h1 className="text-lg font-bold text-stone-800 font-serif-brand leading-none">村官智能体</h1>
                      <span className="text-[10px] text-teal-600 font-medium">AI 为您服务</span>
                   </div>
              </div>
              {viewMode !== 'home' && (
                  <button onClick={handleBackToHome} className="text-sm font-medium text-stone-500 bg-stone-100 px-3 py-1 rounded-full">返回首页</button>
              )}
              {/* 数据刷新按钮 + 缓存状态 */}
              <div className="flex items-center space-x-3">
                  <button 
                      onClick={handleRefreshData}
                      disabled={isRefreshing}
                      className="text-xs font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-full transition flex items-center space-x-1 disabled:opacity-50"
                      title={cacheInfo?.message || '刷新数据'}
                  >
                      <Icon name="download" className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      <span>{isRefreshing ? '同步中...' : '刷新数据'}</span>
                  </button>
                  {cacheInfo && (
                      <span className="text-[10px] text-stone-400">
                          {cacheInfo.cached ? '✓' : '○'} {cacheInfo.message}
                      </span>
                  )}
              </div>
         </header>
       )}

       <main>
           {renderContent()}
       </main>

       {/* Connected Agent Widget */}
       <BottomChatWidget 
           contextName={getActiveContextName()}
           hookWords={activeHooks}
           pendingIntent={pendingIntent}
           onIntentHandled={() => setPendingIntent(null)}
           bottomOffset={getWidgetBottomOffset()} 
           reactionText={agentReaction} 
       />
    </div>
  );
};

export default TourGuide;
