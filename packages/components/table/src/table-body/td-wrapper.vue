<template>
  <td :colspan="colspan" :rowspan="rowspan"><slot /></td>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name:'TableTdWrapper',
  props:{
    colspan: {
      type: Number,
      default: 1,
    },
    rowspan: {
      type: Number,
      default: 1,
    },
  }
})
</script>
