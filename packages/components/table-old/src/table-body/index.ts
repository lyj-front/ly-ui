import {
  defineComponent,
  getCurrentInstance,
  h,
  watch,
  onUnmounted,
  onUpdated,
} from 'vue'
import { addClass, removeClass } from '@element-plus/utils/dom'
import isServer from '@element-plus/utils/isServer'
import { hColgroup } from '../h-helper'
import useLayoutObserver from '../layout-observer'
import useRender from './render-helper'
import { removePopper } from '../util'
import defaultProps from './defaults'

import type { VNode } from 'vue'
import type { DefaultRow, Table } from '../table/defaults'

export default defineComponent({
  name: 'LyTableBody',
  props: defaultProps,
  setup(props) {
    const instance = getCurrentInstance()
    const parent = instance.parent as Table<DefaultRow>
    
    function updateRowClasses(rows: HTMLElement[], oldVal: number, newVal: number) {
      if (oldVal !== null && rows[oldVal]) {
        removeClass(rows[oldVal], 'hover-row');
      }
      if (newVal !== null && rows[newVal]) {
        addClass(rows[newVal], 'hover-row');
      }
    }
    const { wrappedRowRender, tooltipContent, tooltipTrigger } =
      useRender(props)
    const { onColumnsChange, onScrollableChange } = useLayoutObserver(parent)
    let raf = window.requestAnimationFrame
    if (!raf) {
      raf = (fn) => window.setTimeout(fn, 16)
    }
    watch(props.store.states.hoverRow, (newVal: any, oldVal: any) => {
      if (!props.store.states.isComplex.value || isServer) return
      const rows = Array.from(
        instance?.vnode.el?.querySelectorAll('.el-table__row') || []
      ) as HTMLElement[];
      
      raf(() => updateRowClasses(rows, oldVal, newVal))
    })

    onUnmounted(() => {
      removePopper?.()
    })
    onUpdated(() => {
      removePopper?.()
    })

    return {
      onColumnsChange,
      onScrollableChange,
      wrappedRowRender,
      tooltipContent,
      tooltipTrigger,
    }
  },
  render() {
    const data = this.store.states.data.value || []
    return h(
      'table',
      {
        class: 'el-table__body',
        cellspacing: '0',
        cellpadding: '0',
        border: '0',
      },
      [
        hColgroup(this.store.states.columns.value),
        h('tbody', {}, [
          data.reduce((acc: VNode[], row) => {
            return acc.concat(this.wrappedRowRender(row, acc.length))
          }, []),
        ]),
      ]
    )
  },
})
