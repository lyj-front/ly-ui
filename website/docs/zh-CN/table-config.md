## TableConfig 表格联动控制组件

用于配置表格的样式，全局生效

### 使用方法

:::demo 一般全局就放一个，要配合 ly-table 或者 ly-table-page 使用

```html
<template>
  <div class="table-config-box">
    <div class="right-but">
      <ly-table-config></ly-table-config>
    </div>
  </div>
  <ly-table :data="tableData" style="width: 100%">
    <ly-table-column prop="date" label="日期" width="180"> </ly-table-column>
    <ly-table-column prop="name" label="姓名" width="180"> </ly-table-column>
    <ly-table-column prop="address" label="地址"> </ly-table-column>
  </ly-table>
</template>

<style lang="less" scoped>
  .table-config-box {
    position: relative;
    height: 30px;
    .right-but {
      position: absolute;
      top: 0;
      right: 0;
      line-height: 30px;
    }
  }
</style>

<script>
  export default {
    data() {
      return {
        tableData: [
          {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
          },
          {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄',
          },
          {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄',
          },
          {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄',
          },
        ],
      }
    },
  }
</script>
<!--
<setup>
  import { ref } from 'vue';
  export default {
      setup() {
          const tableData = ref([
              {
                  date: '2016-05-02',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1518 弄',
              },
              {
                  date: '2016-05-04',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1517 弄',
              },
              {
                  date: '2016-05-01',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1519 弄',
              },
              {
                  date: '2016-05-03',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1516 弄',
              },
          ]);
          return {
              tableData,
          };
      },
  };
</setup>
-->
```

:::