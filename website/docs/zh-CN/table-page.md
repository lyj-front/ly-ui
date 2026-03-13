## TablePage 表格页面组件

用来生成一个表格页面的复合型组件

### 基础用法

:::demo

```html
<template>
  <ly-table-page
    ref="planTablePage"
    customClass="ces-table-page-class"
    :table-config="tableConfig"
    @row-dblclick="gotoEdit"
    highlight-current-row
    clickdelay
    border
    headerFixed
    height="auto"
    :page-size="50"
    :page-sizes="[25,50,100]"
    @row-click="rowClick"
  ></ly-table-page>
</template>

<script>
  import { LyMessage } from 'ly-ui'
  import { ref,reactive } from 'vue'
  // server 按实际项目写，实际项目中应该是 import serve from '@http/xxxxx' xxxxx = server目录下的文件名
  const { default: serve} = require('../../utils/server/common-api.js')

  export default {
    setup () {
      const searchParams = reactive({
          workerType: 0,
          deptName: '',
          workerId: '',
          workerName: '',
          dateType: 1,
          dateS: '',
          dateE: '',
          cjTypeStr: '4',
          jdzt: '',
          jyzt: '',
          gzdh: '',
          jgyhId: '',
          jgyh: '',
          dkyhId: '',
          dkyh: '',
          dbgsId: '',
          dbgs: '',
          lsId:'',
          lsName:'',
          ywjd: '',
          pgfdzt: '',
          cityId: '',
          companyIdStrArr: [],
          areaId: '',
          jjfw: '',
          wymc: '',
          fybh: '',
          qdbz: '',
          cwbz: '',
          yzxm: '',
          wsyhfdTab: 0,
          wsdbfdTab: 0,
      })
      const tableConfig = {
        api: serve.planList,
        pageMap: {
            Size: 'pageSize',
            No: 'currPage',
        },
        responseMap: {
            List: 'list',
            Total: 'cm.totalRecord',
        },
        search: searchParams,
        header: [
            {
                label: 'NO',
                width: '50',
                type: 'index',
            },
            {
            custom: true,
            label: '计划名称',
            minWidth: '200',
            prop: 'planName',
          },
          {
            label: '关联岗位',
            minWidth: '',
            prop: 'relationDuty',
          },
          {
            label: '关卡数',
            minWidth: '',
            prop: 'levelNum',
          },
          {
            label: '创建人',
            minWidth: '',
            prop: 'createName',
          },
          {
            label: '创建时间',
            minWidth: '',
            prop: 'createTimeStr',
          },
          {
            label: '计划状态',
            minWidth: '',
            prop: 'planStatusStr',
          }
        ]
      }
      const planTablePage=ref(null)
      function gotoEdit({ id }) {
        console.log('双击');
        // LyMessage(`修改 id: ${id} 的数据`)

        // planTablePage.value.pageInfo.Size = 50
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

### 自定义模板内容

:::demo

```html
<template>
  <ly-table-page
    ref="planTablePage"
    :table-config="tableConfig"
    :page-size="100"
    border
    :page-sizes="[100,1000,2000]"
    @row-dblclick="gotoEdit"
  >
    <template #planName="scope">
      <span style="color:red;">{{scope.row.planName}}</span>
    </template>
  </ly-table-page>
</template>

<script>
  import { LyMessage } from 'ly-ui'
  // server 按实际项目写，实际项目中应该是 import serve from '@http/xxxxx' xxxxx = server目录下的文件名
  const { default: serve} = require('../../utils/server/common-api.js')

  export default {
    setup () {
      const tableConfig = {
        api: serve.planList,
        header: [
          {
            custom: true,
            label: '计划名称',
            minWidth: '200',
            prop: 'planName',
          },
          {
            label: '关联岗位',
            minWidth: '',
            prop: 'relationDuty',
          },
          {
            label: '关卡数',
            minWidth: '',
            prop: 'levelNum',
          },
          {
            label: '创建人',
            minWidth: '',
            prop: 'createName',
          },
          {
            label: '创建时间',
            minWidth: '',
            prop: 'createTimeStr',
          },
          {
            label: '计划状态',
            minWidth: '',
            prop: 'planStatusStr',
          }
        ]
      }

      function gotoEdit({ id }) {
        LyMessage(`修改 id: ${id} 的数据`)
      }

      return {
        tableConfig,
        gotoEdit
      }
    }
  }
