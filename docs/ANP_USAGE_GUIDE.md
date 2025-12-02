# ANP 通信协议使用指南

本指南帮助开发者快速上手 ANP (Agent Network Protocol) 代理通信系统。

---

## 快速开始

### 1. 基础使用 - 发送文本消息

```typescript
import { AgentA } from '../services/agentSystem';

// 用户提问
const result = await AgentA.processUserRequest(
  "讲讲东里村的历史",  // 用户问题
  "东里村",             // 当前景点
  "text"                // 模式: text 或 photo
);

// 显示结果
console.log(result.text);       // AI回复文本
console.log(result.audio_base_64); // 语音音频(base64)
```

### 2. 图片识别模式

```typescript
const result = await AgentA.processUserRequest(
  "识别这张照片",
  "东里古民居",
  "photo"  // 切换到图片模式
);

console.log(result.explanation);   // 识别结果解说
console.log(result.memorial_image); // 生成的纪念图片URL
```

### 3. 购物信息查询

```typescript
// ANP会自动识别商业意图
const result = await AgentA.processUserRequest(
  "这里有什么特产可以买",
  "东里村",
  "text"
);

console.log(result.recommend_text); // 推荐文案
console.log(result.products);       // 商品列表
console.log(result.businesses);     // 商家列表
```

---

## 组件集成

### 在聊天组件中使用

```typescript
import { AgentA } from '../services/agentSystem';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (text: string) => {
    setLoading(true);
    
    try {
      // 调用 Agent A
      const result = await AgentA.processUserRequest(
        text,
        currentSpotName,
        'text'
      );
      
      // 添加到消息列表
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: result.text,
        audio: result.audio_base_64
      }]);
      
    } catch (error) {
      console.error('AI响应失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... UI 组件
  );
};
```

---

## 调试工具

### 启用调试模式

```typescript
import { Network } from '../services/agentSystem';

// 启用调试日志
Network.enableDebugMode();

// 所有消息会打印到控制台:
// [ANP] A → B REQUEST call_tool
// [ANP] B → A RESPONSE tool_result
// [ANP] Context updated: {userSession: {...}}
```

### 使用 ANP Monitor 面板

```typescript
import ANPMonitor from '../components/ANPMonitor';

function App() {
  return (
    <>
      {/* 你的主应用 */}
      <TourGuide />
      
      {/* 添加监控面板 */}
      {process.env.NODE_ENV === 'development' && <ANPMonitor />}
    </>
  );
}
```

Monitor 面板功能:
- ✅ 实时显示代理健康状态
- ✅ 查看最近20条消息历史
- ✅ 查看共享上下文数据
- ✅ 系统性能指标
- ✅ 启用/禁用调试模式

### 查看消息历史

```typescript
import { Network } from '../services/agentSystem';

// 获取最近10条消息
const history = Network.getMessageHistory(10);

history.forEach(msg => {
  console.log(`${msg.source} → ${msg.target}`, msg.type, msg.action);
});
```

### 查看代理健康状态

```typescript
const health = Network.getAgentHealth();

console.log(health);
// {
//   'A': 'online',
//   'B': 'online',
//   'D': 'online'
// }
```

### 查看共享上下文

```typescript
const context = Network.getContext();

console.log('当前景点:', context.userSession.currentSpot);
console.log('查询历史:', context.userSession.history);
console.log('待处理任务:', context.systemStatus.pendingTasks);
```

---

## 高级用法

### 自定义意图识别

如果需要扩展意图识别规则，修改 `agentSystem.ts`:

```typescript
function parseIntent(text: string): { tool: string, isCommerce: boolean } {
  // 添加新的意图识别规则
  if (text.includes('导航') || text.includes('路线')) {
    return { tool: 'get_navigation', isCommerce: false };
  }
  
  // 现有规则...
  if (text.includes('买') || text.includes('吃')) {
    return { tool: 'get_shopping_info', isCommerce: true };
  }
  
  return { tool: 'voice_interaction', isCommerce: false };
}
```

### 添加新工具

1. **在 geminiService.ts 中实现工具函数**:

```typescript
export async function getWeatherInfo(location: string): Promise<WeatherInfo> {
  // 实现天气查询逻辑
  return {
    temperature: "25°C",
    condition: "晴朗",
    forecast: "未来三天都是好天气"
  };
}
```

2. **在 agentSystem.ts 注册工具**:

```typescript
const tools = {
  'voice_interaction': geminiService.voiceInteraction,
  'object_recognition': geminiService.objectRecognition,
  'get_shopping_info': geminiService.getShoppingInfo,
  'get_related_knowledge': geminiService.getRelatedKnowledge,
  'get_map': geminiService.getStaticMapImage,
  'get_weather': geminiService.getWeatherInfo, // 新增
};
```

3. **在 parseIntent 中添加识别规则**:

```typescript
function parseIntent(text: string) {
  if (text.includes('天气')) {
    return { tool: 'get_weather', isCommerce: false };
  }
  // ... 其他规则
}
```

