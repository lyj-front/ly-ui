<template>
  <div class="cus-input-container clearfix">
    <div class="clearfix rule-thing" style="font-size: 0">
      <template v-for="(item, i) in list" :key="i">
        <span
          style="line-height: 30px; font-size: 13px; margin-right: 3px"
          :class="{
            'offset-top': item.content == '-',
            ['rule-' + item.type]: 1,
            eval: item.isEval,
          }"
          >{{ item.content }}</span
        >
      </template>
    </div>
    <div class="clearfix mt5 rule-result">
      <span :class="{ red: calcResult == '试算失败' }">{{ calcResult }}</span>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    list: { type: Array, default: () => [] },
    calcResult: { type: String, default: '' },
  },
})
</script>
