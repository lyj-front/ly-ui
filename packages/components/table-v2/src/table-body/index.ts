import {
  defineComponent,
  getCurrentInstance,
  h,
  watch,
  ref,
  onUnmounted,
  onUpdated,
  nextTick
} from 'vue'
import { addClass, removeClass } from '@element-plus/utils/dom'
import isServer from '@element-plus/utils/isServer'
import { hColgroup } from '../h-helper'
import useLayoutObserver from '../layout-observer'
import useRender from './render-helper'
import { removePopper,getRowStartIndexForOffset,getRowStopIndexForStartIndex,getColumnStartIndexForOffset, getColumnStopIndexForStartIndex} from '../util'
import defaultProps from './defaults'
import TableHeader from '../table-header'
import type { VNode } from 'vue'
import type { DefaultRow, Table } from '../table/defaults'
export default defineComponent({
  name: 'LyTableBody',
  props: defaultProps,
  setup(props) {
    let tableData = []
    let columnsData = []
    // if(props.fixed){
    //   props.store.states.columns.value=  []
    //   props.store.states._columns.value=  []
    // }
    const instance = getCurrentInstance()
    const parent = instance.parent as Table<DefaultRow>
    const { wrappedRowRender, tooltipContent, tooltipTrigger } =
      useRender(props)
    const { onColumnsChange, onScrollableChange } = useLayoutObserver(parent)

    watch(props.store.states.hoverRow, (newVal: any, oldVal: any) => {
      if (!props.store.states.isComplex.value || isServer) return
      let raf = window.requestAnimationFrame
      if (!raf) {
        raf = (fn) => window.setTimeout(fn, 16)
      }
      raf(() => {
        const rows = instance.vnode.el.querySelectorAll('.el-table__row')
        const oldRow = rows[oldVal]
        const newRow = rows[newVal]
        if (oldRow) {
          removeClass(oldRow, 'hover-row')
        }
        if (newRow) {
          addClass(newRow, 'hover-row')
        }
      })
    })
    let startIndex = ref()
    let stopIndex = ref()
    const scrollTop = ref(0)
    const columnStartIndex = ref()
    const columnStopIndex = ref()
    const scrollTo = (scrollTop,scrollLeft) => {
      startIndex.value = getRowStartIndexForOffset({rowHeight:props.rowHeight,totalRow:tableData.length,fixedWrapper:props.context.refs.fixedWrapper,rightFixedWrapper:props.context.refs.rightFixedWrapper},scrollTop)
      stopIndex.value = getRowStopIndexForStartIndex({height:props.context.layout.bodyHeight.value,rowHeight:props.rowHeight,totalRow:tableData.length},startIndex.value,scrollTop)
      props.store.states.data.value = tableData.slice(startIndex.value,stopIndex.value+1)


      const leftFixedColumns = columnsData.filter(item=>item.fixed && item.fixed==='left')
      const rightFixedColumns = columnsData.filter(item=>item.fixed && item.fixed==='right')
      const leftFixedWidth = leftFixedColumns.reduce((prev,next)=>{
        return prev + next.width;
      },0)
      columnStartIndex.value = getColumnStartIndexForOffset({columnWidth:props.columnWidth,columnsData,leftFixedWidth},scrollLeft)
      columnStopIndex.value = getColumnStopIndexForStartIndex({columnWidth:props.columnWidth,columnsData,width:props.context.refs.bodyWrapper.clientWidth},columnStartIndex.value,scrollLeft)
      if(!props.fixed) {
        // console.log(columnStartIndex.value,columnStopIndex.value+1,11111111111)
        props.store.states.columns.value = columnsData.slice(columnStartIndex.value,columnStopIndex.value+1)
      }
      // props.store.states.columns.value = leftFixedColumns.concat(arr.slice(columnStartIndex.value,columnStopIndex.value+1)).concat(rightFixedColumns)
      // props.context.refs.fixedBodyWrapper.querySelector('.el-table__body')?.scrollTo(0,scrollTop)
    }
    const onScroll = (e) => {
      scrollTop.value = e.target.scrollTop
      const scrollLeft = e.target.scrollLeft
      props.context.refs.headerWrapper.querySelector('.el-table__header')?.setAttribute('style',`transform:translateX(${-scrollLeft}px);`)
      if(props.context.refs?.rightFixedWrapper) {
        props.context.refs.rightFixedWrapper.querySelector('.el-table__body').scrollLeft = 10000000
      }
      if(!props.fixed) {
        scrollTo(scrollTop.value,scrollLeft)
      }
    }
    watch(()=>props.store.states._data.value,function(val){
      tableData = val
      scrollTo(0,0)
    })
    watch(()=>props.store.states._columns.value,function(val){
      columnsData = val
    },{
      immediate:true
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
      onScroll,
      wrappedRowRender,
      tooltipContent,
      startIndex,
      columnStartIndex,
      totalRow:tableData.length,
      rowHeight:props.rowHeight,
      scrollTop:scrollTop.value,
      tooltipTrigger,
    }
  },
  render() {
    const data = this.store.states.data.value || []
    let fixedHeight = 0
    if(this.context?.layout?.bodyHeight?.value && this.context?.layout?.headerHeight?.value){
      fixedHeight = this.context?.layout?.bodyHeight?.value+8
    }
    return h(
      'table',
      {
        class: 'el-table__body',
        cellspacing: '0',
        cellpadding: '0',
        border: '0',
        style:`${!this.fixed?'height:100%':'height:calc(100% + '+(this.scrollTop % this.rowHeight)+')'};overflow-y:auto;display:block;position:relative;${this.fixed?'overflow-x:hidden;':''}`,
        onscroll:!this.fixed && this.onScroll
      },
      [
        hColgroup(this.fixed?this.store.states._columns.value:this.store.states.columns.value),
        h('tbody', {
          style:`height:${this.fixed?'100%;':this.store.states._data.value.length*this.rowHeight}px;width:${!this.fixed?this.context.layout.scrollWidth.value+'px':''};display:block;`
        }, [
          data.reduce((acc: VNode[], row) => {
            return acc.concat(this.wrappedRowRender({...row,fixed:this.fixed}, acc.length,this.startIndex,this.columnStartIndex))
          }, []),
        ]),
      ]
    )
  },
})
