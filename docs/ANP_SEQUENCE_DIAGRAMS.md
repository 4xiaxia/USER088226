# ANP 通信时序图集

本文档包含 ANP 协议中所有关键场景的时序图，帮助理解消息流转过程。

---

## 场景1: 文本对话 (Voice Interaction)

用户询问景点信息，Agent A 解析意图后调用 Agent B 的语音交互工具。

```mermaid
sequenceDiagram
    participant User as 用户界面<br/>(BottomChatWidget)
    participant AgentA as Agent A<br/>门面代理
    participant Network as ANP Network<br/>消息总线
    participant AgentB as Agent B<br/>工具执行器
    participant AgentD as Agent D<br/>数据池
    participant Gemini as Gemini Service
    participant API as SiliconFlow API

    User->>AgentA: processUserRequest(<br/>"讲讲东里村", "东里村", "text")
    
    Note over AgentA: 步骤1: 注册监听器
    AgentA->>AgentA: register('A', responseHandler)
    
    Note over AgentA: 步骤2: 意图解析
    AgentA->>AgentA: parseIntent("讲讲东里村")<br/>→ voice_interaction
    
    Note over AgentA: 步骤3: 构造请求消息
    AgentA->>Network: dispatch(REQUEST)<br/>{<br/>  id: "req_1733123456",<br/>  source: 'A',<br/>  target: 'B',<br/>  type: 'REQUEST',<br/>  action: 'call_tool',<br/>  payload: {<br/>    toolName: 'voice_interaction',<br/>    params: ['东里村', '讲讲东里村']<br/>  }<br/>}
    
    Note over Network: 步骤4: 监控并路由
    Network->>Network: monitor(msg)<br/>记录到history
    Network->>AgentB: listeners['B'](msg)
    
    Note over AgentB: 步骤5: 工具查找和执行
    AgentB->>AgentB: tools['voice_interaction']
    AgentB->>Gemini: voiceInteraction(<br/>'东里村', '讲讲东里村')
    
    Gemini->>API: POST /chat/completions<br/>{model, messages, ...}
    
    alt API调用成功
        API-->>Gemini: {text: "东里村是...", ...}
    else API失败
        Note over Gemini: 故障切换
        Gemini->>API: 切换到 Zhipu AI
        API-->>Gemini: 备用响应
    end
    
    Gemini-->>AgentB: {text: "东里村是...", audio_base_64: ""}
    
    Note over AgentB: 步骤6: 发送响应
    AgentB->>Network: dispatch(RESPONSE)<br/>{<br/>  id: "resp_1733123457",<br/>  source: 'B',<br/>  target: 'A',<br/>  type: 'RESPONSE',<br/>  action: 'tool_result',<br/>  payload: {<br/>    text: "东里村是...",<br/>    audio_base_64: ""<br/>  }<br/>}
    
    Note over AgentB: 步骤7: 更新上下文
    AgentB->>Network: dispatch(EVENT)<br/>{<br/>  source: 'B',<br/>  target: 'D',<br/>  type: 'EVENT',<br/>  action: 'context_update',<br/>  payload: {<br/>    userSession: {<br/>      currentSpot: '东里村'<br/>    }<br/>  }<br/>}
    
    Network->>AgentD: listeners['D'](msg)
    AgentD->>AgentD: 更新 sharedContext
    
    Note over Network: 步骤8: 路由响应给A
    Network->>AgentA: listeners['A'](msg)
    
    Note over AgentA: 步骤9: 处理响应
    AgentA->>AgentA: responseHandler(msg)<br/>resolve(msg.payload)
    
    AgentA-->>User: 返回结果<br/>{text: "东里村是...", audio: ""}
    
    Note over User: 步骤10: UI渲染
    User->>User: 显示消息气泡<br/>播放音频(如有)
```

---

## 场景2: 图片识别 (Object Recognition)

用户上传照片，Agent B 调用视觉识别模型。

