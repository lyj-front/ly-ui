## Button 按钮

常用的操作按钮。

### 不同尺寸

Button 组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的按钮尺寸。

:::demo 额外的尺寸：`medium`、`small`、`mini`，通过设置`size`属性来配置它们。

```html
<ly-row>
  <p>一级按钮：</p>
  <ly-button>返回</ly-button>
  <ly-button type="primary">确定</ly-button>
  <ly-button type="primary">多于四个字</ly-button>
</ly-row>
<ly-row>
  <p>二级按钮：</p>
  <ly-button size="medium">返回</ly-button>
  <ly-button size="medium" type="primary">确定</ly-button>
  <ly-button size="medium" type="primary">多于三字</ly-button>
</ly-row>
<ly-row>
  <p>弹窗按钮：</p>
  <ly-button size="small">返回</ly-button>
  <ly-button size="small" type="primary">确定</ly-button>
  <ly-button size="small" type="primary">多于两</ly-button>
</ly-row>
<ly-row>
  <p>三级按钮：</p>
  <ly-button size="mini">返回</ly-button>
  <ly-button size="mini" type="primary">确定</ly-button>
  <ly-button size="mini" type="primary">多于两</ly-button>
</ly-row>

<ly-row>
  <p>圆形按钮(不常用)：</p>
  <ly-button round>多于四个字</ly-button>
  <ly-button size="medium" round>确定</ly-button>
  <ly-button size="small" round>确定</ly-button>
  <ly-button size="mini" round>确定</ly-button>
</ly-row>
<ly-row>
  <p>图标按钮：</p>
  <ly-button icon="el-icon-search" circle></ly-button>
  <ly-button icon="el-icon-search" type="primary" circle></ly-button>
</ly-row>
```

:::

### 禁用状态

按钮不可用状态。

:::demo 你可以使用`disabled`属性来定义按钮是否可用，它接受一个`Boolean`值。

```html
<ly-row>
  <ly-button disabled>默认按钮</ly-button>
  <ly-button type="primary" disabled>主要按钮</ly-button>
</ly-row>

<ly-row>
  <ly-button plain disabled>朴素按钮</ly-button>
  <ly-button type="primary" plain disabled>主要按钮</ly-button>
  <ly-button type="success" plain disabled>成功按钮</ly-button>
  <ly-button type="info" plain disabled>信息按钮</ly-button>
  <ly-button type="warning" plain disabled>警告按钮</ly-button>
  <ly-button type="danger" plain disabled>危险按钮</ly-button>
</ly-row>
```

:::

### 文字按钮

没有边框和背景色的按钮。

:::demo

```html
<ly-button type="text">文字按钮</ly-button>
<ly-button type="text" disabled>文字按钮</ly-button>
```

:::

### 基础用法

基础的按钮用法。

:::demo 使用`type`、`plain`、`round`和`circle`属性来定义 Button 的样式。

```html
<ly-row>
  <ly-button>默认按钮</ly-button>
  <ly-button type="primary">主要按钮</ly-button>
  <ly-button type="success">成功按钮</ly-button>
  <ly-button type="info">信息按钮</ly-button>
  <ly-button type="warning">警告按钮</ly-button>
  <ly-button type="danger">危险按钮</ly-button>
</ly-row>

<ly-row>
  <ly-button plain>朴素按钮</ly-button>
  <ly-button type="primary" plain>主要按钮</ly-button>
  <ly-button type="success" plain>成功按钮</ly-button>
  <ly-button type="info" plain>信息按钮</ly-button>
  <ly-button type="warning" plain>警告按钮</ly-button>
  <ly-button type="danger" plain>危险按钮</ly-button>
</ly-row>

<ly-row>
  <ly-button round>圆角按钮</ly-button>
  <ly-button type="primary" round>主要按钮</ly-button>
  <ly-button type="success" round>成功按钮</ly-button>
  <ly-button type="info" round>信息按钮</ly-button>
  <ly-button type="warning" round>警告按钮</ly-button>
  <ly-button type="danger" round>危险按钮</ly-button>
</ly-row>

<ly-row>
  <ly-button icon="el-icon-search" circle></ly-button>
  <ly-button type="primary" icon="el-icon-edit" circle></ly-button>
  <ly-button type="success" icon="el-icon-check" circle></ly-button>
  <ly-button type="info" icon="el-icon-message" circle></ly-button>
  <ly-button type="warning" icon="el-icon-star-off" circle></ly-button>
  <ly-button type="danger" icon="el-icon-delete" circle></ly-button>
</ly-row>
```

:::

### 图标按钮

带图标的按钮可增强辨识度（有文字）或节省空间（无文字）。

:::demo 设置`icon`属性即可，icon 的列表可以参考 Element Plus 的 icon 组件，也可以设置在文字右边的 icon ，只要使用`i`标签即可，可以使用自定义图标。

```html
<ly-button type="primary" icon="el-icon-edit"></ly-button>
<ly-button type="primary" icon="el-icon-share"></ly-button>
<ly-button type="primary" icon="el-icon-delete"></ly-button>
<ly-button type="primary" icon="el-icon-search">搜索</ly-button>
<ly-button type="primary"
  >上传<i class="el-icon-upload el-icon--right"></i
></ly-button>
```

:::

### 按钮组

以按钮组的方式出现，常用于多项类似操作。

:::demo 使用`<ly-button-group>`标签来嵌套你的按钮。

```html
<ly-button-group>
  <ly-button type="primary" icon="el-icon-arrow-left">上一页</ly-button>
  <ly-button type="primary"
    >下一页<i class="el-icon-arrow-right el-icon--right"></i
  ></ly-button>
</ly-button-group>
<ly-button-group>
  <ly-button type="primary" icon="el-icon-edit"></ly-button>
  <ly-button type="primary" icon="el-icon-share"></ly-button>
  <ly-button type="primary" icon="el-icon-delete"></ly-button>
</ly-button-group>
```

:::

### 加载中

点击按钮后进行数据加载操作，在按钮上显示加载状态。

:::demo 要设置为 loading 状态，只要设置`loading`属性为`true`即可。

```html
<ly-button type="primary" :loading="true">加载中</ly-button>
```

:::

### Button Attributes

| 参数        | 说明           | 类型    | 可选值                                             | 默认值 |
| ----------- | -------------- | ------- | -------------------------------------------------- | ------ |
| size        | 尺寸           | string  | medium / small / mini                              | —      |
| type        | 类型           | string  | primary / success / warning / danger / info / text | —      |
| plain       | 是否朴素按钮   | boolean | —                                                  | false  |
| round       | 是否圆角按钮   | boolean | —                                                  | false  |
| circle      | 是否圆形按钮   | boolean | —                                                  | false  |
| loading     | 是否加载中状态 | boolean | —                                                  | false  |
| disabled    | 是否禁用状态   | boolean | —                                                  | false  |
| icon        | 图标类名       | string  | —                                                  | —      |
| autofocus   | 是否默认聚焦   | boolean | —                                                  | false  |
| native-type | 原生 type 属性 | string  | button / submit / reset                            | button |

### Button-Group Attributes

| 参数 | 说明                         | 类型   | 可选值                | 默认值 |
| ---- | ---------------------------- | ------ | --------------------- | ------ |
| size | 用于控制该按钮组内按钮的尺寸 | string | medium / small / mini | —      |

### Button-Group Slots

| Name    | Description      |
| ------- | ---------------- |
| default | 自定义按钮组内容 |
