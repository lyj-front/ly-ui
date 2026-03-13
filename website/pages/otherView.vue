<template>
  <iframe
    :src="iframeSrc"
    frameborder="0"
    style="width: 100%; height: 100%; border: none"
  ></iframe>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
  setup() {
    const route = useRoute()
    const iframeSrc = ref('')
    watch(
      () => route.meta,
      (val) => {
        console.log('val: ', val)
        if (val.type === 1) {
          iframeSrc.value = `https://front.leyoujia.com/jjs-ui-prod/#/component/${val.main}?hidden=true`
        } else if (val.type === 2) {
          // https://front.leyoujia.com/pluginsAPI/html/comboSelect.html
          iframeSrc.value = `https://front.leyoujia.com/pluginsAPI/html/${val.main}.html`
        }
      },
      {
        immediate: true,
      }
    )
    return {
      iframeSrc,
    }
  },
}
</script>

<style lang="scss" scoped></style>
