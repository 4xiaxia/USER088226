
import React, { useState, useEffect, useRef } from 'react';
import { AgentA } from '../services/agentSystem'; // [ANP] Core Integration
import { Icon } from './common/Icon';
import { ASSETS } from '../utils/constants';
import { decode, decodeAudioData } from '../utils/audioUtils';

// --- Types ---

interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    audio?: string;
    type: 'text' | 'shop' | 'photo' | 'system';
    data?: any;
    timestamp: number;
}

interface BottomChatWidgetProps {
    contextName?: string; // [UPDATED] Generic context (Spot Name, Article Title, etc.)
    hookWords?: string[]; 
    onIntentHandled?: (intent: string) => void;
    pendingIntent?: string | null;
    bottomOffset?: number;
    reactionText?: string | null; // Text triggered by user interaction
}

// --- Sound Utility ---
const playDiDiSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const now = ctx.currentTime;
        
        // Oscillator 1 (The "Di")
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(800, now);
        osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        gain1.gain.setValueAtTime(0.1, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.1);

        // Oscillator 2 (The second "Di", slightly delayed)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1200, now + 0.15);
        osc2.frequency.exponentialRampToValueAtTime(800, now + 0.25);
        gain2.gain.setValueAtTime(0.1, now + 0.15);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.15);
        osc2.stop(now + 0.25);

    } catch (e) {
        console.warn("Sound play failed", e);
    }
};

// --- Sub-Components ---

const AudioButton: React.FC<{ isPlaying: boolean; onClick: () => void; label?: string }> = ({ isPlaying, onClick, label }) => (
    <button 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border ${
            isPlaying 
            ? 'bg-teal-50 border-teal-200 text-teal-600 shadow-sm animate-pulse' 
            : 'bg-white border-stone-200 text-stone-500 hover:border-teal-300 hover:text-teal-600'
        }`}
    >
        <Icon name={isPlaying ? 'pause' : 'play'} className="w-3 h-3" />
        <span>{label || (isPlaying ? '播放中' : '听语音')}</span>
        {isPlaying && (
            <div className="flex space-x-0.5 items-end h-3 ml-1">
                <div className="w-0.5 bg-teal-500 h-1 animate-[bounce_1s_infinite]"></div>
                <div className="w-0.5 bg-teal-500 h-2 animate-[bounce_1.2s_infinite]"></div>
                <div className="w-0.5 bg-teal-500 h-1.5 animate-[bounce_0.8s_infinite]"></div>
            </div>
        )}
    </button>
);

const MessageBubble: React.FC<{ msg: ChatMessage; isPlaying: boolean; onPlay: () => void }> = ({ msg, isPlaying, onPlay }) => {
    const isUser = msg.sender === 'user';
    
    return (
        <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
            <div className={`max-w-[85%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`
                    px-4 py-3 rounded-2xl text-sm shadow-sm leading-relaxed relative
                    ${isUser 
                        ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-br-none' 
                        : 'bg-white border border-stone-100 text-stone-700 rounded-bl-none'
                    }
                `}>
                    {/* Text Content */}
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Rich Content: Shop */}
                    {msg.type === 'shop' && msg.data?.products && (
                        <div className="mt-3 space-y-2 bg-stone-50/50 p-2 rounded-lg border border-stone-100/50">
                             <div className="flex items-center text-xs text-stone-400 font-bold uppercase tracking-wider mb-1">
                                <Icon name="bag" className="w-3 h-3 mr-1" /> 推荐好物
                             </div>
                             {msg.data.products.slice(0, 3).map((p: any, i: number) => (
                                 <div key={i} className="bg-white p-2 rounded-md shadow-sm border border-stone-100 flex justify-between items-center text-xs">
                                     <span className="font-medium text-stone-700">{p.name}</span>
                                     <span className="text-orange-600 font-bold bg-orange-50 px-1.5 py-0.5 rounded">{p.price}</span>
                                 </div>
                             ))}
                        </div>
                    )}

                    {/* Rich Content: Photo */}
                    {msg.type === 'photo' && msg.data?.memorial_image && (
                         <div className="mt-3 rounded-lg overflow-hidden border border-stone-100 shadow-sm relative group">
                             <img src={msg.data.memorial_image} className="w-full h-32 object-cover" alt="Memory" />
                             <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                         </div>
                    )}
                </div>

                {/* Audio Control (Attached below bubble for AI) */}
                {msg.sender === 'ai' && msg.audio && (
                    <div className="mt-1.5 ml-1">
                        <AudioButton isPlaying={isPlaying} onClick={onPlay} />
                    </div>
                )}
                
                {/* Timestamp */}
                <div className="mt-1 text-[10px] text-stone-300 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
            </div>
        </div>
    );
};

