<template>
  <!-- eslint-disable vue/attributes-order -->
  <!-- eslint-disable vue/no-multiple-template-root -->
  <ly-container
    :class="['ly-table-page', customClass]"
    v-loading="tableLoading"
  >
    <slot name="searchTop" :data="search" :click="getInfo"></slot>
    <ly-header class="search-header" v-if="search">
      <span class="select-text mr10">选择:</span>
      <div class="search-box">
        <slot name="search" :data="search" :click="getInfo"></slot>
        <div class="search-box-but">
          <ly-button type="primary" size="medium" @click="searchConfirm">
            查询
          </ly-button>
          <ly-button size="medium" @click="searchReset">重置</ly-button>
          <slot name="searchRight" :data="search" :click="getInfo"></slot>
        </div>
      </div>
      <ly-table-view
        class="table-page-view"
        v-if="showTableView"
        :list-id-name="listIdName"
        :system-id-name="systemIdName"
        :system-view-table-list="systemViewTableList"
        :user-view-table-list="userViewTableList"
        :table-filter-status="tableFilterStatus"
        @useViewChange="useViewChange"
      ></ly-table-view>
    </ly-header>
    <slot name="searchBottom" :data="search" :click="getInfo"></slot>
    <div class="block-line-10" v-if="search && !border"></div>
    <ly-main>
      <ly-table
        v-bind="$attrs"
        :updateOffset="updateChildOffset"
        :data="tableData"
        :border="border"
        :height="height"
        style="width: 100%"
        tooltip-effect="dark"
        ref="elTableRef"
        stripe
        @row-dblclick="
          (...args) => {
            $emit('row-dblclick', ...args)
          }
        "
        @select="
          (...args) => {
            $emit('select', ...args)
          }
        "
        @select-all="
          (...args) => {
            $emit('select-all', ...args)
          }
        "
        @selection-change="
          (...args) => {
            $emit('selection-change', ...args)
          }
        "
        @cell-mouse-enter="
          (...args) => {
            $emit('cell-mouse-enter', ...args)
          }
        "
        @cell-mouse-leave="
          (...args) => {
            $emit('cell-mouse-leave', ...args)
          }
        "
        @cell-click="
          (...args) => {
            $emit('cell-click', ...args)
          }
        "
        @cell-dbl-click="
          (...args) => {
            $emit('cell-dbl-click', ...args)
          }
        "
        @row-click="
          (...args) => {
            $emit('row-click', ...args)
          }
        "
        @row-contextmenu="
          (...args) => {
            $emit('row-contextmenu', ...args)
          }
        "
        @header-click="
          (...args) => {
            $emit('header-click', ...args)
          }
        "
        @header-contextmenu="
          (...args) => {
            $emit('header-contextmenu', ...args)
          }
        "
        @sort-change="
          (...args) => {
            $emit('sort-change', ...args)
          }
        "
        @filter-change="
          (...args) => {
            $emit('filter-change', ...args)
          }
        "
        @current-change="
          (...args) => {
            $emit('current-change', ...args)
          }
        "
        @header-dragend="
          (...args) => {
            $emit('header-dragend', ...args)
          }
        "
        @expand-change="
          (...args) => {
            $emit('expand-change', ...args)
          }
        "
      >
        <ly-table-column
          v-for="(config, index) in header"
          :key="config.prop"
          :show-overflow-tooltip="!config.noTip"
          :type="config.type"
          :prop="config.prop"
          :label="config.label"
          :sortable="config.sortable"
          :explain="config.explain"
          :min-width="config.minWidth"
          :width="config.width + 'px'"
          :fixed="config.fixed"
          :selectable="config.selectable"
          :reserve-selection="config.reserveSelection"
          :render-header="config.renderHeader"
        >
          <template v-if="config.custom" #default="scope">
            <slot
              :name="config.prop"
              :row="scope.row"
              :index="scope.$index"
            ></slot>
          </template>
        </ly-table-column>
      </ly-table>
    </ly-main>
    <ly-footer height="62px" v-if="isPage">
      <div class="foot-btn">
        <slot name="footerLeft">
          <ly-button v-if="isSelection" size="medium" @click="selectAll"
            >全选</ly-button
          >
          <ly-button v-if="isSelection" size="medium" @click="resetSelect"
            >反选</ly-button
          >
        </slot>
      </div>

      <ly-pagination
        v-if="isShowPage"
        @size-change="sizeChange"
        @current-change="currentChange"
        v-model:current-page="pageInfo.No"
        v-model:page-size="pageInfo.Size"
        v-model:total="pageInfo.trueTotal"
        :page-sizes="pageSizes"
        layout="slot, sizes, prev, pager, next, jumper"
      >
        <span class="total-text">共 {{ pageInfo.Total }} 条</span>
      </ly-pagination>
    </ly-footer>
  </ly-container>
</template>

