## Dropdown 下拉菜单

将动作或菜单折叠到下拉菜单中。

### 基础用法

移动到下拉菜单上，展开更多操作。

:::demo 通过组件`slot`来设置下拉触发的元素以及需要通过具名`slot`为`dropdown` 来设置下拉菜单。默认情况下，下拉按钮只要`hover`即可，无需点击也会显示下拉菜单。

```html
<ly-dropdown trigger="click">
  <span class="el-dropdown-link">下拉菜单</span>
  <template #dropdown>
    <ly-dropdown-menu>
      <ly-dropdown-item>黄金糕</ly-dropdown-item>
      <ly-dropdown-item>狮子头</ly-dropdown-item>
      <ly-dropdown-item>螺蛳粉</ly-dropdown-item>
      <ly-dropdown-item disabled>双皮奶</ly-dropdown-item>
      <ly-dropdown-item divided>蚵仔煎</ly-dropdown-item>
    </ly-dropdown-menu>
  </template>
</ly-dropdown>

<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
    font-size: 12px;
  }
</style>
```
:::

### 呈现类型

配置下拉触发元素呈现类型
:::demo 可通过 `type` 属性配置下拉触发元素呈现类型。默认`button`按钮类型
```html
    <ly-dropdown>
      <span class="el-dropdown-link">按钮类型</span>
      <template #dropdown>
        <ly-dropdown-menu>
          <ly-dropdown-item>黄金糕</ly-dropdown-item>
          <ly-dropdown-item>狮子头</ly-dropdown-item>
          <ly-dropdown-item>螺蛳粉</ly-dropdown-item>
          <ly-dropdown-item>双皮奶</ly-dropdown-item>
          <ly-dropdown-item>蚵仔煎</ly-dropdown-item>
        </ly-dropdown-menu>
      </template>
    </ly-dropdown>

    <ly-dropdown type="text">
      <span class="el-dropdown-link">文本类型</span>
      <template #dropdown>
        <ly-dropdown-menu>
          <ly-dropdown-item>黄金糕</ly-dropdown-item>
          <ly-dropdown-item>狮子头</ly-dropdown-item>
          <ly-dropdown-item>螺蛳粉</ly-dropdown-item
          >
          <ly-dropdown-item>双皮奶</ly-dropdown-item>
          <ly-dropdown-item>蚵仔煎</ly-dropdown-item>
        </ly-dropdown-menu>
      </template>
    </ly-dropdown>
```
:::
### 触发方式

可以配置 click 激活或者 hover 激活。

:::demo 在`trigger`属性设置为`click`即可。

```html
<ly-row class="block-col-2">
  <ly-col :span="8">
    <span class="demonstration">hover 激活</span>
    <ly-dropdown :menu-width="120">
      <span class="el-dropdown-link">下拉菜单</span>
      <template #dropdown>
        <ly-dropdown-menu>
          <ly-dropdown-item icon="el-icon-plus">黄金糕</ly-dropdown-item>
          <ly-dropdown-item icon="el-icon-circle-plus">狮子头</ly-dropdown-item>
          <ly-dropdown-item icon="el-icon-circle-plus-outline"
            >螺蛳粉</ly-dropdown-item
          >
          <ly-dropdown-item icon="el-icon-check">双皮奶</ly-dropdown-item>
          <ly-dropdown-item icon="el-icon-circle-check"
            >蚵仔煎</ly-dropdown-item
          >
        </ly-dropdown-menu>
      </template>
    </ly-dropdown>
  </ly-col>
  <ly-col :span="8">
    <span class="demonstration">click 激活</span>
    <ly-dropdown trigger="click">
      <span class="el-dropdown-link">下拉菜单</span>
      <template #dropdown>
        <ly-dropdown-menu>
          <ly-dropdown-item icon="el-icon-plus">黄金糕</ly-dropdown-item>
          <ly-dropdown-item icon="el-icon-circle-plus">狮子头</ly-dropdown-item>
          <ly-dropdown-item icon="el-icon-circle-plus-outline"
            >螺蛳粉</ly-dropdown-item
          >
          <ly-dropdown-item icon="el-icon-check">双皮奶</ly-dropdown-item>
          <ly-dropdown-item icon="el-icon-circle-check"
            >蚵仔煎</ly-dropdown-item
          >
        </ly-dropdown-menu>
      </template>
    </ly-dropdown>
  </ly-col>
  <ly-col :span="8">
    <span class="demonstration">右键(contextmenu) 激活</span>
    <ly-dropdown trigger="contextmenu">
      <span class="el-dropdown-link">下拉菜单</span>
      <template #dropdown>
        <ly-dropdown-menu>
          <ly-dropdown-item icon="el-icon-plus">黄金糕</ly-dropdown-item>
          <ly-dropdown-item icon="el-icon-circle-plus">狮子头</ly-dropdown-item>
          <ly-dropdown-item icon="el-icon-circle-plus-outline"
            >螺蛳粉</ly-dropdown-item
          >
          <ly-dropdown-item icon="el-icon-check">双皮奶</ly-dropdown-item>
          <ly-dropdown-item icon="el-icon-circle-check"
            >蚵仔煎</ly-dropdown-item
          >
        </ly-dropdown-menu>
      </template>
    </ly-dropdown>
  </ly-col>
</ly-row>

<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
    font-size: 12px;
  }
  .demonstration {
    display: block;
    color: var(--el-text-color-secondary);
    font-size: 14px;
    margin-bottom: 20px;
  }
</style>
```