</script>

```

:::


### 显示字段说明、排序、首次不请求

:::demo

```html
<template>
  <ly-table-page
    ref="planTablePage"
    :sort-always-show="true"
    :table-config="tableConfig"
    @row-dblclick="gotoEdit"
    @sort-change="sortChange"
    :firstRequest="false"
  ></ly-table-page>
</template>

<script>
  import { LyMessage } from 'ly-ui'
  // server 按实际项目写，实际项目中应该是 import serve from '@http/xxxxx' xxxxx = server目录下的文件名
  const { default: serve} = require('../../utils/server/common-api.js')

  export default {
    setup () {
      const tableConfig = {
        api: serve.planList,
        search: {},
        header: [
          {
            label: '序号',
            width: '55',
            type: 'index',
          },
          {
            label: '计划名称',
            minWidth: '200',
            prop: 'planName',
            sortable: true,
            explain: '计划名称说明'
          },
          {
            label: '关联岗位',
            minWidth: '',
            prop: 'relationDuty',
            sortable: true,
          },
          {
            label: '关卡数',
            minWidth: '',
            prop: 'levelNum',
            sortable: true,
          },
          {
            label: '创建人',
            minWidth: '',
            prop: 'createName',
            sortable: true,
          },
          {
            label: '创建时间',
            minWidth: '',
            prop: 'createTimeStr',
            sortable: true,
          },
          {
            label: '计划状态',
            minWidth: '',
            prop: 'planStatusStr',
            sortable: true,
          }
        ]
      }

      function gotoEdit({ id }) {
        LyMessage(`修改 id: ${id} 的数据`)
      }

      function sortChange(column, prop, order) {
        console.log('column, prop, order: ', column, prop, order);
      }

      return {
        tableConfig,
        gotoEdit,
        sortChange
      }
    }
  }
</script>

```

:::

### 显示序号、多选框、操作栏、展开行

:::demo

```html
<template>
  <ly-table-page
    ref="planTablePage"
    :table-config="tableConfig"
    @row-dblclick="gotoEdit"
    @selection-change="selectChange"
  >
    <template #operate="scope">
      <a href="javascript:void(0);" class="mr10" @click.stop="gotoEdit(scope.row)">修改</a>
    </template>
    <template #expandprop="scope">
      <div>{{scope.row}}</div>
    </template>
  </ly-table-page>
</template>

<script>
  import { LyMessage } from 'ly-ui'
  // server 按实际项目写，实际项目中应该是 import serve from '@http/xxxxx' xxxxx = server目录下的文件名
  const { default: serve} = require('../../utils/server/common-api.js')

  export default {
    setup () {
      function selectable(row,index){
        return row.levelNum === 1
      }
      const tableConfig = {
        api: serve.planList,
        header: [
          // 展开行
          {
            type: 'expand',
            prop:'expandprop',
            custom: true,
          },
          // 多选框
          {
            width: '55',
            type: 'selection',
            selectable,
          },
          {
            label: '序号',
            width: '55',
            type: 'index',
          },
          {
            label: '计划名称',
            minWidth: '150',
            prop: 'planName',
          },
          {
            label: '关联岗位',
            minWidth: '',
            prop: 'relationDuty',
          },
          {
            label: '关卡数',
            minWidth: '',
            prop: 'levelNum',
          },
          {
            label: '创建人',
            minWidth: '',
            prop: 'createName',
          },
          {
            label: '创建时间',
            minWidth: '150',
            prop: 'createTimeStr',
          },
          {
            label: '计划状态',
            minWidth: '',
            prop: 'planStatusStr',
          },
          {
            custom: true,
            label: '操作',
            prop: 'operate',
          }
        ]
      }

      function gotoEdit({ id }) {
        LyMessage(`修改 id: ${id} 的数据`)
      }

      function selectChange(val) {
        console.log('val: ', val);
      }

      return {
        tableConfig,
        gotoEdit,
        selectChange
      }
    }
  }
