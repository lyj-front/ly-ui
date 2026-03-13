<template>
  <div
    :class="['el-upload', `el-upload--${listType}`]"
    tabindex="0"
    @click="handleClick"
    @keydown.self.enter.space="handleKeydown"
    v-show="!hidenIcon"
  >
    <template v-if="drag">
      <upload-dragger :disabled="disabled" @file="uploadFiles">
        <slot></slot>
      </upload-dragger>
    </template>
    <template v-else>
      <slot></slot>
    </template>
    <input
      ref="inputRef"
      class="el-upload__input"
      type="file"
      :name="name"
      :multiple="multiple"
      :accept="accept"
      @change="handleChange"
    />
  </div>
  <cut-dialog :fileVal="fileVal" :fileName="fileName" @file="uploadFiles" :cutWidth="cutWidth" :cutHeight="cutHeight" :cutFixed="cutFixed" v-if="canCut"></cut-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import { NOOP, hasOwn } from '@vue/shared'

import ajax from './ajax'
import UploadDragger from './upload-dragger.vue'

import type { Indexable, Nullable } from '@element-plus/utils/types'
import type { ListType, UploadFile, ElFile } from './upload.type'
import cutDialog,{ dialogVisible } from './cutDialog.vue'
type IFileHanlder = (
  file: Nullable<ElFile[]>,
  fileList?: UploadFile[]
) => unknown

type AjaxEventListener = (e: ProgressEvent, file: ElFile) => unknown

