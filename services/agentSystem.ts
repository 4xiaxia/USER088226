import { AgentID, ANPMessage, SharedContext } from '../types';
import * as geminiService from './geminiService';

type MessageHandler = (msg: ANPMessage) => Promise<void>;

/**
 * ANP (Agent Network Protocol) 核心实现
 * 
 * 职责:
 * 1. 代理注册与管理
 * 2. 消息路由与分发
 * 3. 上下文监控与持久化
 * 4. 系统日志与追踪
 */
class AgentNetwork {
  private listeners: Record<string, MessageHandler> = {};
  private sharedContext: SharedContext = {
    userSession: { history: [] },
    environment: {},
    systemStatus: { agentHealth: {}, pendingTasks: 0 }
  };
  private messageHistory: ANPMessage[] = []; // 消息历史记录
  private readonly MAX_HISTORY = 100; // 最多保留100条消息
  private debugMode: boolean = false; // 调试模式开关

  /**
   * 注册代理到网络
   * @param agentId 代理ID
   * @param handler 消息处理器
   */
  register(agentId: AgentID, handler: MessageHandler) {
    this.listeners[agentId] = handler;
    this.sharedContext.systemStatus.agentHealth[agentId] = 'online';
    if (this.debugMode) {
      console.log(`[ANP] Agent ${agentId} registered`);
    }
  }

  /**
   * 注销代理
   * @param agentId 代理ID
   */
  unregister(agentId: AgentID) {
    delete this.listeners[agentId];
    this.sharedContext.systemStatus.agentHealth[agentId] = 'offline';
    if (this.debugMode) {
      console.log(`[ANP] Agent ${agentId} unregistered`);
    }
  }

  /**
   * 启用调试模式
   */
  enableDebugMode() {
    this.debugMode = true;
    console.log('[ANP] Debug mode enabled');
  }

  /**
   * 禁用调试模式
   */
  disableDebugMode() {
    this.debugMode = false;
  }

  /**
   * 分发消息到目标代理
   * @param msg ANP消息
   */
  async dispatch(msg: ANPMessage) {
    // 调试日志
    if (this.debugMode) {
      console.log(`[ANP] ${msg.source} → ${msg.target}`, msg.type, msg.action);
    }

    // 监控消息
    this.monitor(msg);

    // 记录消息历史
    this.messageHistory.push(msg);
    if (this.messageHistory.length > this.MAX_HISTORY) {
      this.messageHistory.shift(); // 保持队列大小
    }

    // 路由消息
    try {
      if (msg.target === 'BROADCAST') {
        // 广播模式: 发送给所有注册的代理
        const handlers = Object.values(this.listeners);
        await Promise.all(handlers.map(h => h(msg)));
      } else if (this.listeners[msg.target]) {
        // 单播模式: 发送给指定代理
        await this.listeners[msg.target](msg);
      } else {
        // 目标不存在
        if (this.debugMode) {
          console.warn(`[ANP] Target agent '${msg.target}' not found`);
        }
      }
    } catch (error) {
      console.error(`[ANP] Error dispatching message:`, error);
      // 发送错误事件
      this.dispatch({
        id: `err_internal_${Date.now()}`,
        timestamp: Date.now(),
        source: 'NETWORK' as AgentID,
        target: msg.source,
        type: 'ERROR',
        action: 'dispatch_failed',
        payload: { originalMessage: msg.id, error: String(error) }
      });
    }
  }

