
import React, { useEffect, useRef, useState } from 'react';
import { Spot, Route } from '../types';
import { openNavigationApp } from '../utils/navigation';
import { Icon } from './common/Icon';
import { Spinner } from './common/Spinner';

interface MapViewProps {
  routes: Route[];
  onSelectSpot: (spot: Spot | null) => void;
  activeSpotId: string | null;
}

// Route Colors: Red (Revolution), Green (Eco), Yellow (Folk/Culture)
const ROUTE_COLORS: Record<string, string> = {
    '历史文化': '#C41E3A', // Red
    '自然风景': '#36B37E', // Green
    '美食体验': '#FAAD14', // Yellow
    'default': '#1677FF'
};

const MapView: React.FC<MapViewProps> = ({ routes, onSelectSpot, activeSpotId }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null); // AMap.Map
  const [isMapReady, setIsMapReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Initialize Map
  useEffect(() => {
    const checkAMap = setInterval(() => {
        if (window.AMap) {
            clearInterval(checkAMap);
            initMap();
        }
    }, 500);

    const timeout = setTimeout(() => {
        clearInterval(checkAMap);
        if (!window.AMap) setInitError("地图服务加载超时，请检查网络");
    }, 10000);

    return () => {
        clearInterval(checkAMap);
        clearTimeout(timeout);
        if (mapInstanceRef.current) {
            mapInstanceRef.current.destroy();
        }
    };
  }, []);

  const initMap = () => {
      if (!mapContainerRef.current) return;
      
      try {
          // [DEFAULT CENTER] Dongli Village (Strategic Center)
          // We intentionally center here instead of user location to show the destination first.
          const center = [118.205, 25.235]; 

          const map = new window.AMap.Map(mapContainerRef.current, {
              zoom: 16.5,  // 放大地图显示更细节
              center: center,
              viewMode: '3D',
              pitch: 45,
          });

          // Add basic controls
          window.AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function(){
              map.addControl(new window.AMap.ToolBar({ position: 'LT' }));
              map.addControl(new window.AMap.Scale());
          });

          mapInstanceRef.current = map;
          setIsMapReady(true);
      } catch (e) {
          console.error("Map Init Error", e);
          setInitError("地图初始化失败");
      }
  };

  // Render Routes and Markers
  useEffect(() => {
      if (!isMapReady || !mapInstanceRef.current || !routes) return;
      
      const map = mapInstanceRef.current;
      map.clearMap(); // Clear previous overlays

      routes.forEach(route => {
          // Determine color based on category
          let colorKey = route.category;
          if (route.name.includes('民俗')) colorKey = '美食体验'; 
          const color = ROUTE_COLORS[colorKey] || ROUTE_COLORS['default'];
          
          const pathArr: [number, number][] = [];
          
          // 1. Render Spots (Markers)
          route.spots.forEach(spot => {
              const [lng, lat] = spot.coord.split(',').map(Number);
              if (!isNaN(lng) && !isNaN(lat)) {
                  pathArr.push([lng, lat]);

                  // Custom Marker UI (Simple & Clear)
                  const markerContent = `
                      <div class="relative flex flex-col items-center justify-center cursor-pointer transform hover:scale-110 transition-transform">
                           <div class="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-xs" style="background-color: ${color}">
                               ${spot.name.substring(0, 1)}
                           </div>
                           <div class="mt-1 px-2 py-0.5 bg-white/95 backdrop-blur rounded-full text-[10px] font-bold text-gray-700 shadow-sm border border-gray-100 whitespace-nowrap">
                               ${spot.name}
                           </div>
                      </div>
                  `;

                  const marker = new window.AMap.Marker({
                      position: [lng, lat],
                      content: markerContent,
                      offset: new window.AMap.Pixel(-16, -30),
                      zIndex: 100,
                      extData: { id: spot.id }
                  });

                  // Info Window (景点名称 + 简介 + 导航/详情按钮)
                  const intro = spot.intro_short.length > 100 ? spot.intro_short.substring(0, 100) + '...' : spot.intro_short;
                  const infoContent = `
                      <div class="p-4 w-72 bg-white rounded-xl shadow-lg">
                          <h4 class="font-bold text-lg mb-2" style="color: ${color}">${spot.name}</h4>
                          <p class="text-sm text-gray-600 mb-4 leading-relaxed">${intro}</p>
                          <div class="space-y-2">
                              <button onclick="window.handleMapNav(${lat}, ${lng}, '${spot.name}')" class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm py-3 rounded-lg font-medium shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all">
                                  🧭 我要导航去
                              </button>
                              <button onclick="window.handleMapDetail('${spot.id}')" class="w-full bg-gray-50 text-gray-700 text-sm py-3 rounded-lg font-medium border border-gray-200 hover:bg-gray-100 hover:border-gray-300 active:scale-95 transition-all">
                                  📖 查看景点介绍
                              </button>
                          </div>
                      </div>
                  `;
                  
                  marker.on('click', () => {
                      const infoWindow = new window.AMap.InfoWindow({
                          content: infoContent,
                          offset: new window.AMap.Pixel(0, -35),
                          closeWhenClickMap: true
                      });
                      infoWindow.open(map, [lng, lat]);
                  });

                  map.add(marker);
              }
          });

          // 2. Render Route Line
          if (pathArr.length > 1) {
              const polyline = new window.AMap.Polyline({
                  path: pathArr,
                  strokeColor: color,
                  strokeWeight: 5,
                  strokeOpacity: 0.8,
                  isOutline: true,
                  borderWeight: 1,
                  outlineColor: '#ffffff',
                  zIndex: 50
              });
              map.add(polyline);
          }
      });
      
      // Bridge Global Functions for InfoWindow HTML
      // 白嫖导航：支付宝/高德零配置外跳
      (window as any).handleMapNav = (lat: number, lng: number, name: string) => {
          const ua = navigator.userAgent.toLowerCase();
          const isWechat = ua.includes('micromessenger');
          const isAlipay = ua.includes('alipay');
          
          if (isAlipay) {
              // 支付宝：直接跳高德地图小程序（固定AppId，零配置）
              const scheme = `alipays://platformapi/startapp?appId=20000067&page=pages/navi/navi&lat=${lat}&lon=${lng}&name=${encodeURIComponent(name)}`;
              window.location.href = scheme;
          } else if (isWechat) {
              // 微信：复制景点名，提示用户去高德/支付宝搜索
              if (navigator.clipboard && navigator.clipboard.writeText) {
                  navigator.clipboard.writeText(name).then(() => {
                      alert(`已复制景点名：${name}\n\n请打开高德地图或支付宝搜索导航`);
                  }).catch(() => {
                      alert(`请手动复制景点名：${name}\n然后在高德地图/支付宝中搜索导航`);
                  });
              } else {
                  alert(`请记住景点名：${name}\n然后在高德地图/支付宝中搜索导航`);
              }
          } else {
              // 外部浏览器：尝试唤起高德APP，失败则跳网页版
              const amapApp = `amap://navi?poiname=${encodeURIComponent(name)}&lat=${lat}&lon=${lng}&dev=0&style=2`;
              const amapWeb = `https://m.amap.com/navi/?dest=${lng},${lat}&destName=${encodeURIComponent(name)}&hideRouteIcon=1`;
              
              const start = Date.now();
              window.location.href = amapApp;
              
              // 2秒没反应说明没装APP，跳网页版
              setTimeout(() => {
                  if (Date.now() - start < 2500) {
                      window.open(amapWeb, '_blank');
                  }
              }, 2000);
          }
      };

      (window as any).handleMapDetail = (spotId: string) => {
          const foundSpot = routes.flatMap(r => r.spots).find(s => s.id === spotId);
          if (foundSpot) {
              onSelectSpot(foundSpot);
          }
      };

      return () => {
          delete (window as any).handleMapNav;
          delete (window as any).handleMapDetail;
      };

  }, [isMapReady, routes]);

  return (
    <div className="relative w-full h-full bg-stone-100">
        {!isMapReady && !initError && (
             <div className="absolute inset-0 flex items-center justify-center bg-stone-50 z-10">
                 <div className="flex flex-col items-center">
                    <Spinner size="md" />
                    <p className="text-xs text-stone-400 mt-2">地图加载中...</p>
                 </div>
             </div>
        )}
        
        {initError && (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-50 z-10">
                <div className="text-center p-6">
                    <Icon name="x" className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <p className="text-stone-500 text-sm">{initError}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 text-xs text-blue-500 underline">
                        刷新重试
                    </button>
                </div>
            </div>
        )}

        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Back Button */}
        <button 
            onClick={() => onSelectSpot(null)}
            className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur shadow-lg px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 flex items-center space-x-1 active:scale-95 transition border border-white/50"
        >
             <Icon name="arrow-left" className="w-4 h-4" />
             <span>返回列表</span>
        </button>
        
        {/* Environment Hint */}
        <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur text-white text-[10px] px-3 py-1.5 rounded-full shadow-lg pointer-events-none">
            网页版导航 · 无需安装 APP
        </div>
    </div>
  );
};

export default MapView;