<script>
import { ref, computed, toRefs,watch, defineComponent, provide,nextTick } from 'vue'
import { PaginationControl } from './../../pagination'
import { useServe, setViewApi } from '@element-plus/hooks'
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  )
}
const updateChildOffset = ref(false)
function getTableData(tableConfig, props, emit) {
  const {
    isPage,
    isShowPage,
    maxPage,
    listIdName,
    systemIdName,
    beforeReset,
    afterReset,
    beforeGetInfo,
    afterGetInfo,
    pageSize,
    firstRequest
  } = props
  const headerBackups = JSON.parse(JSON.stringify(tableConfig.header))
  const header = ref(tableConfig.header)
  const {
    api,
    pageMap = { Size: 'pageSize', No: 'pageNum' },
    responseMap = { Total: 'total', List: 'records' },
    // , No: 'current'
    search,
    request = {},
  } = tableConfig
  const {
    pageInfo,
    pageReset,
    handleSizeChange,
    handleCurrentChange,
    getTotal,
  } = PaginationControl(maxPage, pageSize)
  const tableData = ref([])
  let searchBackups = null
  if (search) {
    searchBackups = JSON.parse(JSON.stringify(search))
  }
  // 判断是否存在多选
  const isSelection = computed(() => {
    return (tableConfig.header || []).some((item) => item.type === 'selection')
  })

  async function init() {
    if (!!listIdName && !!systemIdName) {
      try {
        await getField()
        setViewApi(listIdName, systemIdName, getField)
      } catch (error) {}
    }
    pageReset()
    if(firstRequest){
      getInfo()
    }
  }

  // 获取配置的字段
  const systemViewTableList = ref([])
  const userViewTableList = ref([])
  const tableFilterStatus = ref(false)
  async function getField() {
    const res = await useServe.http('getViewTable', {
      listIdName,
      systemIdName,
    })
    systemViewTableList.value = res.data.systemViewTableList || []
    userViewTableList.value = res.data.userViewTableList || []
    tableFilterStatus.value = res.data?.filterStatus == 1 ? true : false
    const isInitView = systemViewTableList.value[0].useStatus;
    const { data } = await useServe.http('getViewFieldById', {
      listIdName,
      systemIdName,
    })
    // data 即即将要显示的字段名，遍历 data 配置 tableConfig 表格对应要展示的字段
    if (!!data) {
      const headerMap = []

      // 注入 type 类型，注意，这样子写，会导致，type类型的表头，一定会按照前端代码书写的顺序，被移动到正式使用的表头的最前面
      headerBackups.forEach((hItem) => {
        if (!!hItem.type) {
          headerMap.push(hItem)
        }
      })
      // 按照视图组件返回的顺序，生成中间内容
      data.forEach((item) => {
        const headerItem = headerBackups.find(
          (hItem) => hItem.prop == item.fieldIdName && !hItem.type
        )
        if (headerItem) {
          if (item.fieldName) {
            headerItem.label = item.fieldName
          }
          if (isInitView) {
            // 原始视图时protoHide：0不隐藏 1隐藏
            if (!item.protoHide) {
              headerMap.push(headerItem)
            }
          } else {
            headerMap.push(headerItem)
          }
        }
      })
      // 最后注入 operate
      const headerOperate = headerBackups.find(
        (hItem) => hItem.prop == 'operate'
      )
      if (headerOperate) {
        headerMap.push(headerOperate)
      }

      header.value = headerMap
      emit('getSelectViewField', headerMap)
    }
  }

  const tableLoading = ref(false)
  // 获取数据
  async function getInfo() {
    try{
    await fncToPromise(beforeGetInfo())
    // query 指定参数
    let query = JSON.parse(JSON.stringify(request))
    // 是否需要分页
    if (isPage) {
      query = {
        ...query,
        [pageMap.Size]: pageInfo.Size,
        [pageMap.No]: pageInfo.No,
      }
    }

    // 是否需要搜索
    if (search) {
      query = {
        ...query,
        ...JSON.parse(JSON.stringify(search)),
      }
    }
      tableLoading.value = true
      const res = await api(query)
      tableLoading.value = false
      await fncToPromise(afterGetInfo(res))
      tableData.value = responseMap.List ? responseMapGetData(res.data, responseMap.List) : res.data
      if (isPage) {
        pageInfo.Total = responseMapGetData(res.data, responseMap.Total)
        getTotal()
      }
      nextTick(()=>{
        updateChildOffset.value = true;
        setTimeout(() => {
          updateChildOffset.value = false
        }, 1000);
      })
      return res
    } catch (error) {
      tableLoading.value = false
      await fncToPromise(afterGetInfo(error))
      return error
    }
  }

  async function searchReset() {
    try{
    Object.keys(search).forEach((key) => {
      search[key] = searchBackups[key]
    })
    await fncToPromise(beforeReset())
    const res = await getInfo()
    await fncToPromise(afterReset(res))
    }catch(err){}
  }

  async function searchConfirm() {
    await getInfo()
  }

  return {
    header,
    tableData,
    pageInfo,
    isSelection,
    systemViewTableList,
    userViewTableList,
    tableFilterStatus,
    searchReset,
    init,
    searchConfirm,
    tableLoading,
    getInfo,
    search,
    sizeChange: compose(getInfo, handleSizeChange),
    currentChange: compose(getInfo, handleCurrentChange),
  }
}