</script>

```

:::

### 固定列

:::demo

```html
<template>
  <ly-table-page
    ref="planTablePage"
    :table-config="tableConfig"
    @row-dblclick="gotoEdit"
  >
    <template #operate="scope">
      <a href="javascript:void(0);" class="mr10" @click.stop="gotoEdit(scope.row)">修改</a>
    </template>
  </ly-table-page>
</template>

<script>
  import { LyMessage } from 'ly-ui'
  // server 按实际项目写，实际项目中应该是 import serve from '@http/xxxxx' xxxxx = server目录下的文件名
  const { default: serve} = require('../../utils/server/common-api.js')

  export default {
    setup () {
      const tableConfig = {
        api: serve.planList,
        header: [
          {
            width: '55',
            type: 'selection', // 多选框
          },
          {
            label: '计划名称',
            minWidth: '200',
            prop: 'planName',
            fixed: true,
          },
          {
            label: '关联岗位',
            minWidth: '',
            prop: 'relationDuty',
          },
          {
            label: '关卡数',
            minWidth: '300',
            prop: 'levelNum',
          },
          {
            label: '创建人',
            minWidth: '200',
            prop: 'createName',
          },
          {
            label: '创建人',
            minWidth: '300',
            prop: 'createName',
          },
          {
            label: '创建人',
            minWidth: '300',
            prop: 'createName',
          },
          {
            label: '创建人',
            minWidth: '300',
            prop: 'createName',
          },
          {
            label: '创建时间',
            minWidth: '',
            prop: 'createTimeStr',
            fixed: 'right',
          },
          {
            label: '计划状态',
            minWidth: '',
            prop: 'planStatusStr',
          },
          {
            custom: true,
            label: '操作',
            prop: 'operate',
          }
        ]
      }

      function gotoEdit({ id }) {
        LyMessage(`修改 id: ${id} 的数据`)
      }

      return {
        tableConfig,
        gotoEdit
      }
    }
  }
</script>

```

:::

### 合计

:::demo

```html
<template>
  <ly-table-page
    ref="planTablePage"
    :table-config="tableConfig"
    @row-dblclick="gotoEdit"
    show-summary
    :summary-method="getSummaries"
  ></ly-table-page>
</template>

<script>
  import { LyMessage } from 'ly-ui'
  // server 按实际项目写，实际项目中应该是 import serve from '@http/xxxxx' xxxxx = server目录下的文件名
  const { default: serve} = require('../../utils/server/common-api.js')

  export default {
    setup () {
      const tableConfig = {
        api: serve.planList,
        header: [
          {
            label: '计划名称',
            minWidth: '200',
            prop: 'planName',
          },
          {
            label: '关联岗位',
            minWidth: '',
            prop: 'relationDuty',
          },
          {
            label: '关卡数',
            minWidth: '300',
            prop: 'levelNum',
          },
          {
            label: '创建人',
            minWidth: '200',
            prop: 'createName',
          },
          {
            label: '创建人',
            minWidth: '300',
            prop: 'createName',
          },
          {
            label: '创建人',
            minWidth: '300',
            prop: 'createName',
          },
          {
            label: '创建人',
            minWidth: '300',
            prop: 'createName',
          },
          {
            label: '创建时间',
            minWidth: '',
            prop: 'createTimeStr',
          },
          {
            label: '计划状态',
            minWidth: '',
            prop: 'planStatusStr',
          }
        ]
      }

      function gotoEdit({ id }) {
        LyMessage(`修改 id: ${id} 的数据`)
      }

      function getSummaries(param) {
        const { columns, data } = param
        // 需要return 一个数组，不然会导致报错无法使用
        return ['合计', '1', '2']
      }

      return {
        tableConfig,
        gotoEdit,
        getSummaries
      }
    }
  }
</script>

