<template>
  <ly-popper
    ref="triggerVnode"
    v-model:visible="visible"
    :placement="placement"
    :fallback-placements="['bottom-start', 'top-start', 'right', 'left']"
    :effect="effect"
    pure
    :manual-mode="true"
    :show-arrow="false"
    :offset="4"
    :trigger="[trigger]"
    :popper-class="'el-dropdown__popper' + ' ' + propClass"
    append-to-body
    transition="el-zoom-in-top"
    :stop-popper-mouse-event="false"
    :gpu-acceleration="false"
  >
    <template #default>
      <ly-scrollbar
        ref="scrollbar"
        tag="ul"
        :wrap-style="wrapStyle"
        view-class="el-dropdown__list"
        :style="{ width: dropWidth ? dropWidth + 'px' : '' }"
      >
        <slot name="dropdown"></slot>
      </ly-scrollbar>
    </template>
    <template #trigger>
      <div :class="[
        'el-dropdown'
      ]">
        <!-- dropdownSize ? 'el-dropdown--' + dropdownSize : '', -->
        <template v-if="type === 'text'">
          <slot name="default"></slot>
          <i :class="['el-dropdown__icon', 'el-icon-' + iconClass]"></i>
        </template>

        <template v-if="type === 'button'">
          <ly-button>
            <slot name="default"></slot>
            <i :class="['el-dropdown__icon', 'el-icon-' + iconClass,]"></i>
          </ly-button>
        </template>

        <template v-if="type === 'button_primary'">
          <ly-button type="primary">
            <slot name="default"></slot>
            <i :class="['el-dropdown__icon', 'el-icon-' + primaryIconClass,]"></i>
          </ly-button>
        </template>
        <!-- <template v-else>
          <ly-button-group>
            <ly-button :size="dropdownSize" :type="type" @click="handlerMainButtonClick">
              <slot name="default"></slot>
            </ly-button>
            <ly-button :size="dropdownSize" :type="type" class="el-dropdown__caret-button">
              <i class="el-dropdown__icon el-icon-caret-bottom"></i>
            </ly-button>
          </ly-button-group>
        </template>-->
      </div>
    </template>
  </ly-popper>
</template>
<script lang="ts">
import {
  defineComponent,
  provide,
  getCurrentInstance,
  ref,
  computed,
  nextTick,
  watch,
  onMounted,
} from 'vue'
import type { PropType } from 'vue'
import LyButton from '@element-plus/components/button'
import LyPopper, { Effect, Placement } from '@element-plus/components/popper'
import LyScrollbar from '@element-plus/components/scrollbar'
import { on, addClass, removeClass } from '@element-plus/utils/dom'
import { addUnit } from '@element-plus/utils/util'
import { useDropdown } from './useDropdown'

import type { ComponentPublicInstance } from 'vue'
import type { TriggerType } from '@element-plus/hooks/use-popper/use-target-events'

type Nullable<T> = null | T

