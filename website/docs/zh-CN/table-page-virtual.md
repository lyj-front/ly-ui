## TablePage 虚拟滚动(使用定位实现，可能存在未知bug)

>>>注意

>>1、一定要添加row-key属性

>>2、一定要设置rowHeight熟悉 每行高度要固定

>>3、每列需要设置宽度

>>展开暂不支持

### 基础用法

:::demo

```html
<template>
  <div style="height:50vh;">
    <ly-table-page-v2
      :table-config="tableConfig"
      @row-dblclick="gotoEdit"
      highlight-current-row
      clickdelay
      height="100%"
      row-key="id"
      @row-click="rowClick"
      maxPage="2"
      :pageSize="100"
      :rowHeight="30"
    >
    </ly-table-page-v2>
  </div>
</template>

<script>
  import { ref } from 'vue'
  import {LyTablePage,LyTablePageV2} from 'ly-ui'
  // server 按实际项目写，实际项目中应该是 import serve from '@http/xxxxx' xxxxx = server目录下的文件名
  const { default: serve} = require('../../utils/server/common-api.js')

  export default {
    components:{
      LyTablePageV2,
    },
    setup () {
      console.log(LyTablePageV2,'LyUi')
      const tableConfig = {
        api: serve.planList,
        header: [
          {
            label: '关联岗位2',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位3',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位4',
            minWidth: '',
            width:100,
            prop: 'planName',
          },
          {
            label: '关联岗位5',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位6',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位7',
            minWidth: '',
            width:100,
            prop: 'relationDuty',
          },
          {
            label: '关联岗位8',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位9',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位10',
            minWidth: '',
            width:100,
            prop: 'relationDuty',
          },
          {
            label: '关联岗位11',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位12',
            minWidth: '',
            width:100,
            prop: 'relationDuty',
          },
          {
            label: '关联岗位13',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位14',
            minWidth: '',
            width:100,
            prop: 'levelNum',
          },
          {
            label: '关联岗位15',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位16',
            minWidth: '',
            width:100,
            prop: 'levelNum',
          },
          {
            label: '关联岗位17',
            minWidth: '',
            width:100,
            prop: 'relationDuty',
          },
          {
            label: '关联岗位18',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位19',
            minWidth: '',
            width:100,
            prop: 'levelNum',
          },
          {
            label: '关联岗位20',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位21',
            minWidth: '',
            width:100,
            prop: 'levelNum',
          },
          {
            label: '关联岗位22',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位23',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位24',
            minWidth: '',
            width:100,
            prop: 'relationDuty',
          },
          {
            label: '关卡数',
            minWidth: '',
            width:100,
            prop: 'levelNum',
          },
          {
            label: '创建人',
            minWidth: '',
            width:100,
            prop: 'createName',
          },
          {
            label: '创建时间',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '计划状态',
            minWidth: '',
            width:100,
            prop: 'planStatusStr',
          }
        ]
      }
      const planTablePage=ref(null)
      function gotoEdit({ id }) {
        console.log('双击');
      }
      function rowClick(){
        console.log('单击');
      }

      return {
        planTablePage,
        tableConfig,
        gotoEdit,
        rowClick
      }
    }
  }
</script>

```

:::

### 基础用法(可选)

:::demo

