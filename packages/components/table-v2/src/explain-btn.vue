<template>
  <ly-tooltip
    placement="bottom"
    effect="light"
    :offset="5"
  >
    <template #content><div v-html="explainStr"></div></template>
    <span class="explain-btn"><i class="el-icon-question"></i></span>
  </ly-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LyTooltip from '@element-plus/components/tooltip'
export default defineComponent({
  name: 'LyTableExplain',
  components: {
    LyTooltip,
  },
  props: {
    explainStr: {
      type: String,
      default: '',
    },
  },
})
</script>