```mermaid
sequenceDiagram
    participant User as 用户界面
    participant AgentA as Agent A
    participant Network as ANP Network
    participant AgentB as Agent B
    participant Gemini as Gemini Service
    participant Pollinations as Pollinations.ai

    User->>User: 用户选择照片
    User->>AgentA: processUserRequest(<br/>"识别照片", "东里古民居", "photo")
    
    Note over AgentA: mode='photo'<br/>自动选择工具
    AgentA->>Network: dispatch(REQUEST)<br/>{<br/>  toolName: 'object_recognition',<br/>  params: ['东里古民居']<br/>}
    
    Network->>AgentB: 路由到 Agent B
    
    AgentB->>Gemini: objectRecognition('东里古民居')
    
    Note over Gemini: 调用AI生成解说词
    Gemini->>Gemini: fetchChatCompletion()<br/>系统提示: "识别照片..."
    
    Gemini->>Gemini: {explanation: "这是明清古民居..."}
    
    Note over Gemini: 生成纪念图片
    Gemini->>Pollinations: GET /prompt/东里古民居...
    Pollinations-->>Gemini: 图片URL
    
    Gemini-->>AgentB: {<br/>  explanation: "这是明清古民居...",<br/>  memorial_image: "https://...",<br/>  audio_base_64: ""<br/>}
    
    AgentB->>Network: dispatch(RESPONSE)
    Network->>AgentA: 路由响应
    AgentA-->>User: 返回识别结果
    
    User->>User: 显示图片和解说
```

---

## 场景3: 购物信息查询 (Shopping Info)

用户询问特产，触发商业意图识别。

```mermaid
sequenceDiagram
    participant User as 用户界面
    participant AgentA as Agent A
    participant Network as ANP Network
    participant AgentB as Agent B
    participant Gemini as Gemini Service

    User->>AgentA: processUserRequest(<br/>"这里有什么特产可以买", "东里村", "text")
    
    Note over AgentA: 意图识别
    AgentA->>AgentA: parseIntent("...买")<br/>→ isCommerce=true
    
    AgentA->>Network: dispatch(REQUEST)<br/>{<br/>  toolName: 'get_shopping_info',<br/>  params: ["118.205,25.235", "东里村"]<br/>}
    
    Network->>AgentB: 路由到 Agent B
    
    AgentB->>Gemini: getShoppingInfo(<br/>"118.205,25.235", "东里村")
    
    Gemini->>Gemini: fetchChatCompletion()<br/>系统提示: "推荐当地特色"
    
    Gemini-->>AgentB: {<br/>  recommend_text: "为您推荐...",<br/>  products: [<br/>    {name: "红菇", price: "¥50/斤"},<br/>    {name: "茶叶", price: "¥80/盒"}<br/>  ],<br/>  businesses: [<br/>    {name: "老李特产店", distance: "200m"}<br/>  ]<br/>}
    
    AgentB->>Network: dispatch(RESPONSE)
    Network->>AgentA: 路由响应
    AgentA-->>User: 返回购物信息
    
    User->>User: 显示商品卡片<br/>显示商家列表
```

---

## 场景4: 错误处理流程

工具执行失败时的降级处理。

```mermaid
sequenceDiagram
    participant User as 用户界面
    participant AgentA as Agent A
    participant Network as ANP Network
    participant AgentB as Agent B
    participant Gemini as Gemini Service
    participant API as AI API

    User->>AgentA: processUserRequest(...)
    AgentA->>Network: dispatch(REQUEST)
    Network->>AgentB: 路由到 Agent B
    
    AgentB->>Gemini: voiceInteraction(...)
    Gemini->>API: 调用主API (SiliconFlow)
    
    API-->>Gemini: ❌ HTTP 500 错误
    
    Note over Gemini: 第一次降级
    Gemini->>API: 切换到备用API (Zhipu)
    
    API-->>Gemini: ❌ 备用API也失败
    
    Gemini-->>AgentB: throw Error("所有API失败")
    
    Note over AgentB: 捕获异常
    AgentB->>Network: dispatch(ERROR)<br/>{<br/>  type: 'ERROR',<br/>  action: 'tool_failed',<br/>  payload: {<br/>    message: "所有API失败"<br/>  }<br/>}
    
    Network->>AgentA: 路由错误消息
    
    Note over AgentA: 第二次降级
    AgentA->>AgentA: responseHandler(msg)<br/>if (msg.type === 'ERROR')<br/>  resolve({text: "服务暂时不可用"})
    
    AgentA-->>User: 返回友好错误提示
    
    User->>User: 显示: "服务暂时不可用，请稍后再试"
```

