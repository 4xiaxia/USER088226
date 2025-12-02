# ANP (Agent Network Protocol) 代理网络通信协议

## 📋 协议概述

ANP是东里村智能导游系统的核心通信协议，实现了前端AI代理之间的解耦、异步、可观测的消息通信机制。

### 设计理念

- **松耦合**: 代理通过消息总线通信，无直接依赖
- **异步非阻塞**: 基于Promise的异步消息分发
- **可观测性**: 集中监控和日志记录
- **容错性**: 完善的错误处理和降级机制
- **可扩展性**: 动态注册代理和工具

---
sequenceDiagram
    participant User as 用户界面
    participant AgentA as Agent A (门面)
    participant Network as ANP Network
    participant AgentB as Agent B (工具)
    participant AgentD as Agent D (数据池)
    participant Gemini as Gemini Service
    participant API as 外部AI API

    User->>AgentA: processUserRequest("讲讲东里村")
    
    Note over AgentA: 1. 意图解析<br/>parseIntent() -> voice_interaction
    
    AgentA->>AgentA: register('A', responseHandler)
    
    AgentA->>Network: dispatch(REQUEST)
    Note right of Network: {<br/>  id: "req_123",<br/>  source: 'A',<br/>  target: 'B',<br/>  type: 'REQUEST',<br/>  action: 'call_tool',<br/>  payload: {<br/>    toolName: 'voice_interaction',<br/>    params: ['东里村', '讲讲东里村']<br/>  }<br/>}
    
    Network->>Network: monitor() 监听消息
    Network->>AgentB: 路由到 Agent B
    
    Note over AgentB: 2. 工具调用<br/>tools[toolName](...params)
    
    AgentB->>Gemini: voiceInteraction('东里村', '讲讲东里村')
    
    Gemini->>API: 调用 SiliconFlow API
    
    alt API调用成功
        API-->>Gemini: {text: "东里村...", audio_base_64: ""}
    else API失败
        Gemini->>API: 切换到 Zhipu AI (备用)
        API-->>Gemini: 备用响应
    end
    
    Gemini-->>AgentB: 返回结果
    
    Note over AgentB: 3. 发送RESPONSE
    AgentB->>Network: dispatch(RESPONSE)
    Note right of Network: {<br/>  id: "resp_124",<br/>  source: 'B',<br/>  target: 'A',<br/>  type: 'RESPONSE',<br/>  action: 'tool_result',<br/>  payload: {text: "...", audio: ""}<br/>}
    
    Note over AgentB: 4. 发送EVENT更新上下文
    AgentB->>Network: dispatch(EVENT)
    Note right of Network: {<br/>  source: 'B',<br/>  target: 'D',<br/>  type: 'EVENT',<br/>  action: 'context_update',<br/>  payload: {<br/>    userSession: {<br/>      currentSpot: '东里村'<br/>    }<br/>  }<br/>}
    
    Network->>AgentD: 路由到 Agent D
    AgentD->>AgentD: 更新 sharedContext
    
    Network->>AgentA: 路由RESPONSE到Agent A
    AgentA->>AgentA: responseHandler()
    AgentA-->>User: resolve(payload)
    
    User->>User: 显示消息气泡<br/>播放音频

## 🏗️ 架构设计

### 核心组件

```
┌─────────────────────────────────────────────────────────┐
│                     用户交互层                           │
│  BottomChatWidget  AgentPresenter  VoiceInteractionPanel│
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   ANP 网络层                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │ AgentNetwork (消息总线)                          │   │
│  │ • listeners: 代理注册表                          │   │
│  │ • sharedContext: 共享上下文                      │   │
│  │ • monitor(): 消息监控                            │   │
│  │ • dispatch(): 消息分发                           │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
    ┌───────┐   ┌───────┐   ┌───────┐
    │Agent A│   │Agent B│   │Agent D│
    │ 门面  │   │ 工具  │   │数据池 │
    └───────┘   └───────┘   └───────┘
```

---

## 📦 数据结构

### ANPMessage 消息格式

