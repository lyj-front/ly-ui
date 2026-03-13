<template>
  <ly-dialog
    title="裁剪"
    v-model="dialogVisible"
    @open="handelOpen"
    @closed="handelClosed"
    width="800px"
    custom-class="cut-upload"
  >
    <div class="cropper-content">
      <lyj-cropper
        ref="cropper"
        :img="fileVal"
        :outputSize="cutOption.outputSize"
        :outputType="cutOption.outputType"
        :info="true"
        :full="cutOption.full"
        :canMove="cutOption.canMove"
        :canMoveBox="cutOption.canMoveBox"
        :original="cutOption.original"
        :autoCrop="cutOption.autoCrop"
        :autoCropWidth="cutWidth"
        :autoCropHeight="cutHeight"
        :fixedBox="cutFixed"
        @realTime="realTime"
      ></lyj-cropper>
    </div>
    <p class="previews-tip">预览效果</p>
    <div class="previews-content" v-html="cutOption.pHtml"></div>
    <template #footer>
      <span class="dialog-footer">
        <ly-button size="small" type="primary" @click="submit">确定</ly-button>
        <ly-button size="small" @click="dialogVisible = false">取消</ly-button>
      </span>
    </template>
  </ly-dialog>
</template>

<script>
import { ref, reactive, defineComponent } from 'vue'
import LyjCropper from './vue-cropper.vue'
import LyDialog from '@element-plus/components/dialog'
const dialogVisible = ref(false)
const cutDialog = defineComponent({
  components: {
    LyDialog,
    LyjCropper,
  },
  emits: ['file'],
  props: {
    fileVal: {
      type: [String, Blob, null, File],
      default: '',
    },
    fileName: {
      type: [String, Blob, null, File],
      default: '',
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
  setup(props, { emit }) {
    const cutOption = reactive({
      outputSize: 1, //剪切后的图片质量（0.1-1）
      full: false, //输出原图比例截图 props名full
      outputType: 'png',
      canMove: true, //图片是否可以拖动
      original: false, // 上传图片按照原始比例渲染
      canMoveBox: true, //框是否能拖动
      autoCrop: true,
      autoCropWidth: 160,
      autoCropHeight: 226,
      fixedBox: true, //框的大小是否固定
      pHtml: '',
      //   img: '',
      finalFormData: '',
    })
    const cropper = ref(null)
    function realTime(data) {
      cutOption.pHtml = data.html
    }
    //打开时
    function handelOpen() {
        
    }
    //关闭时
    function handelClosed() {}
    //blob文件转file
    async function transToFile(blob, fileName, fileType) {
      return new window.File([blob], fileName, { type: fileType })
    }

    //点击确定
    function submit() {
      cropper.value.getCropBlob(async(data) => {
        let res = await transToFile(data,props.fileName,data.type)
        // res.uid= new Date().getTime()
        emit('file', new Array(res))
        dialogVisible.value = false
      })
    }
    return {
      handelOpen,
      handelClosed,
      dialogVisible,
      submit,
      cutOption,
      cropper,
      realTime,
    }
  },
})
export { cutDialog as default, dialogVisible }
</script>
