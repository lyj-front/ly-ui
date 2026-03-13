<template>
  <div
    ref="elTableRef"
    :class="[
      {
        'el-table--fit': fit,
        'el-table--striped': border ? false : stripe,
        'el-table--border': border || isGroup,
        'el-table--hidden': isHidden,
        'el-table--group': isGroup,
        'el-table--fluid-height': maxHeight,
        'el-table--scrollable-x': layout.scrollX.value,
        'el-table--scrollable-y': layout.scrollY.value,
        'el-table--enable-row-hover': !store.states.isComplex.value,
        'el-table--enable-row-transition':
          (store.states.data.value || []).length !== 0 &&
          (store.states.data.value || []).length < 100,
      },
      tableSize ? `el-table--${tableSize}` : '',
      className,
      'el-table',
      layout.headerFixed?'el-table-header-fixed':'',
      layout.scrollBarFixed && layout.scrollX.value?'el-table-scrollbar-fixed':''
    ]"
    :style="style"
    @mouseleave="handleMouseLeave()"
  >
    <div ref="hiddenColumns" class="hidden-columns">
      <slot></slot>
    </div>
    <div
      v-if="showHeader"
      ref="headerWrapper"
      v-mousewheel="handleHeaderFooterMousewheel"
      class="el-table__header-wrapper"
    >
      <div>
        <table-header
          ref="tableHeader"
          :border="border"
          :sort-always-show="sortAlwaysShow"
          :default-sort="defaultSort"
          :store="store"
          :style="{
            width: layout.bodyWidth.value ? layout.bodyWidth.value + 'px' : '',
          }"
          @set-drag-visible="setDragVisible"
        />
      </div>
      <!--
      <div v-show="isFixed" :class="['head-fixed-wrap','header-sticky']" :style="{
        width:tableBodyWrapWidth?tableBodyWrapWidth + 'px':'',
        height:fixedHeaderHeight + 'px',
        top:fixedTop+'px'
      }">
        <table-header
          ref="tableHeader"
          :border="border"
          :sort-always-show="sortAlwaysShow"
          :default-sort="defaultSort"
          :store="store"
          :style="{
            width: layout.bodyWidth.value ? layout.bodyWidth.value + 'px' : '',
            transform:isFixed?`translate3d(${-bodyWrapScrollLeft}px, 0, 0)`:''
          }"
          @set-drag-visible="setDragVisible"
        />
      </div> -->
    </div>
    <div ref="bodyWrapper" :style="[bodyHeight]" class="el-table__body-wrapper">
      <table-body
        :context="context"
        :highlight="highlightCurrentRow"
        :row-class-name="rowClassName"
        :tooltip-effect="tooltipEffect"
        :row-style="{
          lineHeight: `${tableConfigControl.lineHeight - 12}px`,
          ...rowStyle,
        }"
        :store="store"
        :stripe="border ? false : stripe"
        :clickdelay="clickdelay"
        :style="{
          width: bodyWidth,
        }"
      />
      <div
        v-if="isEmpty"
        ref="emptyBlock"
        :style="emptyBlockStyle"
        class="el-table__empty-block"
      >
        <span class="el-table__empty-text">
          <slot name="empty">
            <div v-if="!emptyText" v-html="defaultIcon"></div>
            <span class="el-table__empty-font">{{ emptyText || t('el.table.emptyText') }}</span>
          </slot>
        </span>
      </div>
      <div
        v-if="$slots.append"
        ref="appendWrapper"
        class="el-table__append-wrapper"
      >
        <slot name="append"></slot>
      </div>
    </div>
    <div
      v-if="showSummary"
      v-show="!isEmpty"
      ref="footerWrapper"
      v-mousewheel="handleHeaderFooterMousewheel"
      class="el-table__footer-wrapper"
    >
      <table-footer
        :border="border"
        :default-sort="defaultSort"
        :store="store"
        :style="{
          width: layout.bodyWidth.value ? layout.bodyWidth.value + 'px' : '',
        }"
        :sum-text="sumText || t('el.table.sumText')"
        :summary-method="summaryMethod"
      />
    </div>
    <div
      v-if="store.states.fixedColumns.value.length > 0"
      ref="fixedWrapper"
      v-mousewheel="handleFixedMousewheel"
      :style="[
        {
          width: layout.fixedWidth.value ? layout.fixedWidth.value + 'px' : '',
        },
        fixedHeight,
      ]"
      class="el-table__fixed"
    >
      <div
        v-if="showHeader"
        ref="fixedHeaderWrapper"
        class="el-table__fixed-header-wrapper"
      >
        <div>
          <table-header
            ref="fixedTableHeader"
            :border="border"
            :sort-always-show="sortAlwaysShow"
            :store="store"
            :style="{
              width: bodyWidth,
            }"
            fixed="left"
            @set-drag-visible="setDragVisible"
          />
        </div>
        <!-- <div v-show="isFixed" :class="['head-fixed-wrap','header-sticky']" :style="{
          width:layout.fixedWidth.value?layout.fixedWidth.value + 'px':'',
          height:fixedHeaderHeight + 'px',
          top:fixedTop+'px'
        }">
          <table-header
            ref="fixedTableHeader"
            :border="border"
            :sort-always-show="sortAlwaysShow"
            :store="store"
            :style="{
              width: bodyWidth,
            }"
            fixed="left"
            @set-drag-visible="setDragVisible"
          />
        </div> -->
      </div>
      <div
        ref="fixedBodyWrapper"
        :style="[
          {
            top: layout.headerHeight.value + 'px',
          },
          fixedBodyHeight,
        ]"
        class="el-table__fixed-body-wrapper"
      >
        <table-body
          :highlight="highlightCurrentRow"
          :row-class-name="rowClassName"
          :tooltip-effect="tooltipEffect"
          :row-style="{
            lineHeight: `${tableConfigControl.lineHeight - 12}px`,
            ...rowStyle,
          }"
          :store="store"
          :stripe="border ? false : stripe"
          :style="{
            width: bodyWidth,
          }"
          fixed="left"
        />
        <div
          v-if="$slots.append"
          :style="{ height: layout.appendHeight.value + 'px' }"
          class="el-table__append-gutter"
        ></div>
      </div>
      <div
        v-if="showSummary"
        v-show="!isEmpty"
        ref="fixedFooterWrapper"
        class="el-table__fixed-footer-wrapper"
      >
        <table-footer
          :border="border"
          :store="store"
          :style="{
            width: bodyWidth,
          }"
          :sum-text="sumText || t('el.table.sumText')"
          :summary-method="summaryMethod"
          fixed="left"
        />
      </div>
    </div>
    <div
      v-if="store.states.rightFixedColumns.value.length > 0"
      ref="rightFixedWrapper"
      v-mousewheel="handleFixedMousewheel"
      :style="[
        {
          width: layout.rightFixedWidth.value
            ? layout.rightFixedWidth.value + 'px'
            : '',
          right: layout.scrollY.value
            ? (border ? layout.gutterWidth : layout.gutterWidth || 0) + 'px'
            : '',
        },
        fixedHeight,
      ]"
      class="el-table__fixed-right"
    >
      <div
        v-if="showHeader"
        ref="rightFixedHeaderWrapper"
        class="el-table__fixed-header-wrapper"
        :style="{
          height:fixedHeaderHeight+'px'
        }"
      >
        <div>
          <table-header
            ref="rightFixedTableHeader"
            :border="border"
            :sort-always-show="sortAlwaysShow"
            :store="store"
            :style="{
              width: bodyWidth,
            }"
            fixed="right"
            @set-drag-visible="setDragVisible"
          />
        </div>
        <!-- <div v-show="isFixed" :class="['head-fixed-wrap','header-sticky']" :style="{
            width:layout.rightFixedWidth.value?layout.rightFixedWidth.value + 'px':'',
            height:fixedHeaderHeight + 'px',
            top:fixedTop+'px',
            right:fixedRight+'px'
          }">
          <table-header
            ref="rightFixedTableHeader"
            :border="border"
            :sort-always-show="sortAlwaysShow"
            :store="store"
            :style="{
              width: bodyWidth,
            }"
            fixed="right"
            @set-drag-visible="setDragVisible"
          />
        </div> -->
      </div>
      <div
        ref="rightFixedBodyWrapper"
        :style="[{ top: layout.headerHeight.value + 'px' }, fixedBodyHeight]"
        class="el-table__fixed-body-wrapper"
      >
        <table-body
          :highlight="highlightCurrentRow"
          :row-class-name="rowClassName"
          :tooltip-effect="tooltipEffect"
          :row-style="{
            lineHeight: `${tableConfigControl.lineHeight - 12}px`,
            ...rowStyle,
          }"
          :store="store"
          :stripe="border ? false : stripe"
          :style="{
            width: bodyWidth,
          }"
          fixed="right"
        />
        <div
          v-if="$slots.append"
          :style="{ height: layout.appendHeight.value + 'px' }"
          class="el-table__append-gutter"
        ></div>
      </div>
      <div
        v-if="showSummary"
        v-show="!isEmpty"
        ref="rightFixedFooterWrapper"
        class="el-table__fixed-footer-wrapper"
      >
        <table-footer
          :border="border"
          :store="store"
          :style="{
            width: bodyWidth,
          }"
          :sum-text="sumText || t('el.table.sumText')"
          :summary-method="summaryMethod"
          fixed="right"
        />
      </div>
    </div>
    <div
      ref="tableFooterStickyScroller"
      v-if="layout.scrollBarFixed && layout.scrollX.value"
      class="footer-sticky"
      :style="{bottom:layout.scrollBarPosition+'px'||0}"
    >
        <div class="footer-scroll" :style="{width:bodyWidth}"></div>
    </div>
    <div
      v-if="store.states.rightFixedColumns.value.length > 0"
      ref="rightFixedPatch"
      :style="{
        width: layout.scrollY.value ? layout.gutterWidth + 'px' : '0',
        height: layout.headerHeight.value + 'px',
      }"
      class="el-table__fixed-right-patch"
    ></div>
    <div
      v-show="resizeProxyVisible"
      ref="resizeProxy"
      class="el-table__column-resize-proxy"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, computed,watch,ref,nextTick,onMounted,onBeforeUnmount } from 'vue'