```typescript
interface ANPMessage {
  id: string;                    // 消息唯一ID (格式: req_timestamp / resp_timestamp / evt_timestamp)
  timestamp: number;             // 消息时间戳 (Date.now())
  source: AgentID;               // 消息来源 ('A' | 'B' | 'C' | 'D' | 'USER')
  target: AgentID | 'BROADCAST'; // 消息目标 (单播/广播)
  type: MessageType;             // 消息类型
  action: string;                // 动作名称
  payload: any;                  // 消息负载
}

type AgentID = 'A' | 'B' | 'C' | 'D' | 'USER';
type MessageType = 'REQUEST' | 'RESPONSE' | 'EVENT' | 'ERROR';
```

### SharedContext 共享上下文

```typescript
interface SharedContext {
  userSession: {
    currentSpot?: string;        // 当前景点名称
    lastIntent?: string;         // 最后一次识别的意图
    history: string[];           // 用户查询历史
  };
  environment: {
    weather?: string;            // 天气信息
    activeEvents?: string[];     // 当前活跃事件
  };
  systemStatus: {
    agentHealth: Record<string, 'online' | 'busy' | 'offline'>;
    pendingTasks: number;        // 待处理任务数
  };
}
```

---

## 🔄 消息流转详解

### 完整请求-响应周期

```
1. 用户发起请求
   UI → AgentA.processUserRequest(text, context, mode)

2. Agent A 注册监听器
   Network.register('A', responseHandler)

3. Agent A 解析意图
   parseIntent(text) → {tool, isCommerce}

4. Agent A 发送请求消息
   Network.dispatch({
     id: 'req_123',
     source: 'A',
     target: 'B',
     type: 'REQUEST',
     action: 'call_tool',
     payload: {toolName, params}
   })

5. Network 路由消息
   listeners['B'](msg)

6. Agent B 执行工具
   tools[toolName](...params) → geminiService

7. Agent B 发送响应消息
   Network.dispatch({
     id: 'resp_124',
     source: 'B',
     target: 'A',
     type: 'RESPONSE',
     action: 'tool_result',
     payload: result
   })

8. Agent B 发送上下文更新事件
   Network.dispatch({
     source: 'B',
     target: 'D',
     type: 'EVENT',
     action: 'context_update',
     payload: {userSession: {...}}
   })

9. Network 路由响应给 Agent A
   responseHandler(msg) → resolve(msg.payload)

10. 结果返回给 UI
    UI 显示消息气泡 + 播放音频
```

---

## 🎯 代理职责划分

### Agent A - 门面代理 (Facade)

**职责**:
- 接收用户请求
- 意图识别和解析
- 工具选择和参数准备
- 消息路由到 Agent B
- 响应结果封装返回

**核心方法**:
```typescript
AgentA.processUserRequest(text: string, contextSpot: string, mode: 'text' | 'photo')
```

**意图解析规则**:
```typescript
function parseIntent(text: string): {tool: string, isCommerce: boolean} {
  if (text.includes('买') || text.includes('吃')) 
    return {tool: 'get_shopping_info', isCommerce: true};
  if (text.includes('历史') || text.includes('知识')) 
    return {tool: 'get_related_knowledge', isCommerce: false};
  return {tool: 'voice_interaction', isCommerce: false};
}
```

### Agent B - 工具执行器 (Tool Runner)

**职责**:
- 监听 REQUEST 消息
- 查找并执行对应工具
- 调用外部 AI 服务
- 返回执行结果
- 发送上下文更新事件

**工具映射表**:
```typescript
const tools = {
  'voice_interaction': geminiService.voiceInteraction,
  'object_recognition': geminiService.objectRecognition,
  'get_shopping_info': geminiService.getShoppingInfo,
  'get_related_knowledge': geminiService.getRelatedKnowledge,
  'get_map': geminiService.getStaticMapImage
};
```

**消息处理逻辑**:
```typescript
Network.register('B', async (msg: ANPMessage) => {
  if (msg.type === 'REQUEST' && msg.action === 'call_tool') {
    try {
      // 1. 执行工具
      const result = await tool(...params);
      
      // 2. 发送成功响应
      Network.dispatch({type: 'RESPONSE', ...});
      
      // 3. 发送上下文更新
      Network.dispatch({type: 'EVENT', target: 'D', ...});
      
    } catch (error) {
      // 4. 发送错误消息
      Network.dispatch({type: 'ERROR', ...});
    }
  }
});
```