// 处理回调函数为promise
const fncToPromise = (fnc) => {
  if (!fnc) fnc = Function.prototype
  return isPromise(fnc)
    ? fnc
    : new Promise((res, rej) => {
        try {
          fnc()
          res()
        } catch (error) {
          rej(error)
        }
      })
}

// 判断promise对象
const isPromise = (val) => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

const isObject = (val) =>
  val !== null && (typeof val === 'object' || typeof val === 'function')
const isFunction = (val) => typeof val === 'function'

// 通过 ResponseMap 获取数据信息
function responseMapGetData(data, responseMap) {
  let result = data
  responseMap.split('.').forEach((key) => {
    result = result[key]
  })
  return result
}

/**
 * A/ ComponemtAttribute 组件自定义属性
 * 3、isPage        是否开启分页，默认是
 * 4、tableConfig   表格配置项
 * tableConfig.api          请把接口配置在 listServer.js 中
 * tableConfig.header       表头数据格式
 * tableConfig.header.label     表头名称
 * tableConfig.header.prop      表头对应字段名
 * tableConfig.header.custom    是否自定义属性
 * tableConfig.pageMap     分页映射， 默认值 { Size: 'pageSize', No: 'pageNum' }
 * tableConfig.responseMap  获取数据映射，默认值 { Total: 'total', list: 'records' } ; PS： 如果 list 传 ''，那么获取的结果直接取 data的数据
 * tableConfig.search       搜索框，请传入 reactive 格式的数据
 * tableConfig.request      搜索接口特殊参数
 *
 * B/ ref 方法
 * ref.value.getInfo      调用表格接口方法
 * ref.value.init         重置表格方法（包括分页）
 * ref.value.searchReset  重置搜索框方法
 *
 * C/ slot 插槽属性
 * slot #search
 * scope.data   search 的参数
 * scope.click  搜索方法
 *
 * slot #{prop}
 * scope.row    行的数据
 * scope.index  第几行
 */
const ListTablePage = defineComponent({
  name: 'LyTablePage',
  props: {
    customClass: {
      type: String,
      default: '',
    },
    updateOffset:{
      type:Boolean,
      default:false
    },
    isPage: {
      type: Boolean,
      required: false,
      default: true,
    },
    isShowPage: {
      type: Boolean,
      required: false,
      default: true,
    },
    maxPage: {
      type: [Number, String],
      required: false,
      default: 0,
    },
    pageSize: {
      type: [Number, String],
      required: false,
      default: 25,
    },
    pageSizes: {
      type: Array,
      required: false,
      default: () => [25, 50, 75, 100, 200],
    },
    tableConfig: {
      type: Object,
      required: true,
    },
    showTableView: {
      type: Boolean,
      default: false,
    },
    listIdName: {
      type: String,
      default: '',
    },
    systemIdName: {
      type: String,
      default: '',
    },
    beforeReset: {
      type: Function,
      default: Function.prototype,
    },
    afterReset: {
      type: Function,
      default: Function.prototype,
    },
    beforeGetInfo: {
      type: Function,
      default: Function.prototype,
    },
    afterGetInfo: {
      type: Function,
      default: Function.prototype,
    },
    height: {
      type: [String, Number],
      default: '100%',
    },
    firstRequest:{
      type: Boolean,
      default: true
    },
    border:{
      type: Boolean,
      default: false
    },
  },
  emits: [
    'select',
    'select-all',
    'selection-change',
    'cell-mouse-enter',
    'cell-mouse-leave',
    'cell-click',
    'cell-dbl-click',
    'row-click',
    'row-contextmenu',
    'row-dblclick',
    'header-click',
    'header-contextmenu',
    'sort-change',
    'filter-change',
    'current-change',
    'header-dragend',
    'expand-change',
    'getSelectViewField'
  ],
  setup(props, { emit }) {
    const { tableConfig } = toRefs(props)
    const tabAll = getTableData(tableConfig.value, props, emit)
    const elTableRef = ref(null)
    function selectAll() {
      if (!elTableRef.value.store.states.isAllSelected.value) {
        elTableRef.value.toggleAllSelection()
      }
    }
    watch(()=>props.updateOffset,function(val){
      updateChildOffset.value = val
    })
    function resetSelect() {
      ;(tabAll.tableData.value || []).forEach((row) => {
        elTableRef.value.toggleRowSelection(row)
      })
    }
    provide('elTableRef', elTableRef)

    tabAll.init()

    function useViewChange(flag) {
      // eslint-disable-next-line no-console
      // console.log('是否重置查询条件: ', flag)
      if (flag == 1) {
        // 重置
        tabAll.searchReset()
      } else {
        // 查询
        tabAll.getInfo()
      }
    }

    return {
      elTableRef,
      updateChildOffset,
      ...tabAll,
      selectAll,
      resetSelect,
      useViewChange,
    }
  },
})

export { ListTablePage as default }
</script>