import { useTableConfig } from '@element-plus/hooks'
import debounce from 'lodash/debounce'
import { Mousewheel } from '@element-plus/directives'
import { useLocaleInject } from '@element-plus/hooks'
import { createStore } from './store/helper'
import TableLayout from './table-layout'
import TableHeader from './table-header'
import TableBody from './table-body'
import TableFooter from './table-footer'
import useUtils from './table/utils-helper'
import useStyle from './table/style-helper'
import defaultProps from './table/defaults'
import defaultIcon from './svg/default-icon'
import type { Table } from './table/defaults'
import { transform } from 'lodash'
let tableIdSeed = 1
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}
export default defineComponent({
  name: 'LyTable',
  directives: {
    Mousewheel,
  },
  components: {
    TableHeader,
    TableBody,
    TableFooter,
  },
  props: defaultProps,
  emits: [
    'select',
    'select-all',
    'selection-change',
    'cell-mouse-enter',
    'cell-mouse-leave',
    'cell-contextmenu',
    'cell-click',
    'cell-dblclick',
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
  ],
  setup(props) {
    type Row = typeof props.data[number]
    const { t } = useLocaleInject()
    const table = getCurrentInstance() as Table<Row>
    const store = createStore<Row>(table, props)
    table.store = store
    const isFixed  = ref(false)
    const headerWrapper = ref<HTMLElement | null>(null)
    const bodyWrapper = ref<HTMLElement | null>(null)
    const tableHeader = ref<HTMLElement | null>(null)
    const elTableRef =  ref<HTMLElement | null>(null)
    const tableFooterStickyScroller  = ref<HTMLElement | null>(null)
    const fixedTop  = ref(0)
    const fixedLeft = ref(0)
    const fixedRight = ref(0)
    const fixedHeaderHeight = ref(0)
    const bodyWrapScrollLeft = ref(0)
    const tableBodyWrapWidth =  ref(0)
    const layout = new TableLayout<Row>({
      store: table.store,
      table,
      fit: props.fit,
      showHeader: props.showHeader,
      headerFixed: props.headerFixed,
      fixedOffsetTop:props.fixedOffsetTop,
      propHeight:props.height,
      scrollBarFixed:props.scrollBarFixed,
      scrollBarPosition:props.scrollBarPosition
    })
    table.layout = layout
    const isEmpty = computed(() => (store.states.data.value || []).length === 0)

    /**
     * open functions
     */
    const {
      setCurrentRow,
      toggleRowSelection,
      clearSelection,
      clearFilter,
      toggleAllSelection,
      toggleRowExpansion,
      clearSort,
      sort,
    } = useUtils<Row>(store)
    const {
      isHidden,
      renderExpanded,
      setDragVisible,
      isGroup,
      handleMouseLeave,
      handleHeaderFooterMousewheel,
      tableSize,
      bodyHeight,
      emptyBlockStyle,
      handleFixedMousewheel,
      fixedHeight,
      fixedBodyHeight,
      resizeProxyVisible,
      bodyWidth,
      resizeState,
      doLayout,
    } = useStyle<Row>(props, layout, store, table)

    const debouncedUpdateLayout = debounce(doLayout, 50)

    const tableId = 'el-table_' + tableIdSeed++
    table.tableId = tableId
    table.state = {
      isGroup,
      resizeState,
      doLayout,
      debouncedUpdateLayout,
    }
    // let scrollerEl
    // let headerElRect
    // let scrollerRect
    // let offsetTop = 0
    // let tableOffsetTop
    // const getElementTop = (element,stopElement?:HTMLElement) => {
    //   let offsetTop = 0;
    //   while (element) {
    //     if(element===stopElement){
    //       break;
    //     }
    //     offsetTop += element.offsetTop;
    //     element = element.offsetParent;
    //   }
    //   return offsetTop;
    // };
    // watch([()=>props.fixedOffsetTop,()=>props.headerFixed,()=>props.updateOffset],function(val){
    //   headerElRect = headerWrapper.value?.getBoundingClientRect()
    //   tableOffsetTop = getElementTop(elTableRef.value)
    //   if(val[0]) {
    //     offsetTop = scrollerRect?tableOffsetTop - scrollerRect.top : tableOffsetTop
    //     offsetTop = offsetTop - val[0]
    //   }
    //   if(!val[1]){
    //     isFixed.value = false
    //   }
    //   if(val[2]){
    //     offsetTop = scrollerRect?tableOffsetTop - scrollerRect.top : tableOffsetTop
    //     fixedRight.value = document.body.clientWidth - headerElRect?.right
    //   }
    //   if(scrollerRect && scrollerRect.top) {
    //     if(val[0]){
    //       fixedTop.value = scrollerRect.top + Number(val[0])
    //     } else {
    //       fixedTop.value = scrollerRect.top
    //     }
    //   }
    // })
    // const scrollerElFun = throttle(() => {
    //   let scrollTop = 0
    //   if (props.scrollElClass) {
    //     scrollTop = scrollerEl.scrollTop;
    //   } else {
    //     scrollTop = window.scrollY || window.pageYOffset;
    //   }
    //   isFixed.value = scrollTop>=offsetTop
    //   console.log('isFixed.value===',isFixed.value)
    //   if(scrollTop>(offsetTop+elTableRef.value?.clientHeight||0)){
    //     isFixed.value = false
    //   }
    //   if(!isFixed.value){
    //     bodyWrapScrollLeft.value = bodyWrapper.value.scrollLeft
    //   }
    // },props.scrollThrottleTime);

    // const bodyFun = (e) => {
    //   if(isFixed.value){
    //     bodyWrapScrollLeft.value  = e.target.scrollLeft
    //   }
    // }
    // const getRightOffset = (el,pel) => {
    //   const parentRect  = pel.getBoundingClientRect();
    //   const childRect = el.getBoundingClientRect()
    //   return parentRect.right - childRect.right;
    // }
    // const headerCalc = () => {
    //   if(props.scrollElClass) {
    //     scrollerRect = document.querySelector(props.scrollElClass).getBoundingClientRect()
    //   }
    //   offsetTop = scrollerRect?tableOffsetTop - scrollerRect.top : tableOffsetTop
    //   if(layout.fixedOffsetTop && props.scrollElClass) {
    //     offsetTop = offsetTop - Number(layout.fixedOffsetTop)
    //   }
    //   setTimeout(() => {
    //     fixedHeaderHeight.value = headerWrapper.value?.clientHeight + 1
    //   }, 0);
    //   fixedTop.value = scrollerRect ? scrollerRect.top:0
    //   fixedLeft.value = headerElRect.left
    //   fixedRight.value = document.body.clientWidth - headerElRect.right
    //   if(props.isDialog){
    //     fixedTop.value = Number(layout.fixedOffsetTop||0)
    //     offsetTop = getElementTop(headerWrapper.value,headerWrapper.value?.closest('.el-dialog'));
    //     fixedRight.value = getRightOffset(headerWrapper.value,headerWrapper.value?.closest('.el-dialog'))
    //   }
    //   if(bodyWrapper.value?.offsetWidth) {
    //     tableBodyWrapWidth.value = bodyWrapper.value?.offsetWidth;
    //     console.log(tableBodyWrapWidth.value,'tableBodyWrapWidth.value')
    //   }el-table__body
    // }el-table__body
    onMounted(()=>{
      nextTick(()=>{
        if(props.scrollBarFixed){
          setTimeout(() => {
            tableFooterStickyScroller.value?.addEventListener('scroll', function(){
              bodyWrapper.value.scrollLeft = tableFooterStickyScroller.value?.scrollLeft
            })
            bodyWrapper.value?.addEventListener('scroll', function(){
              tableFooterStickyScroller.value.scrollLeft = bodyWrapper.value?.scrollLeft
            })
            window.onresize = function() {
              debouncedUpdateLayout()
              setTimeout(() => {
                tableFooterStickyScroller.value?.addEventListener('scroll', function(){
                  bodyWrapper.value.scrollLeft = tableFooterStickyScroller.value?.scrollLeft
                })
              }, 100);
            }
          }, 0);
        }
        setTimeout(() => {
          fixedHeaderHeight.value = headerWrapper.value?.clientHeight + 1
        }, 0);
      })
      // if(props.headerFixed){
      //   nextTick(()=>{
      //     tableOffsetTop = getElementTop(elTableRef.value)
      //     setTimeout(() => {
      //       headerElRect = headerWrapper.value?.getBoundingClientRect()
      //       headerCalc()
      //     }, 1000);
      //     headerElRect = headerWrapper.value?.getBoundingClientRect()
      //     scrollerEl = props.scrollElClass ? document.querySelector(props.scrollElClass) : window
      //     if(props.isDialog) {
      //       setTimeout(() => {
      //         scrollerEl && scrollerEl.addEventListener('scroll',scrollerElFun)
      //         bodyWrapper.value && bodyWrapper.value?.addEventListener('scroll',bodyFun)
      //       }, 1000);
      //     } else {
      //       setTimeout(()=>{
      //         scrollerEl && scrollerEl.addEventListener('scroll',scrollerElFun,{ passive: true })
      //         bodyWrapper.value && bodyWrapper.value?.addEventListener('scroll',bodyFun,{ passive: true })
      //       },1000)
      //     }
      //     setTimeout(() => {
      //       window.onresize = function() {
      //         headerCalc()
      //       }
      //     }, 1000);
      //   })
      // }
    })
    // onBeforeUnmount(()=>{
    //   scrollerEl && scrollerEl.removeEventListener('scroll',scrollerElFun)
    //   bodyWrapper.value?.removeEventListener('scroll',bodyFun)
    // })
    return {
      ...useTableConfig,
      layout,
      store,
      isFixed,
      handleHeaderFooterMousewheel,
      handleMouseLeave,
      tableId,
      tableSize,
      isHidden,
      isEmpty,
      renderExpanded,
      resizeProxyVisible,
      resizeState,
      isGroup,
      bodyWidth,
      bodyHeight,
      emptyBlockStyle,
      debouncedUpdateLayout,
      handleFixedMousewheel,
      fixedHeight,
      fixedBodyHeight,
      setCurrentRow,
      toggleRowSelection,
      clearSelection,
      clearFilter,
      toggleAllSelection,
      toggleRowExpansion,
      clearSort,
      doLayout,
      sort,
      t,
      tableFooterStickyScroller,
      fixedHeaderHeight,
      headerWrapper,
      bodyWrapper,
      tableHeader,
      elTableRef,
      bodyWrapScrollLeft,
      fixedTop,
      fixedLeft,
      fixedRight,
      setDragVisible,
      tableBodyWrapWidth,
      context: table,
      defaultIcon,
    }
  },
})
</script>
