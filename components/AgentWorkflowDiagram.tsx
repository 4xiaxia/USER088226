
import React, { useState } from 'react';
import { ASSETS } from '../utils/constants'; // [MODULE]

const AgentWorkflowDiagram: React.FC = () => {
  const [imgSrc, setImgSrc] = useState(ASSETS.AVATAR_A);
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-stone-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
            <img src={imgSrc} onError={() => setImgSrc(ASSETS.FALLBACK_AVATAR)} className="w-12 h-12 rounded-full mb-2" alt="AI智能代理头像" title="多智能体协作系统" />
            <span className="text-xs font-bold text-stone-600">多智能体协作中</span>
        </div>
    </div>
  );
};
export default AgentWorkflowDiagram;