---

## 场景5: 并发请求处理

多个用户请求同时到达。

```mermaid
sequenceDiagram
    participant U1 as 用户1
    participant U2 as 用户2
    participant AgentA as Agent A
    participant Network as ANP Network
    participant AgentB as Agent B

    Note over U1,U2: T=0ms: 两个请求几乎同时发起
    
    U1->>AgentA: processUserRequest("景点1")
    U2->>AgentA: processUserRequest("景点2")
    
    Note over AgentA: 为每个请求注册独立监听器
    AgentA->>AgentA: register('A', handler1)
    AgentA->>AgentA: register('A', handler2)<br/>(覆盖handler1)
    
    par 并发消息分发
        AgentA->>Network: dispatch(REQUEST1)<br/>{id: "req_001", ...}
    and
        AgentA->>Network: dispatch(REQUEST2)<br/>{id: "req_002", ...}
    end
    
    Note over Network: 消息按到达顺序处理
    Network->>AgentB: 路由 REQUEST1
    Network->>AgentB: 路由 REQUEST2
    
    Note over AgentB: 异步并发执行
    par Agent B 并发工具调用
        AgentB->>AgentB: 处理 REQUEST1
    and
        AgentB->>AgentB: 处理 REQUEST2
    end
    
    AgentB->>Network: dispatch(RESPONSE1)
    AgentB->>Network: dispatch(RESPONSE2)
    
    Network->>AgentA: 路由 RESPONSE1
    AgentA-->>U1: 返回结果1
    
    Network->>AgentA: 路由 RESPONSE2
    AgentA-->>U2: 返回结果2
    
    Note over AgentA: ⚠️ 问题: handler2覆盖了handler1<br/>需要改进: 使用消息ID匹配
```

---

## 场景6: 上下文传递链路

Agent B 更新上下文后，后续请求如何利用。

```mermaid
sequenceDiagram
    participant User as 用户界面
    participant AgentA as Agent A
    participant Network as ANP Network
    participant AgentB as Agent B
    participant AgentD as Agent D (隐式)

    Note over User,AgentD: 第一次对话
    User->>AgentA: "这里是哪？"
    AgentA->>Network: dispatch(REQUEST)
    Network->>AgentB: 路由消息
    
    AgentB->>AgentB: 工具执行
    AgentB->>Network: dispatch(RESPONSE)<br/>{text: "这里是东里村"}
    
    Note over AgentB: 同时更新上下文
    AgentB->>Network: dispatch(EVENT)<br/>{<br/>  action: 'context_update',<br/>  payload: {<br/>    userSession: {<br/>      currentSpot: '东里村'<br/>    }<br/>  }<br/>}
    
    Network->>Network: monitor(msg)<br/>sharedContext.userSession.currentSpot = '东里村'
    
    AgentA-->>User: "这里是东里村"
    
    Note over User,AgentD: 第二次对话 (上下文已有)
    User->>AgentA: "有什么特色？"
    AgentA->>Network: dispatch(REQUEST)<br/>params: ['东里村', '有什么特色？']
    
    Note over AgentB: 从上下文获取景点信息
    Network->>AgentB: 路由消息
    AgentB->>AgentB: contextSpot = params[0] // '东里村'
    
    AgentB->>Network: dispatch(RESPONSE)<br/>{text: "东里村的特色有..."}
    AgentA-->>User: "东里村的特色有..."
```

