
# 皮影戏功能集成指南

本指南将帮助你将皮影戏功能集成到现有的 Web 项目中（包括原生 HTML/JS、React、Vue 等）。

## 1. 核心文件准备

我们已经将核心逻辑封装为一个独立的 ES Module 类库：`ShadowPuppetSDK.js`。

你需要做两件事：
1. 将 `ShadowPuppetSDK.js` 复制到你的项目源代码目录（如 `src/utils/` 或 `js/`）。
2. 将 `assets` 文件夹（包含所有图片资源）复制到你的项目静态资源目录（如 `public/assets/` 或 `static/assets/`）。

## 2. 依赖引入

该项目依赖 MediaPipe 库进行手势识别。由于 MediaPipe 模型较大，建议通过 CDN 引入。

在你的 HTML 文件（或 `index.html` 模板）的 `<head>` 或 `<body>` 底部添加：

```html
<!-- MediaPipe 依赖 -->
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" crossorigin="anonymous"></script>
```

## 3. 基本使用（原生 JS）

```html
<!-- 容器 -->
<div id="my-puppet-stage" style="width: 800px; height: 600px;"></div>

<script type="module">
    import ShadowPuppetApp from './path/to/ShadowPuppetSDK.js';

    // 初始化
    const app = new ShadowPuppetApp('my-puppet-stage', {
        assetsPath: './assets/images/', // 指向你的图片资源目录
        width: 1400,
        height: 1100,
        debug: true // 是否显示手势骨架调试窗口
    });

    // 启动
    app.start().then(() => {
        console.log('皮影戏启动成功');
    }).catch(err => {
        console.error('启动失败', err);
    });

    // 停止
    // app.stop();
</script>
```

## 4. React 集成示例

```jsx
import React, { useEffect, useRef } from 'react';
import ShadowPuppetApp from './utils/ShadowPuppetSDK'; // 假设你把 SDK 放在这里

const ShadowPlayComponent = () => {
    const containerRef = useRef(null);
    const appRef = useRef(null);

    useEffect(() => {
        // 确保 MediaPipe 脚本已加载
        if (!window.Hands || !window.Camera) {
            console.error('请在 index.html 中引入 MediaPipe 脚本');
            return;
        }

        if (containerRef.current && !appRef.current) {
            appRef.current = new ShadowPuppetApp(containerRef.current.id, {
                assetsPath: '/assets/images/', // 根据你的 public 目录结构调整
                width: 1400,
                height: 1100
            });
            
            appRef.current.start();
        }

        // 清理函数
        return () => {
            if (appRef.current) {
                appRef.current.stop();
            }
        };
    }, []);

    return (
        <div 
            id="puppet-container" 
            ref={containerRef} 
            style={{ width: '100%', height: '600px', background: '#000' }}
        />
    );
};

export default ShadowPlayComponent;
```

## 5. Vue 集成示例

```vue
<template>
  <div id="puppet-stage" ref="stage" class="stage"></div>
</template>

<script>
import ShadowPuppetApp from '@/utils/ShadowPuppetSDK.js';

export default {
  data() {
    return {
      app: null
    };
  },
  mounted() {
    this.initPuppet();
  },
  beforeDestroy() {
    if (this.app) {
      this.app.stop();
    }
  },
  methods: {
    initPuppet() {
      // 确保容器 ID 唯一
      this.app = new ShadowPuppetApp('puppet-stage', {
        assetsPath: '/assets/images/',
        width: 1400,
        height: 1100
      });
      
      this.app.start().catch(err => {
        console.error('Failed to start puppet:', err);
      });
    }
  }
}
</script>

<style scoped>
.stage {
  width: 100%;
  height: 600px;
  background: #1a1a1a;
}
</style>
```

## 6. 注意事项

1.  **资源路径**：最常见的问题是图片加载失败。请确保 `assetsPath` 正确指向了存放图片的文件夹，并且该文件夹可以通过 HTTP 访问。
2.  **HTTPS**：由于需要调用摄像头，现代浏览器强制要求在 HTTPS 环境下运行（`localhost` 除外）。部署到生产环境时请务必使用 HTTPS。
3.  **容器大小**：SDK 会创建一个 Canvas 填充容器。建议给容器设置固定的宽高或响应式宽高。
4.  **性能**：MediaPipe 手势识别比较消耗 CPU/GPU。在移动端可能会有发热现象。

## 7. SDK API 参考

### `new ShadowPuppetApp(containerId, options)`

-   `containerId`: DOM 元素的 ID。
-   `options`:
    -   `assetsPath`: 图片资源根路径 (默认: `./assets/images/`)
    -   `width`: 内部 Canvas 宽度 (默认: 1400)
    -   `height`: 内部 Canvas 高度 (默认: 1100)
    -   `debug`: 是否显示手势调试小窗口 (默认: false)

### 方法

-   `start()`: 异步方法，加载资源并启动摄像头。
-   `stop()`: 停止动画循环和视频流。