### 处理长时间任务

对于耗时较长的任务，可以使用超时处理:

```typescript
const result = await Promise.race([
  AgentA.processUserRequest(text, context, mode),
  new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Timeout')), 10000)
  )
]);
```

AgentA 默认已经内置 30 秒超时机制。

### 错误处理最佳实践

```typescript
try {
  const result = await AgentA.processUserRequest(text, context, mode);
  
  if (result.error) {
    // ANP内部错误
    console.error('ANP Error:', result.originalError);
    showErrorMessage('服务暂时不可用');
  } else if (result.timeout) {
    // 超时
    showErrorMessage('请求超时，请重试');
  } else {
    // 正常结果
    displayResult(result);
  }
} catch (error) {
  // 网络错误或其他异常
  console.error('Unexpected error:', error);
  showErrorMessage('发生了意外错误');
}
```

---

## 性能优化建议

### 1. 避免频繁调用

使用防抖(debounce)限制请求频率:

```typescript
import { debounce } from 'lodash';

const debouncedRequest = debounce(async (text) => {
  const result = await AgentA.processUserRequest(text, context, 'text');
  // 处理结果
}, 500); // 500ms 防抖

// 用户输入时调用
debouncedRequest(userInput);
```

### 2. 缓存常见问题

```typescript
const cache = new Map<string, any>();

const getCachedResult = async (question: string, context: string) => {
  const key = `${question}:${context}`;
  
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const result = await AgentA.processUserRequest(question, context, 'text');
  cache.set(key, result);
  
  return result;
};
```

### 3. 预加载音频

音频生成较慢，可以按需加载:

```typescript
const result = await AgentA.processUserRequest(text, context, 'text');

// 先显示文本
displayText(result.text);

// 用户点击播放时再生成音频
if (result.audio_base_64) {
  playAudio(result.audio_base_64);
} else {
  // 按需生成
  const audio = await geminiService.generateMinimaxAudio(result.text);
  playAudio(audio);
}
```

---

## 故障排查

### 问题: 消息没有响应

**检查步骤**:
1. 确认 Agent B 已注册
2. 检查工具名称是否正确
3. 查看浏览器控制台错误日志
4. 启用调试模式查看消息流

```typescript
Network.enableDebugMode();
const result = await AgentA.processUserRequest(text, context, mode);
```

### 问题: API调用失败

**解决方案**:
1. 检查 `.env` 文件中的 API Key
2. 查看网络请求是否正常
3. 检查 API 配额是否用尽
4. 使用备用 API (Zhipu)

### 问题: 音频播放失败

**常见原因**:
- 浏览器不支持 AudioContext
- Base64 解码失败
- 音频格式不兼容

**解决方案**:
```typescript
try {
  await playAudio(audioBase64);
} catch (error) {
  console.error('Audio playback failed:', error);
  // 降级: 只显示文本
  displayText(result.text);
}
```

### 问题: 内存泄漏

如果长时间使用后内存占用过高:

```typescript
// 定期清理消息历史
setInterval(() => {
  Network.clearHistory();
}, 300000); // 每5分钟清理一次

// 清理音频上下文
if (audioContextRef.current) {
  audioContextRef.current.close();
  audioContextRef.current = null;
}
```

---

## 最佳实践总结

### ✅ DO (推荐)

1. **使用 AgentA 作为统一入口**
   - ✅ `await AgentA.processUserRequest(...)`
   - ❌ 不要直接调用 `geminiService`

2. **善用调试工具**
   - 开发环境启用 ANPMonitor
   - 生产环境禁用调试日志

3. **优雅处理错误**
   - 检查 `result.error` 和 `result.timeout`
   - 提供友好的用户提示

4. **性能优化**
   - 使用防抖限制请求频率
   - 缓存常见问题的结果
   - 按需加载音频

### ❌ DON'T (避免)

1. **不要绕过 ANP**
   - ❌ 直接调用 `geminiService.voiceInteraction`
   - ✅ 使用 `AgentA.processUserRequest`

2. **不要忽略错误**
   - ❌ 直接使用 `result.text` 而不检查错误
   - ✅ 先检查 `result.error` 或 `result.timeout`

3. **不要阻塞 UI**
   - ❌ 同步等待 AI 响应
   - ✅ 使用 Loading 状态 + async/await

4. **不要泄漏内存**
   - ❌ 无限累积消息历史
   - ✅ 定期清理 `Network.clearHistory()`

---

## 示例项目

完整示例代码参考:
- `components/BottomChatWidget.tsx` - 聊天组件
- `components/AgentPresenter.tsx` - 完整交互示例
- `components/VoiceInteractionPanel.tsx` - 语音交互

---

## 获取帮助

- 📖 查看 [ANP协议文档](./ANP_PROTOCOL.md)
- 📊 查看 [时序图集](./ANP_SEQUENCE_DIAGRAMS.md)
- 🐛 提交 Issue 到项目仓库
- 💬 联系技术团队

---

**祝你使用愉快！** 🎉
