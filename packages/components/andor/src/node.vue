<template>
  <div class="andor-item" :style="{paddingBottom:cData.children && cData.children.length === 1 ? '0px':'6px'}">
    <div class="andor-item_node">
      <slot :data="cData" :index="index" :level="level">
        <ly-input
          v-model="cData.input"
          style="width: 140px"
          :placeholder="'我是层级' + level"
        ></ly-input>
      </slot>
      <span class="opt-text" @click.stop="addChild">新增子级</span>
      <i class="add-icon" @click.stop="$emit('add-child')"></i>
      <i class="reduce-icon" @click.stop="$emit('reduce-child', index)"></i>
    </div>
    <div class="relative" :style="{marginTop: cData.children && cData.children.length > 1 ?'10px':'0px'}">
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
          :level="level + 1"
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
  </div>
</template>
<script>
import { ref, watch, defineComponent } from 'vue'
import Relation from './relation.vue'
export default defineComponent({
  name: 'AndOrNode',
  components: {
    Relation,
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
    index: { type: Number, default: 0 },
    level: { type: Number, default: null },
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
      !cData.value.children && (cData.value.children = [])
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
