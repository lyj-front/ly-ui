<template>
  <teleport to="body" :disabled="!appendToBody">
    <transition
      name="ly-dialog-fade"
      @after-enter="afterEnter"
      @after-leave="afterLeave"
      @before-leave="beforeLeave"
    >
      <ly-overlay
        v-show="visible"
        :mask="modal"
        :overlay-class="modalClass"
        :z-index="zIndex"
        @click="onModalClick"
      >
        <div class="el-overlay-dialog">
          <div
            ref="dialogRef"
            v-trap-focus
            :class="[
              'el-dialog',
              {
                'is-fullscreen': fullscreen,
                'is-draggable': draggabled,
                'el-dialog--herderCenter': herderCenter,
                'el-dialog--footerCenter': footerCenter,
              },
              customClass,
            ]"
            aria-modal="true"
            role="dialog"
            :aria-label="title || 'dialog'"
            :style="style"
            @click.stop=""
          >
            <div class="el-dialog__header" ref="headerRef">
              <slot name="title">
                <span class="el-dialog__title">
                  {{ title }}
                </span>
              </slot>
              <button
                v-if="showClose"
                aria-label="close"
                class="el-dialog__headerbtn"
                type="button"
                @click="handleClose"
              >
                <i class="el-dialog__close el-icon el-icon-close"></i>
              </button>
            </div>
            <template v-if="rendered">
    
              <div class="el-dialog__body" :style="[bodyHeight? `maxHeight: ${bodyHeight}px;overflowY: auto;`:'' ]">
                <slot></slot>
              </div>
            </template>
            <div v-if="$slots.footer" class="el-dialog__footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </ly-overlay>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref,computed } from 'vue'
import { TrapFocus } from '@element-plus/directives'
import { useDraggable } from '@element-plus/hooks'
import { Overlay } from '@element-plus/components/overlay'

import { dialogProps, dialogEmits } from './dialog'
import { useDialog } from './use-dialog'

export default defineComponent({
  name: 'LyDialog',
  components: {
    LyOverlay: Overlay,
  },
  directives: {
    TrapFocus,
  },

  props: dialogProps,
  emits: dialogEmits,
  
  setup(props, ctx) {
    const dialogRef = ref<HTMLElement>()
    const headerRef = ref<HTMLElement>()
    const dialog = useDialog(props, ctx, dialogRef)
    const draggabled = computed(() => props.draggable && !props.fullscreen)
   
    useDraggable(dialogRef, headerRef, draggabled, props.draggTop,'translateY(-50%)')
    return {
      dialogRef,
      headerRef,
      ...dialog,
      draggabled
    }
  },
})
</script>
