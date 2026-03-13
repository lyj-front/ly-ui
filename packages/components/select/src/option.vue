<!-- hover: hover, -->
<template>
  <li v-show="visible" class="el-select-dropdown__item" :class="{
    selected: itemSelected,
    'is-disabled': isDisabled,
  }" @mouseenter="hoverItem" @click.stop="selectOptionClick">
    <span v-if="select.props.multiple" class="el-select-inp" :class="{
      'is-selected': itemSelected,
    }" aria-checked="false">
      <span class="el-select-checkbox"></span>
      <span>
        <slot>{{ currentLabel }}</slot>
      </span>
    </span>
    <span v-else>
      <slot>{{ currentLabel }}</slot>
    </span>
  </li>
</template>

<script lang="ts">
import {
  toRefs,
  defineComponent,
  getCurrentInstance,
  onBeforeUnmount,
  reactive,
} from 'vue'
import { useOption } from './useOption'
import { SelectOptionProxy } from './token'

export default defineComponent({
  name: 'LyOption',
  componentName: 'LyOption',

  // components: {
  //   LyCheckbox,
  // },
  props: {
    value: {
      required: true,
      type: [String, Number, Boolean, Object],
    },
    label: [String, Number],
    created: Boolean,
    disabled: {
      type: Boolean,
      default: false,
    },
    isSelectAll: Boolean,
    item: {
      type: Object,
      default: () => ({}),
    },
  },

  setup(props) {
    const states = reactive({
      index: -1,
      groupDisabled: false,
      visible: true,
      hitState: false,
      hover: false,
    })

    const { currentLabel, itemSelected, isDisabled, select, hoverItem } =
      useOption(props, states)

    const { visible, hover } = toRefs(states)

    const vm = getCurrentInstance().proxy
    const key = (vm as unknown as SelectOptionProxy).value
    select.onOptionCreate(vm as unknown as SelectOptionProxy)

    onBeforeUnmount(() => {
      const { selected } = select
      const selectedOptions = select.props.multiple ? selected : [selected]
      const doesExist = select.cachedOptions.has(key)
      const doesSelected = selectedOptions.some((item) => {
        return item.value === (vm as unknown as SelectOptionProxy).value
      })
      // if option is not selected, remove it from cache
      if (doesExist && !doesSelected) {
        select.cachedOptions.delete(key)
      }
      select.onOptionDestroy(key)
    })

    function selectOptionClick() {
      if (props.disabled !== true && states.groupDisabled !== true) {
        select.handleOptionSelect(vm, true)
      }
    }

    return {
      currentLabel,
      itemSelected,
      isDisabled,
      select,
      hoverItem,
      visible,
      hover,
      selectOptionClick,
    }
  },
})
</script>
