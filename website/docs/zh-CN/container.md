## Container 布局容器

用于布局的容器组件，方便快速搭建页面的基本结构：

`<ly-container>`：外层容器。当子元素中包含 `<ly-header>` 或 `<ly-footer>` 时，全部子元素会垂直上下排列，否则会水平左右排列。

`<ly-header>`：顶栏容器。

`<ly-aside>`：侧边栏容器。

`<ly-main>`：主要区域容器。

`<ly-footer>`：底栏容器。

:::tip
以上组件采用了 flex 布局，使用前请确定目标浏览器是否兼容。此外，`<ly-container>` 的子元素只能是后四者，后四者的父元素也只能是 `<ly-container>`。
:::

### 常见页面布局

:::demo

```html
<div class="common-layout">
  <ly-container>
    <ly-header>Header</ly-header>
    <ly-main>Main</ly-main>
  </ly-container>

  <ly-container>
    <ly-header>Header</ly-header>
    <ly-main>Main</ly-main>
    <ly-footer>Footer</ly-footer>
  </ly-container>

  <ly-container>
    <ly-aside width="200px">Aside</ly-aside>
    <ly-main>Main</ly-main>
  </ly-container>

  <ly-container>
    <ly-header>Header</ly-header>
    <ly-container>
      <ly-aside width="200px">Aside</ly-aside>
      <ly-main>Main</ly-main>
    </ly-container>
  </ly-container>

  <ly-container>
    <ly-header>Header</ly-header>
    <ly-container>
      <ly-aside width="200px">Aside</ly-aside>
      <ly-container>
        <ly-main>Main</ly-main>
        <ly-footer>Footer</ly-footer>
      </ly-container>
    </ly-container>
  </ly-container>

  <ly-container>
    <ly-aside width="200px">Aside</ly-aside>
    <ly-container>
      <ly-header>Header</ly-header>
      <ly-main>Main</ly-main>
    </ly-container>
  </ly-container>

  <ly-container>
    <ly-aside width="200px">Aside</ly-aside>
    <ly-container>
      <ly-header>Header</ly-header>
      <ly-main>Main</ly-main>
      <ly-footer>Footer</ly-footer>
    </ly-container>
  </ly-container>
</div>

<style>
  .el-header,
  .el-footer {
    background-color: #b3c0d1;
    color: var(--el-text-color-primary);
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #d3dce6;
    color: var(--el-text-color-primary);
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #e9eef3;
    color: var(--el-text-color-primary);
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
```

:::

### 实例

:::demo

```html
<ly-container style="height: 500px; border: 1px solid #eee">
  <ly-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <ly-menu :default-openeds="['1', '3']">
      <ly-sub-menu index="1">
        <template #title><i class="el-icon-message"></i>导航一</template>
        <ly-menu-item-group>
          <template #title>分组一</template>
          <ly-menu-item index="1-1">选项1</ly-menu-item>
          <ly-menu-item index="1-2">选项2</ly-menu-item>
        </ly-menu-item-group>
        <ly-menu-item-group title="分组2">
          <ly-menu-item index="1-3">选项3</ly-menu-item>
        </ly-menu-item-group>
        <ly-sub-menu index="1-4">
          <template #title>选项4</template>
          <ly-menu-item index="1-4-1">选项4-1</ly-menu-item>
        </ly-sub-menu>
      </ly-sub-menu>
      <ly-sub-menu index="2">
        <template #title><i class="el-icon-menu"></i>导航二</template>
        <ly-menu-item-group>
          <template #title>分组一</template>
          <ly-menu-item index="2-1">选项1</ly-menu-item>
          <ly-menu-item index="2-2">选项2</ly-menu-item>
        </ly-menu-item-group>
        <ly-menu-item-group title="分组2">
          <ly-menu-item index="2-3">选项3</ly-menu-item>
        </ly-menu-item-group>
        <ly-sub-menu index="2-4">
          <template #title>选项4</template>
          <ly-menu-item index="2-4-1">选项4-1</ly-menu-item>
        </ly-sub-menu>
      </ly-sub-menu>
      <ly-sub-menu index="3">
        <template #title><i class="el-icon-setting"></i>导航三</template>
        <ly-menu-item-group>
          <template #title>分组一</template>
          <ly-menu-item index="3-1">选项1</ly-menu-item>
          <ly-menu-item index="3-2">选项2</ly-menu-item>
        </ly-menu-item-group>
        <ly-menu-item-group title="分组2">
          <ly-menu-item index="3-3">选项3</ly-menu-item>
        </ly-menu-item-group>
        <ly-sub-menu index="3-4">
          <template #title>选项4</template>
          <ly-menu-item index="3-4-1">选项4-1</ly-menu-item>
        </ly-sub-menu>
      </ly-sub-menu>
    </ly-menu>
  </ly-aside>

  <ly-container>
    <ly-header style="text-align: right; font-size: 12px">
      <ly-dropdown>
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <template #dropdown>
          <ly-dropdown-menu>
            <ly-dropdown-item>查看</ly-dropdown-item>
            <ly-dropdown-item>新增</ly-dropdown-item>
            <ly-dropdown-item>删除</ly-dropdown-item>
          </ly-dropdown-menu>
        </template>
      </ly-dropdown>
      <span>王小虎</span>
    </ly-header>

    <ly-main>
      <ly-table :data="tableData">
        <ly-table-column prop="date" label="日期" width="140">
        </ly-table-column>
        <ly-table-column prop="name" label="姓名" width="120">
        </ly-table-column>
        <ly-table-column prop="address" label="地址"> </ly-table-column>
      </ly-table>
    </ly-main>
  </ly-container>
</ly-container>

<style>
  .el-header {
    background-color: #b3c0d1;
    color: var(--el-text-color-primary);
    line-height: 60px;
  }

  .el-aside {
    color: var(--el-text-color-primary);
  }
</style>

<script>
  export default {
    data() {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }
      return {
        tableData: Array(20).fill(item),
      }
    },
  }
</script>
<!--
<setup>

  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      };

      const tableData = ref(Array(20).fill(item));

      return {
        tableData,
      };
    },
  });

</setup>
-->
```

:::

### Container Attributes

| 参数      | 说明             | 类型   | 可选值                | 默认值                                                                 |
| --------- | ---------------- | ------ | --------------------- | ---------------------------------------------------------------------- |
| direction | 子元素的排列方向 | string | horizontal / vertical | 子元素中有 `el-header` 或 `el-footer` 时为 vertical，否则为 horizontal |

### Header Attributes

| 参数   | 说明     | 类型   | 可选值 | 默认值 |
| ------ | -------- | ------ | ------ | ------ |
| height | 顶栏高度 | string | —      | 60px   |

### Aside Attributes

| 参数  | 说明       | 类型   | 可选值 | 默认值 |
| ----- | ---------- | ------ | ------ | ------ |
| width | 侧边栏宽度 | string | —      | 300px  |

### Footer Attributes

| 参数   | 说明     | 类型   | 可选值 | 默认值 |
| ------ | -------- | ------ | ------ | ------ |
| height | 底栏高度 | string | —      | 60px   |
