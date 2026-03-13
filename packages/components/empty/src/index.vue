<template>
  <div class="el-empty">
    <div class="el-empty__image" :style="imageStyle">
      <img v-if="image" :src="image" ondragstart="return false" />
      <slot v-else name="image">
        <i
          v-if="type"
          :class="[
            'el-empty__baseimage',
            type === 'noserver' ? 'img-no-server' : '',
            type === 'nodata' ? 'img-no-data' : '',
            type === 'nopower' ? 'img-no-power' : '',
            type === 'nopage' ? 'img-no-page' : '',
            type === 'nonetwork' ? 'img-no-network' : '',
          ]"
          ondragstart="return false"
        />
        <img-empty v-else />
      </slot>
    </div>
    <div class="el-empty__description">
      <slot v-if="$slots.description" name="description"></slot>
      <p v-else>{{ emptyDescription }}</p>
    </div>
    <div v-if="$slots.default" class="el-empty__bottom">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useLocaleInject } from '@element-plus/hooks'
import ImgEmpty from './img-empty.vue'

export default defineComponent({
  name: 'LyEmpty',
  components: {
    [ImgEmpty.name]: ImgEmpty,
  },
  props: {
    image: {
      type: String,
      default: '',
    },
    imageSize: Number,
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const { t } = useLocaleInject()
    const typeObj = {
      noserver: '服务器异常',
      nodata: '暂无数据',
      nopower: '暂无权限',
      nopage: '没有这个页面',
      nonetwork: '网络异常',
    }
    const emptyDescription = computed(
      () => props.description || typeObj[props.type] || t('el.table.emptyText')
    )
    const imageStyle = computed(() => {
      return {
        width: props.imageSize ? `${props.imageSize}px` : '',
        // height: props.imageSize ? `${props.imageSize}px` : props.type === 'nopage' ? '110px' : '180px',
      }
    })

    return {
      emptyDescription,
      imageStyle,
    }
  },
})
</script>