```

:::

### 携带搜索条件

:::demo 携带搜索条件可以这么写, 这个接口实际上没有搜索的功能， 所以数据没有生效，这里直接打开控制台看一下请求就知道了。参数已经携带过去了

```html
<template>
  <ly-table-page
    ref="planTablePage"
    :table-config="tableConfig"
    :before-reset="beforeReset"
    :after-reset="afterReset"
    :before-get-info="beforeGetInfo"
    :after-get-info="afterGetInfo"
  >
    <template #search="scope">
      <ly-input v-model="scope.data.keyWord" class="action-item-w mr10" maxlength="10" placeholder="请输入计划名称"></ly-input>
      <ly-select v-model="scope.data.abc" class="action-item-w mr10">
        <ly-option label="option.operationType" value="0"></ly-option>
      </ly-select>
      <ly-select v-model="scope.data.abc" class="action-item-w mr10">
        <ly-option label="option.operationType" value="0"></ly-option>
      </ly-select>
      <ly-select v-model="scope.data.abc" class="action-item-w mr10">
        <ly-option label="option.operationType" value="0"></ly-option>
      </ly-select>
      <ly-select v-model="scope.data.abc" class="action-item-w mr10">
        <ly-option label="option.operationType" value="0"></ly-option>
      </ly-select>
      <ly-select v-model="scope.data.abc" class="action-item-w mr10">
        <ly-option label="option.operationType" value="0"></ly-option>
      </ly-select>
      <ly-select v-model="scope.data.abc" class="action-item-w mr10">
        <ly-option label="option.operationType" value="0"></ly-option>
      </ly-select>
      <ly-select v-model="scope.data.abc" class="action-item-w mr10">
        <ly-option label="option.operationType" value="0"></ly-option>
      </ly-select>
    </template>
  </ly-table-page>
</template>

<style>
  .action-item-w {
    width: 186px;
  }
  .mr10 {
    margin-right: 10px;
  }
</style>

<script>
  // serve 按实际项目写，实际项目中应该是 import serve from '@http/xxxxx' xxxxx = server目录下的文件名
  const { default: serve} = require('../../utils/server/common-api.js')
  import { reactive } from 'vue'
  import { LyMessage } from 'ly-ui'

  export default {
    setup () {
      // search 为动态的参数，一般情况下是检索项
      // request 为调用获取数据时接口需要额外的参数，一般情况下是传一些固定的参数，如ID这些
      const tableConfig = {
        api: serve.planList,
        search: reactive({
          keyWord: '',
          abc: ''
        }),
        request: {
          id: '123'
        },
        header: [
          {
            custom: false, // 自定义则修改为true
            label: '计划名称',
            minWidth: '',
            prop: 'planName',
          },
          {
            label: '关联岗位',
            minWidth: '',
            prop: 'relationDuty',
          },
          {
            label: '关卡数',
            minWidth: '',
            prop: 'levelNum',
            sortable: true,
          },
          {
            label: '创建人',
            minWidth: '',
            prop: 'createName',
          },
          {
            label: '创建时间',
            minWidth: '',
            prop: 'createTimeStr',
            sortable: true,
          },
          {
            label: '计划状态',
            minWidth: '',
            prop: 'planStatusStr',
          }
        ]
      }

      // 点击重置按钮调用接口之前的生命周期回调
      async function beforeReset() {
        console.log('beforeReset')
      }

      // 点击重置按钮调用接口之后的生命周期回调
      async function afterReset(res) {
        // 回调函数可以使用 async/await ，也支持 return 一个 promise
        await beforeReset()
        console.log('afterReset', res)
      }

      // 调用搜索接口之前的生命周期回调
      async function beforeGetInfo() {
        console.log('beforeGetInfo')
        await beforeReset()
      }

      // 调用搜索接口之后的生命周期回调
      async function afterGetInfo(res) {
        console.log('afterGetInfo', res)
      }

      return {
        tableConfig,
        beforeReset,
        afterReset,
        beforeGetInfo,
        afterGetInfo
      }
    }
  }
</script>

```

:::

### 手动调用接口更新表格数据

:::demo

```html
<template>
  <ly-table-page
    ref="planTablePage"
    :table-config="tableConfig"
  >
    <template #search="scope">
      <ly-input v-model="scope.data.keyWord" class="action-item-w mr10" maxlength="10" placeholder="请输入计划名称"></ly-input>
      <ly-select v-model="scope.data.abc" class="action-item-w mr10">
        <ly-option label="option.operationType" value="0"></ly-option>
      </ly-select>
    </template>
    <template #operate="scope">
      <ly-button size="mini" @click="getInfo">调用表格接口</ly-button>
    </template>
  </ly-table-page>
