<template>
  <div v-if="list.length > 1" class="relation-box">
    <div class="relation-border"></div>
    <ly-dropdown
      style="z-index: 100; background: #fff"
      type="text"
      @command="handleCommand"
    >
      <span class="el-dropdown-link">
        {{ text }}
      </span>
      <template #dropdown>
        <ly-dropdown-menu>
          <ly-dropdown-item
            v-for="item in commands"
            :key="item"
            :style="{ color: text == item ? '#3188e8' : '#333' }"
            :command="item"
            >{{ item }}</ly-dropdown-item
          >
        </ly-dropdown-menu>
      </template>
    </ly-dropdown>
  </div>
</template>
<script>
import { ref, watch, defineComponent } from 'vue'
export default defineComponent({
  name: 'Relation',
  props: {
    list: { type: Array, default: () => [] },
    relation: { type: String, default: '且' },
    field: { type: String, default: '' },
    commands: { type: Array, default: () => ['且', '或'] },
  },
  setup(props, { emit }) {
    const text = ref('')
    watch(text, (n) => {
      emit('update:relation', n)
    })
    watch(
      () => props.relation,
      (n) => {
        text.value = n
      },
      { immediate: true }
    )
    function handleCommand(e) {
      text.value = e
    }

    return {
      text,
      handleCommand,
    }
  },
})
</script>