```html
<template>
  <div style="height:50vh;">
    <ly-table-page-v2
      :table-config="tableConfig"
      @row-dblclick="gotoEdit"
      highlight-current-row
      clickdelay
      height="100%"
      row-key="id"
      @row-click="rowClick"
      maxPage="2"
      :pageSize="100"
      :rowHeight="30"
    >
      <template #expandprop="scope">
        <div>{{scope.row}}</div>
      </template>
    </ly-table-page-v2>
  </div>
</template>

<script>
  import { ref } from 'vue'
  import {LyTablePage,LyTablePageV2} from 'ly-ui'
  // server 按实际项目写，实际项目中应该是 import serve from '@http/xxxxx' xxxxx = server目录下的文件名
  const { default: serve} = require('../../utils/server/common-api.js')

  export default {
    components:{
      LyTablePageV2,
    },
    setup () {
      console.log(LyTablePageV2,'LyUi')
      const tableConfig = {
        api: serve.planList,
        header: [{
            width: '80',
            type: 'selection',
          },{
            label: '计划名称',
            width:200,
            prop: 'planName',
          },
          {
            label: '关联岗位1',
            minWidth: '',
            width:100,
            prop: 'relationDuty',
          },
          {
            label: '关联岗位2',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位3',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位4',
            minWidth: '',
            width:100,
            prop: 'planName',
          },
          {
            label: '关联岗位5',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位6',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位7',
            minWidth: '',
            width:100,
            prop: 'relationDuty',
          },
          {
            label: '关联岗位8',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位9',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位10',
            minWidth: '',
            width:100,
            prop: 'relationDuty',
          },
          {
            label: '关联岗位11',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位12',
            minWidth: '',
            width:100,
            prop: 'relationDuty',
          },
          {
            label: '关联岗位13',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位14',
            minWidth: '',
            width:100,
            prop: 'levelNum',
          },
          {
            label: '关联岗位15',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位16',
            minWidth: '',
            width:100,
            prop: 'levelNum',
          },
          {
            label: '关联岗位17',
            minWidth: '',
            width:100,
            prop: 'relationDuty',
          },
          {
            label: '关联岗位18',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位19',
            minWidth: '',
            width:100,
            prop: 'levelNum',
          },
          {
            label: '关联岗位20',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位21',
            minWidth: '',
            width:100,
            prop: 'levelNum',
          },
          {
            label: '关联岗位22',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位23',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位24',
            minWidth: '',
            width:100,
            prop: 'relationDuty',
          },
          {
            label: '关卡数',
            minWidth: '',
            width:100,
            prop: 'levelNum',
          },
          {
            label: '创建人',
            minWidth: '',
            width:100,
            prop: 'createName',
          },
          {
            label: '创建时间',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '计划状态',
            minWidth: '',
            width:100,
            prop: 'planStatusStr',
          }
        ]
      }
      const planTablePage=ref(null)
      function gotoEdit({ id }) {
        console.log('双击');
      }
      function rowClick(){
        console.log('单击');
      }

      return {
        planTablePage,
        tableConfig,
        gotoEdit,
        rowClick
      }
    }
  }
</script>

```

:::

### 基础用法1-左侧有固定列

:::demo

```html
<template>
  <div style="height:50vh;">
    <ly-table-page-v2
      :table-config="tableConfig"
      @row-dblclick="gotoEdit"
      highlight-current-row
      clickdelay
      row-key="id"
      height="100%"
      @row-click="rowClick"
      maxPage="2"
      :pageSize="100"
      :rowHeight="30"
    >
    </ly-table-page-v2>
  </div>
</template>

<script>
  import { ref } from 'vue'
  import {LyTablePage,LyTablePageV2} from 'ly-ui'
  // server 按实际项目写，实际项目中应该是 import serve from '@http/xxxxx' xxxxx = server目录下的文件名
  const { default: serve} = require('../../utils/server/common-api.js')

  export default {
    components:{
      LyTablePageV2,
    },
    setup () {
      console.log(LyTablePageV2,'LyUi')
      const tableConfig = {
        api: serve.planList,
        header: [
          {
            label: '计划名称',
            width:200,
            fixed:'left',
            prop: 'planName',
          },
          {
            label: '关联岗位1',
            minWidth: '',
            fixed:'left',
            width:100,
            prop: 'relationDuty',
          },
          {
            label: '关联岗位2',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位3',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位4',
            minWidth: '',
            width:100,
            prop: 'planName',
          },
          {
            label: '关联岗位5',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位6',
            minWidth: '',
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位7',
            minWidth: '',
            width:100,
            prop: 'relationDuty',
          },
          {
            label: '关联岗位8',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位9',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位10',
            minWidth: '',
            width:100,
            prop: 'relationDuty',
          },
          {
            label: '关联岗位11',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位12',
            minWidth: '',
            width:100,
            prop: 'relationDuty',
          },
          {
            label: '关联岗位13',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位14',
            minWidth: '',
            width:100,
            prop: 'levelNum',
          },
          {
            label: '关联岗位15',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位16',
            minWidth: '',
            width:100,
            prop: 'levelNum',
          },
          {
            label: '关联岗位17',
            minWidth: '',
            width:100,
            prop: 'relationDuty',
          },
          {
            label: '关联岗位18',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位19',
            minWidth: '',
            width:100,
            prop: 'levelNum',
          },
          {
            label: '关联岗位20',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位21',
            minWidth: '',
            width:100,
            prop: 'levelNum',
          },
          {
            label: '关联岗位22',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位23',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位24',
            minWidth: '',
            width:100,
            prop: 'relationDuty',
          },
          {
            label: '关卡数',
            minWidth: '',
            width:100,
            prop: 'levelNum',
          },
          {
            label: '创建人',
            minWidth: '',
            width:100,
            prop: 'createName',
          },
          {
            label: '创建时间',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '计划状态',
            minWidth: '',
            width:100,
            prop: 'planStatusStr',
          }
        ]
      }
      const planTablePage=ref(null)
      function gotoEdit({ id }) {
        console.log('双击');
      }
      function rowClick(){
        console.log('单击');
      }

      return {
        planTablePage,
        tableConfig,
        gotoEdit,
        rowClick
      }
    }
  }
</script>

```
:::

