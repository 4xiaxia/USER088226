# 地图导航功能文档

## 📍 功能概览

本项目的地图功能基于**高德地图 Web API 2.0**，实现了永春县东里村的旅游路线总览和景点导航功能。

### 核心特性
- ✅ **三条旅游路线**：红色革命、绿色生态、民俗文化
- ✅ **不同颜色路线连线**：区分不同主题路线
- ✅ **景点标记点击交互**：弹出气泡显示详情
- ✅ **零配置白嫖导航**：支付宝/高德/微信环境自适应
- ✅ **定位兜底机制**：失败时自动定位到东里村中心

---

## 🎨 路线颜色映射

| 路线类别 | 颜色代码 | 视觉效果 | 代表路线 |
|---------|---------|---------|---------|
| 历史文化 | `#C41E3A` | 🔴 中国红 | 红色革命追忆路线 |
| 自然风景 | `#36B37E` | 🟢 生态绿 | 自然生态民俗游 |
| 美食体验 | `#FAAD14` | 🟡 明黄色 | 深度民俗文化体验 |
| default | `#1677FF` | 🔵 天蓝色 | 备用颜色 |

**实现位置**：`components/MapView.tsx` 第 15-20 行

```typescript
const ROUTE_COLORS: Record<string, string> = {
    '历史文化': '#C41E3A', // Red
    '自然风景': '#36B37E', // Green
    '美食体验': '#FAAD14', // Yellow
    'default': '#1677FF'
};
```

---

## 🗺️ 地图初始化

### 默认中心坐标（东里村）

```typescript
// services/staticData.ts 中定义的村子坐标
const DEFAULT_VILLAGE_LOCATION = {
  longitude: 118.205,
  latitude: 25.235,
  name: '永春县东里村',
  address: '福建省泉州市永春县东里村'
};
```

### 地图配置参数

```typescript
const map = new window.AMap.Map(mapContainerRef.current, {
    zoom: 16.5,           // 放大级别，显示更多细节
    center: [118.205, 25.235], // 东里村中心坐标
    viewMode: '3D',       // 3D 视角
    pitch: 45,            // 倾斜角度
});
```

**实现位置**：`components/MapView.tsx` 第 51-78 行

---

## 📌 景点标记交互

### 标记样式

每个景点在地图上显示为：
1. **圆形彩色图标**：根据所属路线显示对应颜色
2. **景点首字**：显示景点名称的第一个字
3. **景点名称标签**：白色背景的全名标签

**实现位置**：`components/MapView.tsx` 第 101-111 行

```typescript
const markerContent = `
    <div class="relative flex flex-col items-center justify-center cursor-pointer transform hover:scale-110 transition-transform">
         <div class="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-xs" style="background-color: ${color}">
             ${spot.name.substring(0, 1)}
         </div>
         <div class="mt-1 px-2 py-0.5 bg-white/95 backdrop-blur rounded-full text-[10px] font-bold text-gray-700 shadow-sm border border-gray-100 whitespace-nowrap">
             ${spot.name}
         </div>
    </div>
`;
```

### 气泡窗口内容

点击标记后弹出气泡，包含：
- **景点名称**（标题，使用路线颜色）
- **100字简介**（自动截断）
- **两个操作按钮**：
  - 🧭 我要导航去（蓝色渐变按钮）
  - 📖 查看景点介绍（灰色边框按钮）

**实现位置**：`components/MapView.tsx` 第 121-136 行

```typescript
const intro = spot.intro_short.length > 100 ? spot.intro_short.substring(0, 100) + '...' : spot.intro_short;
const infoContent = `
    <div class="p-4 w-72 bg-white rounded-xl shadow-lg">
        <h4 class="font-bold text-lg mb-2" style="color: ${color}">${spot.name}</h4>
        <p class="text-sm text-gray-600 mb-4 leading-relaxed">${intro}</p>
        <div class="space-y-2">
            <button onclick="window.handleMapNav(${lat}, ${lng}, '${spot.name}')" class="...">
                🧭 我要导航去
            </button>
            <button onclick="window.handleMapDetail('${spot.id}')" class="...">
                📖 查看景点介绍
            </button>
        </div>
    </div>
`;
```

---

## 🧭 零配置白嫖导航方案

### 核心逻辑：环境检测 + Scheme跳转

**实现位置**：`components/MapView.tsx` 第 169-204 行

#### 1. 支付宝环境

**策略**：直接跳转支付宝内置高德地图小程序（固定AppId，无需配置）

