<template>
  <transition-group
    v-if="listType !== 'table'"
    tag="ul"
    :class="[
      'el-upload-list',
      'el-upload-list--' + listType,
      { 'is-disabled': disabled },
    ]"
    name="el-list"
  >
    <li
      v-for="(file, index) in files"
      :key="file.uid || file"
      :class="[
        'el-upload-list__item',
        'is-' + file.status,
        focusing ? 'focusing' : '',
      ]"
      tabindex="0"
      @keydown.delete="!disabled && handleRemove($event, file)"
      @focus="focusing = true"
      @blur="focusing = false"
      @click="onFileClicked"
      v-showToast
    >
      <slot :file="file">
        <template v-if="file.status != 'fail'">
          <img
            v-if="
              file.status !== 'uploading' &&
              ['picture-card', 'picture'].includes(listType)
            "
            class="el-upload-list__item-thumbnail"
            :src="file.url"
            @click="openUrl(file)"
            alt=""
          />
        </template>
        <template
          v-else-if="
            file.status == 'fail' &&
            file.status !== 'uploading' &&
            ['picture-card', 'picture'].includes(listType)
          "
        >
          <div class="el-upload-list__item-fail">
            <i class="el-upload-list__item-fail-i"></i>
            <span>上传失败</span>
          </div>
        </template>
        <a class="el-upload-list__item-name" @click="handleClick(file)">
          <i
            :class="[
              file.status == 'fail' ? 'el-icon-lyjlinkred' : 'el-icon-lyjlink',
            ]"
          ></i>
          <span
            :data-index="index"
            :data-status="file.status"
            :class="[
              'el-upload-list__item-name-text',
              file.status == 'fail'
                ? 'el-upload-list__item-name-text-error'
                : '',
            ]"
            @click="openUrl(file)"
            >{{ file.name }}</span
          >
        </a>
        <label class="el-upload-list__item-status-label">
          <template v-if="listType === 'text'">
            <i
              v-if="file.status == 'fail'"
              class="el-icon-lyjdelred"
              @click="handleRemove($event, file)"
            ></i>
            <template v-else>
              <i
                class="el-icon-lyjdelgrey"
                @click="handleRemove($event, file)"
              ></i>
              <i
                class="el-icon-lyjdelblue"
                @click="handleRemove($event, file)"
              ></i
            ></template>
          </template>
          <template v-else-if="['picture-card', 'picture'].includes(listType)">
            <i
              class="el-icon-item-remove"
              @click="handleRemove($event, file)"
            ></i>
          </template>
        </label>
        <!-- Due to close btn only appears when li gets focused disappears after li gets blurred, thus keyboard navigation can never reach close btn-->
        <!-- This is a bug which needs to be fixed -->
        <!-- TODO: Fix the incorrect navigation interaction -->
        <i v-if="!disabled" class="el-icon-close-tip">{{
          t('el.upload.deleteTip')
        }}</i>
        <template v-if="listType === 'picture-card'">
          <div class="el-upload-list__item-progress">
            <p>文件上传中</p>
            <i
              class="el-icon-item-remove"
              @click="handleRemove($event, file)"
            ></i>
            <ly-progress
              v-if="file.status === 'uploading'"
              type="line"
              :stroke-width="2"
              :percentage="+file.percentage"
              :show-text="false"
            />
            <p>{{ file.percentage }}%</p>
          </div>
        </template>
        <template v-else>
          <ly-progress
            v-if="file.status === 'uploading'"
            type="line"
            :stroke-width="2"
            :percentage="+file.percentage"
          />
        </template>
      </slot>
    </li>
  </transition-group>
  <template v-else>
    <section class="el-upload-list__table-section">
      <template v-for="(file, index) in files" :key="file.uid || file">
        <div
          class="el-upload-list__table-progress"
          v-if="file.status === 'uploading'"
        >
          <p class="el-upload-list__table-progress-text">
            正在上传...<em>{{ file.percentage }}%</em>,请勿关闭页面
          </p>
          <ly-progress
            type="line"
            :stroke-width="4"
            :percentage="+file.percentage"
            :show-text="false"
          />
        </div>
      </template>
    </section>
    <ly-table class="el-upload-list__table-table" v-if="files.length > 0" :data="files">
      <ly-table-column
        v-for="(config, index) in tableHeader"
        :key="index"
        :show-overflow-tooltip="!config.noTip"
        :type="config.type"
        :prop="config.prop"
        :label="config.label"
        :sortable="config.sortable"
        :explain="config.explain"
        :min-width="config.minWidth"
        :width="config.width + 'px'"
        :fixed="config.fixed"
      >
        <template v-if="config.custom" #default="scope">
          <slot
            :name="config.prop"
            :row="scope.row"
            :index="scope.$index"
          ></slot>
        </template>
      </ly-table-column>
    </ly-table>
  </template>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NOOP } from '@vue/shared'