### 基础用法2-右侧有固定列

:::demo

```html
<template>
  <div style="height:50vh;">
    <ly-table-page-v2
      :table-config="tableConfig"
      @row-dblclick="gotoEdit"
      highlight-current-row
      row-key="id"
      :pageSize="100"
      clickdelay
      height="100%"
      @row-click="rowClick"
      maxPage="2"
      :rowHeight="30"
    >
      <template #expandprop="scope">
        <div>{{scope.row}}</div>
      </template>
    </ly-table-page-v2>
  </div>
</template>

<script>
  import { ref } from 'vue'
  import {LyTablePage,LyTablePageV2} from 'ly-ui'
  // server 按实际项目写，实际项目中应该是 import serve from '@http/xxxxx' xxxxx = server目录下的文件名
  const { default: serve} = require('../../utils/server/common-api.js')

  export default {
    components:{
      LyTablePageV2,
    },
    setup () {
      console.log(LyTablePageV2,'LyUi')
      const tableConfig = {
        api: serve.planList,
        header: [{
            type:'selection',
            fixed:'left',
            width:60
          },{
            label: '计划名称',
            width:200,
            fixed:'left',
            prop: 'planName',
          },
          {
            label: '关联岗位1',
            minWidth: '',
            fixed:'left',
            width:100,
            prop: 'relationDuty',
          },
          {
            label: '关联岗位2',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位3',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位4',
            minWidth: '',
            width:100,
            prop: 'planName',
          },
          {
            label: '关联岗位5',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位6',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位7',
            minWidth: '',
            width:100,
            prop: 'relationDuty',
          },
          {
            label: '关联岗位8',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位9',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位10',
            minWidth: '',
            width:100,
            prop: 'relationDuty',
          },
          {
            label: '关联岗位11',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位12',
            minWidth: '',
            width:100,
            prop: 'relationDuty',
          },
          {
            label: '关联岗位13',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位14',
            minWidth: '',
            width:100,
            prop: 'levelNum',
          },
          {
            label: '关联岗位15',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位16',
            minWidth: '',
            width:100,
            prop: 'levelNum',
          },
          {
            label: '关联岗位17',
            minWidth: '',
            width:100,
            prop: 'relationDuty',
          },
          {
            label: '关联岗位18',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位19',
            minWidth: '',
            width:100,
            prop: 'levelNum',
          },
          {
            label: '关联岗位20',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位21',
            minWidth: '',
            width:100,
            prop: 'levelNum',
          },
          {
            label: '关联岗位22',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位23',
            minWidth: '',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '关联岗位24',
            minWidth: '',
            width:100,
            prop: 'relationDuty',
          },
          {
            label: '关卡数',
            minWidth: '',
            width:100,
            prop: 'levelNum',
          },
          {
            label: '创建人',
            minWidth: '',
            width:100,
            prop: 'createName',
          },
          {
            label: '创建时间',
            minWidth: '',
            fixed:'right',
            width:100,
            prop: 'createTimeStr',
          },
          {
            label: '计划状态',
            minWidth: '',
            fixed:'right',
            width:100,
            prop: 'planStatusStr',
          }
        ]
      }
      const planTablePage=ref(null)
      function gotoEdit({ id }) {
        console.log('双击');
      }
      function rowClick(){
        console.log('单击');
      }

      return {
        planTablePage,
        tableConfig,
        gotoEdit,
        rowClick
      }
    }
  }
</script>

```
:::
参数同table-page table组件参数
