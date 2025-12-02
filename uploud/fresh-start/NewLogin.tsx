import React, { useState } from 'react';
import { SkinConfig } from '../utils/skinManager';

interface NewLoginProps {
  onLogin: (user: { id: string; name: string }) => void;
  skinConfig: SkinConfig;
}

const NewLogin: React.FC<NewLoginProps> = ({ onLogin, skinConfig }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleWechatLogin = () => {
    setIsLoggingIn(true);
    // 模拟微信登录
    setTimeout(() => {
      const userId = `user_${Math.random().toString(36).substring(2, 10)}`;
      onLogin({ id: userId, name: '微信用户' });
    }, 1000);
  };

  const handleAlipayLogin = () => {
    setIsLoggingIn(true);
    // 模拟支付宝登录
    setTimeout(() => {
      const userId = `user_${Math.random().toString(36).substring(2, 10)}`;
      onLogin({ id: userId, name: '支付宝用户' });
    }, 1000);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-${skinConfig.gradientFrom} via-white to-${skinConfig.gradientTo}`}>
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-100 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-teal-100 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-100 rounded-full opacity-20"></div>
      </div>

      {/* 主要内容卡片 */}
      <div className="relative bg-white/90 backdrop-blur-sm p-8 pt-16 rounded-3xl shadow-2xl text-center max-w-sm w-full mx-4 border border-white/20">
        {/* Logo/头像区域 */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <div className={`w-32 h-32 bg-gradient-to-br from-${skinConfig.primary}-400 to-${skinConfig.secondary}-500 rounded-full p-1 shadow-2xl animate-pulse`}>
              <div className="w-full h-full bg-white rounded-full p-1 flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-300 to-teal-400 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* 状态指示器 */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        {/* 标题和描述 */}
        <div className="mt-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-wide">村官智能体</h1>
          <div className="flex items-center justify-center space-x-3 text-gray-500 text-sm">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-emerald-300"></div>
            <span className="font-medium">AI 伴您 · 探索乡土</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-emerald-300"></div>
          </div>
        </div>

        {/* 功能亮点 */}
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
            onClick={handleWechatLogin}
            disabled={isLoggingIn}
            className={`w-full ${skinConfig.buttonPrimary} text-white py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-3 active:scale-95 ${isLoggingIn ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoggingIn ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>登录中...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>微信一键登录</span>
              </>
            )}
          </button>

          <button 
            onClick={handleAlipayLogin}
            disabled={isLoggingIn}
            className={`w-full ${skinConfig.buttonSecondary} text-white py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-3 active:scale-95 ${isLoggingIn ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoggingIn ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>登录中...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>支付宝快速登录</span>
              </>
            )}
          </button>
        </div>

        {/* 底部信息 */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            登录即表示您同意我们的服务条款和隐私政策
          </p>
        </div>
      </div>

      {/* 底部版权信息 */}
      <div className="absolute bottom-6 text-gray-400 text-xs tracking-wider">
        Powered by AI · 公益助农项目
      </div>
    </div>
  );
};

export default NewLogin;