import { useLocaleInject } from '@element-plus/hooks'
import LyProgress from '@element-plus/components/progress'
import LyMessageBox from '@element-plus/components/message-box'
import { createPopper } from '@popperjs/core'
import PopupManager from '@element-plus/utils/popup-manager'
import type { PropType } from 'vue'
import type { UploadFile } from './upload.type'
import { off, on } from '@element-plus/utils/dom'

function renderContent(popperContent): HTMLDivElement {
  const content = document.createElement('div')
  content.className = `el-popper is-light`
  content.innerHTML = popperContent
  content.style.maxWidth = '270px'
  content.style.transition = 'opacity 0.3s'
  content.style.lineHeight = '18px'
  content.style.zIndex = String(PopupManager.nextZIndex())
  content.style.opacity = '0'
  document.body.appendChild(content)
  return content
}

function renderArrow(): HTMLDivElement {
  const arrow = document.createElement('div')
  arrow.className = 'el-popper__arrow'
  arrow.style.bottom = '-4px'
  return arrow
}

function showPopper(el, _child) {
  if (
    _child.clientWidth < _child.scrollWidth ||
    _child.dataset.status == 'fail'
  ) {
    const content = renderContent(
      _child.dataset.status == 'fail' ? '上传失败，请重试' : _child.innerText
    )
    const arrow = renderArrow()
    content.style.opacity = '1'
    content.appendChild(arrow)
    const poper = createPopper(el, content, {
      placement: 'right',
      strategy: 'fixed',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 20],
          },
        },
        {
          name: 'arrow',
          options: {
            element: arrow,
            padding: 10,
          },
        },
      ],
    })
    on(el, 'mouseleave', removePopper.bind(el, el, poper, content))
  }
}
function removePopper(el, poper, content) {
  content.remove()
}

export default defineComponent({
  name: 'LyUploadList',
  components: { LyProgress },
  directives: {
    showToast: {
      mounted(el) {
        const el_list = el.getElementsByClassName(
          'el-upload-list__item-name-text'
        )
        if (el_list.length === 0) return
        const _child = el_list[0]
        on(_child, 'mouseenter', showPopper.bind(el, el, _child))
      },
    },
  },
  props: {
    files: {
      type: Array as PropType<UploadFile[]>,
      default: () => [] as File[],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    handlePreview: {
      type: Function as PropType<(file: UploadFile) => void>,
      default: () => NOOP,
    },
    listType: {
      type: String as PropType<'picture' | 'picture-card' | 'text'>,
      default: 'text',
    },
    tableHeader: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['remove'],
  setup(props, { emit }) {
    const { t } = useLocaleInject()
    const showToastList = ref([])
    const handleClick = (file: UploadFile) => {
      props.handlePreview(file)
    }

    const onFileClicked = (e: Event) => {
      ;(e.target as HTMLElement).focus()
    }
    const handleRemove = (e: Event, file: UploadFile) => {
      if (file.status == 'fail') {
        emit('remove', file)
        return
      }
      LyMessageBox.confirm('是否确定删除该文件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          emit('remove', file)
        })
        .catch(() => {})
    }

    const openUrl = (file: UploadFile) => {
      if (file.url) {
        window.open(file.url)
      }
    }
    return {
      openUrl,
      focusing: ref(false),
      handleClick,
      handleRemove,
      onFileClicked,
      showToastList,
      t,
    }
  },
})
</script>
