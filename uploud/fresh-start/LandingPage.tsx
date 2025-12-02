import React, { useState, useRef } from 'react';

interface LandingPageProps {
  onLogin: (userId: string) => void;
  onAdminClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onAdminClick }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
      setTimeout(() => {
        video.pause();
        video.currentTime = 0;
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-100 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-teal-100 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-100 rounded-full opacity-20"></div>
      </div>

      {/* 主要内容卡片 */}
      <div className="relative bg-white/90 backdrop-blur-sm p-8 pt-16 rounded-3xl shadow-2xl text-center max-w-sm w-full mx-4 border border-white/20">
        {/* 浮动视频头像 */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            {/* 外圈装饰 */}
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full p-1 shadow-2xl animate-pulse">
              <div className="w-full h-full bg-white rounded-full p-1">
                <video
                  ref={videoRef}
                  src="/uploud/mp4/gif.mp4"
                  className="w-full h-full rounded-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onLoadedData={() => setIsVideoLoaded(true)}
                  onClick={handleVideoClick}
                />
              </div>
            </div>

            {/* 状态指示器 */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        {/* 标题区域 */}
        <div className="mt-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-wide">村官智能体</h1>
          <div className="flex items-center justify-center space-x-3 text-gray-500 text-sm">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-emerald-300"></div>
            <span className="font-medium">AI 伴您 · 探索乡土</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-emerald-300"></div>
          </div>
        </div>

        {/* 特色介绍 */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center justify-center space-x-2 text-gray-600 text-sm">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            <span>智能导览 · 实时互动</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-600 text-sm">
            <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
            <span>语音对话 · 个性推荐</span>
          </div>
        </div>

        {/* 登录按钮组 */}
        <div className="space-y-4 mb-6">
          <button
            onClick={() => onLogin('wx_user_' + Date.now())}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-3 active:scale-95"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.691 2.188C8.691 2.188 8.691 2.188 8.691 2.188L8.691 2.188C8.691 2.188 8.691 2.188 8.691 2.188C7.84 2.188 7.056 2.61 6.606 3.312L6.606 3.312C6.606 3.312 6.606 3.312 6.606 3.312C6.156 4.014 6.156 4.914 6.606 5.616L6.606 5.616C6.606 5.616 6.606 5.616 6.606 5.616C7.056 6.318 7.84 6.74 8.691 6.74L8.691 6.74C8.691 6.74 8.691 6.74 8.691 6.74C9.542 6.74 10.326 6.318 10.776 5.616L10.776 5.616C10.776 5.616 10.776 5.616 10.776 5.616C11.226 4.914 11.226 4.014 10.776 3.312L10.776 3.312C10.776 3.312 10.776 3.312 10.776 3.312C10.326 2.61 9.542 2.188 8.691 2.188Z" />
            </svg>
            <span>微信一键登录</span>
          </button>

          <button
            onClick={() => onLogin('ali_user_' + Date.now())}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-3 active:scale-95"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span>支付宝快速登录</span>
          </button>
        </div>

        {/* 管理员入口 */}
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={onAdminClick}
            className="text-sm text-gray-400 hover:text-emerald-600 transition-colors flex items-center justify-center space-x-2 w-full group"
          >
            <span>我是村民/管理员，参与内容共建</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 底部信息 */}
      <div className="absolute bottom-6 text-gray-400 text-xs tracking-wider">
        Powered by Gemini AI · 公益助农
      </div>
    </div>
  );
};

export default LandingPage;