### Agent D - 数据池 (Shared Context Manager)

**职责**:
- 维护共享上下文
- 监听 EVENT 消息
- 持久化状态信息
- 提供上下文查询接口

**当前实现**: 通过 `AgentNetwork.monitor()` 隐式实现

---

## 📨 消息类型与 Action 映射

| 类型 | Action | Source | Target | Payload | 说明 |
|------|--------|--------|--------|---------|------|
| REQUEST | call_tool | A | B | `{toolName, params}` | 请求调用工具 |
| RESPONSE | tool_result | B | A | `{text, audio_base_64, ...}` | 工具执行成功 |
| EVENT | context_update | B | D | `{userSession: {...}}` | 上下文更新 |
| ERROR | tool_failed | B | A | `{message}` | 工具执行失败 |

---

## 🔍 监控与日志

### Monitor 监控器

```typescript
private monitor(msg: ANPMessage) {
  // 监控类型1: 上下文更新
  if (msg.type === 'EVENT' && msg.action === 'context_update') {
    this.sharedContext = { ...this.sharedContext, ...msg.payload };
  }
  
  // 监控类型2: 用户查询记录
  if (msg.source === 'USER' && msg.action === 'query') {
    this.sharedContext.userSession.history.push(msg.payload.text);
  }
  
  // 可选: 日志输出
  // console.log(`[ANP] ${msg.source} → ${msg.target}`, msg.type, msg.action);
}
```

---

## 🚀 使用示例

### 示例1: 文本对话

```typescript
// UI层调用
const result = await AgentA.processUserRequest(
  "讲讲东里村的历史",  // 用户问题
  "东里村",             // 当前景点
  "text"                // 交互模式
);

// 消息流转:
// A → Network: REQUEST(call_tool, voice_interaction)
// Network → B: 路由消息
// B → geminiService: 调用AI
// B → Network: RESPONSE(tool_result)
// B → Network: EVENT(context_update)
// Network → A: 路由响应
// A → UI: resolve(result)

console.log(result.text); // "东里村是..."
```

### 示例2: 图片识别

```typescript
const result = await AgentA.processUserRequest(
  "识别这张照片",       // 固定文本
  "东里村古民居",       // 当前景点
  "photo"               // 模式切换为photo
);

// 消息流转:
// A → Network: REQUEST(call_tool, object_recognition)
// Network → B: 路由消息
// B → geminiService: 调用视觉模型
// B → Network: RESPONSE(tool_result)
// Network → A: 路由响应
// A → UI: resolve(result)

console.log(result.explanation);   // "这是一座明清时期..."
console.log(result.memorial_image); // 生成的纪念图片URL
```

### 示例3: 购物信息查询

```typescript
const result = await AgentA.processUserRequest(
  "这里有什么特产可以买",
  "东里村",
  "text"
);

// 意图解析: parseIntent() → {tool: 'get_shopping_info', isCommerce: true}
// 消息流转:
// A → Network: REQUEST(call_tool, get_shopping_info)
// Network → B: 路由消息
// B → geminiService: 调用商业数据API
// B → Network: RESPONSE(tool_result)

console.log(result.recommend_text); // "为您推荐以下特产..."
console.log(result.products);       // [{name: "红菇", price: "¥50/斤"}, ...]
console.log(result.businesses);     // [{name: "老李特产店", distance: "200m"}, ...]
```

---

## ⚡ 性能优化

### 1. 消息队列 (建议实现)

```typescript
class AgentNetwork {
  private messageQueue: ANPMessage[] = [];
  private isProcessing = false;
  
  async dispatch(msg: ANPMessage) {
    this.messageQueue.push(msg);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }
  
  private async processQueue() {
    this.isProcessing = true;
    while (this.messageQueue.length > 0) {
      const msg = this.messageQueue.shift()!;
      await this.routeMessage(msg);
    }
    this.isProcessing = false;
  }
}
```

### 2. 消息优先级 (建议实现)

