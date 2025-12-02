import React, { useState, useEffect } from 'react';
import { SkinConfig } from '../utils/skinManager';

interface WelcomeDialogProps {
  onComplete: () => void;
  user: { id: string; name: string } | null;
  skinConfig: SkinConfig;
}

const WelcomeDialog: React.FC<WelcomeDialogProps> = ({ onComplete, user, skinConfig }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showContinue, setShowContinue] = useState(false);

  const messages = [
    `您好，${user?.name || '村民朋友'}！欢迎来到智慧乡村平台。`,
    "我是您的智能村官助手，很高兴为您服务。",
    "在这里，您可以了解村务信息、参与社区活动、享受便民服务。",
    "让我为您简单介绍一下主要功能吧！",
    "点击下方按钮，开始您的智慧乡村之旅吧！"
  ];

  useEffect(() => {
    if (currentMessage < messages.length - 1) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        setCurrentMessage(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (currentMessage === messages.length - 1) {
      // 最后一条消息显示完成后显示继续按钮
      const timer = setTimeout(() => {
        setIsTyping(false);
        setShowContinue(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentMessage, messages.length]);

  const handleContinue = () => {
    onComplete();
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-${skinConfig.gradientFrom} via-white to-${skinConfig.gradientTo} p-4`}>
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-24 h-24 bg-emerald-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-16 w-32 h-32 bg-teal-100 rounded-full opacity-30 animate-bounce"></div>
      </div>

      {/* 对话框容器 */}
      <div className="relative w-full max-w-2xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
        {/* 顶部标题栏 */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold">智能村官助手</h2>
              <p className="text-emerald-100">在线为您提供贴心服务</p>
            </div>
          </div>
        </div>

        {/* 对话内容区域 */}
        <div className="p-8">
          <div className="flex items-start space-x-4 mb-8">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="bg-emerald-50 rounded-2xl p-6 shadow-sm">
                <p className="text-gray-800 text-lg">
                  {messages[currentMessage]}
                  {isTyping && currentMessage < messages.length - 1 && (
                    <span className="inline-block w-2 h-5 bg-emerald-500 ml-1 animate-pulse"></span>
                  )}
                </p>
              </div>
              
              {/* 功能介绍卡片 */}
              {currentMessage === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white rounded-xl p-4 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">村务公开</h3>
                    <p className="text-sm text-gray-600">实时查看村务信息</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">邻里互助</h3>
                    <p className="text-sm text-gray-600">参与社区活动交流</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">便民服务</h3>
                    <p className="text-sm text-gray-600">一站式生活服务平台</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 继续按钮 */}
          {showContinue && (
            <div className="flex justify-center pt-4">
              <button
                onClick={handleContinue}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <span>开始体验</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* 底部进度指示器 */}
        <div className="px-8 pb-6">
          <div className="flex justify-center space-x-2">
            {messages.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index <= currentMessage ? 'bg-emerald-500' : 'bg-gray-200'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeDialog;