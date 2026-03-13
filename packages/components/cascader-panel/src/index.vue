<template>
  <div
    :class="['el-cascader-panel', border && 'is-bordered']"
    @keydown="handleKeyDown"
  >
    <ly-cascader-menu
      v-for="(menu, index) in menus"
      :key="index"
      :ref="(item) => (menuList[index] = item)"
      :index="index"
      :nodes="menu"
    />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUpdate,
  onMounted,
  provide,
  reactive,
  Ref,
  ref,
  watch,
} from 'vue'
import isEqual from 'lodash/isEqual'
import { EVENT_CODE } from '@element-plus/utils/aria'
import { UPDATE_MODEL_EVENT, CHANGE_EVENT } from '@element-plus/utils/constants'
import isServer from '@element-plus/utils/isServer'
import scrollIntoView from '@element-plus/utils/scroll-into-view'
import {
  arrayFlat,
  coerceTruthyValueToArray,
  deduplicate,
  isEmpty,
} from '@element-plus/utils/util'

import LyCascaderMenu from './menu.vue'
import Store from './store'
import Node from './node'
import { CommonProps, useCascaderConfig } from './config'
import {
  checkNode,
  focusNode,
  getMenuIndex,
  getSibling,
  sortByOriginalOrder,
} from './utils'
import { default as CascaderNode, ExpandTrigger } from './node'
import { CASCADER_PANEL_INJECTION_KEY } from './types'

import type { PropType } from 'vue'
import type { Nullable } from '@element-plus/utils/types'
import type {
  CascaderValue,
  CascaderNodeValue,
  CascaderOption,
  RenderLabel,
} from './node'

import { LyCascaderPanelContext } from './types'

const ajax = function( url ){
  return new Promise(r => {
    const http = new XMLHttpRequest()
    http.open('get', url)
    http.send()
    http.onreadystatechange = function () {
      if (http.readyState == 4) {
        const jsonData = JSON.parse(http.responseText)
        r(jsonData)
      }
    }
  })
}

export default defineComponent({
  name: 'LyCascaderPanel',

  components: {
    LyCascaderMenu,
  },

  props: {
    ...CommonProps,
    border: {
      type: Boolean,
      default: true,
    },
    renderLabel: Function as PropType<RenderLabel>,
  },

  emits: [UPDATE_MODEL_EVENT, CHANGE_EVENT, 'close', 'expand-change'],

  setup(props, { emit, slots }) {
    let initialLoaded = true
    // for interrupt sync check status in lazy mode
    let manualChecked = false

    let initStoreFlag = true

    const config = useCascaderConfig(props)

    const store: Ref<Store> = ref(null)
    const menuList = ref([])
    const checkedValue: Ref<Nullable<CascaderValue>> = ref(null)
    const menus: Ref<CascaderNode[][]> = ref([])
    const expandingNode: Ref<Nullable<CascaderNode>> = ref(null)
    const checkedNodes: Ref<CascaderNode[]> = ref([])

    const isHoverMenu = computed(
      () => config.value.expandTrigger === ExpandTrigger.HOVER
    )
    const renderLabelFn = computed(() => props.renderLabel || slots.default)

    let oldConfig: typeof config
    let oldOptions: CascaderOption[]
    const initStore = (refresh) => {
      const { options } = props
      const cfg = config.value
      const configTemp = config
      if (
        oldOptions === undefined ||
        oldConfig === undefined ||
        oldOptions !== options ||
        configTemp !== oldConfig ||
        refresh
      ) {
        manualChecked = false
        store.value = new Store(options, cfg)
        menus.value = [store.value.getNodes()]
        // city是true就是当前的组件是城市选取
        if (cfg.city) {
          const urlCity = '/community/city/city-simpleSearch?deeps='
          cfg.value = 'code'
          cfg.label = 'name'
          cfg.lazy = true
          cfg.lazyLoad = function (node, resolve) {
            ajax(`${urlCity}${cfg.deepsInitialValue + node.level + 1}&parentCode=${node.value}`).then(
              (r) => {
                if (r.citys && Array.isArray(r.citys)) {
                  const rData = r.citys.map((i) => {
                    return {
                      ...i,
                      leaf: node.level == Number(cfg.cityLevel) - 1,
                      disabled: cfg.disabledCity.includes(i.code),
                    }
                  })
                  resolve(rData)
                }
              }
            )
          }
          ajax(urlCity + (cfg.deepsInitialValue + 1)).then((r: any) => {
            if (r.citys && Array.isArray(r.citys)) {
              const rData = r.citys.map((i) => {
                return {
                  ...i,
                  leaf: cfg.cityLevel == 1,
                  disabled: cfg.disabledCity.includes(i.code),
                }
              })
              store.value.appendNodes(rData, null)
              // 回显处理
              if (
                props.modelValue &&
                Array.isArray(props.modelValue) &&
                (cfg.cityLevel >= props.modelValue.length ||
                  (cfg.multiple &&
                    props.modelValue.length > 0 &&
                    cfg.cityLevel == props.modelValue[0].length))
              ) {
                //递归获取一下当前的数据props.modelValue
                const findNodes = [];
                const handleShow = function(list1){
                  let _index = 0 //记录一次当前递归的索引
                  const dg = function () {
                    const findNode = store.value.allNodes.find((i) => {
                      return i.value == list1[_index]
                    })
                    findNodes.push(findNode)
                    if (_index == cfg.cityLevel - 1){
                      syncMenuState(findNodes, false)
                      return
                    }
                    _index++
                    if (findNode) {
                      cfg.lazyLoad(findNode, (list) => {
                        findNode.loaded = true
                        store.value.appendNodes(list, findNode)
                        dg()
                      })
                    }
                  }
                  dg()
                }
                if (cfg.multiple) {
                  props.modelValue.forEach((item) => {
                    handleShow(item)
                  })
                } else {
                  handleShow(props.modelValue)
                }
              }
            }
          })
        } else if (cfg.lazy && isEmpty(props.options)) {
          initialLoaded = false
          lazyLoad(null, () => {
            initialLoaded = true
            syncCheckedValue(false, true)
          })
        } else {
          syncCheckedValue(false, true)
        }
      }

      oldConfig = configTemp
      oldOptions = options
    }

    const lazyLoad: LyCascaderPanelContext['lazyLoad'] = (node, cb) => {
      const cfg = config.value
      node = node || new Node({}, cfg, null, true)
      node.loading = true

      const resolve = (dataList: CascaderOption[]) => {
        const parent = node.root ? null : node
        dataList && store.value.appendNodes(dataList, parent)
        node.loading = false
        node.loaded = true
        node.childrenData = node.childrenData || []
        cb && cb(dataList)
      }

      cfg.lazyLoad(node, resolve)
    }

    const expandNode: LyCascaderPanelContext['expandNode'] = (node, silent) => {
      const { level } = node
      const newMenus = menus.value.slice(0, level)
      let newExpandingNode: Nullable<CascaderNode>

      if (node.isLeaf) {
        newExpandingNode = node.pathNodes[level - 2]
      } else {
        newExpandingNode = node
        newMenus.push(node.children)
      }

      if (expandingNode.value?.uid !== newExpandingNode?.uid) {
        expandingNode.value = node
        menus.value = newMenus
        !silent && emit('expand-change', node?.pathValues || [])
      }
    }

    const handleCheckChange: LyCascaderPanelContext['handleCheckChange'] = (
      node,
      checked,
      emitClose = true
    ) => {
      const { checkStrictly, multiple } = config.value
      const oldNode = checkedNodes.value[0]
      manualChecked = true

      !multiple && oldNode?.doCheck(false)
      node.doCheck(checked)
      calculateCheckedValue()
      emitClose && !multiple && !checkStrictly && emit('close')
    }

    const getFlattedNodes = (leafOnly: boolean) => {
      return store.value.getFlattedNodes(leafOnly)
    }

    const getCheckedNodes = (leafOnly: boolean) => {
      return getFlattedNodes(leafOnly).filter((node) => node.checked !== false)
    }

    const clearCheckedNodes = () => {
      checkedNodes.value.forEach((node) => node.doCheck(false))
      calculateCheckedValue()
    }

    const calculateCheckedValue = () => {
      const { checkStrictly, multiple } = config.value
      const oldNodes = checkedNodes.value
      const newNodes = getCheckedNodes(!checkStrictly)
      // ensure the original order
      const nodes = sortByOriginalOrder(oldNodes, newNodes)
      const values = nodes.map((node) => node.valueByOption)
      checkedNodes.value = nodes
      checkedValue.value = multiple ? values : values[0] ?? null
    }

    const syncCheckedValue = (loaded = false, forced = false) => {
      const { modelValue } = props
      const { lazy, multiple, checkStrictly,city } = config.value
      const leafOnly = !checkStrictly

      if (
        !initialLoaded ||
        manualChecked ||
        (!forced && isEqual(modelValue, checkedValue.value))
      )
        return

      if (lazy && !loaded && !city) {
        const values: CascaderNodeValue[] = deduplicate(
          arrayFlat(coerceTruthyValueToArray(modelValue))
        )
        const nodes = values
          .map((val) => store.value.getNodeByValue(val))
          .filter((node) => !!node && !node.loaded && !node.loading)

        if (nodes.length) {
          nodes.forEach((node) => {
            lazyLoad(node, () => syncCheckedValue(false, forced))
          })
        } else {
          syncCheckedValue(true, forced)
        }
      } else {
        const values = multiple
          ? coerceTruthyValueToArray(modelValue)
          : [modelValue]
        const nodes = deduplicate(
          values.map((val) => store.value.getNodeByValue(val, leafOnly))
        )
        syncMenuState(nodes, false)
        checkedValue.value = modelValue
      }
    }

    const syncMenuState = (
      newCheckedNodes: CascaderNode[],
      reserveExpandingState = true
    ) => {
      const { checkStrictly } = config.value
      const oldNodes = checkedNodes.value
      const newNodes = newCheckedNodes.filter(
        (node) => !!node && (checkStrictly || node.isLeaf)
      )
      const oldExpandingNode = store.value.getSameNode(expandingNode.value)
      const newExpandingNode =
        (reserveExpandingState && oldExpandingNode) || newNodes[0]

      if (newExpandingNode) {
        newExpandingNode.pathNodes.forEach((node) => expandNode(node, true))
      } else {
        expandingNode.value = null
      }

      oldNodes.forEach((node) => node.doCheck(false))
      newNodes.forEach((node) => node.doCheck(true))

      checkedNodes.value = newNodes
      nextTick(scrollToExpandingNode)
    }

    const scrollToExpandingNode = () => {
      if (isServer) return

      menuList.value.forEach((menu) => {
        const menuElement = menu?.$el
        if (menuElement) {
          const container = menuElement.querySelector('.el-scrollbar__wrap')
          const activeNode =
            menuElement.querySelector('.el-cascader-node.is-active') ||
            menuElement.querySelector('.el-cascader-node.in-active-path')
          scrollIntoView(container, activeNode)
        }
      })
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const { code } = e

      switch (code) {
        case EVENT_CODE.up:
        case EVENT_CODE.down:
          const distance = code === EVENT_CODE.up ? -1 : 1
          focusNode(getSibling(target, distance))
          break
        case EVENT_CODE.left:
          const preMenu = menuList.value[getMenuIndex(target) - 1]
          const expandedNode = preMenu?.$el.querySelector(
            '.el-cascader-node[aria-expanded="true"]'
          )
          focusNode(expandedNode)
          break
        case EVENT_CODE.right:
          const nextMenu = menuList.value[getMenuIndex(target) + 1]
          const firstNode = nextMenu?.$el.querySelector(
            '.el-cascader-node[tabindex="-1"]'
          )
          focusNode(firstNode)
          break
        case EVENT_CODE.enter:
          checkNode(target)
          break
        case EVENT_CODE.esc:
        case EVENT_CODE.tab:
          emit('close')
          break
      }
    }


    provide(
      CASCADER_PANEL_INJECTION_KEY,
      reactive({
        config,
        expandingNode,
        checkedNodes,
        isHoverMenu,
        renderLabelFn,
        lazyLoad,
        expandNode,
        handleCheckChange,
      })
    )

    watch([config, () => props.options], () => initStore(), {
      deep: true,
      immediate: true,
    })

    watch(
      () => props.modelValue,
      () => {
        if (props.props && props.props.city && initStoreFlag) {
          initStore(true)
        } else {
          manualChecked = false
          syncCheckedValue()
        }
        initStoreFlag = true
      }
    )

    watch(checkedValue, (val) => {
      if (!isEqual(val, props.modelValue)) {
        initStoreFlag = false
        emit(UPDATE_MODEL_EVENT, val)
        emit(CHANGE_EVENT, val)
      }
    })

    onBeforeUpdate(() => (menuList.value = []))

    onMounted(() => !isEmpty(props.modelValue) && syncCheckedValue())

    return {
      menuList,
      menus,
      checkedNodes,
      handleKeyDown,
      handleCheckChange,
      syncCheckedValue,
      getFlattedNodes,
      getCheckedNodes,
      clearCheckedNodes,
      calculateCheckedValue,
      scrollToExpandingNode,
    }
  },
})
</script>
