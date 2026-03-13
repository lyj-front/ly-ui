# 快速上手

本节将介绍如何在项目中使用 LyUi。

## 使用组件

### 完整引入所有组件

> main.ts

```typescript
import { createApp } from 'vue'
import LyUi from 'ly-ui'
import locale from 'ly-ui/lib/locale/lang/zh-cn'
import 'ly-ui/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(LyUi, { locale })
app.mount('#app')
```

### 按需引入组件

`LyUi`的 JS 代码默认支持基于 ES modules 的 [摇树 tree shaking](https://webpack.js.org/guides/tree-shaking/)。

> App.vue

```html
<template>
  <ly-button> 我是 LyButton </ly-button>
</template>
<script>
  import { defineComponent } from 'vue'
  import { LyButton } from 'ly-ui'

  export default defineComponent({
    name: 'app'
    components: {
      LyButton,
    },
  })
</script>
```

### 样式的引入

我们**强烈建议直接引入全部的样式文件**，虽然这看起来会增大整个应用的体积，但这样做可以避免引入额外的打包工具插件（减少负担），你还可以通过 [CDN](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/)
的方式来加载样式文件，从而使得你的应用加载更快。

通过 JS 的方式引入

```typescript
import 'ly-ui/dist/index.css'
```

如果你想让样式也按需引入，你可以使用对应工具提供的插件来引用。请看[常见问题](/#/zh-CN/component/quickstart#chang-jian-wen-ti)

## 快捷搭建项目模板

### 使用 lyj-cli@1.3

我们为新版的 lyj-cli 准备了相应的
[Ly Ui 插件]你可以用它们快速地搭建一个基于
Ly Ui 的项目。

## 全局配置

在引入 LyUi 时，可以传入一个全局配置对象。该对象目前支持 `size` 与 `zIndex` 字段。`size`
用于改变组件的默认尺寸，`zIndex` 设置弹框的初始 z-index（默认值：2000）。按需引入 LyUi 的方式，具体操作如下：

完整引入 LyUi：

```js
import { createApp } from 'vue'
import LyUi from 'ly-ui'
import App from './App.vue'

const app = createApp(App)
app.use(LyUi, { size: 'small', zIndex: 3000 })
```

按需引入 LyUi:

```js
import { createApp } from 'vue'
import { LyButton } from 'ly-ui'
import App from './App.vue'

const app = createApp(App)
app.config.globalProperties.$ELEMENT = option
app.use(LyButton)
```

按照以上设置，项目中所有拥有 `size` 属性的组件的默认尺寸均为 'small'，弹框的初始 z-index 为 3000。

## 使用 Nuxt.js

我们还可以使用 [Nuxt.js](https://nuxtjs.org)：

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe src="https://glitch.com/embed/#!/embed/nuxt-with-element?path=nuxt.config.js&previewSize=0&attributionHidden=true" alt="nuxt-with-element on glitch" style="height: 100%; width: 100%; border: 0;"></iframe>
</div>

## 开始使用

至此，一个基于 Vue 和 LyUi 的开发环境已经搭建完毕，现在就可以编写代码了。各个组件的使用方法请参阅它们各自的文档。

## 常见问题

### 我想同时按需引入组件和样式，我应该怎么做？

#### 使用 vite 按需加载样式

如果你使用 [vite](https://vitejs.dev) 作为构建打包工具，那么你需要先安装 `vite-plugin-element-plus` 来实现按需加载样式

```shell
yarn add vite-plugin-element-plus -D
# 或
npm install vite-plugin-element-plus -D
```

然后将如下代码添加至 `vite.config.js` 文件中:

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VitePluginElementPlus from 'vite-plugin-element-plus'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      VitePluginElementPlus({
        // 如果你需要使用 [component name].scss 源文件，你需要把下面的注释取消掉。
        // 对于所有的 API 你可以参考 https://github.com/element-plus/vite-plugin-element-plus
        // 的文档注释
        // useSource: true
        format: mode === 'development' ? 'esm' : 'cjs',
      }),
    ],
  }
})
```

#### 使用 webpack 按需加载样式

如果你使用 webpack 作为构建打包工具，那么你需要先安装 `babel-plugin-import` 来实现按需加载样式

```shell
yarn add babel-plugin-import -D
# 或
npm install babel-plugin-import -D
```

然后你需要将以下代码加入你的 `babel.config.js` 文件中。

> babel.config.js

```javascript
module.exports = {
  plugins: [
    [
      'import',
      {
        libraryName: 'ly-ui',
        // 引入组件
        customName: (name) => {
          name = name.slice(3)
          return `ly-ui/lib/components/${name}`
        },
        // 引入样式
        customStyleName: (name) => {
          name = name.slice(3)
          // 如果你需要引入 [name].scss 文件，你需要用下面这行
          // return `ly-ui/lib/components/${name}/style`
          // 引入 [name].css
          return `ly-ui/lib/components/${name}/style/css`
        },
      },
    ],
  ],
}
```