</template>

<style>
  .action-item-w {
    width: 186px;
  }
  .mr10 {
    margin-right: 10px;
  }
</style>

<script>
  // serve 按实际项目写，实际项目中应该是 import serve from '@http/xxxxx' xxxxx = server目录下的文件名
  const { default: serve} = require('../../utils/server/common-api.js')
  import { reactive, ref } from 'vue'
  import { LyMessage } from 'ly-ui'

  export default {
    setup () {
      const planTablePage = ref(null)
      // search 为动态的参数，一般情况下是检索项
      // request 为调用获取数据时接口需要额外的参数，一般情况下是传一些固定的参数，如ID这些
      const tableConfig = {
        api: serve.planList,
        search: reactive({
          keyWord: '',
          abc: ''
        }),
        request: {
          id: '123'
        },
        header: [
          {
            custom: false, // 自定义则修改为true
            label: '计划名称',
            minWidth: '',
            prop: 'planName',
          },
          {
            label: '关联岗位',
            minWidth: '',
            prop: 'relationDuty',
          },
          {
            label: '关卡数',
            minWidth: '',
            prop: 'levelNum',
            sortable: true,
          },
          {
            label: '创建人',
            minWidth: '',
            prop: 'createName',
          },
          {
            label: '创建时间',
            minWidth: '',
            prop: 'createTimeStr',
            sortable: true,
          },
          {
            label: '计划状态',
            minWidth: '',
            prop: 'planStatusStr',
          },
          {
            custom: true,
            label: '操作',
            minWidth: '100',
            prop: 'operate',
          }
        ]
      }

      function getInfo() {
        planTablePage.value.getInfo()
      }

      return {
        planTablePage,
        getInfo,
        tableConfig,
      }
    }
  }
</script>

```

:::

### 多行搜索条件（适用于搜索栏有其他内容）

:::demo #searchTop  #searchBottom 无固定样式，全部自己定义

```html
<template>
  <ly-table-page
    ref="planTablePage"
    :table-config="tableConfig"
  >
    <template #searchTop="scope">
      <ly-input v-model="scope.data.keyWord" class="action-item-w mr10" maxlength="10" placeholder="请输入计划名称"></ly-input>
    </template>
    <template #search="scope">
      <ly-input v-model="scope.data.keyWord" class="action-item-w mr10" maxlength="10" placeholder="请输入计划名称"></ly-input>
      <ly-select v-model="scope.data.abc" class="action-item-w mr10">
        <ly-option label="option.operationType" value="0"></ly-option>
      </ly-select>
    </template>
    <template #searchRight>
      <ly-button type="primary" size="medium">审核</ly-button>
    </template>
    <template #searchBottom="scope">
      <ly-input v-model="scope.data.keyWord" class="action-item-w mr10" maxlength="10" placeholder="请输入计划名称"></ly-input>
    </template>
    <template #operate="scope">
      <ly-button size="mini" @click="getInfo">调用表格接口</ly-button>
    </template>
  </ly-table-page>
</template>

<style>
  .action-item-w {
    width: 186px;
  }
  .mr10 {
    margin-right: 10px;
  }
</style>