export default defineComponent({
  components: {
    UploadDragger,
    cutDialog
  },
  props: {
    type: {
      type: String,
      default: '',
    },
    action: {
      type: String,
      default: 'https://upload.qbox.me',
    },
    name: {
      type: String,
      default: 'file',
    },
    data: {
      type: Object as PropType<Record<string, any>>,
      default: () => null,
    },
    headers: {
      type: Object as PropType<Nullable<Partial<Headers>>>,
      default: () => null,
    },
    method: {
      type: String,
      default: 'post',
    },
    withCredentials: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean as PropType<Nullable<boolean>>,
      default: null,
    },
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers
    accept: {
      type: String,
      default: '',
    },
    onStart: {
      type: Function as PropType<(file: File) => void>,
      default: NOOP as (file: File) => void,
    },
    onProgress: {
      type: Function as PropType<AjaxEventListener>,
      default: NOOP as AjaxEventListener,
    },
    onSuccess: {
      type: Function as PropType<AjaxEventListener>,
      default: NOOP as AjaxEventListener,
    },
    onError: {
      type: Function as PropType<AjaxEventListener>,
      default: NOOP as AjaxEventListener,
    },
    beforeUpload: {
      type: Function as PropType<
        (file: File) => Promise<File | Blob> | boolean | unknown
      >,
      default: NOOP as (file: File) => void,
    },
    drag: {
      type: Boolean,
      default: false,
    },
    onPreview: {
      type: Function as PropType<IFileHanlder>,
      default: NOOP as IFileHanlder,
    },
    onRemove: {
      type: Function as PropType<
        (file: Nullable<FileList>, rawFile: ElFile) => void
      >,
      default: NOOP as (file: Nullable<FileList>, rawFile: ElFile) => void,
    },
    onHiden:{
      type:Function,
      default:()=>{}
    },
    fileList: {
      type: Array as PropType<UploadFile[]>,
      default: () => [] as UploadFile[],
    },
    autoUpload: {
      type: Boolean,
      default: true,
    },
    listType: {
      type: String as PropType<ListType>,
      default: 'text',
    },
    httpRequest: {
      type: Function as
        | PropType<typeof ajax>
        | PropType<(...args: unknown[]) => Promise<unknown>>,
      default: () => ajax,
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
    hidenIcon:{
      type: Boolean,
      default: false,
    },
    onExceed: {
      type: Function as PropType<
        (files: FileList, fileList: UploadFile[]) => void
      >,
      default: NOOP,
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
    const reqs = ref({} as Indexable<XMLHttpRequest | Promise<any>>)
    const mouseover = ref(false)
    const inputRef = ref(null as Nullable<HTMLInputElement>)
    // const hidenIcon = ref(false)
    //判断初始化时上传限制个数大于限制上传个数情况
    if(props.limitHiden && props.limit && props.fileList.length >= props.limit){
      props.onHiden(true)
    }

    function uploadFiles(files: FileList) {
      //当设置了影藏上传图标并且已上传数大于等于限制个数时
      if(props.limitHiden && props.limit && props.fileList.length + files.length >= props.limit){
          props.onHiden(true)
      }
      if (props.limit && props.fileList.length + files.length > props.limit) {
        props.onExceed(files, props.fileList)
        return
      }
      let postFiles = Array.from(files)
      if (!props.multiple) {
        postFiles = postFiles.slice(0, 1)
      }
      if (postFiles.length === 0) {
        return
      }
      postFiles.forEach((rawFile) => {
        props.onStart(rawFile)
        if (props.autoUpload) upload(rawFile as ElFile)
      })
    }

    function upload(rawFile: ElFile) {
      inputRef.value.value = null
      if (!props.beforeUpload) {
        return post(rawFile)
      }
      const before = props.beforeUpload(rawFile)
      if (before instanceof Promise) {
        before
          .then((processedFile) => {
            const fileType = Object.prototype.toString.call(processedFile)
            if (fileType === '[object File]' || fileType === '[object Blob]') {
              if (fileType === '[object Blob]') {
                processedFile = new File([processedFile], rawFile.name, {
                  type: rawFile.type,
                })
              }
              for (const p in rawFile) {
                if (hasOwn(rawFile, p)) {
                  processedFile[p] = rawFile[p]
                }
              }
              post(processedFile)
            } else {
              post(rawFile)
            }
          })
          .catch(() => {
            props.onRemove(null, rawFile)
          })
      } else if (before !== false) {
        post(rawFile)
      } else {
        props.onRemove(null, rawFile)
      }
    }
    function abort(file) {
      const _reqs = reqs.value
      if (file) {
        let uid = file
        if (file.uid) uid = file.uid
        if (_reqs[uid]) {
          ;(_reqs[uid] as XMLHttpRequest).abort()
        }
      } else {
        Object.keys(_reqs).forEach((uid) => {
          if (_reqs[uid]) (_reqs[uid] as XMLHttpRequest).abort()
          delete _reqs[uid]
        })
      }
    }
    function post(rawFile: ElFile) {
      const { uid } = rawFile
      const _data = props.data
      const options = {
        headers: props.headers,
        withCredentials: props.withCredentials,
        file: rawFile,
        data: _data,
        method: props.method,
        filename: props.name,
        action: props.action,
        onProgress: (e) => {
          props.onProgress(e, rawFile)
        },
        onSuccess: (res) => {
          props.onSuccess(res, rawFile)
          delete reqs.value[uid]
        },
        onError: (err) => {
          props.onError(err, rawFile)
          delete reqs.value[uid]
        },
      }
      const req = props.httpRequest(options)
      reqs.value[uid] = req
      if (req instanceof Promise) {
        req.then(options.onSuccess, options.onError)
      }
    }

    const fileVal = ref(null as any);
    const fileName = ref('')

    function handleChange(e: DragEvent) {
      const files = (e.target as HTMLInputElement).files
      if (!files) return
      if(props.canCut && !/image\//.test(files[0].type)){
        uploadFiles(files)
        return
      }
      if(props.canCut && !props.multiple){
        var reader = new FileReader()
        reader.onload = (e) => {
          let data
          if (typeof e.target.result === 'object') {
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          } else {
            data = e.target.result
          }
          fileVal.value = data;
          fileName.value = files[0].name
          dialogVisible.value = true;
        }
        reader.readAsArrayBuffer(files[0])
      }else{ 
        uploadFiles(files)
      }
    }

    function handleClick() {
      if (!props.disabled) {
        inputRef.value.value = null
        inputRef.value.click()
      }
    }

    function handleKeydown() {
      handleClick()
    }

    return {
      reqs,
      mouseover,
      inputRef,
      abort,
      post,
      handleChange,
      handleClick,
      handleKeydown,
      upload,
      uploadFiles,
      fileVal,
      fileName,
    }
  },
})
</script>
