## Descriptions 描述列表

列表形式展示多个字段。

### 基础用法

:::demo

```html
<ly-descriptions title="用户信息">
  <ly-descriptions-item label="用户名">kooriookami</ly-descriptions-item>
  <ly-descriptions-item label="手机号">18100000000</ly-descriptions-item>
  <ly-descriptions-item label="居住地">苏州市</ly-descriptions-item>
  <ly-descriptions-item label="备注">
    <ly-tag size="small">学校</ly-tag>
  </ly-descriptions-item>
  <ly-descriptions-item label="联系地址"
    >江苏省苏州市吴中区吴中大道 1188 号</ly-descriptions-item
  >
</ly-descriptions>
```

:::

### 不同尺寸

:::demo

```html
<template>
  <ly-radio-group v-model="size">
    <ly-radio label="">默认</ly-radio>
    <ly-radio label="medium">中等</ly-radio>
    <ly-radio label="small">小型</ly-radio>
    <ly-radio label="mini">超小</ly-radio>
  </ly-radio-group>

  <ly-descriptions
    class="margin-top"
    title="带边框列表"
    :column="3"
    :size="size"
    border
  >
    <template #extra>
      <ly-button type="primary" size="small">操作</ly-button>
    </template>
    <ly-descriptions-item>
      <template #label>
        <i class="el-icon-user"></i>
        用户名
      </template>
      kooriookami
    </ly-descriptions-item>
    <ly-descriptions-item>
      <template #label>
        <i class="el-icon-mobile-phone"></i>
        手机号
      </template>
      18100000000
    </ly-descriptions-item>
    <ly-descriptions-item>
      <template #label>
        <i class="el-icon-location-outline"></i>
        居住地
      </template>
      苏州市
    </ly-descriptions-item>
    <ly-descriptions-item>
      <template #label>
        <i class="el-icon-tickets"></i>
        备注
      </template>
      <ly-tag size="small">学校</ly-tag>
    </ly-descriptions-item>
    <ly-descriptions-item>
      <template #label>
        <i class="el-icon-office-building"></i>
        联系地址
      </template>
      江苏省苏州市吴中区吴中大道 1188 号
    </ly-descriptions-item>
  </ly-descriptions>

  <ly-descriptions
    class="margin-top"
    title="无边框列表"
    :column="3"
    :size="size"
  >
    <template #extra>
      <ly-button type="primary" size="small">操作</ly-button>
    </template>
    <ly-descriptions-item label="用户名">kooriookami</ly-descriptions-item>
    <ly-descriptions-item label="手机号">18100000000</ly-descriptions-item>
    <ly-descriptions-item label="居住地">苏州市</ly-descriptions-item>
    <ly-descriptions-item label="备注">
      <ly-tag size="small">学校</ly-tag>
    </ly-descriptions-item>
    <ly-descriptions-item label="联系地址"
      >江苏省苏州市吴中区吴中大道 1188 号</ly-descriptions-item
    >
  </ly-descriptions>
</template>

<script>
  export default {
    data() {
      return {
        size: '',
      }
    },
  }
</script>
```

:::

### 垂直列表

:::demo

```html
<ly-descriptions title="垂直带边框列表" direction="vertical" :column="4" border>
  <ly-descriptions-item label="用户名">kooriookami</ly-descriptions-item>
  <ly-descriptions-item label="手机号">18100000000</ly-descriptions-item>
  <ly-descriptions-item label="居住地" :span="2">苏州市</ly-descriptions-item>
  <ly-descriptions-item label="备注">
    <ly-tag size="small">学校</ly-tag>
  </ly-descriptions-item>
  <ly-descriptions-item label="联系地址"
    >江苏省苏州市吴中区吴中大道 1188 号</ly-descriptions-item
  >
</ly-descriptions>

<ly-descriptions
  class="margin-top"
  title="垂直无边框列表"
  :column="4"
  direction="vertical"
>
  <ly-descriptions-item label="用户名">kooriookami</ly-descriptions-item>
  <ly-descriptions-item label="手机号">18100000000</ly-descriptions-item>
  <ly-descriptions-item label="居住地" :span="2">苏州市</ly-descriptions-item>
  <ly-descriptions-item label="备注">
    <ly-tag size="small">学校</ly-tag>
  </ly-descriptions-item>
  <ly-descriptions-item label="联系地址"
    >江苏省苏州市吴中区吴中大道 1188 号</ly-descriptions-item
  >
</ly-descriptions>
```

:::

### 自定义样式

:::demo

```html
<ly-descriptions title="自定义样式列表" :column="3" border>
  <ly-descriptions-item
    label="用户名"
    label-align="right"
    align="center"
    label-class-name="my-label"
    class-name="my-content"
    width="150px"
    >kooriookami</ly-descriptions-item
  >
  <ly-descriptions-item label="手机号" label-align="right" align="center"
    >18100000000</ly-descriptions-item
  >
  <ly-descriptions-item label="居住地" label-align="right" align="center"
    >苏州市</ly-descriptions-item
  >
  <ly-descriptions-item label="备注" label-align="right" align="center">
    <ly-tag size="small">学校</ly-tag>
  </ly-descriptions-item>
  <ly-descriptions-item label="联系地址" label-align="right" align="center"
    >江苏省苏州市吴中区吴中大道 1188 号</ly-descriptions-item
  >
</ly-descriptions>
```

:::

### Descriptions Attributes

| 参数      | 说明                            | 类型    | 可选值                | 默认值     |
| --------- | ------------------------------- | ------- | --------------------- | ---------- |
| border    | 是否带有边框                    | boolean | —                     | false      |
| column    | 一行 `Descriptions Item` 的数量 | number  | —                     | 3          |
| direction | 排列的方向                      | string  | vertical / horizontal | horizontal |
| size      | 列表的尺寸                      | string  | medium / small / mini | —          |
| title     | 标题文本，显示在左上方          | string  | —                     | —          |
| extra     | 操作区文本，显示在右上方        | string  | —                     | —          |

### Descriptions Slots

| Name  | 说明                       |
| ----- | -------------------------- |
| title | 自定义标题，显示在左上方   |
| extra | 自定义操作区，显示在右上方 |

### Descriptions Item Attributes

| 参数             | 说明                                                                                                                                                 | 类型            | 可选值                | 默认值 |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | --------------------- | ------ |
| label            | 标签文本                                                                                                                                             | string          | —                     | —      |
| span             | 列的数量                                                                                                                                             | number          | —                     | 1      |
| width            | 列的宽度，不同行相同列的宽度按最大值设定（如无 `border` ，宽度包含标签与内容）                                                                       | string / number | —                     | —      |
| min-width        | 列的最小宽度，与 `width` 的区别是 `width` 是固定的，`min-width` 会把剩余宽度按比例分配给设置了 `min-width` 的列（如无 `border`，宽度包含标签与内容） | string / number | —                     | —      |
| align            | 列的内容对齐方式（如无 `border`，对标签和内容均生效）                                                                                                | string          | left / center / right | left   |
| label-align      | 列的标签对齐方式，若不设置该项，则使用内容的对齐方式（如无 `border`，请使用 `align` 参数）                                                           | string          | left / center / right | —      |
| class-name       | 列的内容自定义类名                                                                                                                                   | string          | —                     | —      |
| label-class-name | 列的标签自定义类名                                                                                                                                   | string          | —                     | —      |

### Descriptions Item Slots

| Name  | 说明           |
| ----- | -------------- |
| label | 自定义标签文本 |
