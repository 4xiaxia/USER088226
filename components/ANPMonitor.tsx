/**
 * ANP Network Monitor - 代理网络监控面板
 * 
 * 功能:
 * 1. 实时显示代理健康状态
 * 2. 显示消息历史记录
 * 3. 显示共享上下文
 * 4. 系统性能指标
 * 
 * 用途: 开发调试、系统监控
 */

import React, { useState, useEffect } from 'react';
import { Network } from '../services/agentSystem';
import { ANPMessage } from '../types';
import { Icon } from './common/Icon';

const ANPMonitor: React.FC = () => {
  const [messages, setMessages] = useState<ANPMessage[]>([]);
  const [context, setContext] = useState<any>(null);
  const [agentHealth, setAgentHealth] = useState<Record<string, string>>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // 获取最新数据
      setMessages(Network.getMessageHistory(20));
      setContext(Network.getContext());
      setAgentHealth(Network.getAgentHealth());
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleRefresh = () => {
    setMessages(Network.getMessageHistory(20));
    setContext(Network.getContext());
    setAgentHealth(Network.getAgentHealth());
  };

  const handleClearHistory = () => {
    if (window.confirm('确定要清空消息历史吗？')) {
      Network.clearHistory();
      handleRefresh();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-300';
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'REQUEST': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RESPONSE': return 'bg-green-100 text-green-800 border-green-200';
      case 'EVENT': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ERROR': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isExpanded) {
    // 折叠状态: 只显示一个浮动按钮
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <Icon name="bell" className="w-4 h-4" />
          <span className="text-sm font-bold">ANP Monitor</span>
          <div className="flex items-center space-x-1">
            {Object.entries(agentHealth).map(([id, status]) => (
              <div
                key={id}
                className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}
                title={`Agent ${id}: ${status}`}
              />
            ))}
          </div>
        </button>
      </div>
    );
  }

  // 展开状态: 显示完整监控面板
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="bell" className="w-6 h-6" />
            <h2 className="text-xl font-bold">ANP Network Monitor</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                autoRefresh ? 'bg-white/20' : 'bg-white/10'
              }`}
            >
              {autoRefresh ? '⏸ 暂停' : '▶ 自动刷新'}
            </button>
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Icon name="plus" className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Icon name="x" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Agent Health Status */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
              <Icon name="check-circle" className="w-4 h-4 mr-2 text-purple-600" />
              代理健康状态
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(agentHealth).map(([id, status]) => (
                <div
                  key={id}
                  className="bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(status)} animate-pulse`} />
                    <span className="text-sm font-medium text-gray-700">Agent {id}</span>
                  </div>
                  <span className="text-xs text-gray-500 uppercase">{status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          {context && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                <Icon name="document-chart-bar" className="w-4 h-4 mr-2 text-blue-600" />
                系统状态
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="text-xs text-gray-500 mb-1">待处理任务</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {context.systemStatus?.pendingTasks || 0}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="text-xs text-gray-500 mb-1">当前景点</div>
                  <div className="text-sm font-bold text-gray-700 truncate">
                    {context.userSession?.currentSpot || '未设置'}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="text-xs text-gray-500 mb-1">历史查询</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {context.userSession?.history?.length || 0}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Message History */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-700 flex items-center">
                <Icon name="clipboard" className="w-4 h-4 mr-2 text-purple-600" />
                消息历史 (最近20条)
              </h3>
              <button
                onClick={handleClearHistory}
                className="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                清空历史
              </button>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <Icon name="folder-open" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">暂无消息</p>
                </div>
              ) : (
                messages.reverse().map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-white rounded-lg p-3 border border-gray-200 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getMessageTypeColor(
                            msg.type
                          )}`}
                        >
                          {msg.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {msg.source} → {msg.target}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Action:</span> {msg.action}
                    </div>
                    {msg.type === 'REQUEST' && msg.payload.toolName && (
                      <div className="text-xs text-gray-600 mt-1">
                        <span className="font-medium">Tool:</span> {msg.payload.toolName}
                      </div>
                    )}
                    {msg.type === 'ERROR' && msg.payload.message && (
                      <div className="text-xs text-red-600 mt-1 bg-red-50 p-2 rounded">
                        <span className="font-medium">Error:</span> {msg.payload.message}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Shared Context Details */}
          {context && (
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                <Icon name="book-open" className="w-4 h-4 mr-2 text-green-600" />
                共享上下文
              </h3>
              <pre className="bg-white rounded-lg p-3 text-xs text-gray-700 overflow-auto max-h-[200px] border border-green-200">
                {JSON.stringify(context, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            ANP Protocol v1.0 | 实时监控中...
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => Network.enableDebugMode()}
              className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors"
            >
              启用调试模式
            </button>
            <button
              onClick={() => Network.disableDebugMode()}
              className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
            >
              禁用调试模式
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ANPMonitor;
