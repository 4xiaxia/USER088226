import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './common/Icon';
import { ASSETS } from '../utils/constants';

interface FloatingTag {
  label: string;
  color: string;
  action: string;
  position: { top: string; left?: string; right?: string };
  delay: number;
}

const WelcomeModal: React.FC<{ onClose: () => void; onNavigate: (target: string) => void }> = ({ onClose, onNavigate }) => {
  const [imgSrc] = useState(ASSETS.AVATAR_A);
  const [bubbleStep, setBubbleStep] = useState(0); // 对话气泡步骤
  const [showTags, setShowTags] = useState(false); // 显示浮动标签
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text'); // 输入模式
  const [chiefStatus, setChiefStatus] = useState('正在为您介绍...'); // A叔状态
  const [showVideo, setShowVideo] = useState(false); // 是否显示视频
  const [isClosing, setIsClosing] = useState(false); // 是否正在关闭
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 对话气泡内容（按客户需求）
  const bubbles = [
    {
      text: '欢迎！我是村官A叔，我能干啥：',
      items: [
        '🏛️ 红色文旅、抗战旧址导览',
        '👴 名人先辈、侨乡文化介绍',
        '🌿 风景导游、特色体验',
        '📢 村子动态、最新资讯'
      ]
    },
    {
      text: '有事儿点击右下角，我都在哦。\n点击气泡或者直接进入首页。',
      items: []
    }
  ];

  // 浮动标签配置（自然分布在头像周围，避免重叠）
  const floatingTags: FloatingTag[] = [
    // 第一批（第一个气泡后显示）- 左侧分布
    { label: '🏛️ 红色文旅', color: 'from-red-400 to-pink-500', action: 'route-red', position: { top: '12%', left: '2%' }, delay: 0 },
    { label: '⚔️ 抗战旧址', color: 'from-orange-400 to-red-500', action: 'war-site', position: { top: '32%', left: '5%' }, delay: 300 },
    { label: '👴 名人先辈', color: 'from-amber-400 to-yellow-500', action: 'celebrity', position: { top: '52%', left: '3%' }, delay: 600 },
    // 第二批（第二个气泡后显示）- 右侧分布
    { label: '🌿 风景导游', color: 'from-green-400 to-emerald-500', action: 'tour-guide', position: { top: '18%', right: '4%' }, delay: 900 },
    { label: '🏮 侨乡文化', color: 'from-purple-400 to-violet-500', action: 'culture', position: { top: '38%', right: '2%' }, delay: 1200 },
    { label: '📢 村子动态', color: 'from-blue-400 to-cyan-500', action: 'news', position: { top: '58%', right: '5%' }, delay: 1500 }
  ];

  // 自动显示对话气泡
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    // 页面加载时立即显示视频并尝试播放
    setShowVideo(true);
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log('视频初始播放失败:', err);
        // 如果失败，稍后在对话输出时重试
      });
    }
    
    // 第一个气泡（1秒后出现）
    timers.push(setTimeout(() => {
      setBubbleStep(1);
      // 对话输出时确保视频正在播放
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(err => {
          console.log('视频自动播放失败:', err);
        });
      }
    }, 1000));

    // 显示浮动标签（2秒后开始逐个出现）
    timers.push(setTimeout(() => {
      setShowTags(true);
    }, 2000));

    // 第二个气泡（4秒后出现）
    timers.push(setTimeout(() => {
      setBubbleStep(2);
      // 对话输出时确保视频正在播放
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(err => {
          console.log('视频自动播放失败:', err);
        });
      }
      // 更新A叔状态
      setTimeout(() => {
        setChiefStatus('随时为您服务');
      }, 1000);
    }, 4000));

    return () => timers.forEach(clearTimeout);
  }, []);

  // 自动滚动到最新内容
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [bubbleStep]);

  const handleTagClick = (action: string) => {
    // 关闭欢迎页
    onClose();
    
    // 延迟一下，等欢迎页关闭后再跳转
    setTimeout(() => {
      // 根据 action 跳转到首页对应区域
      if (action === 'route-red' || action === 'war-site') {
        // 红色文旅/抗战旧址 -> 路线区域
        document.getElementById('routes-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'celebrity') {
        // 名人先辈 -> 名人堂区域
        document.getElementById('celebrity-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'tour-guide') {
        // 风景导游 -> 路线区域
        document.getElementById('routes-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'culture') {
        // 侨乡文化 -> 名人堂区域
        document.getElementById('celebrity-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'news') {
        // 村子动态 -> 动态区域
        document.getElementById('news-section')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        // 其他操作，使用原有逻辑
        onNavigate(action);
      }
    }, 300);
  };

  const handleSkip = () => {
    // 跳过介绍，直接进入首页
    setBubbleStep(2);
    setShowTags(true);
    setChiefStatus('随时为您服务');
    // 可选：延迟后自动关闭
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const switchInputMode = (mode: 'text' | 'voice') => {
    setInputMode(mode);
    if (mode === 'voice') {
      // 语音模式提示（实际项目中启动语音识别）
      alert('🎤 语音功能开发中...\n\n将支持:\n• 语音转文字\n• 文字转语音\n• 实时语音对话');
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = (e.target as HTMLInputElement).value;
      if (value.trim()) {
        const question = value.trim();
        (e.target as HTMLInputElement).value = '';
        // 开始淡出动画
        setIsClosing(true);
        setTimeout(() => {
          onNavigate('chat:' + question);
          onClose();
        }, 300); // 等待淡出动画完成
      }
    }
  };

  const handleSendMessage = () => {
    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (input && input.value.trim()) {
      const question = input.value.trim();
      input.value = '';
      // 开始淡出动画
      setIsClosing(true);
      setTimeout(() => {
        onNavigate('chat:' + question);
        onClose();
      }, 300); // 等待淡出动画完成
    }
  };

  const handleBubbleClick = () => {
    // 点击气泡进入首页
    onClose();
  };

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-emerald-50/95 via-white/90 to-teal-50/95 backdrop-blur-sm z-50 flex flex-col items-center justify-start px-4 py-8 overflow-hidden transition-opacity duration-300 ${
      isClosing ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* 跳过按钮 - 右上角 */}
      <button
        onClick={handleSkip}
        className="absolute top-8 right-8 z-50 bg-white/90 backdrop-blur-md border border-emerald-300 rounded-full px-4 py-2 text-xs text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-lg"
      >
        跳过介绍
      </button>

      {/* 标题 */}
      <div className="text-center mb-6 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-800">欢迎</h1>
        <h2 className="text-3xl font-bold text-gray-800">来东里村</h2>
      </div>

      {/* A叔头像区域（带动态播放效果） */}
      <div className="relative w-full max-w-[380px] flex items-center justify-center mb-8">
        {/* 中心头像 */}
        <div className="relative z-10 animate-fade-in-up-slow">
          <div className="relative">
            {/* 外层发光环 - emerald 色系，温柔脉动 */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
            <div className="relative w-48 h-48 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full p-1 shadow-2xl animate-float-gentle">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
                {/* 视频头像 - 对话时自动播放 */}
                <video
                  ref={videoRef}
                  src="/src/styles/gif.mp4"
                  className="w-full h-full object-cover rounded-full"
                  style={{ display: showVideo ? 'block' : 'none' }}
                  loop
                  muted
                  playsInline
                  autoPlay
                  preload="auto"
                  onError={() => {
                    console.log('视频加载失败，切换到静态图片');
                    setShowVideo(false);
                  }}
                />
                {/* 静态图片备用 - 视频未播放或加载失败时显示 */}
                <img 
                  src={imgSrc} 
                  alt="AI村官A叔" 
                  className="w-full h-full object-cover rounded-full" 
                  style={{ display: showVideo ? 'none' : 'block' }}
                  onError={() => {}} 
                />
                {/* 在线状态 - 跳动的心跳，添加温柔摇摆 */}
                <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-md animate-gentle-sway">
                  <div className="w-3 h-3 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
                  <div className="w-3 h-3 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              </div>
            </div>
          </div>
          {/* A叔名字和状态 */}
          <div className="text-center mt-3">
            <h3 className="text-xl font-bold text-gray-800">A叔村官</h3>
            <p className="text-sm text-emerald-600">{chiefStatus}</p>
          </div>
        </div>

        {/* 环绕的浮动标签（带心跳动效） */}
        {showTags && floatingTags.map((tag, index) => (
          <button
            key={index}
            onClick={() => handleTagClick(tag.action)}
            className={`absolute z-20 bg-gradient-to-r ${tag.color} text-white text-sm font-bold px-4 py-2.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center space-x-1.5 animate-fade-in-up heartbeat-animation`}
            style={{
              top: tag.position.top,
              left: tag.position.left,
              right: tag.position.right,
              animationDelay: `${tag.delay}ms`
            } as React.CSSProperties}
          >
            <span>{tag.label}</span>
            <Icon name="chevron-down" className="w-3.5 h-3.5 -rotate-90" />
          </button>
        ))}
      </div>

      {/* 对话窗口 - 独立白色卡片 */}
      {bubbleStep > 0 && (
        <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 w-full max-w-[300px] bg-gray-50/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 p-5 z-30 animate-fade-in-up">
          <div className="space-y-3 max-h-[280px] overflow-y-auto">
            {/* 第一个气泡 */}
            {bubbleStep >= 1 && (
              <div className="bg-white/95 rounded-2xl rounded-tl-sm px-4 py-3 border border-emerald-200/30 shadow-sm relative">
                <p className="text-gray-800 text-sm font-medium mb-2">{bubbles[0].text}</p>
                <ul className="space-y-1.5">
                  {bubbles[0].items.map((item, idx) => (
                    <li key={idx} className="text-gray-700 text-xs flex items-start">
                      <span className="mr-1.5">{idx + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {/* 语音播放图标 */}
                <div className="absolute bottom-3 right-3 w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-md">
                  <div className="flex space-x-0.5">
                    <div className="w-0.5 h-2 bg-white rounded-full animate-bounce bounce-delay-0"></div>
                    <div className="w-0.5 h-3 bg-white rounded-full animate-bounce bounce-delay-1"></div>
                    <div className="w-0.5 h-2 bg-white rounded-full animate-bounce bounce-delay-2"></div>
                  </div>
                </div>
              </div>
            )}

            {/* 第二个气泡 */}
            {bubbleStep >= 2 && (
              <div className="bg-white/95 rounded-2xl rounded-tl-sm px-4 py-3 border border-emerald-200/30 shadow-sm relative">
                <p className="text-gray-800 text-xs leading-relaxed whitespace-pre-line">{bubbles[1].text}</p>
                {/* 语音播放图标 */}
                <div className="absolute bottom-3 right-3 w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-md">
                  <div className="flex space-x-0.5">
                    <div className="w-0.5 h-2 bg-white rounded-full animate-bounce bounce-delay-0"></div>
                    <div className="w-0.5 h-3 bg-white rounded-full animate-bounce bounce-delay-1"></div>
                    <div className="w-0.5 h-2 bg-white rounded-full animate-bounce bounce-delay-2"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 底部操作区 - 移动端优化位置 */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-[340px] px-4 z-40">
        {/* 胶囊输入框 */}
        <div className="bg-white/95 backdrop-blur-xl rounded-full px-3 py-2.5 flex items-center space-x-2 shadow-2xl border border-emerald-200">
          {/* 文本输入框（键盘模式时显示） */}
          {inputMode === 'text' && (
            <input 
              type="text" 
              placeholder="和A叔聊聊..."
              className="flex-1 outline-none text-sm bg-transparent placeholder-gray-400 min-w-0"
              onKeyPress={handleInputKeyPress}
            />
          )}
          
          {/* 语音模式提示 */}
          {inputMode === 'voice' && (
            <div className="flex-1 flex items-center justify-center space-x-2 text-purple-600">
              <Icon name="microphone" className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">正在听...</span>
            </div>
          )}
          
          {/* 切换按钮组 */}
          <div className="flex items-center space-x-1.5">
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                switchInputMode('text');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                inputMode === 'text' 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md border-emerald-300' 
                  : 'bg-white/80 text-gray-600 hover:bg-gray-100 border-emerald-300'
              }`}
            >
              键盘
            </button>
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                switchInputMode('voice');
              }}
              className={`p-1.5 rounded-full transition-all ${
                inputMode === 'voice'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                  : 'bg-white/80 text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="语音输入"
            >
              <Icon name="microphone" className="w-4 h-4" />
            </button>
          </div>
          
          {/* 发送按钮 */}
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleSendMessage(); // 发送消息，不关闭页面
            }}
            className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform shadow-lg"
            aria-label="发送消息"
          >
            <span className="text-sm">➤</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
