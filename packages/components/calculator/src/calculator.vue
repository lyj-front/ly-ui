<template>
  <div class="calculator-container relative">
    <cus-input :list="operations" :calc-result="calcResult"></cus-input>
    <keyboard
      :iscalc="disabledCalc"
      @add="add"
      @back="back"
      @reset="reset"
      @submit="submit"
    ></keyboard>
    <div v-if="calcErrorInfo" class="errorRule">
      {{ calcErrorInfo }}
    </div>
  </div>
</template>

<script>
import { ref, watch, defineComponent, provide } from 'vue'
import CusInput from './cusInput.vue'
import Keyboard from './keyboard.vue'
export default defineComponent({
  name: 'Calculator',
  components: {
    CusInput,
    Keyboard,
  },
  props: {
    data: { type: Array, default: () => null },
    calcFun: {
      type: Function,
      default: () => {
        return ''
      },
    },
    validateFun: {
      type: Function,
      default: null,
    },
    disabledCalc: { type: Boolean, default: false },
  },
  emits: ['change', 'errorInfoChange'],
  setup(props, { emit }) {
    const operations = ref([]) // 公式集合
    const calcErrorInfo = ref('') // 错误信息
    const calcResult = ref('') // 计算结果

    provide('calcErrorInfo', calcErrorInfo)

    const add = (obj) => {
      if (obj && obj.content && obj.type) {
        operations.value.push(obj)
        emit('change', operations.value)
        const validObj = props.validateFun
          ? props.validateFun(operations.value)
          : validateEvalRepeat()
        if (validObj && !validObj.valid) {
          calcErrorInfo.value = validObj.errorInfo
        }
      }
    }

    const back = () => {
      operations.value.pop()
      emit('change', operations.value)
      const validObj = props.validateFun
        ? props.validateFun(operations.value)
        : validateEvalRepeat()
      if (validObj && !validObj.valid) {
        calcErrorInfo.value = validObj.errorInfo
      }
    }

    const reset = () => {
      operations.value = []
      calcResult.value = ''
      calcErrorInfo.value = ''
      emit('change', operations.value)
    }

    const submit = () => {
      const result = props.calcFun(operations.value)
      if (result) calcResult.value = result
    }

    const validateEvalRepeat = () => {
      const opers = operations.value
      for (let i = 1; i < opers.length; i++) {
        if (opers[i].isEval && opers[i - 1].isEval) {
          return {
            errorInfo: '不允许出现多个连续的运算符',
            valid: false,
          }
        }
        if (opers[i].type === 'field' && opers[i - 1].type === 'field') {
          return {
            errorInfo: '不允许出现多个连续的字段',
            valid: false,
          }
        }
      }
      return {
        valid: true,
      }
    }

    watch(
      () => props.data,
      (n) => {
        if (n) {
          operations.value = n
        }
      },
      {
        immediate: true,
      }
    )

    watch(calcErrorInfo, (n) => {
      emit('errorInfoChange', n)
    })

    return {
      calcResult,
      operations,
      calcErrorInfo,
      add,
      back,
      reset,
      submit,
      validateEvalRepeat,
    }
  },
})
</script>