<script>
  // serve 按实际项目写，实际项目中应该是 import serve from '@http/xxxxx' xxxxx = server目录下的文件名
  const { default: serve} = require('../../utils/server/common-api.js')
  import { reactive, ref } from 'vue'
  import { LyMessage } from 'ly-ui'

  export default {
    setup () {
      const planTablePage = ref(null)
      // search 为动态的参数，一般情况下是检索项
      // request 为调用获取数据时接口需要额外的参数，一般情况下是传一些固定的参数，如ID这些
      const tableConfig = {
        api: serve.planList,
        search: reactive({
          keyWord: '',
          abc: ''
        }),
        request: {
          id: '123'
        },
        header: [
          {
            custom: false, // 自定义则修改为true
            label: '计划名称',
            minWidth: '',
            prop: 'planName',
          },
          {
            label: '关联岗位',
            minWidth: '',
            prop: 'relationDuty',
          },
          {
            label: '关卡数',
            minWidth: '',
            prop: 'levelNum',
            sortable: true,
          },
          {
            label: '创建人',
            minWidth: '',
            prop: 'createName',
          },
          {
            label: '创建时间',
            minWidth: '',
            prop: 'createTimeStr',
            sortable: true,
          },
          {
            label: '计划状态',
            minWidth: '',
            prop: 'planStatusStr',
          },
          {
            custom: true,
            label: '操作',
            minWidth: '100',
            prop: 'operate',
          }
        ]
      }

      function getInfo() {
        planTablePage.value.getInfo()
      }

      return {
        planTablePage,
        getInfo,
        tableConfig,
      }
    }
  }
</script>

```

:::

### 联动视图组件

:::demo

```html
<template>
  <ly-table-page
    :table-config="tableConfig"
    list-id-name="233"
    system-id-name="666"
    :show-table-view="true"
    @get-select-view-field="getSelectViewField"
  >
    <template #search="scope">
      <ly-input v-model="scope.data.keyWord" class="action-item-w mr10" maxlength="10" placeholder="请输入计划名称"></ly-input>
      <ly-select v-model="scope.data.abc" class="action-item-w mr10">
        <ly-option label="option.operationType" value="0"></ly-option>
      </ly-select>
    </template>
    <template #expandprop="{row}">
      <div>{{row}}</div>
    </template>
    <template #operate="scope">
      <a href="javascript:void(0);" class="mr10">修改</a>
    </template>
  </ly-table-page>
</template>

<style>
  .action-item-w {
    width: 186px;
  }
  .mr10 {
    margin-right: 10px;
  }
</style>

<script>
  // serve 按实际项目写，实际项目中应该是 import serve from '@http/xxxxx' xxxxx = server目录下的文件名
  const { default: serve} = require('../../utils/server/common-api.js')
  import { reactive } from 'vue'

  export default {
    setup () {
      const tableConfig = {
        api: serve.planList,
        search: reactive({
          keyWord: '',
          abc: ''
        }),
        header: [
          // 展开行
          {
            type: 'expand',
            prop:'expandprop',
            custom: true,
          },
          {
            width: '55',
            type: 'selection', // 多选框
          },
          {
            label: '序号',
            width: '55',
            type: 'index',
          },
          {
            custom: false, // 自定义则修改为true
            label: '计划名称',
            minWidth: '',
            prop: 'planName',
          },
          {
            label: '关联岗位',
            minWidth: '',
            prop: 'relationDuty',
          },
          {
            label: '关卡数',
            minWidth: '',
            prop: 'levelNum',
            sortable: true,
          },
          {
            label: '创建人',
            minWidth: '',
            prop: 'createName',
          },
          {
            label: '创建时间',
            minWidth: '',
            prop: 'createTimeStr',
            sortable: true,
          },
          {
            label: '启用状态',
            minWidth: '',
            prop: 'planStatus',
          },
          {
            custom: true,
            label: '操作',
            prop: 'operate',
          }
        ]
      }

      // 获取当前选中视图的字段列表
      function getSelectViewField(arr) {
        console.log(arr)
      }

      return {
        tableConfig,
        getSelectViewField,
      }
    }
  }
</script>

