
import React, { useState, useRef, useEffect } from 'react';
import { Spot, NavigationInfo } from '../types';
import { UniversalDetailView, ContentData } from './common/ContentTemplates';
import { Icon } from './common/Icon';
import { openNavigationApp } from '../utils/navigation';
import { getReliableImage } from '../services/geminiService';

interface SpotDetailProps {
  spot: Spot;
  onBack: () => void;
  onNext: () => void;
  navigationInfo: NavigationInfo | null;
  isNavLoading: boolean;
  onAskAI?: (question: string) => void;
}

const SpotDetail: React.FC<SpotDetailProps> = ({ spot, onBack, onNext, onAskAI }) => {
  // --- Controller Logic: Audio State ---
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
      // Reset audio state when spot changes
      setIsPlaying(false);
      if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
      }
  }, [spot.id]);

  const toggleAudio = () => {
      if (!audioRef.current) return;
      if (isPlaying) {
          audioRef.current.pause();
      } else {
          audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
  };

  // --- Data Adapter ---
  const spotData: ContentData = {
      id: spot.id,
      title: spot.name,
      subtitle: spot.distance,
      // [FIX] Use getReliableImage fallback if spot.imageUrl is empty/undefined
      imageUrl: spot.imageUrl || getReliableImage(spot.imagePrompt),
      description: spot.intro_short,
      detailText: spot.intro_txt,
      tags: spot.tags,
      metaInfo: [
          { label: '预计游览', value: '30 分钟', icon: 'clock' },
          { label: '距离当前', value: spot.distance, icon: 'location' }
      ]
  };

  // --- Render Slot: Sticky Bottom Actions ---
  const renderActions = () => (
      <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className="flex-1 bg-white border border-stone-200 text-stone-600 py-3 rounded-xl font-bold shadow-sm active:scale-95 transition flex justify-center items-center"
          >
            返回
          </button>
          <button 
            onClick={() => openNavigationApp(parseFloat(spot.coord.split(',')[1]), parseFloat(spot.coord.split(',')[0]), spot.name)}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition flex justify-center items-center space-x-2"
          >
            <Icon name="navigation" className="w-4 h-4" />
            <span>导航</span>
          </button>
          <button 
            onClick={onNext}
            className="flex-[1.5] bg-stone-800 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center space-x-2 active:scale-95 transition"
          >
            <span>下一站</span>
            <Icon name="arrow-left" className="w-4 h-4 transform rotate-180" />
          </button>
      </div>
  );

  return (
    <UniversalDetailView 
        data={spotData} 
        onClose={onBack}
        renderBottomActions={renderActions}
    >
        {/* --- Slot Injection: Audio Player --- */}
        {spot.audioUrl && (
            <div className="mb-6 bg-stone-900 rounded-2xl p-4 flex items-center justify-between shadow-xl text-white">
                <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPlaying ? 'bg-teal-500 animate-pulse' : 'bg-white/20'}`}>
                        <Icon name={isPlaying ? "pause" : "play"} className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="text-sm font-bold">智能语音导览</div>
                        <div className="text-[10px] text-white/60">AI 还原历史原声</div>
                    </div>
                </div>
                <button 
                    onClick={toggleAudio}
                    className="px-4 py-1.5 bg-white text-stone-900 text-xs font-bold rounded-full hover:bg-gray-100 transition"
                >
                    {isPlaying ? '暂停' : '点击播放'}
                </button>
                <audio 
                    ref={audioRef} 
                    src={spot.audioUrl} 
                    onEnded={() => setIsPlaying(false)}
                />
            </div>
        )}

        {/* --- Slot Injection: AI Interaction --- */}
        {onAskAI && spot.tags && (
             <div className="mt-4 bg-teal-50 rounded-2xl p-5 border border-teal-100">
                 <h3 className="text-xs font-bold text-teal-800 uppercase tracking-widest mb-3 flex items-center">
                    <Icon name="chat-bubble" className="w-4 h-4 mr-2" />
                    AI 伴游助手
                 </h3>
                 <div className="flex flex-wrap gap-2">
                     {spot.tags.map(tag => (
                         <button 
                            key={tag}
                            onClick={() => onAskAI(tag)}
                            className="bg-white text-teal-700 text-xs px-3 py-1.5 rounded-lg border border-teal-200 shadow-sm active:scale-95 transition"
                         >
                             #{tag} 故事
                         </button>
                     ))}
                     <button onClick={() => onAskAI('最佳拍照点')} className="bg-white text-teal-700 text-xs px-3 py-1.5 rounded-lg border border-teal-200 shadow-sm hover:border-teal-300">
                         📸 哪里拍照好看?
                     </button>
                 </div>
             </div>
        )}
    </UniversalDetailView>
  );
};

export default SpotDetail;
