<template>
  <div ref="selectWrapper" v-click-outside:[popperPaneRef]="handleClose" class="el-select" :class="[
    selectSize ? 'el-select--' + selectSize : '',
    expandTags ? 'arrow-align-center' : '',
  ]" @click.stop="toggleMenu">
    <ly-popper ref="popper" v-model:visible="dropMenuVisible" placement="bottom-start"
      :append-to-body="popperAppendToBody" :popper-class="`el-select__popper ${popperClass} ${autoPopper ? 'popper-width-auto' : ''
        }`" :fallback-placements="['bottom-start', 'top-start', 'right', 'left']" manual-mode :effect="Effect.LIGHT"
      :show-arrow="false" :offset="1" pure trigger="click" transition="el-zoom-in-top" :stop-popper-mouse-event="false"
      :gpu-acceleration="false" @before-enter="handleMenuEnter">
      <template #trigger>
        <div class="select-trigger">
          <ly-tooltip v-if="multiple && selected.length" :placement="tooltipPlacement || 'top-start'" :popper-class="`ly-top-tip ${topPopperClass} ${expandTags ? 'hide-arrow' : ''
            }`" effect="light" :disabled="dropMenuVisible">
            <template v-if="!expandTags" #content>
              <!-- <div> -->
              <div :style="{ width: inputWidth - 2 + 'px' }" class="top-dark">
                <ly-tag v-for="item in selected" :key="getValueKey(item)" :closable="!selectDisabled && !item.isDisabled"
                  :hit="item.hitState" disable-transitions @close="deleteTag($event, item)">
                  <span :style="{ maxWidth: inputWidth - 75 + 'px' }">
                    <slot name="seletSolt" :data="{ type: 'tooltipTags', item, selected }">
                      {{ item.currentLabel }}
                    </slot>
                  </span>
                </ly-tag>
              </div>
            </template>
            <div v-if="multiple" ref="tags" class="el-select__tags"
              :style="{ maxWidth: inputWidth - 20 + 'px', width: '100%' }">
              <span v-if="selected.length && !expandTags">
                <ly-tag :closable="!selectDisabled && !selected[0].isDisabled" :hit="selected[0].hitState"
                  disable-transitions @close="deleteTag($event, selected[0])">
                  <span class="el-select__tags-text" :style="{ maxWidth: inputWidth - 88 + 'px' }">
                    <slot name="seletSolt" :data="{ type: 'unExpandTags', item: selected[0], selected }">
                      {{ selected[0].currentLabel }}
                    </slot>
                  </span>
                </ly-tag>
                <ly-tag v-if="selected.length > 1" :closable="false" disable-transitions>
                  <span class="el-select__tags-num">+ {{ selected.length - 1 }}</span>
                </ly-tag>
              </span>
              <transition v-if="expandTags && !outInput" @after-leave="resetInputHeight">
                <span :style="{
                  marginLeft:
                    prefixWidth && selected.length
                      ? `${prefixWidth}px`
                      : 'unset',
                }">
                  <ly-tag v-for="item in selected" :key="getValueKey(item)"
                    :closable="!selectDisabled && !item.isDisabled" :hit="item.hitState" disable-transitions
                    @close="deleteTag($event, item)">
                    <span class="el-select__tags-text" :style="{ maxWidth: inputWidth - 75 + 'px' }">
                      <slot name="seletSolt" :data="{ type: 'expandTags', item, selected }">
                        {{ item.currentLabel }}
                      </slot>
                    </span>
                  </ly-tag>
                </span>
              </transition>
            </div>
          </ly-tooltip>

          <ly-input :id="id" ref="reference" v-model="selectedLabel" type="text" :placeholder="currentPlaceholder"
            :name="name" :autocomplete="autocomplete" :size="selectSize" :disabled="selectDisabled" :readonly="true"
            :validate-event="false" :class="{ 'is-focus': visible }" :tabindex="multiple && filterable ? '-1' : null"
            @focus="handleFocus" @blur="handleBlur" @input="debouncedOnInputChange" @paste="debouncedOnInputChange"
            @keydown.down.stop.prevent="navigateOptions('next')" @keydown.up.stop.prevent="navigateOptions('prev')"
            @keydown.enter.stop.prevent="selectOption" @keydown.esc.stop.prevent="visible = false"
            @keydown.tab="visible = false" @mouseenter="inputHovering = true" @mouseleave="inputHovering = false">
            <template v-if="$slots.prefix" #prefix>
              <div style="
                  height: 100%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                ">
                <slot name="prefix"></slot>
              </div>
            </template>
            <template #suffix>
              <i v-show="!showClose" :class="[
                'el-select__caret',
                'el-input__icon',
                'el-icon-' + iconClass,
              ]"></i>
              <i v-if="showClose" :class="`el-select__caret el-input__icon ${clearIcon}`" @click="handleClearClick"></i>
            </template>
          </ly-input>
        </div>
      </template>
      <template #default>
        <div v-if="filterable || remote" class="el-select__content">
          <input ref="input" v-model="query" type="text" class="el-select__input"
            :class="[selectSize ? `is-${selectSize}` : '']" :disabled="selectDisabled" :placeholder="searchPlaceholder"
            :autocomplete="autocomplete" :style="{
              flexGrow: '1',
              width: `${inputWidth - 36}px`,
            }" @focus="handleFocus" @blur="handleBlur" @keyup="managePlaceholder" @keydown="resetInputState"
            @keydown.down.prevent="navigateOptions('next')" @keydown.up.prevent="navigateOptions('prev')"
            @keydown.esc.stop.prevent="visible = false" @keydown.enter.stop.prevent="selectOption"
            @keydown.tab="visible = false" @compositionstart="handleComposition" @compositionupdate="handleComposition"
            @compositionend="handleComposition" @input="debouncedQueryChange" />
          <!-- marginLeft:
                (prefixWidth && !selected.length) || tagInMultiLine
                  ? `${prefixWidth}px`
          : 'unset',-->
          <!-- @keydown.delete="deletePrevTag" -->
          <i class="el-icon-ly-search-block"></i>
        </div>
        <ly-select-menu>
          <ly-scrollbar ref="scrollbar" tag="ul" wrap-class="el-select-dropdown__wrap" :view-class="`el-select-dropdown__list ${filterable ? 'no-top' : ''
            }`" :class="{
    'is-empty': !allowCreate && query && filteredOptionsCount === 0,
  }">
            <!-- 这个div看似无用，但是不能去掉，去掉了之后，打包会有毁灭性的BUG
            如果选项为空的时候，内部就没有任何dom做为根节点，这个时候vue3 patch 是不给通过的，然后会报错
            整个项目所有的select组件都不能正常使用-->
            <div>
              <!-- width: `${inputLength / (inputWidth - 32)}%`, -->
              <ly-checkbox v-if="multiple && showAll && filteredOptionsCount !== 0" v-model="allSelected"
                :label="showAllText" @change="selectAllChange"></ly-checkbox>
              <ly-option v-if="showNewOption" :value="query" :created="true" />
              <slot></slot>
            </div>
          </ly-scrollbar>
          <template v-if="emptyText &&
            (!allowCreate || loading || (allowCreate && options.size === 0))
            ">
            <slot v-if="$slots.empty" name="empty"></slot>
            <p v-else class="el-select-dropdown__empty">{{ emptyText }}</p>
          </template>
        </ly-select-menu>
      </template>
    </ly-popper>
    <span v-if="expandTags && outInput && !currentPlaceholder" class="el-select-out-input-placeholder">
      继续选择
    </span>
    <transition v-if="expandTags && outInput">

      <span class="el-select-out__tags" :style="{
        marginLeft:
          prefixWidth && selected.length
            ? `${prefixWidth}px`
            : 'unset',
        maxHeight: outInputHeight
          ? `${outInputHeight}px`
          : 'auto',
      }">
        <ly-tag v-for="item in selected" :key="getValueKey(item)" :closable="!selectDisabled && !item.isDisabled"
          :hit="item.hitState" disable-transitions @close="deleteTag($event, item)">
          <span class="el-select__tags-text" :style="{ maxWidth: inputWidth - 75 + 'px' }">
            <slot name="seletSolt" :data="{ type: 'outInput', item, selected }">
              {{ item.currentLabel }}
            </slot>
          </span>
        </ly-tag>
      </span>
    </transition>
  </div>
</template>

<script lang="ts">
import {
  toRefs,
  defineComponent,
  onMounted,
  onBeforeUnmount,
  nextTick,
  reactive,
  provide,
  computed,
} from 'vue'
import { ClickOutside } from '@element-plus/directives'
import { useFocus, useLocaleInject } from '@element-plus/hooks'
import LyInput from '@element-plus/components/input'
import LyCheckbox from '@element-plus/components/checkbox'
import LyPopper, { Effect } from '@element-plus/components/popper'
import LyScrollbar from '@element-plus/components/scrollbar'
import LyTag from '@element-plus/components/tag'
import LyTooltip from '@element-plus/components/tooltip'

import { UPDATE_MODEL_EVENT, CHANGE_EVENT } from '@element-plus/utils/constants'
import {
  addResizeListener,
  removeResizeListener,
} from '@element-plus/utils/resize-event'
import { isValidComponentSize } from '@element-plus/utils/validators'
import LyOption from './option.vue'
import LySelectMenu from './select-dropdown.vue'
import { useSelect, useSelectStates } from './useSelect'
import { selectKey } from './token'

import type { PropType } from 'vue'
import type { ComponentSize } from '@element-plus/utils/types'
import type { SelectContext } from './token'

export default defineComponent({
  name: 'LySelect',
  componentName: 'LySelect',
  components: {
    LyInput,
    LyCheckbox,
    LySelectMenu,
    LyOption,
    LyTag,
    LyScrollbar,
    LyPopper,
    LyTooltip,
  },
  directives: { ClickOutside },
  props: {
    name: String,
    id: String,
    modelValue: [Array, String, Number, Boolean, Object],
    autocomplete: {
      type: String,
      default: 'off',
    },
    automaticDropdown: Boolean,
    size: {
      type: String as PropType<ComponentSize>,
      validator: isValidComponentSize,
    },
    disabled: Boolean,
    clearable: Boolean,
    filterable: Boolean,
    allowCreate: Boolean,
    loading: Boolean,
    showAll: Boolean,
    showAllText: {
      type: String,
      default: '全部',
    },
    popperClass: {
      type: String,
      default: '',
    },
    topPopperClass: {
      type: String,
      default: '',
    },
    remote: Boolean,
    loadingText: String,
    noMatchText: String,
    noDataText: String,
    remoteMethod: Function,
    filterMethod: Function,
    multiple: Boolean,
    multipleLimit: {
      type: Number,
      default: 0,
    },
    placeholder: {
      type: String,
    },
    searchPlaceholder:{
      type:String,
      default:"请输入关键字搜索"
    },
    tooltipPlacement: String,
    defaultFirstOption: Boolean,
    reserveKeyword: Boolean,
    valueKey: {
      type: String,
      default: 'value',
    },
    collapseTags: Boolean,
    expandTags: Boolean,
    outInput: Boolean,
    outInputHeight: {
      type: [String, Number],
      default: 300,
    },
    autoPopper: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: true,
    },
    clearIcon: {
      type: String,
      default: 'el-icon-circle-close',
    },
  },
  emits: [
    UPDATE_MODEL_EVENT,
    CHANGE_EVENT,
    'remove-tag',
    'clear',
    'visible-change',
    'focus',
    'blur',
  ],

  setup(props, ctx) {
    const { t } = useLocaleInject()
    const states = useSelectStates(props)
    const {
      optionsArray,
      selectSize,
      readonly,
      handleResize,
      collapseTagSize,
      debouncedOnInputChange,
      debouncedQueryChange,
      deletePrevTag,
      deleteTag,
      deleteSelected,
      handleOptionSelect,
      scrollToOption,
      setSelected,
      resetInputHeight,
      managePlaceholder,
      showClose,
      selectDisabled,
      iconClass,
      showNewOption,
      emptyText,
      toggleLastOptionHitState,
      resetInputState,
      handleComposition,
      onOptionCreate,
      onOptionDestroy,
      handleMenuEnter,
      handleFocus,
      blur,
      handleBlur,
      handleClearClick,
      handleClose,
      toggleMenu,
      selectOption,
      selectAllChange,
      getValueKey,
      navigateOptions,
      dropMenuVisible,
      reference,
      input,
      popper,
      tags,
      selectWrapper,
      scrollbar,
    } = useSelect(props, states, ctx)

    const { focus } = useFocus(reference)

    const {
      inputWidth,
      selected,
      inputLength,
      filteredOptionsCount,
      visible,
      softFocus,
      selectedLabel,
      hoverIndex,
      query,
      allSelected,
      inputHovering,
      currentPlaceholder,
      menuVisibleOnFocus,
      isOnComposition,
      isSilentBlur,
      options,
      cachedOptions,
      optionsCount,
      prefixWidth,
      tagInMultiLine,
    } = toRefs(states)

    provide(
      selectKey,
      reactive({
        props,
        options,
        optionsArray,
        cachedOptions,
        optionsCount,
        filteredOptionsCount,
        hoverIndex,
        handleOptionSelect,
        selectEmitter: states.selectEmitter,
        onOptionCreate,
        onOptionDestroy,
        selectWrapper,
        selected,
        setSelected,
      }) as unknown as SelectContext
    )

    onMounted(() => {
      states.cachedPlaceHolder = currentPlaceholder.value =
        props.placeholder || t('el.select.placeholder')
      if (
        props.multiple &&
        Array.isArray(props.modelValue) &&
        props.modelValue.length > 0
      ) {
        currentPlaceholder.value = ''
      }
      addResizeListener(selectWrapper.value as any, handleResize)
      if (reference.value && reference.value.$el) {
        const sizeMap = {
          medium: 36,
          small: 32,
          mini: 28,
        }
        const input = reference.value.input
        states.initialInputHeight =
          input.getBoundingClientRect().height || sizeMap[selectSize.value]
      }
      if (props.remote && props.multiple) {
        resetInputHeight()
      }
      nextTick(() => {
        if (reference.value.$el) {
          inputWidth.value = reference.value.$el.getBoundingClientRect().width
        }
        if (ctx.slots.prefix) {
          const inputChildNodes = reference.value.$el.childNodes
          const input = [].filter.call(
            inputChildNodes,
            (item) => item.tagName === 'INPUT'
          )[0]
          const prefix = reference.value.$el.querySelector('.el-input__prefix')
          prefixWidth.value = Math.max(
            prefix.getBoundingClientRect().width + 5,
            30
          )
          if (states.prefixWidth) {
            input.style.paddingLeft = `${Math.max(states.prefixWidth, 30)}px`
          }
        }
      })
      setSelected()
    })

    onBeforeUnmount(() => {
      removeResizeListener(selectWrapper.value as any, handleResize)
    })

    if (props.multiple && !Array.isArray(props.modelValue)) {
      ctx.emit(UPDATE_MODEL_EVENT, [])
    }
    if (!props.multiple && Array.isArray(props.modelValue)) {
      ctx.emit(UPDATE_MODEL_EVENT, '')
    }

    const popperPaneRef = computed(() => {
      // eslint-disable-next-line no-console
      return popper.value?.popperRef
    })

    return {
      Effect,
      tagInMultiLine,
      prefixWidth,
      selectSize,
      readonly,
      handleResize,
      collapseTagSize,
      debouncedOnInputChange,
      debouncedQueryChange,
      deletePrevTag,
      deleteTag,
      deleteSelected,
      handleOptionSelect,
      scrollToOption,
      inputWidth,
      selected,
      inputLength,
      filteredOptionsCount,
      visible,
      softFocus,
      selectedLabel,
      hoverIndex,
      query,
      allSelected,
      inputHovering,
      currentPlaceholder,
      menuVisibleOnFocus,
      isOnComposition,
      isSilentBlur,
      options,
      resetInputHeight,
      managePlaceholder,
      showClose,
      selectDisabled,
      iconClass,
      showNewOption,
      emptyText,
      toggleLastOptionHitState,
      resetInputState,
      handleComposition,
      handleMenuEnter,
      handleFocus,
      blur,
      handleBlur,
      handleClearClick,
      handleClose,
      toggleMenu,
      selectOption,
      selectAllChange,
      getValueKey,
      navigateOptions,
      dropMenuVisible,
      focus,
      reference,
      input,
      popper,
      popperPaneRef,
      tags,
      selectWrapper,
      scrollbar,
    }
  },
})
</script>
