<template>
  <div class="table-config-box">
    <div class="table-config-but" @click="showConfig = !showConfig">
      <i class="el-icon-table-config"></i>
      <span class="table-config-text">显示设置</span>
    </div>
    <div
      v-if="showConfig"
      class="table-config-box-mask"
      @click="showConfig = false"
    ></div>
    <div v-if="showConfig" class="config-box">
      <p>行高</p>
      <div class="line-height-box">
        <div
          v-for="config in lineHeightConfig"
          :key="config"
          class="line-height-item"
          :class="[tableConfigControl.lineHeight === config ? 'active' : '']"
          @click="changeLineHeight(config)"
        >
          {{ config }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, unref } from 'vue'
import { useTableConfig } from '@element-plus/hooks'
import { useNamespace } from '@element-plus/hooks'
export default defineComponent({
  name: 'LyTableConfig',
  setup() {
    const showConfig = ref(false)
    const ns = useNamespace('table')
    function changeLineHeight(value) {
      document.querySelectorAll(`.${unref(ns.namespace)}-table .cell`).forEach(item => {
        item.style.lineHeight = `${value - 12}px`
      })
      useTableConfig.tableConfigControl.lineHeight = value
    }
    return { ...useTableConfig, showConfig, changeLineHeight }
  },
})
</script>
