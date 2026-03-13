/* eslint-disable no-console */
import { watch, Ref } from 'vue'

export default function (
  propsShow: any,
  compShow: Ref<boolean>,
  emit: (event: 'update:modelValue' | 'closed', ...args: any[]) => void
) {
  watch(
    () => propsShow.modelValue,
    (val) => {
      compShow.value = val
    }
  )

  watch(compShow, (val) => {
    if (!val) {
      emit('update:modelValue', val)
      emit('closed')
    }
  })
}
