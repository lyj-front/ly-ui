<script lang="ts">
import {
  computed,
  defineComponent,
  h,
  getCurrentInstance,
  inject,
  ref,
  provide,
  onBeforeUnmount,
  reactive,
  watch
} from 'vue'
import { NOOP } from '@vue/shared'
import { elFormKey } from '@element-plus/tokens'

import ajax from './ajax'
import UploadList from './upload-list.vue'
import Upload from './upload.vue'
import useHandlers from './useHandlers'

import type { PropType } from 'vue'
import type { LyFormContext } from '@element-plus/tokens'
import type { Nullable } from '@element-plus/utils/types'
import type {
  ListType,
  UploadFile,
  FileHandler,
  FileResultHandler,
} from './upload.type'

type PFileHandler<T> = PropType<FileHandler<T>>
type PFileResultHandler<T = any> = PropType<FileResultHandler<T>>

export default defineComponent({
  name: 'LyUpload',
  components: {
    Upload,
    UploadList,
  },
  props: {
    action: {
      type: String,
      default: 'https://upload.qbox.me',
    },
    headers: {
      type: Object as PropType<Headers>,
      default: () => ({}),
    },
    method: {
      type: String,
      default: 'post',
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: 'file',
    },
    drag: {
      type: Boolean,
      default: false,
    },
    withCredentials: Boolean,
    showFileList: {
      type: Boolean,
      default: true,
    },
    accept: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'select',
    },
    beforeUpload: {
      type: Function as PFileHandler<void>,
      default: NOOP,
    },
    beforeRemove: {
      type: Function as PFileHandler<boolean>,
      default: NOOP,
    },
    onRemove: {
      type: Function as PFileHandler<void>,
      default: NOOP,
    },
    onChange: {
      type: Function as PFileHandler<void>,
      default: NOOP,
    },
    onPreview: {
      type: Function as PropType<() => void>,
      default: NOOP,
    },
    onSuccess: {
      type: Function as PFileResultHandler,
      default: NOOP,
    },
    onProgress: {
      type: Function as PFileResultHandler<ProgressEvent>,
      default: NOOP,
    },
    onError: {
      type: Function as PFileResultHandler<Error>,
      default: NOOP,
    },
    fileList: {
      type: Array as PropType<UploadFile[]>,
      default: () => {
        return [] as UploadFile[]
      },
    },
    autoUpload: {
      type: Boolean,
      default: true,
    },
    listType: {
      type: String as PropType<ListType>,
      default: 'text' as ListType, // text,picture,picture-card
    },
    httpRequest: {
      type: Function,
      default: ajax,
    },
    disabled: Boolean,
    limit: {
      type: Number as PropType<Nullable<number>>,
      default: null,
    },
    limitHiden:{
      type: Boolean,
      default: false,
    },
    onExceed: {
      type: Function,
      default: () => NOOP,
    },
    tableHeader: {
      type: Array,
      default: () => [],
    },
    canCut:{
      type: Boolean,
      default: false,
    },
    cutWidth:{
      type: Number,
      default: 100,
    },
    cutHeight:{
      type: Number,
      default: 100,
    },
    cutFixed:{
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const elForm = inject(elFormKey, {} as LyFormContext)

    const uploadDisabled = computed(() => {
      return props.disabled || elForm.disabled
    })

    const {
      abort,
      clearFiles,
      handleError,
      handleProgress,
      handleStart,
      handleSuccess,
      handleRemove,
      submit,
      uploadRef,
      hidenIcon,
      uploadFiles
    } = useHandlers(props)


    watch(props.fileList,(val)=>{
      if(!props.limitHiden || !props.limit ) return;
      if(val.length >= props.limit){
        hidenIcon.value = true;
      }else{
        hidenIcon.value = false;
      }
    })
    //影藏事件
    function handleHiden(val){
      hidenIcon.value = val
    }
    //移除事件
    function imgRemove(file,raw){
      handleRemove(file,raw)
      if(props.limitHiden && props.limit && uploadFiles.value.length < props.limit){
        hidenIcon.value = false;
      }
    }

    provide('uploader', getCurrentInstance())

    onBeforeUnmount(() => {
      uploadFiles.value.forEach((file) => {
        if (file.url && file.url.indexOf('blob:') === 0) {
          URL.revokeObjectURL(file.url)
        }
      })
    })

    return {
      abort,
      dragOver: ref(false),
      draging: ref(false),
      handleError,
      handleProgress,
      handleRemove,
      imgRemove,
      handleHiden,
      handleStart,
      handleSuccess,
      uploadDisabled,
      uploadFiles,
      uploadRef,
      hidenIcon,
      submit,
      clearFiles,
    }
  },
  render() {
    let uploadList,
      _this = this
    if (this.showFileList) {
      const _slot = {};
      this.tableHeader?.forEach((item)=>{
        _slot[item.prop] = (row,index)=>{
          return _this.$slots[item.prop]?.(row,index)
        }
      })
      uploadList = h(
        UploadList,
        {
          disabled: this.uploadDisabled,
          listType: this.listType,
          files: this.uploadFiles,
          onRemove: this.imgRemove,
          handlePreview: this.onPreview,
          tableHeader: this.tableHeader,
        },
        this.$slots.file
          ? {
              default: (props: { file: UploadFile }) => {
                return _this.$slots.file?.({
                  file: props.file,
                })
              },
              ..._slot
            }
          : _slot
      )
    } else {
      uploadList = null
    }

    const uploadData = {
      type: this.type,
      drag: this.drag,
      action: this.action,
      multiple: this.multiple,
      'before-upload': this.beforeUpload,
      'with-credentials': this.withCredentials,
      headers: this.headers,
      method: this.method,
      name: this.name,
      data: this.data,
      accept: this.accept,
      fileList: this.uploadFiles,
      autoUpload: this.autoUpload,
      listType: this.listType,
      disabled: this.uploadDisabled,
      limit: this.limit,
      limitHiden : this.limitHiden,
      hidenIcon:this.hidenIcon,
      canCut:this.canCut,
      cutWidth:this.cutWidth,
      cutHeight:this.cutHeight,
      cutFixed:this.cutFixed,
      'on-exceed': this.onExceed,
      'on-start': this.handleStart,
      'on-progress': this.handleProgress,
      'on-success': this.handleSuccess,
      'on-error': this.handleError,
      'on-preview': this.onPreview,
      'on-remove': this.imgRemove,
      'on-hiden':this.handleHiden,
      'http-request': this.httpRequest,
      ref: 'uploadRef',
    }
    const trigger = this.$slots.trigger || this.$slots.default
    const uploadComponent = h(Upload, uploadData, {
      default: () => trigger?.(),
    })
    return h('div', { class: `el-upload-${this.listType}_${this.listType}` }, [
      this.listType === 'picture-card' ? uploadList : null,
      this.$slots.trigger
        ? [uploadComponent, this.$slots.default()]
        : uploadComponent,
      this.$slots.tip?.(),
      this.listType !== 'picture-card' ? uploadList : null,
    ])
  },
})
</script>
