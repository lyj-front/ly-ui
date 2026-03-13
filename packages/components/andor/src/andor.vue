<template>
  <div class="andor-tree-container relative">
    <relation
      v-model:relation="cData[relationField]"
      :list="cData.children"
    ></relation>
    <div
      class="flex-1"
      :style="{
        marginLeft:
          cData.children && cData.children.length > 1 ? '32px' : '0px',
      }"
    >
      <and-or-node
        v-for="(item, i) in cData.children"
        :key="item.id"
        v-model:data="cData.children[i]"
        :index="i"
        :level="1"
        :relation-field="relationField"
        @add-child="addChild"
        @reduce-child="reduceChild"
      >
        <template #default="slotProps">
          <slot
            :data="slotProps.data"
            :index="slotProps.index"
            :level="slotProps.level"
          ></slot>
        </template>
      </and-or-node>
    </div>
  </div>
</template>

<script>
import { ref, watch, defineComponent } from 'vue'
import AndOrNode from './node.vue'
import Relation from './relation.vue'
export default defineComponent({
  name: 'AndOr',
  components: {
    AndOrNode,
    Relation,
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
    relationField: { type: String, default: 'relation' },
  },
  emits: ['reduce-child', 'add-child', 'update:data'],
  setup(props, { emit }) {
    const cData = ref({ children: [], relation: '且' })

    watch(
      () => props.data,
      (val) => {
        cData.value = val
      },
      { immediate: true }
    )

    watch(cData, (val) => {
      emit('update:data', val)
    })

    function addChild() {
      cData.value.children.push({})
    }

    function reduceChild(i) {
      cData.value.children.splice(i, 1)
    }

    return {
      cData,
      addChild,
      reduceChild,
    }
  },
})
</script>
