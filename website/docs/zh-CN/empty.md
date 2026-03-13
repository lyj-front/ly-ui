### 类型

通过设置 `type` 属性来设置基本类型，可选值为noserver|nodata|nopower|nopage，默认为空00000。description、image属性设置后优先级高于type。

:::demo

```html
<template>
  <ly-empty type='noserver'></ly-empty>
  <ly-divider></ly-divider>
  <ly-empty type='nodata'></ly-empty>
  <ly-divider></ly-divider>
  <ly-empty type='nopower'></ly-empty>
  <ly-divider></ly-divider>
  <ly-empty type='nopage'></ly-empty>
  <ly-divider></ly-divider>
  <ly-empty type='nonetwork'></ly-empty>
  <ly-divider></ly-divider>
  <ly-empty type='noserver' description="属性优先"></ly-empty>
</template>
```

:::

## Empty 空状态

空状态时的占位提示。

### 基础用法

:::demo

```html
<template>
  <ly-empty description="描述文字"></ly-empty>
</template>
```

:::

### 自定义图片

通过设置 `image` 属性传入图片 URL。

:::demo

```html
<template>
  <ly-empty
    image="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
  ></ly-empty>
</template>
```

:::

### 图片尺寸

通过设置 `image-size` 属性来控制图片大小。

:::demo

```html
<template>
  <ly-empty :image-size="200"></ly-empty>
</template>
```

:::

### 底部内容

使用默认插槽可在底部插入内容。

:::demo

```html
<template>
  <ly-empty>
    <ly-button type="primary">按钮</ly-button>
  </ly-empty>
</template>
```

:::

### Empty Attributes

| 参数        | 说明             | 类型   | 可选值 | 默认值 |
| ----------- | ---------------- | ------ | ------ | ------ |
| image       | 图片地址         | string | —      | —      |
| image-size  | 图片大小（宽度） | number | —      | —      |
| description | 文本描述         | string | —      | —      |
| type | 文本描述         | string | noserver\|nodata\|nopower\|nopage      | —      |

### Empty Slots

| Name        | 说明           |
| ----------- | -------------- |
| default     | 自定义底部内容 |
| image       | 自定义图片     |
| description | 自定义描述文字 |
| type | 自定义图标 |