---

## 场景7: 广播消息 (未来扩展)

系统级事件广播给所有代理。

```mermaid
sequenceDiagram
    participant System as 系统
    participant Network as ANP Network
    participant AgentA as Agent A
    participant AgentB as Agent B
    participant AgentC as Agent C
    participant AgentD as Agent D

    System->>Network: dispatch(EVENT)<br/>{<br/>  source: 'SYSTEM',<br/>  target: 'BROADCAST',<br/>  type: 'EVENT',<br/>  action: 'system_maintenance',<br/>  payload: {<br/>    message: "系统将于1分钟后维护"<br/>  }<br/>}
    
    Note over Network: 广播路由
    par 所有代理接收消息
        Network->>AgentA: listeners['A'](msg)
        AgentA->>AgentA: 暂停接收新请求
    and
        Network->>AgentB: listeners['B'](msg)
        AgentB->>AgentB: 完成当前任务
    and
        Network->>AgentC: listeners['C'](msg)
        AgentC->>AgentC: 清理资源
    and
        Network->>AgentD: listeners['D'](msg)
        AgentD->>AgentD: 持久化上下文
    end
    
    Note over AgentA,AgentD: 所有代理进入维护模式
```

---

## 时序图解读说明

### 图例说明

- **实线箭头 (→)**: 同步调用/消息发送
- **虚线箭头 (-->>)**: 异步返回/回调
- **Note框**: 关键步骤说明
- **alt框**: 条件分支 (if/else)
- **par框**: 并发执行

### 关键时间点

1. **T0**: 用户发起请求
2. **T1**: AgentA 注册监听器 (~1ms)
3. **T2**: 消息分发到 Network (~1ms)
4. **T3**: 路由到 AgentB (~1ms)
5. **T4-T5**: 工具执行 (AI API调用, 500-3000ms)
6. **T6**: 响应返回到 AgentA (~1ms)
7. **T7**: UI 渲染结果 (~50ms)

**总耗时**: 主要取决于 AI API 响应速度 (500-3000ms)

### 性能瓶颈

1. **AI API 调用**: 占用 90%+ 的时间
2. **消息路由**: 几乎可以忽略不计 (<5ms)
3. **意图解析**: 简单关键词匹配 (<1ms)

---

## 优化建议

### 1. 请求合并

对于相似的并发请求，可以合并为一个 API 调用：

```mermaid
graph LR
    R1[请求1] --> Cache{缓存检查}
    R2[请求2] --> Cache
    R3[请求3] --> Cache
    Cache -->|未命中| API[调用API]
    Cache -->|命中| Result[返回缓存]
    API --> Result
```

### 2. 流式响应

支持 SSE (Server-Sent Events) 实现流式返回：

```mermaid
sequenceDiagram
    User->>AgentA: 请求
    AgentA->>AgentB: 请求
    AgentB->>API: stream=true
    
    loop 流式接收
        API-->>AgentB: chunk 1
        AgentB-->>User: 部分结果1
        API-->>AgentB: chunk 2
        AgentB-->>User: 部分结果2
    end
    
    API-->>AgentB: 结束
    AgentB-->>User: 完成
```

### 3. 消息去重

对于重复的请求，避免重复执行：

```mermaid
graph TD
    Msg[新消息] --> Hash{计算Hash}
    Hash --> Check{检查是否重复}
    Check -->|是| Drop[丢弃消息]
    Check -->|否| Process[正常处理]
    Process --> Record[记录Hash]
```

---

## 相关文档

- [ANP 协议规范](./ANP_PROTOCOL.md)
- [Agent 系统设计](../services/agentSystem.ts)
- [Gemini 服务封装](../services/geminiService.ts)

---

**Last Updated**: 2024-12-02