:::

### 菜单隐藏方式

可以`hide-on-click`属性来配置。

:::demo 下拉菜单默认在点击菜单项后会被隐藏，将`hide-on-click`属性默认为`false`可以关闭此功能。

```html
<ly-dropdown :hide-on-click="false">
  <span class="el-dropdown-link">下拉菜单</span>
  <template #dropdown>
    <ly-dropdown-menu>
      <ly-dropdown-item>黄金糕</ly-dropdown-item>
      <ly-dropdown-item>狮子头</ly-dropdown-item>
      <ly-dropdown-item>螺蛳粉</ly-dropdown-item>
      <ly-dropdown-item disabled>双皮奶</ly-dropdown-item>
      <ly-dropdown-item divided>蚵仔煎</ly-dropdown-item>
    </ly-dropdown-menu>
  </template>
</ly-dropdown>

<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
    font-size: 12px;
  }
</style>
```

:::

### 指令事件

点击菜单项后会触发事件，用户可以通过相应的菜单项 key 进行不同的操作

:::demo

```html
<ly-dropdown @command="handleCommand">
  <span class="el-dropdown-link">下拉菜单</span>
  <template #dropdown>
    <ly-dropdown-menu>
      <ly-dropdown-item command="a">黄金糕</ly-dropdown-item>
      <ly-dropdown-item command="b">狮子头</ly-dropdown-item>
      <ly-dropdown-item command="c">螺蛳粉</ly-dropdown-item>
      <ly-dropdown-item command="d" disabled>双皮奶</ly-dropdown-item>
      <ly-dropdown-item command="e" divided>蚵仔煎</ly-dropdown-item>
    </ly-dropdown-menu>
  </template>
</ly-dropdown>

<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
    font-size: 12px;
  }
</style>

<script>
  export default {
    methods: {
      handleCommand(command) {
        this.$message('click on item ' + command)
      },
    },
  }
</script>
<!--
<setup>

  import { defineComponent } from 'vue';
  import { LyMessage } from 'ly-ui';

  export default defineComponent({
    setup() {

      const handleCommand = (command) => {
        LyMessage(`click on item ${command}`);
      };
      return {
        handleCommand,
      };
    },
  });

</setup>
-->
```

:::


### Dropdown Attributes

| 参数          | 说明                                                                                                     | 类型          | 可选值                                               | 默认值 |
| --------------| -------------------------------------------------------------------------------------------------------- | --------------| ---------------------------------------------------- | ------ |
| type         | 下拉触发元素呈现类型                        | string | text/button                                               | button        |
| prop-class    | 传给下拉列表的样式，支持修改默认样式                     | string          | —                                                    | —      |
| max-height    | 菜单最大高度                                                                                             | string / number | —                                                    | —      |
| menu-width    | 菜单的宽度，按钮类型默认按钮的宽度                                                                        | string / number | —                                                    | —      |
| disabled      | 是否禁用                                                                                                 | boolean         | —                                                    | false  |
| placement     | 菜单弹出位置                                                                                             | string          | top/top-start/top-end/bottom/bottom-start/bottom-end | bottom-start |
| trigger       | 触发下拉的行为                                                                                           | string          | hover, click, contextmenu                            | hover  |
| hide-on-click | 是否在点击菜单项后隐藏菜单                                                                               | boolean         | —                                                    | true   |
| show-timeout  | 展开下拉菜单的延时（仅在 trigger 为 hover 时有效）                                                       | number          | —                                                    | 250    |
| hide-timeout  | 收起下拉菜单的延时（仅在 trigger 为 hover 时有效）                                                       | number          | —                                                    | 150    |
| tabindex      | Dropdown 组件的 [tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) | number          | —                                                    | 0      |

### Dropdown Slots

| Name     | 说明                                                       |
| -------- | ---------------------------------------------------------- |
| —        | 触发下拉列表显示的元素。 注意： 必须是一个元素或者或者组件 |
| dropdown | 下拉列表，通常是 `<ly-dropdown-menu>` 组件                 |

### Dropdown Events

| 事件名称       | 说明                                          | 回调参数                      |
| -------------- | --------------------------------------------- | ----------------------------- |
| command        | 点击菜单项触发的事件回调                      | dropdown-item 的指令          |
| visible-change | 下拉框出现/隐藏时触发                         | 出现则为 true，隐藏则为 false |

### Dropdown Menu Item Attributes

| 参数     | 说明       | 类型                 | 可选值 | 默认值 |
| -------- | ---------- | -------------------- | ------ | ------ |
| command  | 指令       | string/number/object | —      | —      |
| disabled | 禁用       | boolean              | —      | false  |
| divided  | 显示分割线 | boolean              | —      | false  |
| icon     | 图标类名   | string               | —      | —      |