export default defineComponent({
  name: 'LyDropdown',
  components: {
    LyButton,
    LyScrollbar,
    LyPopper,
  },
  props: {
    trigger: {
      type: String as PropType<TriggerType | 'contextmenu'>,
      default: 'hover',
    },
    type: {
      type: String,
      default: 'button'
    },
    size: {
      type: String,
      default: '',
    },
    propClass: {
      type: String,
      default: '',
    },
    // splitButton: Boolean,
    hideOnClick: {
      type: Boolean,
      default: true,
    },
    placement: {
      type: String as PropType<Placement>,
      default: 'bottom-start',
    },
    showTimeout: {
      type: Number,
      default: 150,
    },
    hideTimeout: {
      type: Number,
      default: 150,
    },
    tabindex: {
      type: [Number, String],
      default: 0,
    },
    effect: {
      type: String as PropType<Effect>,
      default: Effect.LIGHT,
    },
    maxHeight: {
      type: [Number, String],
      default: '',
    },
    menuWidth: {
      type: [Number, String],
      default: ''
    }
  },
  emits: ['visible-change', 'click', 'command'],
  setup(props, { emit }) {
    const _instance = getCurrentInstance()
    const { ELEMENT } = useDropdown()

    const timeout = ref<Nullable<number>>(null)
    const visible = ref(false)
    const scrollbar = ref(null)

    const dropWidth = ref<String | Number>('')
    // 下拉菜单列表的显示隐藏
    const dorpDownIsShow = ref(false)
    const wrapStyle = computed(() => `max-height: ${addUnit(props.maxHeight)}`)

    watch(
      () => visible.value,
      (val) => {
        if (val) {
          triggerElmFocus()
          dorpDownIsShow.value = true
        } else {
          triggerElmBlur()
          dorpDownIsShow.value = false
        }

        emit('visible-change', val)
      }
    )

    const focusing = ref(false)
    watch(
      () => focusing.value,
      (val) => {
        const selfDefine = triggerElm.value
        if (selfDefine) {
          if (val) {
            addClass(selfDefine, 'focusing')
          } else {
            removeClass(selfDefine, 'focusing')
          }
        }
      }
    )

    const triggerVnode = ref<Nullable<ComponentPublicInstance>>(null)
    const triggerElm = computed<Nullable<HTMLButtonElement>>(() => {
      const _: any = (triggerVnode.value?.$refs.triggerRef as HTMLElement)
        ?.children[0]
      // return !props.splitButton ? _ : _?.children?.[1]
      return _
    })

    function handleClick() {
      if (triggerElm.value?.disabled) return
      if (visible.value) {
        hide()
      } else {
        show()
      }
    }

    function show() {
      if (triggerElm.value?.disabled) return
      timeout.value && clearTimeout(timeout.value)
      timeout.value = window.setTimeout(
        () => {
          visible.value = true
        },
        ['click', 'contextmenu'].includes(props.trigger) ? 0 : props.showTimeout
      )
    }

    function hide() {
      if (triggerElm.value?.disabled) return
      removeTabindex()
      if (props.tabindex >= 0) {
        resetTabindex(triggerElm.value)
      }
      clearTimeout(timeout.value)
      timeout.value = window.setTimeout(
        () => {
          visible.value = false
        },
        ['click', 'contextmenu'].includes(props.trigger) ? 0 : props.hideTimeout
      )
    }

    function removeTabindex() {
      triggerElm.value?.setAttribute('tabindex', '-1')
    }

    function resetTabindex(ele) {
      removeTabindex()
      ele?.setAttribute('tabindex', '0')
    }

    function triggerElmFocus() {
      triggerElm.value?.focus?.()
    }

    function triggerElmBlur() {
      triggerElm.value?.blur?.()
    }

    // const dropdownSize = computed(() => props.size || ELEMENT.size)

    // icon的样式
    const iconClass = computed(() =>
      dorpDownIsShow.value ? 'blue-caret-top is-reverse' : 'blue-caret-top'
    )

    const primaryIconClass = computed(() =>
      dorpDownIsShow.value ? 'caret-top is-reverse' : 'caret-top'
    )

    function commandHandler(...args) {
      emit('command', ...args)
    }

    provide('elDropdown', {
      instance: _instance,
      // dropdownSize,
      visible,
      handleClick,
      commandHandler,
      show,
      hide,
      trigger: computed(() => props.trigger),
      hideOnClick: computed(() => props.hideOnClick),
      triggerElm,
    })

    onMounted(() => {
      if (!props.splitButton) {
        on(triggerElm.value, 'focus', () => {
          focusing.value = true
        })
        on(triggerElm.value, 'blur', () => {
          focusing.value = false
        })
        on(triggerElm.value, 'click', () => {
          focusing.value = false
        })
      }
      if (props.trigger === 'hover') {
        on(triggerElm.value, 'mouseenter', show)
        on(triggerElm.value, 'mouseleave', hide)
      } else if (props.trigger === 'click') {
        on(triggerElm.value, 'click', handleClick)
      } else if (props.trigger === 'contextmenu') {
        on(triggerElm.value, 'contextmenu', (e) => {
          e.preventDefault()
          handleClick()
        })
      }

      Object.assign(_instance, {
        handleClick,
        hide,
        resetTabindex,
      })

      // 计算下拉框的宽度
      dropWidth.value = props.menuWidth
      if (!props.menuWidth && props.type === 'button' && triggerVnode.value?.$refs) {
        dropWidth.value = triggerVnode.value?.$refs.triggerRef.getBoundingClientRect().width - 1
      }
    })

    // const handlerMainButtonClick = (event) => {
    //   emit('click', event)
    //   hide()
    // }

    return {
      visible,
      iconClass,
      primaryIconClass,
      scrollbar,
      wrapStyle,
      dropWidth,
      // dropdownSize,
      // handlerMainButtonClick,
      triggerVnode,
    }
  },
})
</script>
