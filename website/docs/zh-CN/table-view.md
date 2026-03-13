## TableView 表格联动视图组件

表格联动视图组件，PS: ly-table-page 组件可以直接启用默认的 ly-table-view 不需要另外单独写一次，这里演示的是单独写的做法（视图组件不放在默认位置，而是自定义位置）

### 与table-page组件开拆的使用方法

:::demo 一般全局就放一个，要配合 ly-table 使用

```html
<template>
  <ly-table-page
    list-id-name="233"
    system-id-name="666"
    showTableView
    :table-config="tableConfig"
  >
    <template #operate="scope">
      <a href="javascript:void(0);" class="mr10">修改</a>
    </template>
  </ly-table-page>
</template>

<style>
  .table-config-box {
    position: relative;
    height: 30px;
    .right-but {
      position: absolute;
      top: 0;
      right: 0;
      line-height: 30px;
      display: flex;
    }
    .ly-table-view {
      margin-right: 28px;
    }
  }
</style>

<script>
  import { LyMessage } from 'ly-ui'
  // server 按实际项目写，实际项目中应该是 import server from '@http/xxxxx' xxxxx = server目录下的文件名
  const { default: server} = require('../../utils/server/common-api.js')

  export default {
    setup () {
      const tableConfig = {
        api: server.planList,
        search:{

        },
        pageMap: {
          Size: 'pageSize',
          No: 'pageNum',
        },
        header: [
          {
            custom: false, // 自定义则修改为true
            label: '计划名称',
            minWidth: '100',
            prop: 'planName',
          },
          {
            label: '关联岗位',
            minWidth: '100',
            prop: 'relationDuty',
          },
          {
            label: '关卡数',
            minWidth: '100',
            prop: 'levelNum',
          },
          {
            label: '创建人',
            minWidth: '100',
            prop: 'createName',
          },
          {
            label: '创建时间',
            minWidth: '100',
            prop: 'createTimeStr',
          },
          {
            label: '启用状态',
            minWidth: '100',
            prop: 'planStatus',
          },
          {
            custom: true,
            label: '操作',
            width: '100',
            prop: 'operate',
          }
        ]
      }

      return {
        tableConfig,
      }
    }
  }
</script>

```

:::

### table-page联动视图组件

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
        // console.log(arr)
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


### Attributes

| 参数                | 说明              | 类型    | 默认值 |
| ------------------- | ----------------  | ------- | ------ |
| list-id-name        | 列表ID            | string  | 无  |
| system-id-name      | 系统ID            | string  | 无  |

### 如何获取 list-id-name、system-id-name ？

前往视图配置页面 [测试环境](https://itest.leyoujia.com/lyj-menu/syssetting/SYS_VIEW#/)、[正式环境](https://i.leyoujia.com/lyj-menu/syssetting/SYS_VIEW#/) 页面配置相关的系统信息以及列表信息

注意：系统ID与列表ID不要乱起名字。

命名规则：

系统ID: 项目名(英文)

列表ID: 项目名_页面名_1 ()


### 对接表格

目前 table-view 只能与 table-page 组件联动使用，同上给表格添加上这两个属性，并且保持 table-page 传入的 tableConfig.header.prop 与视图配置页面的字段配置一致即可

| 参数                | 说明              | 类型    | 默认值 |
| ------------------- | ----------------  | ------- | ------ |
| list-id-name        | 列表ID            | string  | 无  |
| system-id-name      | 系统ID            | string  | 无  |