```typescript
interface ANPMessage {
  // ... existing fields
  priority?: 'high' | 'normal' | 'low';
}

async dispatch(msg: ANPMessage) {
  if (msg.priority === 'high') {
    this.messageQueue.unshift(msg); // 插队
  } else {
    this.messageQueue.push(msg);
  }
}
```

### 3. 链路追踪 (建议实现)

```typescript
interface ANPMessage {
  traceId?: string;   // 链路追踪ID
  parentId?: string;  // 父消息ID
  depth?: number;     // 调用深度
}
```

---

## 🛡️ 错误处理

### 错误类型

1. **工具不存在**: `Tool ${toolName} not found`
2. **工具执行失败**: API调用失败、网络错误等
3. **消息路由失败**: target不存在

### 错误处理策略

```typescript
try {
  const tool = tools[toolName];
  if (!tool) throw new Error(`Tool ${toolName} not found`);
  const result = await tool(...params);
  // 发送 RESPONSE
} catch (error: any) {
  // 发送 ERROR 消息
  Network.dispatch({
    type: 'ERROR',
    action: 'tool_failed',
    payload: { message: error.message }
  });
}
```

### UI层降级处理

```typescript
const responseHandler = async (msg: ANPMessage) => {
  if (msg.type === 'ERROR') {
    resolve({ text: "服务暂时不可用，请稍后再试。" });
  } else {
    resolve(msg.payload);
  }
};
```

---

## 🔧 扩展指南

### 添加新代理

```typescript
// 1. 定义代理ID
type AgentID = 'A' | 'B' | 'C' | 'D' | 'E' | 'USER';

// 2. 注册代理
Network.register('E', async (msg: ANPMessage) => {
  if (msg.type === 'REQUEST' && msg.action === 'your_action') {
    // 处理逻辑
  }
});
```

### 添加新工具

```typescript
// 1. 在 geminiService 中实现工具函数
export async function newTool(param1: string): Promise<Result> {
  // 工具实现
}

// 2. 在 Agent B 的工具映射表中注册
const tools = {
  'voice_interaction': geminiService.voiceInteraction,
  'new_tool': geminiService.newTool,  // 新增
};
```

### 添加新消息类型

```typescript
// 1. 扩展 MessageType
type MessageType = 'REQUEST' | 'RESPONSE' | 'EVENT' | 'ERROR' | 'NOTIFY';

// 2. 在 monitor 中处理新类型
private monitor(msg: ANPMessage) {
  if (msg.type === 'NOTIFY') {
    // 处理通知消息
  }
}
```

---

## 📊 最佳实践

### ✅ DO (推荐做法)

- ✅ 使用有意义的消息ID: `req_${timestamp}`, `resp_${timestamp}`
- ✅ 所有异步操作都通过 ANP 进行
- ✅ 在 payload 中包含足够的上下文信息
- ✅ 使用 monitor 记录关键消息
- ✅ 优雅处理 ERROR 消息

### ❌ DON'T (避免做法)

- ❌ 直接调用其他代理的内部方法
- ❌ 在 payload 中传递过大的数据（如完整图片）
- ❌ 忽略 ERROR 类型消息
- ❌ 在 UI 层直接调用 geminiService
- ❌ 阻塞式的同步消息处理

---

## 🔗 相关文件

- `services/agentSystem.ts` - ANP核心实现
- `services/geminiService.ts` - AI服务封装
- `components/BottomChatWidget.tsx` - UI层集成示例
- `components/AgentPresenter.tsx` - 完整交互示例
- `types.ts` - 类型定义

---

## 📝 版本历史

- **v1.0.0** (当前版本)
  - ✅ 基础消息总线实现
  - ✅ Agent A, B, D 角色划分
  - ✅ REQUEST, RESPONSE, EVENT, ERROR 消息类型
  - ✅ 工具映射和动态调用
  - ✅ 共享上下文管理

- **v1.1.0** (规划中)
  - 🔄 消息队列和优先级
  - 🔄 链路追踪和性能监控
  - 🔄 消息重试机制
  - 🔄 Agent C 完整实现

---

## 📧 联系方式

如有问题或建议，请联系技术团队。

---

**ANP Protocol** - Powering Intelligent Agent Communication in 东里村智能导游系统
