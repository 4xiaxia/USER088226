
import React from 'react';
import { Route, Spot } from '../types';
import MapView from './MapView';

// Explicit type definition to satisfy TypeScript
interface PresenterModeProps {
  routes: Route[] | null;
  onSelectSpotFromMap: (spot: Spot) => void;
  // Legacy props kept for compatibility if needed, otherwise marked optional
  activeSpot?: Spot | null;
  activeSpotCategory?: string | null;
  isLoading?: boolean;
  error?: string | null;
  geoError?: any;
}

const PresenterMode: React.FC<PresenterModeProps> = ({ routes, onSelectSpotFromMap }) => {
  return (
    // Container fills height minus header
    <div className="relative w-full h-[calc(100vh-70px)] bg-stone-100 overflow-hidden animate-fade-in">
        {routes ? (
            <MapView 
                routes={routes} 
                onSelectSpot={(s) => s && onSelectSpotFromMap(s)} 
                activeSpotId={null} 
            />
        ) : (
            <div className="flex items-center justify-center h-full text-stone-400 text-sm">
                地图数据加载中...
            </div>
        )}
    </div>
  );
};

export default PresenterMode;