  /**
   * 监控消息并更新上下文
   * @param msg ANP消息
   */
  private monitor(msg: ANPMessage) {
    // 监控类型1: 上下文更新事件
    if (msg.type === 'EVENT' && msg.action === 'context_update') {
       this.sharedContext = { ...this.sharedContext, ...msg.payload };
       if (this.debugMode) {
         console.log('[ANP] Context updated:', msg.payload);
       }
    }
    
    // 监控类型2: 用户查询记录
    if (msg.source === 'USER' && msg.action === 'query') {
        this.sharedContext.userSession.history.push(msg.payload.text);
        if (this.debugMode) {
          console.log('[ANP] User query recorded:', msg.payload.text);
        }
    }

    // 监控类型3: 代理状态变化
    if (msg.type === 'EVENT' && msg.action === 'agent_status_change') {
      const { agentId, status } = msg.payload;
      this.sharedContext.systemStatus.agentHealth[agentId] = status;
    }

    // 监控类型4: 任务计数
    if (msg.type === 'REQUEST') {
      this.sharedContext.systemStatus.pendingTasks++;
    } else if (msg.type === 'RESPONSE' || msg.type === 'ERROR') {
      this.sharedContext.systemStatus.pendingTasks = Math.max(0, this.sharedContext.systemStatus.pendingTasks - 1);
    }
  }

  /**
   * 获取共享上下文
   */
  getContext() {
      return this.sharedContext;
  }

  /**
   * 获取消息历史
   * @param limit 返回最近的N条消息
   */
  getMessageHistory(limit?: number) {
    if (limit) {
      return this.messageHistory.slice(-limit);
    }
    return [...this.messageHistory];
  }

  /**
   * 获取代理健康状态
   */
  getAgentHealth() {
    return { ...this.sharedContext.systemStatus.agentHealth };
  }

  /**
   * 清空消息历史
   */
  clearHistory() {
    this.messageHistory = [];
    if (this.debugMode) {
      console.log('[ANP] Message history cleared');
    }
  }
}

export const Network = new AgentNetwork();

// --- Agent B: Tool Runner (工具执行器) ---

/**
 * 工具映射表
 * 将工具名称映射到实际的函数实现
 */
const tools = {
  'voice_interaction': geminiService.voiceInteraction,
  'object_recognition': geminiService.objectRecognition,
  'get_shopping_info': geminiService.getShoppingInfo,
  'get_related_knowledge': geminiService.getRelatedKnowledge,
  'get_map': geminiService.getStaticMapImage // Corrected mapping
};

/**
 * Agent B 消息处理器
 * 职责: 接收工具调用请求，执行工具，返回结果
 */
Network.register('B', async (msg: ANPMessage) => {
  // 只处理 REQUEST 类型的 call_tool 动作
  if (msg.type === 'REQUEST' && msg.action === 'call_tool') {
    const { toolName, params } = msg.payload;
    const startTime = Date.now();

    try {
      // 1. 查找工具
      const tool = tools[toolName as keyof typeof tools];
      if (!tool) {
        throw new Error(`Tool '${toolName}' not found in registry`);
      }

      // 2. 执行工具
      // @ts-ignore - 动态参数调用
      const result = await tool(...params);

      // 3. 计算执行时间
      const executionTime = Date.now() - startTime;

      // 4. 发送成功响应
      Network.dispatch({
        id: `resp_${Date.now()}`,
        timestamp: Date.now(),
        source: 'B',
        target: msg.source,
        type: 'RESPONSE',
        action: 'tool_result',
        payload: result
      });

      // 5. 副作用: 更新上下文 (如果第一个参数是字符串，认为是景点名)
      if (params[0] && typeof params[0] === 'string') {
          Network.dispatch({
              id: `evt_${Date.now()}`,
              timestamp: Date.now(),
              source: 'B',
              target: 'D',
              type: 'EVENT',
              action: 'context_update',
              payload: { 
                userSession: { 
                  currentSpot: params[0],
                  lastIntent: toolName 
                } 
              }
          });
      }

      // 6. 性能日志
      if (executionTime > 3000) {
        console.warn(`[ANP] Tool '${toolName}' took ${executionTime}ms (slow)`);
      }

    } catch (error: any) {
      // 7. 错误处理
      console.error(`[ANP] Tool '${toolName}' failed:`, error);
      
      Network.dispatch({
        id: `err_${Date.now()}`,
        timestamp: Date.now(),
        source: 'B',
        target: msg.source,
        type: 'ERROR',
        action: 'tool_failed',
        payload: { 
          message: error.message,
          toolName,
          params: params.map((p: any) => typeof p === 'string' ? p : '[Object]')
        }
      });
    }
  }
});