// --- Thinking Bubble Component (Large Pop-up Mascot) ---
const ThinkingBubble: React.FC<{ text?: string | null }> = ({ text }) => (
    <div className="absolute bottom-[85%] left-0 z-50 pointer-events-none w-full flex justify-center">
        <div className="relative animate-[float-pop_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
            {/* 1. The Large Mascot Avatar (Using Avatar A) */}
            <img 
                src={ASSETS.AVATAR_A} 
                onError={(e) => e.currentTarget.src = ASSETS.FALLBACK_AVATAR}
                className="w-32 h-32 object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                alt="AI Mascot"
            />

            {/* 2. Context Speech Bubble (If text provided) */}
            {text && (
                <div className="absolute -top-2 -right-16 bg-white px-3 py-2 rounded-xl rounded-bl-none shadow-xl border-2 border-teal-100 animate-fade-in-up origin-bottom-left max-w-[140px]">
                     <p className="text-xs font-bold text-teal-800 leading-tight">{text}</p>
                     <div className="absolute bottom-[-6px] left-[-2px] w-3 h-3 bg-white border-b-2 border-r-2 border-teal-100 transform rotate-45"></div>
                </div>
            )}
        </div>
    </div>
);

// --- Main Widget ---

const BottomChatWidget: React.FC<BottomChatWidgetProps> = ({ 
    contextName = "东里村", 
    hookWords = [], 
    onIntentHandled, 
    pendingIntent, 
    bottomOffset = 0,
    reactionText = null
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Audio State
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Auto-scroll ref
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Rotating hooks state
  const [displayHook, setDisplayHook] = useState<string | null>(null);
  
  // Passive Sensing State
  const [isSensing, setIsSensing] = useState(false);

  // --- Effects ---

  // Add styles for shaking animation
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes agent-shake {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-3deg); }
        75% { transform: rotate(3deg); }
      }
      @keyframes float-pop {
        0% { opacity: 0; transform: scale(0.5) translateY(20px); }
        80% { transform: scale(1.1) translateY(-5px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // [UPDATED] Passive Sensing Trigger with Sound
  useEffect(() => {
    // Determine if there is a reason to trigger the "sensing" state
    const hasTrigger = !!reactionText; 
    
    if (hasTrigger) {
        // 1. Play "DiDi" Sound
        playDiDiSound();

        // 2. Trigger visual "sensing"
        setIsSensing(true);
        const timer = setTimeout(() => setIsSensing(false), 3500); // Show for 3.5s to let animation finish
        return () => clearTimeout(timer);
    }
  }, [reactionText]); 

  // Auto-rotate hooks
  useEffect(() => {
    if (hookWords.length > 0) {
        setDisplayHook(hookWords[0]);
        const interval = setInterval(() => {
            setDisplayHook(prev => {
                const currentIndex = hookWords.indexOf(prev || '');
                const nextIndex = (currentIndex + 1) % hookWords.length;
                return hookWords[nextIndex];
            });
        }, 4000);
        return () => clearInterval(interval);
    } else {
        setDisplayHook(`我在${contextName}，问我吧`);
    }
  }, [hookWords, contextName]);

  // Handle pending intent
  useEffect(() => {
      if (pendingIntent) {
          handleSendMessage(pendingIntent);
      }
  }, [pendingIntent]);

  // Scroll to bottom
  useEffect(() => {
      if (isExpanded) {
          scrollToBottom();
      }
  }, [messages, isExpanded, isLoading]);

  const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  // --- Logic ---

  const stopAudio = () => {
      if (audioSourceRef.current) {
          try { audioSourceRef.current.stop(); } catch (e) {}
          audioSourceRef.current = null;
      }
      setPlayingMsgId(null);
  };

  const playAudio = async (msgId: string, base64: string) => {
    if (playingMsgId === msgId) {
        stopAudio();
        return;
    }
    
    stopAudio(); // Stop any currently playing
    setPlayingMsgId(msgId);

    try {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();
        
        const audioBytes = decode(base64);
        const buffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
        
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => setPlayingMsgId(null);
        
        audioSourceRef.current = source;
        source.start(0);
    } catch (e) {
        console.warn("Audio play failed", e);
        setPlayingMsgId(null);
    }
  };

  const handleSendMessage = async (text?: string) => {
    const content = text || inputValue;
    if (!content.trim()) return;
    
    setInputValue('');
    if (!isExpanded) setIsExpanded(true); 
    
    if (onIntentHandled) onIntentHandled(content);

    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { 
        id: userMsgId, 
        sender: 'user', 
        text: content, 
        type: 'text', 
        timestamp: Date.now() 
    }]);
    
    setIsLoading(true);

    try {
        // [ANP Integration] AgentA Dispatcher
        const result = await AgentA.processUserRequest(content, contextName, 'text');
        
        const aiMsgId = (Date.now() + 1).toString();
        let messageType: ChatMessage['type'] = 'text';
        let displayText = result.text || "";

        if (result.products) {
            messageType = 'shop';
            displayText = result.recommend_text || "为您找到以下推荐：";
        } else if (result.memorial_image) {
            messageType = 'photo';
            displayText = result.explanation || "识别结果如下";
        }

        setMessages(prev => [...prev, { 
            id: aiMsgId,
            sender: 'ai', 
            text: displayText, 
            audio: result.audio_base_64,
            type: messageType,
            data: result,
            timestamp: Date.now()
        }]);

        // Auto-play audio if available
        if (result.audio_base_64) {
            playAudio(aiMsgId, result.audio_base_64);
        }

    } catch (e) {
        setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            sender: 'ai', 
            text: "网络有点小卡顿，请再说一次~", 
            type: 'text', 
            timestamp: Date.now() 
        }]);
    } finally {
        setIsLoading(false);
    }
  };

  // --- Render ---

  // 1. Expanded Chat Sheet
  if (isExpanded) {
      return (
          <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-white animate-slide-up-sheet rounded-t-3xl shadow-2xl" style={{ height: '50vh', maxHeight: '600px' }}>
             {/* Header */}
             <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-white/90 backdrop-blur-sm sticky top-0 z-10">
                 <div className="flex items-center space-x-3">
                     <div className="w-14 h-14 rounded-full overflow-hidden border border-teal-100 shadow-sm">
                         <img src={ASSETS.AVATAR_A} className="w-full h-full object-cover" alt="Avatar" />
                     </div>
                     <div>
                         <h3 className="font-bold text-stone-800">村官小A</h3>
                         <p className="text-xs text-teal-600 font-medium">AI 智能伴游中</p>
                     </div>
                 </div>
                 <button onClick={() => setIsExpanded(false)} className="p-2 bg-stone-50 rounded-full text-stone-400 hover:bg-stone-100" aria-label="关闭">
                     <Icon name="chevron-down" className="w-6 h-6" />
                 </button>
             </div>

             {/* Chat Area */}
             <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-stone-50" style={{ paddingBottom: '100px' }}>
                 {messages.length === 0 && (
                     <div className="text-center mt-10 text-stone-400 text-sm">
                         <p>👋 您好！我是小A，您可以问我：</p>
                         <div className="mt-4 flex flex-wrap justify-center gap-2">
                             {hookWords.slice(0, 4).map((word, i) => (
                                 <button 
                                    key={i} 
                                    onClick={() => handleSendMessage(word)}
                                    className="bg-white border border-stone-200 px-3 py-1.5 rounded-full text-xs shadow-sm"
                                 >
                                     {word}
                                 </button>
                             ))}
                         </div>
                     </div>
                 )}
                 {messages.map(msg => (
                     <MessageBubble 
                        key={msg.id} 
                        msg={msg} 
                        isPlaying={playingMsgId === msg.id} 
                        onPlay={() => msg.audio && playAudio(msg.id, msg.audio)}
                     />
                 ))}
                 {isLoading && (
                     <div className="flex items-center space-x-2 text-stone-400 text-xs ml-4">
                         <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                         <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-75"></div>
                         <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-150"></div>
                         <span>思考中...</span>
                     </div>
                 )}
                 <div ref={messagesEndRef}></div>
             </div>

             {/* Footer Input */}
             <div className="p-3 bg-white border-t border-stone-100 absolute bottom-0 w-full pb-6">
                 <div className="flex items-center space-x-2 bg-stone-100 rounded-full px-2 py-1.5 border border-stone-200 focus-within:ring-2 focus-within:ring-teal-100 focus-within:border-teal-300 transition-all">
                     <button className="p-2 bg-white rounded-full text-stone-500 shadow-sm border border-stone-100" aria-label="语音输入">
                         <Icon name="microphone" className="w-5 h-5" />
                     </button>
                     <input 
                        className="flex-grow bg-transparent border-none outline-none text-sm px-2 text-stone-800 placeholder-stone-400"
                        placeholder={displayHook || "问问关于这里的故事..."}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                     />
                     <button 
                        onClick={() => handleSendMessage()}
                        disabled={!inputValue.trim()}
                        className={`p-2 rounded-full transition-all ${inputValue.trim() ? 'bg-teal-600 text-white shadow-md' : 'bg-stone-200 text-stone-400'}`}
                        aria-label="发送消息"
                     >
                         <Icon name="arrow-left" className="w-5 h-5 transform rotate-90" />
                     </button>
                 </div>
             </div>
          </div>
      );
  }

  // 2. Collapsed Dock (Sticky Bottom)
  return (
    <div 
        className={`fixed left-4 right-4 z-40 transition-all duration-500 ease-out`}
        style={{ bottom: `${24 + bottomOffset}px` }}
    >
        {/* 3D Mascot Pop-up (Replaces simple bubble) */}
        {isSensing && <ThinkingBubble text={reactionText} />}

        {/* Main Capsule */}
        <div 
            onClick={() => setIsExpanded(true)}
            className={`
                bg-white/90 backdrop-blur-md rounded-full shadow-premium-lg border border-white/40 p-1.5 pr-4 
                flex items-center justify-between cursor-pointer btn-press overflow-hidden relative
                ${isSensing ? 'animate-[agent-shake_0.5s_ease-in-out]' : ''}
            `}
        >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] animate-[shimmer_3s_infinite]"></div>

            <div className="flex items-center space-x-3 relative z-10">
                {/* Avatar with Status Ring */}
                <div className="relative">
                     <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                        <img src={ASSETS.AVATAR_A} className="w-full h-full object-cover" alt="Avatar" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                </div>

                {/* Scrolling Hook Text */}
                <div className="flex flex-col justify-center h-10 overflow-hidden">
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-0.5">AI 伴您游</span>
                    <div className="h-5 relative w-48 overflow-hidden">
                        <div key={displayHook} className="animate-fade-in-up text-sm font-bold text-stone-800 truncate">
                            {displayHook}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Action Icon */}
            <div className="w-8 h-8 rounded-full bg-stone-800 text-white flex items-center justify-center shadow-lg transform rotate-90">
                 <Icon name="arrow-left" className="w-4 h-4" />
            </div>
        </div>
    </div>
  );
};

export default BottomChatWidget;
