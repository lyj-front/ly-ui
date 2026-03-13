/* eslint-disable no-console */
import { watch, Ref } from 'vue'

export default function (
  propsShow: any,
  compShow: Ref<any>,
  emit: (event: 'update:modelValue', ...args: any[]) => void
) {
  watch(
    () => propsShow.modelValue,
    (val) => {
      compShow.value = val
    }
  )

  watch(compShow, (val) => {
    emit('update:modelValue', val)
  })
}
