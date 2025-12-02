
import React, { useState } from 'react';
import { Spinner } from './common/Spinner';
import { Icon } from './common/Icon';
import { ASSETS } from '../utils/constants';

const Login: React.FC<{ onLogin: (id: string) => void, onAdminClick: () => void, geoLoading: boolean, geoError: any }> = ({ onLogin, onAdminClick, geoLoading }) => {
  const [imgSrc, setImgSrc] = useState(ASSETS.AVATAR_A);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-emerald-50/95 via-white/90 to-teal-50/95 backdrop-blur-sm flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      {/* 标题区 */}
      <div className="text-center mb-8 animate-fade-in-up">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">欢迎来到</h1>
        <h2 className="text-4xl font-bold text-gray-800">东里村</h2>
        <p className="text-sm text-gray-600 mt-3">AI村官A叔 · 带您探索乡土文化</p>
      </div>

      {/* A叔头像区域 */}
      <div className="relative w-full max-w-[380px] flex items-center justify-center mb-10">
        <div className="relative z-10 animate-fade-in-up-slow">
          <div className="relative">
            {/* 外层发光环 */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
            <div className="relative w-40 h-40 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full p-1 shadow-2xl animate-float-gentle">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
                <img 
                  src={imgSrc} 
                  alt="AI村官A叔" 
                  className="w-full h-full object-cover rounded-full" 
                  onError={() => setImgSrc(ASSETS.FALLBACK_AVATAR)} 
                />
                {/* 在线状态 */}
                <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-md animate-gentle-sway">
                  <div className="w-3 h-3 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
                  <div className="w-3 h-3 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Geo Loading 状态 */}
        {geoLoading && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-2 text-teal-600 text-sm">
              <Spinner size="sm" />
              <span>正在定位...</span>
            </div>
          </div>
        )}
      </div>

      {/* 登录按钮区 */}
      <div className="w-full max-w-[360px] space-y-4 mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        {/* 微信登录 */}
        <button 
          onClick={() => onLogin('wx_user_' + Date.now())} 
          className="w-full bg-gradient-to-r from-[#07C160] to-[#06ad56] hover:from-[#06ad56] hover:to-[#059c4d] text-white py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3 active:scale-95 group"
        >
          <Icon name="chat-bubble" className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="text-lg">微信一键游</span>
        </button>

        {/* 支付宝登录 */}
        <button 
          onClick={() => onLogin('ali_user_' + Date.now())} 
          className="w-full bg-gradient-to-r from-[#1677FF] to-[#1363df] hover:from-[#1363df] hover:to-[#1150c5] text-white py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3 active:scale-95 group"
        >
          <Icon name="bag" className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="text-lg">支付宝登录</span>
        </button>
      </div>

      {/* 管理员入口 */}
      <div className="w-full max-w-[360px] pt-4 border-t border-gray-300/50 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <button 
          onClick={onAdminClick}
          className="w-full text-sm text-gray-600 hover:text-gray-800 transition flex items-center justify-center space-x-2 py-3 group"
        >
          <span>我是村民/管理员，参与内容共建</span>
          <Icon name="chevron-down" className="w-4 h-4 transform -rotate-90 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 底部信息 */}
      <div className="absolute bottom-6 text-gray-500/60 text-xs tracking-wide">
        Powered by Gemini AI · 公益助农
      </div>
    </div>
  );
};

export default Login;
