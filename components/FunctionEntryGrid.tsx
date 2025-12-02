import React, { useState, useEffect } from 'react';
import { Icon } from './common/Icon';
import { SparklesText } from './ui/sparkles-text';

// [MODULE] Navigation Grid (3-Block Layout)
// Updated to use the custom CSS grid layout requested by the user
// Now includes basic HTML img tags for backgrounds

// 新增的公告和信息组件
const InfoSection: React.FC = () => {
  // 模拟数据
  const [currentTime, setCurrentTime] = useState(new Date());
  const weather = { temp: '22°C', condition: '晴' };
  const announcement = [
    "村委通知：本周六将举行红色文化讲座，欢迎大家参加",
    "农产品展销会将于下月初举办，欢迎农户报名",
    "村内道路维修工程已完工，恢复正常通行"
  ];

  useEffect(() => {
    // 每秒更新时间
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 格式化时间显示
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return {
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}:${seconds}`
    };
  };

  // 模拟农历日期（实际项目中可能需要引入农历计算库）
  const getLunarDate = () => {
    return "农历 五月廿六";
  };

  const { date, time } = formatDate(currentTime);

  return (
    <div className="px-2 mb-4 animate-fade-in-up">
      {/* 添加最大宽度限制 */}
      <div className="max-w-[1400px] mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden backdrop-blur-sm bg-white/95 hover:shadow-xl transition-shadow duration-300">
        <div className="flex">
          {/* 左侧信息区域 - 40% - Magic UI 风格 */}
          <div className="w-2/5 p-3 relative overflow-hidden">
            {/* 多层渐变背景 + 动画 */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 opacity-80"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/10 via-transparent to-teal-400/10"></div>
            
            {/* 浮动光球装饰 */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-400/30 to-teal-400/30 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-tr from-cyan-400/20 to-emerald-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            {/* 闪烁光效 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
            <div className="h-full flex flex-col justify-between relative z-10">
              <div>
                {/* 日期 - 添加闪烁效果 */}
                <SparklesText 
                  className="text-lg font-bold text-stone-800 tracking-tight drop-shadow-sm"
                  colors={{
                    first: "#10b981",
                    second: "#14b8a6"
                  }}
                  sparklesCount={8}
                >
                  {date}
                </SparklesText>
                
                {/* 时间 - 三色渐变 + 闪烁动画 */}
                <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent mt-1 tabular-nums animate-shimmer drop-shadow-sm">
                  {time}
                </div>
                
                {/* 农历 - 柔和样式 */}
                <div className="text-xs text-stone-500/80 mt-1 font-medium">{getLunarDate()}</div>
              </div>
              
              {/* 天气卡片 - 毛玻璃效果 */}
              <div className="flex items-center mt-2 bg-white/40 backdrop-blur-sm rounded-lg px-2 py-1.5 border border-white/60 shadow-sm">
                <Icon name="sun" className="w-5 h-5 text-amber-500 drop-shadow-sm" />
                <div className="ml-2">
                  <div className="text-sm font-bold text-stone-700">{weather.temp}</div>
                  <div className="text-xs text-stone-500">{weather.condition}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 分割线 */}
          <div className="w-px bg-gradient-to-b from-transparent via-stone-200 to-transparent"></div>

          {/* 右侧公告区域 - 60% */}
          <div className="w-3/5 p-3">
            <div className="flex items-center mb-2">
              <Icon name="bell" className="w-4 h-4 text-amber-500" />
              <h3 className="ml-2 text-sm font-bold text-stone-800">村委公告</h3>
            </div>
            <div className="space-y-1">
              {announcement.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0"></div>
                  <p className="ml-2 text-xs text-stone-600 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

const FunctionEntryGrid: React.FC<{ onNavigate: (id: string) => void; className?: string }> = ({ onNavigate, className = 'mb-4' }) => {
  return (
    <div className={`px-2 ${className}`}>
      {/* 添加最大宽度限制 */}
      <div className="max-w-[1400px] mx-auto">
      <div className="grid grid-cols-3 gap-4">
          {/* Red: 党建·红色文旅 (Grid Area A) - Magic UI 风格 - 极浅配色 */}
          <div 
            className="card relative overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-[1.08] hover:shadow-2xl hover:-rotate-1 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50" 
            onClick={() => onNavigate('route-red')}
          >
            {/* 渐变边框光效 */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-200/50 via-teal-200/50 to-cyan-200/50 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>
            
            {/* 多层背景动画 */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 via-transparent to-teal-100/30 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            {/* 装饰粒子 */}
            <div className="absolute top-4 left-4 w-2 h-2 bg-emerald-300/60 rounded-full animate-ping"></div>
            <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-teal-300/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 right-6 w-1 h-1 bg-cyan-300/30 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
            
            {/* 渐变暗角 - 浅色版本 */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stone-900/5"></div>
            
            {/* 图标装饰 - 增强样式 */}
            <div className="absolute top-3 right-3 opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-300 z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-200/30 blur-md rounded-full"></div>
                <Icon name="map" className="w-7 h-7 text-emerald-600 drop-shadow-sm relative" />
              </div>
            </div>
            
            {/* 文字内容 */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <p className="text-base font-serif-brand font-bold mb-0.5 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-r from-stone-800 via-stone-900 to-stone-800 bg-clip-text text-transparent tracking-wide drop-shadow-sm">党建 · 红色文旅</p>
              <p className="text-[9px] text-stone-500 tracking-widest font-light">自助 · 伴你游</p>
              
              {/* 底部装饰线 */}
              <div className="mt-2.5 w-10 h-0.5 bg-emerald-300/40 group-hover:w-16 transition-all duration-500"></div>
            </div>
          </div>

          {/* Blue: 人文·名人乡贤 (Grid Area B - Right Column) - Magic UI 风格 - 极浅配色 */}
          <div 
            className="card relative overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-[1.08] hover:shadow-2xl hover:rotate-1 bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50" 
            onClick={() => onNavigate('celebrity')}
          >
            {/* 渐变边框光效 */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-200/50 via-sky-200/50 to-blue-200/50 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>
            
            {/* 多层背景动画 */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/30 via-transparent to-blue-100/30 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            {/* 装饰粒子 */}
            <div className="absolute top-6 right-4 w-2 h-2 bg-cyan-300/60 rounded-full animate-ping"></div>
            <div className="absolute bottom-6 right-8 w-1.5 h-1.5 bg-sky-300/40 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            <div className="absolute top-1/3 left-6 w-1 h-1 bg-blue-300/30 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
            
            {/* 渐变暗角 - 浅色版本 */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stone-900/5"></div>
            
            {/* 图标装饰 - 大背景图标 + 发光效果 */}
            <div className="absolute bottom-[-12px] right-[-12px] opacity-8 group-hover:opacity-15 rotate-12 transition-all duration-500 z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-200/20 blur-2xl rounded-full"></div>
                <Icon name="user" className="w-20 h-20 text-cyan-200 relative" />
              </div>
            </div>
            
            {/* 文字内容 */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <p className="text-base font-serif-brand font-bold mb-0.5 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-r from-stone-800 via-stone-900 to-stone-800 bg-clip-text text-transparent tracking-wide drop-shadow-sm">人文 · 名人乡贤</p>
              <p className="text-[9px] text-stone-500 tracking-widest font-light">先辈风骨长隽</p>
              
              {/* 底部装饰线 */}
              <div className="mt-2.5 w-10 h-0.5 bg-cyan-300/40 group-hover:w-16 transition-all duration-500"></div>
            </div>
          </div>

          {/* Green: 风景自然游 (Grid Area C) - Magic UI 风格 - 极浅配色 */}
          <div 
            className="card relative overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-[1.08] hover:shadow-2xl hover:-rotate-1 bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50" 
            onClick={() => onNavigate('route-nature')}
          >
            {/* 渐变边框光效 */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-200/50 via-emerald-200/50 to-green-200/50 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>
            
            {/* 多层背景动画 */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-100/30 via-transparent to-emerald-100/30 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            {/* 装饰粒子 */}
            <div className="absolute top-5 left-5 w-2 h-2 bg-teal-300/60 rounded-full animate-ping"></div>
            <div className="absolute bottom-10 right-6 w-1.5 h-1.5 bg-emerald-300/40 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
            <div className="absolute top-2/3 left-8 w-1 h-1 bg-green-300/30 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
            
            {/* 渐变暗角 - 浅色版本 */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stone-900/5"></div>
            
            {/* 图标装饰 - 增强样式 */}
            <div className="absolute top-3 right-3 opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-300 z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-teal-200/30 blur-md rounded-full"></div>
                <Icon name="camera" className="w-7 h-7 text-teal-600 drop-shadow-sm relative" />
              </div>
            </div>
            
            {/* 文字内容 */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <p className="text-base font-serif-brand font-bold mb-0.5 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-r from-stone-800 via-stone-900 to-stone-800 bg-clip-text text-transparent tracking-wide drop-shadow-sm">风景自然游</p>
              <p className="text-[9px] text-stone-500 tracking-widest font-light">生态田园乐</p>
              
              {/* 底部装饰线 */}
              <div className="mt-2.5 w-10 h-0.5 bg-teal-300/40 group-hover:w-16 transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
};

export default FunctionEntryGrid;
export { InfoSection };