```

:::

### TablePage Attributes

注：除了下述参数，TablePage可以额外接收 Table 组件的所有参数与方法。详情看  table表格 组件的文档

| 参数            | 说明                                   | 类型             | 是否必传 | 默认值 |
| --------------- | -------------------------------------- | ---------------- | -------- | ------ |
| isPage          | 是否开启分页                           | Boolean          | false    | true   |
| maxPage         | 最大分页数                             | Number/String    | false    | 0      |
| pageSize        | 默认每页数量                           | Number/String    | false    | 25     |
| customClass     | table-page组件自定义class              | String           | false    |        |
| show-table-view | 是否在搜索栏显示默认的视图组件         | Boolean          | false    | false  |
| firstRequest     | 进页面是否请求表格数据                | Boolean          | false    | true  |
| tableConfig     | 表格配置项，具体见下表                 | Object           | true     | 无     |
| listIdName      | 视图组件联动参数——列表ID               | String           | false    | 无     |
| systemIdName    | 视图组件联动参数——系统ID               | String           | false    | 无     |
| beforeReset     | 点击重置按钮调用接口之前的生命周期回调 | Promise/Function | false    | 无     |
| afterReset      | 点击重置按钮调用接口之后的生命周期回调 | Promise/Function | false    | 无     |
| beforeGetInfo   | 调用搜索接口之前的生命周期回调         | Promise/Function | false    | 无     |
| afterGetInfo    | 调用搜索接口之后的生命周期回调         | Promise/Function | false    | 无     |

### tableConfig
| 参数        | 说明                                             | 类型             | 默认值                                                                                                                                         |
| ----------- | ------------------------------------------------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| header      | 表头数据格式，具体见下表                         | Object           | 无                                                                                                                                             |
| api         | 获取数据接口                                     | Promise          | 无                                                                                                                                             |
| pageMap     | 分页请求时字段名称映射，isPage = true时生效      | Object           | { Size: 'pageSize', No: 'pageNum' }                                                                                                            |
| responseMap | 服务器数据请求返回的结果字段名称映射             | Object           | { Total: 'total', List: 'records' } // 如果 List 传 ''，那么获取的结果直接取data中的数据，如果数据的层次比较深，可以用 . 区分，如 "data.result |
| search      | 搜索参数，传入由 vue的api: reactive() 创建的对象 | Reactive(Object) | 无                                                                                                                                             |
| request     | 调用获取数据时接口需要额外的参数                 | Object           | 无                                                                                                                                             |


### tableConfig.header
| 参数     | 说明                          | 类型    | 默认值 |
| -------- | ----------------------------- | ------- | ------ |
| prop     | 表头对应字段名                | String  | 无     |
| label    | 表头名称                      | String  | 无     |
| minWidth | 表格最小宽度                  | Number  | 无     |
| width    | 表格固定宽度                  | Number  | 无     |
| custom   | 是否自定义属性                | Boolean | 无     |
| noTip    | 是否不显示超出toolTip         | Boolean | 无     |
| sortable | 是否显示表格排序              | Boolean | 无     |
| explain  | 是否显示表格说明              | String  | 无     |
| fixed    | 是否冻结列                    | String  | 无     |
| type     | 特殊列，可选 selection，index | String  | 无     |


### TablePage Methods (ref)
| 方法名      | 说明                                        | 参数 |
| ----------- | ------------------------------------------- | ---- |
| elTableRef  | 表格对应的ref，可以读取到ly-table的所有方法 |      |
| header      | 表格实际显示的头部数据                      |      |
| tableData   | 表格内容的数据                              |      |
| pageInfo    | 表格分页的数据                              |      |
| searchReset | 重置搜索框方法                              |      |
| init        | 重置表格方法（包括分页）                    |      |
| getInfo     | 调用表格接口方法                            |      |
| search      | 调用表格搜索接口方法                        |      |

### TablePage emits
| 名称                  | 说明                       | 返回  |
| --------------------- | -------------------------- | ----- |
| get-select-view-field | 获取当前选中视图的字段列表 | Array |

### TablePage Slot
| name          | 说明                                                                                               |
| ------------- | -------------------------------------------------------------------------------------------------- |
| #search       | 插入搜索框的内容，参数 scope.data => search 的参数, scope.click => 搜索方法                        |
| #searchTop    | 往搜索栏顶部插入内容                                                                               |
| #searchBottom | 往搜索栏底部插入内容                                                                               |
| #searchRight  | 往搜索栏右侧插入内容                                                                               |
| #operate      | 插入操作栏的内容，参数 scope.row => 行的数据, scope.index => 第几行                                |
| #footerLeft   | 插入分页栏左侧的内容                                                                               |
| #{prop}       | 插入自定义的内容 prop = tableConfig.header.prop，参数 scope.row => 行的数据, scope.index => 第几行 |