// --- Agent A: Facade (门面代理) ---

/**
 * 意图解析函数
 * 基于关键词匹配识别用户意图
 * @param text 用户输入文本
 * @returns 工具名称和是否商业意图
 */
function parseIntent(text: string): { tool: string, isCommerce: boolean } {
    // 商业意图: 购买、饮食相关
    if (text.includes('买') || text.includes('吃') || text.includes('特产') || text.includes('购物')) {
      return { tool: 'get_shopping_info', isCommerce: true };
    }
    
    // 知识查询意图: 历史、文化相关
    if (text.includes('历史') || text.includes('知识') || text.includes('故事') || text.includes('背景')) {
      return { tool: 'get_related_knowledge', isCommerce: false };
    }
    
    // 默认: 语音交互
    return { tool: 'voice_interaction', isCommerce: false };
}

/**
 * Agent A - 门面代理
 * 对外暴露的统一接口，负责意图解析和请求路由
 */

// Agent A 的响应处理器映射表 (requestId -> resolver)
const pendingRequests = new Map<string, (result: any) => void>();

// 注册 Agent A 的全局响应处理器 (只注册一次)
Network.register('A', async (msg: ANPMessage) => {  
  if (msg.type === 'RESPONSE' || msg.type === 'ERROR') {
    // 从当前所有待处理的请求中找到第一个（因为是FIFO顺序）
    // 这是一个简化的实现，实际应该根据消息ID匹配
    const firstRequest = pendingRequests.keys().next();
    
    if (!firstRequest.done) {
      const requestId = firstRequest.value;
      const resolver = pendingRequests.get(requestId);
      
      if (resolver) {
        // 调用对应的 resolver
        if (msg.type === 'ERROR') {
          resolver({ 
            text: "服务暂时不可用，请稍后再试。",
            audio_base_64: "",
            error: true,
            originalError: msg.payload
          });
        } else {
          resolver(msg.payload);
        }
        // 移除已处理的请求
        pendingRequests.delete(requestId);
      }
    }
  }
});

export const AgentA = {
  /**
   * 处理用户请求
   * @param text 用户输入文本
   * @param contextSpot 当前上下文景点名称
   * @param mode 交互模式 (text/photo)
   * @returns Promise<结果>
   */
  processUserRequest: async (text: string, contextSpot: string, mode: 'text' | 'photo' = 'text'): Promise<any> => {
    return new Promise((resolve, reject) => {
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      let timeoutId: NodeJS.Timeout;

      // 注册这个请求的 resolver
      pendingRequests.set(requestId, (result: any) => {
        clearTimeout(timeoutId);
        resolve(result);
      });

      // 设置超时 (30秒)
      timeoutId = setTimeout(() => {
        pendingRequests.delete(requestId);
        resolve({
          text: "请求超时，请重试。",
          audio_base_64: "",
          timeout: true
        });
      }, 30000);

      // 步骤1: 选择工具和准备参数
      let toolName = 'voice_interaction';
      let params = [contextSpot, text];

      if (mode === 'photo') {
          // 图片识别模式
          toolName = 'object_recognition';
          params = [contextSpot];
      } else {
          // 文本模式: 意图识别
          const intent = parseIntent(text);
          if (intent.isCommerce) {
             toolName = 'get_shopping_info';
             // TODO: 实际项目中应从GPS获取用户坐标
             params = ["118.205,25.235", contextSpot]; 
          } else if (intent.tool === 'get_related_knowledge') {
              toolName = 'get_related_knowledge';
              params = [contextSpot];
          }
      }

      // 步骤2: 发送请求到 Agent B
      Network.dispatch({
        id: requestId,
        timestamp: Date.now(),
        source: 'A',
        target: 'B',
        type: 'REQUEST',
        action: 'call_tool',
        payload: { toolName, params }
      });
    });
  },

  /**
   * 获取系统状态
   */
  getSystemStatus: () => {
    return Network.getContext().systemStatus;
  },

  /**
   * 获取代理健康状态
   */
  getAgentHealth: () => {
    return Network.getAgentHealth();
  }
};