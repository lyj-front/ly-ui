## Steps 步骤条

引导用户按照流程完成任务的分步导航条，可根据实际应用场景设定步骤，步骤不得少于 2 步。

### 基础用法

简单的步骤条。

:::demo 设置`active`属性，接受一个`Number`，表明步骤的 index，从 0 开始。需要定宽的步骤条时，设置`space`属性即可，它接受`Number`，单位为`px`，如果不设置，则为自适应。设置`finish-status`属性可以改变已经完成的步骤的状态。

```html
<ly-steps :active="active" finish-status="success">
  <ly-step title="步骤 1"></ly-step>
  <ly-step title="步骤 2"></ly-step>
  <ly-step title="步骤 3"></ly-step>
</ly-steps>

<ly-button style="margin-top: 12px;" @click="next">下一步</ly-button>

<script>
  export default {
    data() {
      return {
        active: 0,
      }
    },

    methods: {
      next() {
        if (this.active++ > 2) this.active = 0
      },
    },
  }
</script>
```

:::

### 含状态步骤条

每一步骤显示出该步骤的状态。

:::demo 也可以使用`title`具名分发，可以用`slot`的方式来取代属性的设置，在本文档最后的列表中有所有的 slot name 可供参考。

```html
<ly-steps :space="200" :active="1" finish-status="success">
  <ly-step title="已完成" description="这是一段很长很长很长的描述性文字"></ly-step>
  <ly-step title="进行中" description="这是一段很长很长很长的描述性文字"></ly-step>
  <ly-step title="步骤 3"></ly-step>
</ly-steps>
```

:::

### 有描述的步骤条

每个步骤有其对应的步骤状态描述。

:::demo

```html
<ly-steps :active="1">
  <ly-step
    title="步骤 1"
    description="这是一段很长很长很长的描述性文字"
  ></ly-step>
  <ly-step
    title="步骤 2"
    description="这是一段很长很长很长的描述性文字"
  ></ly-step>
  <ly-step title="步骤 3" description="这段就没那么长了"></ly-step>
</ly-steps>
```

:::

### 居中的步骤条

标题和描述都将居中。

:::demo

```html
<ly-steps :active="2" align-center>
  <ly-step
    title="步骤1"
    description="这是一段很长很长很长的描述性文字"
  ></ly-step>
  <ly-step
    title="步骤2"
    description="这是一段很长很长很长的描述性文字"
  ></ly-step>
  <ly-step
    title="步骤3"
    description="这是一段很长很长很长的描述性文字"
  ></ly-step>
  <ly-step
    title="步骤4"
    description="这是一段很长很长很长的描述性文字"
  ></ly-step>
</ly-steps>
```

:::


### Steps Attributes

| 参数           | 说明                                               | 类型            | 可选值                                    | 默认值     |
| -------------- | -------------------------------------------------- | --------------- | ----------------------------------------- | ---------- |
| space          | 每个 step 的间距，不填写将自适应间距。支持百分比。 | number / string | —                                         | —          |
| direction      | 显示方向                                           | string          | vertical/horizontal                       | horizontal |
| active         | 设置当前激活步骤                                   | number          | —                                         | 0          |
| process-status | 设置当前步骤的状态                                 | string          | wait / process / finish / error / success | process    |
| finish-status  | 设置结束步骤的状态                                 | string          | wait / process / finish / error / success | finish     |
| align-center   | 进行居中对齐                                       | boolean         | -                                         | false      |
| simple         | 是否应用简洁风格                                   | boolean         | -                                         | false      |

### Step Attributes

| 参数        | 说明                                            | 类型                                                       | 可选值 | 默认值 |
| ----------- | ----------------------------------------------- | ---------------------------------------------------------- | ------ | ------ |
| title       | 标题                                            | string                                                     | —      | —      |
| description | 描述性文字                                      | string                                                     | —      | —      |
| icon        | 图标                                            | 传入 icon 的 class 全名来自定义 icon，也支持 slot 方式写入 | string | —      |
| status      | 设置当前步骤的状态，不设置则根据 steps 确定状态 | wait / process / finish / error / success                  | -      |

### Step Slot

| name        | 说明             |
| ----------- | ---------------- |
| icon        | 自定义图标       |
| title       | 自定义标题       |
| description | 自定义描述性文字 |