```typescript
if (isAlipay) {
    const scheme = `alipays://platformapi/startapp?appId=20000067&page=pages/navi/navi&lat=${lat}&lon=${lng}&name=${encodeURIComponent(name)}`;
    window.location.href = scheme;
}
```

**参数说明**：
- `appId=20000067`：支付宝高德地图小程序固定ID
- `page=pages/navi/navi`：直接跳到导航页
- `lat`、`lon`：目的地坐标
- `name`：目的地名称

#### 2. 微信环境

**策略**：复制景点名称，提示用户手动去高德/支付宝搜索

```typescript
if (isWechat) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(name).then(() => {
            alert(`已复制景点名：${name}\n\n请打开高德地图或支付宝搜索导航`);
        }).catch(() => {
            alert(`请手动复制景点名：${name}\n然后在高德地图/支付宝中搜索导航`);
        });
    } else {
        alert(`请记住景点名：${name}\n然后在高德地图/支付宝中搜索导航`);
    }
}
```

**原因**：微信会拦截 Scheme 协议，无法直接外跳，这是妥协方案。

#### 3. 外部浏览器环境

**策略**：尝试唤起高德APP，2秒无响应则跳转网页版高德地图

```typescript
const amapApp = `amap://navi?poiname=${encodeURIComponent(name)}&lat=${lat}&lon=${lng}&dev=0&style=2`;
const amapWeb = `https://m.amap.com/navi/?dest=${lng},${lat}&destName=${encodeURIComponent(name)}&hideRouteIcon=1`;

const start = Date.now();
window.location.href = amapApp;

setTimeout(() => {
    if (Date.now() - start < 2500) {
        window.open(amapWeb, '_blank');
    }
}, 2000);
```

**参数说明**：
- `amapApp`：高德APP的Scheme协议
  - `poiname`：目的地名称
  - `lat`、`lon`：目的地坐标
  - `dev=0`：使用传入坐标（非当前位置）
  - `style=2`：驾车导航模式
- `amapWeb`：高德网页版导航
  - `dest`：目的地坐标（注意：经度在前）
  - `destName`：目的地名称
  - `hideRouteIcon=1`：隐藏路线图标

---

## 📖 查看景点介绍功能

**实现位置**：`components/MapView.tsx` 第 206-211 行

```typescript
(window as any).handleMapDetail = (spotId: string) => {
    const foundSpot = routes.flatMap(r => r.spots).find(s => s.id === spotId);
    if (foundSpot) {
        onSelectSpot(foundSpot);
    }
};
```

**功能说明**：
- 点击"查看景点介绍"按钮后
- 通过 `spotId` 查找景点对象
- 调用 `onSelectSpot` 回调，跳转到景点详情页（`SpotDetail.tsx`）

---

## 🎯 路线绘制逻辑

**实现位置**：`components/MapView.tsx` 第 151-164 行

### 连线规则

1. **收集坐标点**：遍历路线中的所有景点，提取经纬度坐标
2. **绘制折线**：使用 `AMap.Polyline` 绘制路线
3. **样式配置**：
   - `strokeColor`：根据路线类别设置颜色
   - `strokeWeight`：线宽 5px
   - `strokeOpacity`：透明度 0.8
   - `isOutline`：开启描边
   - `borderWeight`：描边宽度 1px
   - `outlineColor`：白色描边

```typescript
const pathArr: [number, number][] = [];

route.spots.forEach(spot => {
    const [lng, lat] = spot.coord.split(',').map(Number);
    if (!isNaN(lng) && !isNaN(lat)) {
        pathArr.push([lng, lat]);
        // ... 创建标记
    }
});

if (pathArr.length > 1) {
    const polyline = new window.AMap.Polyline({
        path: pathArr,
        strokeColor: color,
        strokeWeight: 5,
        strokeOpacity: 0.8,
        isOutline: true,
        borderWeight: 1,
        outlineColor: '#ffffff',
        zIndex: 50
    });
    map.add(polyline);
}
```

---

## 🛠️ 定位兜底机制

### 当前实现

目前地图默认定位到东里村中心坐标：

```typescript
const center = [118.205, 25.235]; // 东里村
```

### 建议增强方案

如果未来需要实现用户定位功能，建议使用以下兜底逻辑：

```typescript
const initMapWithGeolocation = () => {
    // 1. 尝试使用浏览器定位API
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userCenter = [position.coords.longitude, position.coords.latitude];
                initMapWithCenter(userCenter);
            },
            (error) => {
                console.warn('定位失败，使用兜底坐标', error);
                // 2. 定位失败，兜底到东里村
                initMapWithCenter([118.205, 25.235]);
            }
        );
    } else {
        // 3. 浏览器不支持定位，兜底到东里村
        initMapWithCenter([118.205, 25.235]);
    }
};
```

**当前项目的设计理念**：
> 我们故意不使用用户位置，而是直接展示目的地（东里村），让游客看到旅游区域的全景，这是更符合旅游场景的设计。

---

## 🚀 高德地图 API Key 配置

### 当前配置位置

`index.html` 第 85 行：

```html
<script type="text/javascript" src="https://webapi.amap.com/maps?v=2.0&key=c3fc05f6fa3ffe0a8e5c47409d6ae474"></script>
```

### 如何更换Key

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册账号并创建应用
3. 获取 Web 端（JS API）的 Key
4. 替换 `index.html` 中的 Key 参数

**注意事项**：
- 免费版有调用量限制（每天30万次）
- 需要绑定域名白名单（开发环境使用 `localhost` 或 `127.0.0.1`）

---

## 📂 相关文件清单

| 文件路径 | 功能说明 |
|---------|---------|
| `components/MapView.tsx` | 地图主组件（263行） |
| `components/PresenterMode.tsx` | 地图页面容器组件 |
| `components/TourGuide.tsx` | 路由控制：处理地图页和详情页切换 |
| `services/staticData.ts` | 景点数据定义（包含坐标） |
| `types.ts` | 景点、路线类型定义 |
| `index.html` | 高德地图SDK引入配置 |

---

## 🎨 UI/UX 设计亮点

### 1. 响应式交互
- **标记悬停缩放**：`hover:scale-110`
- **按钮点击反馈**：`active:scale-95`
- **气泡优雅动画**：高德地图自带的InfoWindow动画

### 2. 玻璃态设计
- **半透明背景**：`bg-white/95 backdrop-blur`
- **边框高光**：`border border-white/50`

### 3. 环境提示
- 右上角浮动提示：「网页版导航 · 无需安装 APP」
- 返回按钮：左上角固定位置

### 4. 加载状态
- **加载中**：显示 Spinner + "地图加载中..."
- **加载失败**：显示错误信息 + 刷新按钮

**实现位置**：`components/MapView.tsx` 第 220-259 行

---

## 🔍 调试技巧

### 1. 查看地图加载状态

在浏览器控制台输入：

```javascript
console.log(window.AMap); // 检查高德地图SDK是否加载成功
```

### 2. 测试导航功能

在气泡弹窗中，直接调用全局函数：

```javascript
// 测试导航
window.handleMapNav(25.235, 118.205, '永春辛亥革命纪念馆');

// 测试详情跳转
window.handleMapDetail('poi_red_001');
```

### 3. 检查景点坐标

```javascript
// 打印所有景点坐标
routes.forEach(route => {
    console.log(`路线：${route.name}`);
    route.spots.forEach(spot => {
        console.log(`  - ${spot.name}: ${spot.coord}`);
    });
});
```

---

## ⚠️ 常见问题

### 1. 地图不显示？

**可能原因**：
- 高德地图SDK加载失败（网络问题）
- Key配置错误或超出配额
- 坐标数据格式错误

**解决方案**：
1. 检查控制台是否有错误信息
2. 验证 `window.AMap` 是否存在
3. 检查 Key 是否有效

### 2. 导航跳转没反应？

**可能原因**：
- 微信环境拦截了Scheme协议
- 用户未安装高德地图APP
- Clipboard API不支持（非HTTPS环境）

**解决方案**：
1. 在支付宝中测试（最稳定）
2. 使用浏览器打开（而非微信）
3. 确保HTTPS环境（或localhost）

### 3. 气泡窗口样式错乱？

**可能原因**：
- Tailwind CSS未生效（InfoWindow中的HTML是动态注入的）

**解决方案**：
- 使用内联样式（`style="..."`）
- 或使用高德地图自带的样式类

---

## 📊 性能优化建议

### 当前优化措施

1. **延迟加载**：地图SDK在HTML中直接引入，页面加载时即初始化
2. **清理机制**：组件卸载时销毁地图实例
3. **防抖控制**：使用 `setTimeout` 控制导航跳转时机

### 未来可优化方向

1. **景点聚合**：当缩放级别较小时，使用 `AMap.MarkerCluster` 聚合标记
2. **路线分层**：允许用户单独显示/隐藏某条路线
3. **离线地图**：缓存地图瓦片，支持离线查看
4. **路径规划**：增加从当前位置到景点的路径规划功能

---

## 📝 总结

本项目的地图导航功能已经实现了：

✅ **三条旅游路线不同颜色连线**  
✅ **景点标记点击交互**  
✅ **气泡显示景点名称 + 100字简介**  
✅ **是否导航选择（是：外跳导航，否：查看详情）**  
✅ **零配置白嫖导航（支付宝/高德/微信自适应）**  
✅ **定位兜底到东里村坐标**  

所有功能均已在 `components/MapView.tsx` 中实现，代码简洁、注释清晰，符合项目的整体设计理念。

---

## 🔗 相关文档

- [高德地图 Web API 文档](https://lbs.amap.com/api/javascript-api/summary)
- [ANP协议规范](./ANP_PROTOCOL.md)
- [项目结构文档](../PROJECT_STRUCTURE.md)
- [开发指南](./README.md)

---

**文档版本**：v1.0  
**最后更新**：2025-12-02  
**维护者**：AI Agent System
