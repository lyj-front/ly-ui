<template>
  <div
    class="lyj-cropper"
    ref="cropper"
    @mouseover="scaleImg"
    @mouseout="cancelScale"
  >
    <div class="cropper-box" v-if="imgs">
      <div
        class="cropper-box-canvas"
        v-show="!loading"
        :style="{
          width: trueWidth + 'px',
          height: trueHeight + 'px',
          transform:
            'scale(' +
            scale +
            ',' +
            scale +
            ') ' +
            'translate3d(' +
            x / scale +
            'px,' +
            y / scale +
            'px,' +
            '0)' +
            'rotateZ(' +
            rotate * 90 +
            'deg)',
        }"
      >
        <img :src="imgs" alt="cropper-img" ref="cropperImg" />
      </div>
    </div>
    <div
      class="cropper-drag-box"
      :class="{
        'cropper-move': move && !crop,
        'cropper-crop': crop,
        'cropper-modal': cropping,
      }"
      @mousedown="startMove"
      @touchstart="startMove"
    ></div>
    <div
      v-show="cropping"
      class="cropper-crop-box"
      :style="{
        width: cropW + 'px',
        height: cropH + 'px',
        transform:
          'translate3d(' + cropOffsertX + 'px,' + cropOffsertY + 'px,' + '0)',
      }"
    >
      <span class="cropper-view-box">
        <img
          :style="{
            width: trueWidth + 'px',
            height: trueHeight + 'px',
            transform:
              'scale(' +
              scale +
              ',' +
              scale +
              ') ' +
              'translate3d(' +
              (x - cropOffsertX) / scale +
              'px,' +
              (y - cropOffsertY) / scale +
              'px,' +
              '0)' +
              'rotateZ(' +
              rotate * 90 +
              'deg)',
          }"
          :src="imgs"
          alt="cropper-img"
        />
      </span>
      <span
        class="cropper-face cropper-move"
        @mousedown="cropMove"
        @touchstart="cropMove"
      ></span>
      <span class="crop-info" v-if="info" :style="{ top: cropInfo.top }"
        >{{ cropInfo.width }} × {{ cropInfo.height }}</span
      >
      <span v-if="!fixedBox">
        <span
          class="crop-line line-w"
          @mousedown="changeCropSize($event, false, true, 0, 1)"
          @touchstart="changeCropSize($event, false, true, 0, 1)"
        ></span>
        <span
          class="crop-line line-a"
          @mousedown="changeCropSize($event, true, false, 1, 0)"
          @touchstart="changeCropSize($event, true, false, 1, 0)"
        ></span>
        <span
          class="crop-line line-s"
          @mousedown="changeCropSize($event, false, true, 0, 2)"
          @touchstart="changeCropSize($event, false, true, 0, 2)"
        ></span>
        <span
          class="crop-line line-d"
          @mousedown="changeCropSize($event, true, false, 2, 0)"
          @touchstart="changeCropSize($event, true, false, 2, 0)"
        ></span>
        <span
          class="crop-point point1"
          @mousedown="changeCropSize($event, true, true, 1, 1)"
          @touchstart="changeCropSize($event, true, true, 1, 1)"
        ></span>
        <span
          class="crop-point point2"
          @mousedown="changeCropSize($event, false, true, 0, 1)"
          @touchstart="changeCropSize($event, false, true, 0, 1)"
        ></span>
        <span
          class="crop-point point3"
          @mousedown="changeCropSize($event, true, true, 2, 1)"
          @touchstart="changeCropSize($event, true, true, 2, 1)"
        ></span>
        <span
          class="crop-point point4"
          @mousedown="changeCropSize($event, true, false, 1, 0)"
          @touchstart="changeCropSize($event, true, false, 1, 0)"
        ></span>
        <span
          class="crop-point point5"
          @mousedown="changeCropSize($event, true, false, 2, 0)"
          @touchstart="changeCropSize($event, true, false, 2, 0)"
        ></span>
        <span
          class="crop-point point6"
          @mousedown="changeCropSize($event, true, true, 1, 2)"
          @touchstart="changeCropSize($event, true, true, 1, 2)"
        ></span>
        <span
          class="crop-point point7"
          @mousedown="changeCropSize($event, false, true, 0, 2)"
          @touchstart="changeCropSize($event, false, true, 0, 2)"
        ></span>
        <span
          class="crop-point point8"
          @mousedown="changeCropSize($event, true, true, 2, 2)"
          @touchstart="changeCropSize($event, true, true, 2, 2)"
        ></span>
      </span>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  computed,
  toRefs,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
} from 'vue'
export default defineComponent({
  emits: [
    'img-load',
    'imgLoad',
    'cropMoving',
    'crop-moving',
    'realTime',
    'real-time',
    'imgMoving',
    'img-moving',
    'change-crop-size',
  ],
  props: {
    img: {
      type: [String, Blob, null, File],
      default: '',
    },
    // 输出图片压缩比
    outputSize: {
      type: Number,
      default: 1,
    },
    outputType: {
      type: String,
      default: 'jpeg',
    },
    info: {
      type: Boolean,
      default: true,
    },
    // 是否开启滚轮放大缩小
    canScale: {
      type: Boolean,
      default: true,
    },
    // 是否自成截图框
    autoCrop: {
      type: Boolean,
      default: false,
    },
    autoCropWidth: {
      type: [Number, String],
      default: 0,
    },
    autoCropHeight: {
      type: [Number, String],
      default: 0,
    },
    // 是否开启固定宽高比
    fixed: {
      type: Boolean,
      default: false,
    },
    // 宽高比 w/h
    fixedNumber: {
      type: Array,
      default: () => {
        return [1, 1]
      },
    },
    // 固定大小 禁止改变截图框大小
    fixedBox: {
      type: Boolean,
      default: false,
    },
    // 输出截图是否缩放
    full: {
      type: Boolean,
      default: false,
    },
    // 是否可以拖动图片
    canMove: {
      type: Boolean,
      default: true,
    },
    // 是否可以拖动截图框
    canMoveBox: {
      type: Boolean,
      default: true,
    },
    // 上传图片按照原始比例显示
    original: {
      type: Boolean,
      default: false,
    },
    // 截图框能否超过图片
    centerBox: {
      type: Boolean,
      default: false,
    },
    // 是否根据dpr输出高清图片
    high: {
      type: Boolean,
      default: true,
    },
    // 截图框展示宽高类型
    infoTrue: {
      type: Boolean,
      default: false,
    },
    // 可以压缩图片宽高  默认不超过200
    maxImgSize: {
      type: [Number, String],
      default: 2000,
    },
    // 倍数  可渲染当前截图框的n倍 0 - 1000;
    enlarge: {
      type: [Number, String],
      default: 1,
    },

    // 自动预览的固定宽度
    preW: {
      type: [Number, String],
      default: 0,
    },
    /*
      图片布局方式 mode 实现和css背景一样的效果
      contain  居中布局 默认不会缩放 保证图片在容器里面 mode: 'contain'
      cover    拉伸布局 填充整个容器  mode: 'cover'
      如果仅有一个数值被给定，这个数值将作为宽度值大小，高度值将被设定为auto。 mode: '50px'
      如果有两个数值被给定，第一个将作为宽度值大小，第二个作为高度值大小。 mode: '50px 60px'
    */
    mode: {
      type: String,
      default: 'contain',
    },
    //限制最小区域,可传1以上的数字和字符串，限制长宽都是这么大
    // 也可以传数组[90,90]
    limitMinSize: {
      type: [Number, Array, String],
      default: () => {
        return 10
      },
    },
  },
  setup(props, { emit }) {
    const info = reactive({
      // 容器高宽
      w: 0,
      h: 0,
      // 图片加载
      loading: true,
      // 图片真实宽度
      trueWidth: 0,
      // 图片真实高度
      trueHeight: 0,
      move: true,
      // 移动的x
      moveX: 0,
      // 移动的y
      moveY: 0,
      // 开启截图
      crop: false,
      // 正在截图
      cropping: false,
      // 裁剪框大小
      cropW: 0,
      cropH: 0,
      cropOldW: 0,
      cropOldH: 0,
      // 判断是否能够改变
      canChangeX: false,
      canChangeY: false,
      // 改变的基准点
      changeCropTypeX: 1,
      changeCropTypeY: 1,
      // 裁剪框的坐标轴
      cropX: 0,
      cropY: 0,
      cropChangeX: 0,
      cropChangeY: 0,
      // 支持的滚动事件
      support: '',
      // 移动端手指缩放
      touches: [],
      touchNow: false,
      // 图片旋转
      rotate: 0,
      isIos: false,
      orientation: 0,
      imgs: '',
      // 图片缩放系数
      coe: 0.2,
      // 是否正在多次缩放
      scaling: false,
      scalingSet: '',
      coeStatus: '',
    })

    const cropInfo = computed(() => {
      let obj = {}
      obj.top = position.cropOffsertY > 21 ? '-21px' : '0px'
      obj.width = position.cropW > 0 ? position.cropW : 0
      obj.height = position.cropH > 0 ? position.cropH : 0
      if (props.infoTrue) {
        let dpr = 1
        if (props.high && !props.full) {
          dpr = window.devicePixelRatio
        }
        if ((props.enlarge !== 1) & !props.full) {
          dpr = Math.abs(Number(props.enlarge))
        }
        obj.width = obj.width * dpr
        obj.height = obj.height * dpr
        if (props.full) {
          obj.width = obj.width / position.scale
          obj.height = obj.height / position.scale
        }
      }
      obj.width = obj.width.toFixed(0)
      obj.height = obj.height.toFixed(0)
      return obj
    })
    const isIE = computed(() => {
      var userAgent = navigator.userAgent //取得浏览器的userAgent字符串
      const isIE = !!window.ActiveXObject || 'ActiveXObject' in window //判断是否IE浏览器
      return isIE
    })
    const passive = computed(() => {
      return isIE.value
        ? null
        : {
            passive: false,
          }
    })

    watch(
      () => props.img,
      (val) => {
        checkedImg()
      }
    )

    const getData = (img) =>
      new Promise((reslove, reject) => {
        let obj = {}
        getImageData(img)
          .then((data) => {
            obj.arrayBuffer = data
            obj.orientation = getOrientation(data)
            reslove(obj)
          })
          .catch((error) => {
            reject(error)
          })
      })

    // 这里的获取exif要将图片转ArrayBuffer对象，这里假设获取了图片的baes64
    // 步骤一
    // base64转ArrayBuffer对象
    function getImageData(img) {
      let data = null
      return new Promise((reslove, reject) => {
        if (img.src) {
          if (/^data\:/i.test(img.src)) {
            // Data URI
            data = base64ToArrayBuffer(img.src)
            reslove(data)
          } else if (/^blob\:/i.test(img.src)) {
            // Object URL
            var fileReader = new FileReader()
            fileReader.onload = function (e) {
              data = e.target.result
              reslove(data)
            }
            objectURLToBlob(img.src, function (blob) {
              fileReader.readAsArrayBuffer(blob)
            })
          } else {
            var http = new XMLHttpRequest()
            http.onload = function () {
              if (this.status == 200 || this.status === 0) {
                data = http.response
                reslove(data)
              } else {
                throw 'Could not load image'
              }
              http = null
            }
            http.open('GET', img.src, true)
            http.responseType = 'arraybuffer'
            http.send(null)
          }
        } else {
          reject('img error')
        }
      })
    }

    function objectURLToBlob(url, callback) {
      var http = new XMLHttpRequest()
      http.open('GET', url, true)
      http.responseType = 'blob'
      http.onload = function (e) {
        if (this.status == 200 || this.status === 0) {
          callback(this.response)
        }
      }
      http.send()
    }

    function base64ToArrayBuffer(base64) {
      base64 = base64.replace(/^data\:([^\;]+)\;base64,/gim, '')
      var binary = atob(base64)
      var len = binary.length
      var buffer = new ArrayBuffer(len)
      var view = new Uint8Array(buffer)
      for (var i = 0; i < len; i++) {
        view[i] = binary.charCodeAt(i)
      }
      return buffer
    }
    // 步骤二，Unicode码转字符串
    // ArrayBuffer对象 Unicode码转字符串
    function getStringFromCharCode(dataView, start, length) {
      var str = ''
      var i
      for (i = start, length += start; i < length; i++) {
        str += String.fromCharCode(dataView.getUint8(i))
      }
      return str
    }

    // 步骤三，获取jpg图片的exif的角度（在ios体现最明显）
    function getOrientation(arrayBuffer) {
      var dataView = new DataView(arrayBuffer)
      var length = dataView.byteLength
      var orientation
      var exifIDCode
      var tiffOffset
      var firstIFDOffset
      var littleEndian
      var endianness
      var app1Start
      var ifdStart
      var offset
      var i
      // Only handle JPEG image (start by 0xFFD8)
      if (dataView.getUint8(0) === 0xff && dataView.getUint8(1) === 0xd8) {
        offset = 2
        while (offset < length) {
          if (
            dataView.getUint8(offset) === 0xff &&
            dataView.getUint8(offset + 1) === 0xe1
          ) {
            app1Start = offset
            break
          }
          offset++
        }
      }
      if (app1Start) {
        exifIDCode = app1Start + 4
        tiffOffset = app1Start + 10
        if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
          endianness = dataView.getUint16(tiffOffset)
          littleEndian = endianness === 0x4949

          if (littleEndian || endianness === 0x4d4d /* bigEndian */) {
            if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002a) {
              firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian)

              if (firstIFDOffset >= 0x00000008) {
                ifdStart = tiffOffset + firstIFDOffset
              }
            }
          }
        }
      }
      if (ifdStart) {
        length = dataView.getUint16(ifdStart, littleEndian)

        for (i = 0; i < length; i++) {
          offset = ifdStart + i * 12 + 2
          if (
            dataView.getUint16(offset, littleEndian) ===
            0x0112 /* Orientation */
          ) {
            // 8 is the offset of the current tag's value
            offset += 8

            // Get the original orientation value
            orientation = dataView.getUint16(offset, littleEndian)

            // Override the orientation with its default value for Safari (#120)
            // if (IS_SAFARI_OR_UIWEBVIEW) {
            //   dataView.setUint16(offset, 1, littleEndian);
            // }
            break
          }
        }
      }
      return orientation
    }

    function checkedImg() {
      if (props.img === null || props.img === '') {
        info.imgs = ''
        clearCrop()
        return
      }
      info.loading = true
      position.scale = 1
      info.rotate = 0
      clearCrop()
      let img = new Image()
      img.onload = () => {
        if (props.img === '') {
          emit('img-load', 'error')
          return false
        }

        let width = img.width
        let height = img.height
        getData(img).then((data) => {
          info.orientation = data.orientation || 1
          let max = Number(props.maxImgSize)
          if (!info.orientation && (width < max) & (height < max)) {
            info.imgs = props.img
            return
          }

          if (width > max) {
            height = (height / width) * max
            width = max
          }

          if (height > max) {
            width = (width / height) * max
            height = max
          }
          checkOrientationImage(img, info.orientation, width, height)
        })
      }

      img.onerror = () => {
        emit('img-load', 'error')
      }

      // 判断如果不是base64图片 再添加crossOrigin属性，否则会导致iOS低版本(10.2)无法显示图片
      if (props.img.substr(0, 4) !== 'data') {
        img.crossOrigin = ''
      }

      if (isIE.value) {
        var xhr = new XMLHttpRequest()
        xhr.onload = function () {
          var url = URL.createObjectURL(this.response)
          img.src = url
        }
        xhr.open('GET', props.img, true)
        xhr.responseType = 'blob'
        xhr.send()
      } else {
        img.src = props.img
      }
    }
    // 清除截图
    function clearCrop() {
      info.cropping = false
      position.cropW = 0
      position.cropH = 0
    }

    // 截图移动
    function cropMove(e) {
      e.preventDefault()
      if (!props.canMoveBox) {
        info.crop = false
        startMove(e)
        return false
      }

      if (e.touches && e.touches.length === 2) {
        info.crop = false
        startMove(e)
        leaveCrop()
        return false
      }
      window.addEventListener('mousemove', moveCrop)
      window.addEventListener('mouseup', leaveCrop)
      window.addEventListener('touchmove', moveCrop)
      window.addEventListener('touchend', leaveCrop)
      let x = 'clientX' in e ? e.clientX : e.touches[0].clientX
      let y = 'clientY' in e ? e.clientY : e.touches[0].clientY
      let newX, newY
      newX = x - position.cropOffsertX
      newY = y - position.cropOffsertY
      info.cropX = newX
      info.cropY = newY
      // 触发截图框移动事件
      emit('cropMoving', {
        moving: true,
        axis: getCropAxis(),
      })
      emit('crop-moving', {
        moving: true,
        axis: getCropAxis(),
      })
    }

    function getVersion(name) {
      var arr = navigator.userAgent.split(' ')
      var chromeVersion = ''
      let result = 0
      const reg = new RegExp(name, 'i')
      for (var i = 0; i < arr.length; i++) {
        if (reg.test(arr[i])) chromeVersion = arr[i]
      }
      if (chromeVersion) {
        result = chromeVersion.split('/')[1].split('.')
      } else {
        result = ['0', '0', '0']
      }
      return result
    }

    function checkOrientationImage(img, orientation, width, height) {
      // 如果是 chrome内核版本在81 safari 在 605 以上不处理图片旋转
      // alert(navigator.userAgent)
      if (getVersion('chrome')[0] >= 81) {
        orientation = -1
      } else {
        if (getVersion('safari')[0] >= 605) {
          const safariVersion = getVersion('version')
          if (safariVersion[0] > 13 && safariVersion[1] > 1) {
            orientation = -1
          }
        } else {
          //  判断 ios 版本进行处理
          // 针对 ios 版本大于 13.4的系统不做图片旋转
          const isIos = navigator.userAgent
            .toLowerCase()
            .match(/cpu iphone os (.*?) like mac os/)
          if (isIos) {
            let version = isIos[1]
            version = version.split('_')
            if (version[0] > 13 || (version[0] >= 13 && version[1] >= 4)) {
              orientation = -1
            }
          }
        }
      }

      // alert(`当前处理的orientation${orientation}`)
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      ctx.save()

      switch (orientation) {
        case 2:
          canvas.width = width
          canvas.height = height
          // horizontal flip
          ctx.translate(width, 0)
          ctx.scale(-1, 1)
          break
        case 3:
          canvas.width = width
          canvas.height = height
          //180 graus
          ctx.translate(width / 2, height / 2)
          ctx.rotate((180 * Math.PI) / 180)
          ctx.translate(-width / 2, -height / 2)
          break
        case 4:
          canvas.width = width
          canvas.height = height
          // vertical flip
          ctx.translate(0, height)
          ctx.scale(1, -1)
          break
        case 5:
          // vertical flip + 90 rotate right
          canvas.height = width
          canvas.width = height
          ctx.rotate(0.5 * Math.PI)
          ctx.scale(1, -1)
          break
        case 6:
          canvas.width = height
          canvas.height = width
          //90 graus
          ctx.translate(height / 2, width / 2)
          ctx.rotate((90 * Math.PI) / 180)
          ctx.translate(-width / 2, -height / 2)
          break
        case 7:
          // horizontal flip + 90 rotate right
          canvas.height = width
          canvas.width = height
          ctx.rotate(0.5 * Math.PI)
          ctx.translate(width, -height)
          ctx.scale(-1, 1)
          break
        case 8:
          canvas.height = width
          canvas.width = height
          //-90 graus
          ctx.translate(height / 2, width / 2)
          ctx.rotate((-90 * Math.PI) / 180)
          ctx.translate(-width / 2, -height / 2)
          break
        default:
          canvas.width = width
          canvas.height = height
      }

      ctx.drawImage(img, 0, 0, width, height)
      ctx.restore()
      canvas.toBlob(
        (blob) => {
          let data = URL.createObjectURL(blob)
          URL.revokeObjectURL(info.imgs)
          info.imgs = data
        },
        'image/' + props.outputType,
        1
      )
    }

    watch(
      () => info.imgs,
      (val) => {
        if (val === '') {
          return
        }
        reload()
      }
    )
    const cropper = ref(null)
    function reload() {
      let img = new Image()
      img.onload = () => {
        // 读取图片的信息原始信息， 解析是否需要旋转
        // 读取图片的旋转信息
        // 得到外层容器的宽度高度
        info.w = parseFloat(window.getComputedStyle(cropper.value).width)
        info.h = parseFloat(window.getComputedStyle(cropper.value).height)

        // 存入图片真实高度
        info.trueWidth = img.width
        info.trueHeight = img.height

        // 判断是否需要压缩大图
        if (!props.original) {
          // 判断布局方式 mode
          position.scale = checkedMode()
        } else {
          position.scale = 1
        }

        nextTick(() => {
          position.x =
            -(info.trueWidth - info.trueWidth * position.scale) / 2 +
            (info.w - info.trueWidth * position.scale) / 2
          position.y =
            -(info.trueHeight - info.trueHeight * position.scale) / 2 +
            (info.h - info.trueHeight * position.scale) / 2
          info.loading = false
          // // 获取是否开启了自动截图
          if (props.autoCrop) {
            goAutoCrop()
          }
          // 图片加载成功的回调
          emit('img-load', 'success')
          emit('imgLoad', 'success')
          setTimeout(() => {
            showPreview()
          }, 20)
        })
      }
      img.onerror = () => {
        emit('imgLoad', 'error')
        emit('img-load', 'error')
      }
      img.src = info.imgs
    }
    const isCanShow = ref(true) // 控制emit触发频率

    function showPreview() {
      // 优化不要多次触发
      if (isCanShow.value) {
        isCanShow.value = false
        setTimeout(() => {
          isCanShow.value = true
        }, 16)
      } else {
        return false
      }
      let w = position.cropW
      let h = position.cropH
      let scale = position.scale
      var obj = {}
      obj.div = {
        width: `${w}px`,
        height: `${h}px`,
      }
      let transformX = (position.x - position.cropOffsertX) / scale
      let transformY = (position.y - position.cropOffsertY) / scale
      let transformZ = 0
      obj.w = w
      obj.h = h
      obj.url = info.imgs
      obj.img = {
        width: `${info.trueWidth}px`,
        height: `${info.trueHeight}px`,
        transform: `scale(${scale})translate3d(${transformX}px, ${transformY}px, ${transformZ}px)rotateZ(${
          info.rotate * 90
        }deg)`,
      }
      obj.html = `
      <div class="show-preview" style="width: ${obj.w}px; height: ${
        obj.h
      }px,; overflow: hidden">
        <div style="width: ${w}px; height: ${h}px;border:1px solid #ddd; box-sizing: border-box;">
          <img src=${obj.url} style="width: ${info.trueWidth}px; height: ${
        info.trueHeight
      }px; transform:
          scale(${scale})translate3d(${transformX}px, ${transformY}px, ${transformZ}px)rotateZ(${
        info.rotate * 90
      }deg)">
        </div>
      </div>`
      emit('realTime', obj)
      emit('real-time', obj)
    }

    // 背景布局的函数
    function checkedMode() {
      let scale = 1
      // 通过字符串分割
      let imgW = info.trueWidth
      let imgH = info.trueHeight
      const arr = props.mode.split(' ')
      switch (arr[0]) {
        case 'contain':
          if (info.trueWidth > info.w) {
            // 如果图片宽度大于容器宽度
            scale = info.w / info.trueWidth
          }

          if (info.trueHeight * scale > info.h) {
            scale = info.h / info.trueHeight
          }
          break
        case 'cover':
          // 扩展布局 默认填充满整个容器
          // 图片宽度大于容器
          imgW = info.w
          scale = imgW / info.trueWidth
          imgH = imgH * scale
          // 如果扩展之后高度小于容器的外层高度 继续扩展高度
          if (imgH < info.h) {
            imgH = info.h
            scale = imgH / info.trueHeight
          }
          break
        default:
          try {
            let str = arr[0]
            if (str.search('px') !== -1) {
              str = str.replace('px', '')
              imgW = parseFloat(str)
              const scaleX = imgW / info.trueWidth
              let scaleY = 1
              let strH = arr[1]
              if (strH.search('px') !== -1) {
                strH = strH.replace('px', '')
                imgH = parseFloat(strH)
                scaleY = imgH / info.trueHeight
              }
              scale = Math.min(scaleX, scaleY)
            }
            if (str.search('%') !== -1) {
              str = str.replace('%', '')
              imgW = (parseFloat(str) / 100) * info.w
              scale = imgW / info.trueWidth
            }

            if (arr.length === 2 && str === 'auto') {
              let str2 = arr[1]
              if (str2.search('px') !== -1) {
                str2 = str2.replace('px', '')
                imgH = parseFloat(str2)
                scale = imgH / info.trueHeight
              }
              if (str2.search('%') !== -1) {
                str2 = str2.replace('%', '')
                imgH = (parseFloat(str2) / 100) * info.h
                scale = imgH / info.trueHeight
              }
            }
          } catch (error) {
            scale = 1
          }
      }
      return scale
    }

    function goAutoCrop(cw, ch) {
      if (info.imgs === '' || info.imgs === null) return
      clearCrop()
      info.cropping = true
      let maxWidth = info.w
      let maxHeight = info.h
      if (props.centerBox) {
        const switchWH = Math.abs(info.rotate) % 2 > 0
        let imgW =
          (switchWH ? info.trueHeight : info.trueWidth) * position.scale
        let imgH =
          (switchWH ? info.trueWidth : info.trueHeight) * position.scale
        maxWidth = imgW < maxWidth ? imgW : maxWidth
        maxHeight = imgH < maxHeight ? imgH : maxHeight
      }
      // 截图框默认大小
      // 如果为0 那么计算容器大小 默认为80%
      var w = cw ? cw : parseFloat(props.autoCropWidth)
      var h = ch ? ch : parseFloat(props.autoCropHeight)
      if (w === 0 || h === 0) {
        w = maxWidth * 0.8
        h = maxHeight * 0.8
      }
      w = w > maxWidth ? maxWidth : w
      h = h > maxHeight ? maxHeight : h
      if (props.fixed) {
        h = (w / props.fixedNumber[0]) * props.fixedNumber[1]
      }
      // 如果比例之后 高度大于h
      if (h > info.h) {
        h = info.h
        w = (h / props.fixedNumber[1]) * props.fixedNumber[0]
      }
      changeCrop(w, h)
    }
    // 手动改变截图框大小函数
    function changeCrop(w, h) {
      if (props.centerBox) {
        // 修复初始化时候在centerBox=true情况下
        let axis = getImgAxis()
        if (w > axis.x2 - axis.x1) {
          // 宽度超标
          w = axis.x2 - axis.x1
          h = (w / props.fixedNumber[0]) * props.fixedNumber[1]
        }
        if (h > axis.y2 - axis.y1) {
          // 高度超标
          h = axis.y2 - axis.y1
          w = (h / props.fixedNumber[1]) * props.fixedNumber[0]
        }
      }
      // 判断是否大于容器
      position.cropW = w
      position.cropH = h
      checkCropLimitSize()
      nextTick(() => {
        // 居中走一走
        position.cropOffsertX = (info.w - position.cropW) / 2
        position.cropOffsertY = (info.h - position.cropH) / 2
        if (props.centerBox) {
          moveCrop(null, true)
        }
      })
    }

    function moveCrop(e, isMove) {
      let nowX = 0
      let nowY = 0
      if (e) {
        e.preventDefault()
        nowX = 'clientX' in e ? e.clientX : e.touches[0].clientX
        nowY = 'clientY' in e ? e.clientY : e.touches[0].clientY
      }
      nextTick(() => {
        let cx, cy
        let fw = nowX - info.cropX
        let fh = nowY - info.cropY
        if (isMove) {
          fw = position.cropOffsertX
          fh = position.cropOffsertY
        }
        // 不能超过外层容器
        if (fw <= 0) {
          cx = 0
        } else if (fw + position.cropW > info.w) {
          cx = info.w - position.cropW
        } else {
          cx = fw
        }

        if (fh <= 0) {
          cy = 0
        } else if (fh + position.cropH > info.h) {
          cy = info.h - position.cropH
        } else {
          cy = fh
        }

        // 不能超过图片
        if (props.centerBox) {
          let axis = getImgAxis()
          // 横坐标判断
          if (cx <= axis.x1) {
            cx = axis.x1
          }

          if (cx + position.cropW > axis.x2) {
            cx = axis.x2 - position.cropW
          }

          // 纵坐标纵轴
          if (cy <= axis.y1) {
            cy = axis.y1
          }

          if (cy + position.cropH > axis.y2) {
            cy = axis.y2 - position.cropH
          }
        }

        position.cropOffsertX = cx
        position.cropOffsertY = cy

        // 触发截图框移动事件
        emit('cropMoving', {
          moving: true,
          axis: getCropAxis(),
        })
        emit('crop-moving', {
          moving: true,
          axis: getCropAxis(),
        })
      })
    }

    function leaveCrop(e) {
      window.removeEventListener('mousemove', moveCrop)
      window.removeEventListener('mouseup', leaveCrop)
      window.removeEventListener('touchmove', moveCrop)
      window.removeEventListener('touchend', leaveCrop)
      // 触发截图框移动事件
      emit('cropMoving', {
        moving: false,
        axis: getCropAxis(),
      })
      emit('crop-moving', {
        moving: false,
        axis: getCropAxis(),
      })
    }

    function getCropChecked(cb) {
      let canvas = document.createElement('canvas')
      let img = new Image()
      let rotate = info.rotate
      let trueWidth = info.trueWidth
      let trueHeight = info.trueHeight
      let cropOffsertX = position.cropOffsertX
      let cropOffsertY = position.cropOffsertY
      img.onload = () => {
        if (position.cropW !== 0) {
          let ctx = canvas.getContext('2d')
          let dpr = 1
          if (props.high & !props.full) {
            dpr = window.devicePixelRatio
          }
          if ((props.enlarge !== 1) & !props.full) {
            dpr = Math.abs(Number(props.enlarge))
          }
          let width = position.cropW * dpr
          let height = position.cropH * dpr
          let imgW = trueWidth * position.scale * dpr
          let imgH = trueHeight * position.scale * dpr
          // 图片x轴偏移
          let dx =
            (position.x -
              cropOffsertX +
              (info.trueWidth * (1 - position.scale)) / 2) *
            dpr
          // 图片y轴偏移
          let dy =
            (position.y -
              cropOffsertY +
              (info.trueHeight * (1 - position.scale)) / 2) *
            dpr
          //保存状态
          setCanvasSize(width, height)
          ctx.save()
          switch (rotate) {
            case 0:
              if (!props.full) {
                ctx.drawImage(img, dx, dy, imgW, imgH)
              } else {
                // 输出原图比例截图
                setCanvasSize(width / position.scale, height / position.scale)
                ctx.drawImage(
                  img,
                  dx / position.scale,
                  dy / position.scale,
                  imgW / position.scale,
                  imgH / position.scale
                )
              }
              break
            case 1:
            case -3:
              if (!props.full) {
                // 换算图片旋转后的坐标弥补
                dx = dx + (imgW - imgH) / 2
                dy = dy + (imgH - imgW) / 2
                ctx.rotate((rotate * 90 * Math.PI) / 180)
                ctx.drawImage(img, dy, -dx - imgH, imgW, imgH)
              } else {
                setCanvasSize(width / position.scale, height / position.scale)
                // 换算图片旋转后的坐标弥补
                dx =
                  dx / position.scale +
                  (imgW / position.scale - imgH / position.scale) / 2
                dy =
                  dy / position.scale +
                  (imgH / position.scale - imgW / position.scale) / 2
                ctx.rotate((rotate * 90 * Math.PI) / 180)
                ctx.drawImage(
                  img,
                  dy,
                  -dx - imgH / position.scale,
                  imgW / position.scale,
                  imgH / position.scale
                )
              }
              break
            case 2:
            case -2:
              if (!props.full) {
                ctx.rotate((rotate * 90 * Math.PI) / 180)
                ctx.drawImage(img, -dx - imgW, -dy - imgH, imgW, imgH)
              } else {
                setCanvasSize(width / position.scale, height / position.scale)
                ctx.rotate((rotate * 90 * Math.PI) / 180)
                dx = dx / position.scale
                dy = dy / position.scale
                ctx.drawImage(
                  img,
                  -dx - imgW / position.scale,
                  -dy - imgH / position.scale,
                  imgW / position.scale,
                  imgH / position.scale
                )
              }
              break
            case 3:
            case -1:
              if (!props.full) {
                // 换算图片旋转后的坐标弥补
                dx = dx + (imgW - imgH) / 2
                dy = dy + (imgH - imgW) / 2
                ctx.rotate((rotate * 90 * Math.PI) / 180)
                ctx.drawImage(img, -dy - imgW, dx, imgW, imgH)
              } else {
                setCanvasSize(width / position.scale, height / position.scale)
                // 换算图片旋转后的坐标弥补
                dx =
                  dx / position.scale +
                  (imgW / position.scale - imgH / position.scale) / 2
                dy =
                  dy / position.scale +
                  (imgH / position.scale - imgW / position.scale) / 2
                ctx.rotate((rotate * 90 * Math.PI) / 180)
                ctx.drawImage(
                  img,
                  -dy - imgW / position.scale,
                  dx,
                  imgW / position.scale,
                  imgH / position.scale
                )
              }
              break
            default:
              if (!props.full) {
                ctx.drawImage(img, dx, dy, imgW, imgH)
              } else {
                // 输出原图比例截图
                setCanvasSize(width / position.scale, height / position.scale)
                ctx.drawImage(
                  img,
                  dx / position.scale,
                  dy / position.scale,
                  imgW / position.scale,
                  imgH / position.scale
                )
              }
          }
          ctx.restore()
        } else {
          let width = trueWidth * position.scale
          let height = trueHeight * position.scale
          let ctx = canvas.getContext('2d')
          ctx.save()
          switch (rotate) {
            case 0:
              setCanvasSize(width, height)
              ctx.drawImage(img, 0, 0, width, height)
              break
            case 1:
            case -3:
              // 旋转90度 或者-270度 宽度和高度对调
              setCanvasSize(height, width)
              ctx.rotate((rotate * 90 * Math.PI) / 180)
              ctx.drawImage(img, 0, -height, width, height)
              break
            case 2:
            case -2:
              setCanvasSize(width, height)
              ctx.rotate((rotate * 90 * Math.PI) / 180)
              ctx.drawImage(img, -width, -height, width, height)
              break
            case 3:
            case -1:
              setCanvasSize(height, width)
              ctx.rotate((rotate * 90 * Math.PI) / 180)
              ctx.drawImage(img, -width, 0, width, height)
              break
            default:
              setCanvasSize(width, height)
              ctx.drawImage(img, 0, 0, width, height)
          }
          ctx.restore()
        }
        cb(canvas)
      }
      // 判断图片是否是base64
      var s = props.img.substr(0, 4)
      if (s !== 'data') {
        img.crossOrigin = 'Anonymous'
      }
      img.src = info.imgs

      function setCanvasSize(width, height) {
        canvas.width = Math.round(width)
        canvas.height = Math.round(height)
      }
    }

    // 获取转换成base64 的图片信息
    function getCropData(cb) {
      getCropChecked((data) => {
        cb(data.toDataURL('image/' + info.outputType, info.outputSize))
      })
    }

    //canvas获取为blob对象
    function getCropBlob(cb) {
      getCropChecked((data) => {
        data.toBlob(
          (blob) => cb(blob),
          'image/' + info.outputType,
          info.outputSize
        )
      })
    }
    // 获取截图框的坐标轴
    function getCropAxis() {
      let obj = {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0,
      }
      obj.x1 = position.cropOffsertX
      obj.x2 = obj.x1 + position.cropW
      obj.y1 = position.cropOffsertY
      obj.y2 = obj.y1 + position.cropH
      return obj
    }

    function checkCropLimitSize() {
      let { cropW, cropH } = info

      let limitMinNum = new Array()
      if (!Array.isArray[props.limitMinSize]) {
        limitMinNum = [props.limitMinSize, props.limitMinSize]
      } else {
        limitMinNum = props.limitMinSize
      }

      //限制最小宽度和高度
      cropW = parseFloat(limitMinNum[0])
      cropH = parseFloat(limitMinNum[1])
      return [cropW, cropH]
    }
    // 算出不同场景下面 图片相对于外层容器的坐标轴
    function getImgAxis(x, y, scale) {
      x = x || position.x
      y = y || position.y
      scale = scale || position.scale
      // 如果设置了截图框在图片内， 那么限制截图框不能超过图片的坐标
      // 图片的坐标
      let obj = {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0,
      }
      let imgW = info.trueWidth * scale
      let imgH = info.trueHeight * scale
      switch (info.rotate) {
        case 0:
          obj.x1 = x + (info.trueWidth * (1 - scale)) / 2
          obj.x2 = obj.x1 + info.trueWidth * scale
          obj.y1 = y + (info.trueHeight * (1 - scale)) / 2
          obj.y2 = obj.y1 + info.trueHeight * scale
          break
        case 1:
        case -1:
        case 3:
        case -3:
          obj.x1 = x + (info.trueWidth * (1 - scale)) / 2 + (imgW - imgH) / 2
          obj.x2 = obj.x1 + info.trueHeight * scale
          obj.y1 = y + (info.trueHeight * (1 - scale)) / 2 + (imgH - imgW) / 2
          obj.y2 = obj.y1 + info.trueWidth * scale
          break
        default:
          obj.x1 = x + (info.trueWidth * (1 - scale)) / 2
          obj.x2 = obj.x1 + info.trueWidth * scale
          obj.y1 = y + (info.trueHeight * (1 - scale)) / 2
          obj.y2 = obj.y1 + info.trueHeight * scale
          break
      }
      return obj
    }

    const position = reactive({
      cropW: 0,
      cropH: 0,
      cropOffsertX: 0,
      cropOffsertY: 0,
      scale: 1, // 图片缩放比例
      x: 0, // 图片偏移x轴
      y: 0, // 图片偏移y轴
    })
    watch(position, () => {
      showPreview()
    })

    watch(
      () => props.autoCrop,
      () => {
        if (val) {
          goAutoCrop()
        }
      }
    )

    // 修改了自动截图框
    watch(
      () => props.autoCropWidth,
      () => {
        if (props.autoCrop) {
          goAutoCrop()
        }
      }
    )
    watch(
      () => props.autoCropHeight,
      () => {
        if (props.autoCrop) {
          goAutoCrop()
        }
      }
    )

    watch(
      () => props.mode,
      () => {
        checkedImg()
      }
    )

    watch(
      () => props.rotate,
      () => {
        showPreview()
        if (props.autoCrop) {
          goAutoCrop(position.cropW, position.cropH)
        } else {
          if (position.cropW > 0 || position.cropH > 0) {
            goAutoCrop(position.cropW, position.cropH)
          }
        }
      }
    )

    // 创建截图框
    function createCrop(e) {
      e.preventDefault()
      // 移动生成大小
      var nowX =
        'clientX' in e ? e.clientX : e.touches ? e.touches[0].clientX : 0
      var nowY =
        'clientY' in e ? e.clientY : e.touches ? e.touches[0].clientY : 0
      nextTick(() => {
        var fw = nowX - info.cropX
        var fh = nowY - info.cropY
        if (fw > 0) {
          position.cropW =
            fw + info.cropChangeX > info.w ? info.w - info.cropChangeX : fw
          position.cropOffsertX = info.cropChangeX
        } else {
          position.cropW =
            info.w - info.cropChangeX + Math.abs(fw) > info.w
              ? info.cropChangeX
              : Math.abs(fw)
          position.cropOffsertX =
            info.cropChangeX + fw > 0 ? info.cropChangeX + fw : 0
        }

        if (!props.fixed) {
          if (fh > 0) {
            position.cropH =
              fh + info.cropChangeY > info.h ? info.h - info.cropChangeY : fh
            position.cropOffsertY = info.cropChangeY
          } else {
            position.cropH =
              info.h - info.cropChangeY + Math.abs(fh) > info.h
                ? info.cropChangeY
                : Math.abs(fh)
            position.cropOffsertY =
              info.cropChangeY + fh > 0 ? info.cropChangeY + fh : 0
          }
        } else {
          var fixedHeight =
            (position.cropW / props.fixedNumber[0]) * props.fixedNumber[1]
          if (fixedHeight + position.cropOffsertY > info.h) {
            position.cropH = info.h - position.cropOffsertY
            position.cropW =
              (position.cropH / props.fixedNumber[1]) * props.fixedNumber[0]
            if (fw > 0) {
              position.cropOffsertX = info.cropChangeX
            } else {
              position.cropOffsertX = info.cropChangeX - position.cropW
            }
          } else {
            position.cropH = fixedHeight
          }
          position.cropOffsertY = position.cropOffsertY
        }
      })
    }

    // 创建完成
    function endCrop() {
      if (position.cropW === 0 && position.cropH === 0) {
        info.cropping = false
      }
      window.removeEventListener('mousemove', createCrop)
      window.removeEventListener('mouseup', endCrop)
      window.removeEventListener('touchmove', createCrop)
      window.removeEventListener('touchend', endCrop)
    }

    // 开始截图
    function startCrop() {
      info.crop = true
    }
    // 停止截图
    function stopCrop() {
      info.crop = false
    }

    // 重置函数， 恢复组件置初始状态
    function refresh() {
      let img = props.img
      info.imgs = ''
      position.scale = 1
      info.crop = false
      info.rotate = 0
      info.w = 0
      info.h = 0
      info.trueWidth = 0
      info.trueHeight = 0
      clearCrop()
      nextTick(() => {
        checkedImg()
      })
    }

    // 向左边旋转
    function rotateLeft() {
      info.rotate = info.rotate <= -3 ? 0 : info.rotate - 1
    }

    // 向右边旋转
    function rotateRight() {
      info.rotate = info.rotate >= 3 ? 0 : info.rotate + 1
    }

    // 清除旋转
    function rotateClear() {
      info.rotate = 0
    }

    // 当按下鼠标键
    function startMove(e) {
      e.preventDefault()
      // 如果move 为true 表示当前可以拖动
      if (info.move && !info.crop) {
        if (!props.canMove) {
          return false
        }
        // 开始移动
        info.moveX =
          ('clientX' in e ? e.clientX : e.touches[0].clientX) - position.x
        info.moveY =
          ('clientY' in e ? e.clientY : e.touches[0].clientY) - position.y
        if (e.touches) {
          window.addEventListener('touchmove', moveImg)
          window.addEventListener('touchend', leaveImg)
          if (e.touches.length == 2) {
            // 记录手指刚刚放上去
            info.touches = e.touches
            window.addEventListener('touchmove', touchScale)
            window.addEventListener('touchend', cancelTouchScale)
          }
        } else {
          window.addEventListener('mousemove', moveImg)
          window.addEventListener('mouseup', leaveImg)
        }
        // 触发图片移动事件
        emit('imgMoving', {
          moving: true,
          axis: getImgAxis(),
        })
        emit('img-moving', {
          moving: true,
          axis: getImgAxis(),
        })
      } else {
        // 截图ing
        info.cropping = true
        // 绑定截图事件
        window.addEventListener('mousemove', createCrop)
        window.addEventListener('mouseup', endCrop)
        window.addEventListener('touchmove', createCrop)
        window.addEventListener('touchend', endCrop)
        position.cropOffsertX = e.offsetX
          ? e.offsetX
          : e.touches[0].pageX - cropper.value.offsetLeft
        position.cropOffsertY = e.offsetY
          ? e.offsetY
          : e.touches[0].pageY - cropper.value.offsetTop
        info.cropX = 'clientX' in e ? e.clientX : e.touches[0].clientX
        info.cropY = 'clientY' in e ? e.clientY : e.touches[0].clientY
        info.cropChangeX = position.cropOffsertX
        info.cropChangeY = position.cropOffsertY
        position.cropW = 0
        position.cropH = 0
      }
    }

    // 移动端缩放
    function touchScale(e) {
      e.preventDefault()
      let scale = position.scale
      // 记录变化量
      // 第一根手指
      var oldTouch1 = {
        x: info.touches[0].clientX,
        y: info.touches[0].clientY,
      }
      var newTouch1 = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }
      // 第二根手指
      var oldTouch2 = {
        x: info.touches[1].clientX,
        y: info.touches[1].clientY,
      }
      var newTouch2 = {
        x: e.touches[1].clientX,
        y: e.touches[1].clientY,
      }
      var oldL = Math.sqrt(
        Math.pow(oldTouch1.x - oldTouch2.x, 2) +
          Math.pow(oldTouch1.y - oldTouch2.y, 2)
      )
      var newL = Math.sqrt(
        Math.pow(newTouch1.x - newTouch2.x, 2) +
          Math.pow(newTouch1.y - newTouch2.y, 2)
      )
      var cha = newL - oldL
      // 根据图片本身大小 决定每次改变大小的系数, 图片越大系数越小
      // 1px - 0.2
      var coe = 1
      coe =
        coe / info.trueWidth > coe / info.trueHeight
          ? coe / info.trueHeight
          : coe / info.trueWidth
      coe = coe > 0.1 ? 0.1 : coe
      var num = coe * cha
      if (!info.touchNow) {
        info.touchNow = true
        if (cha > 0) {
          scale += Math.abs(num)
        } else if (cha < 0) {
          scale > Math.abs(num) ? (scale -= Math.abs(num)) : scale
        }
        info.touches = e.touches
        setTimeout(() => {
          info.touchNow = false
        }, 8)
        if (!checkoutImgAxis(position.x, position.y, scale)) {
          return false
        }
        position.scale = scale
      }
    }
    // 图片坐标点校验
    function checkoutImgAxis(x, y, scale) {
      x = x || position.x
      y = y || position.y
      scale = scale || position.scale
      let canGo = true
      // 开始校验 如果说缩放之后的坐标在截图框外 则阻止缩放
      if (props.centerBox) {
        let axis = getImgAxis(x, y, scale)
        let cropAxis = getCropAxis()
        // 左边的横坐标 图片不能超过截图框
        if (axis.x1 >= cropAxis.x1) {
          canGo = false
        }

        // 右边横坐标
        if (axis.x2 <= cropAxis.x2) {
          canGo = false
        }

        // 纵坐标上面
        if (axis.y1 >= cropAxis.y1) {
          canGo = false
        }

        // 纵坐标下面
        if (axis.y2 <= cropAxis.y2) {
          canGo = false
        }
      }
      return canGo
    }

    function cancelTouchScale(e) {
      window.removeEventListener('touchmove', touchScale)
    }

    // 移动图片
    function moveImg(e) {
      e.preventDefault()
      if (e.touches && e.touches.length === 2) {
        info.touches = e.touches
        window.addEventListener('touchmove', touchScale)
        window.addEventListener('touchend', cancelTouchScale)
        window.removeEventListener('touchmove', moveImg)
        return false
      }
      let nowX = 'clientX' in e ? e.clientX : e.touches[0].clientX
      let nowY = 'clientY' in e ? e.clientY : e.touches[0].clientY

      let changeX, changeY
      changeX = nowX - info.moveX
      changeY = nowY - info.moveY

      nextTick(() => {
        if (props.centerBox) {
          let axis = getImgAxis(changeX, changeY, position.scale)
          let cropAxis = getCropAxis()
          let imgW = info.trueHeight * position.scale
          let imgH = info.trueWidth * position.scale
          let maxLeft, maxTop, maxRight, maxBottom
          switch (info.rotate) {
            case 1:
            case -1:
            case 3:
            case -3:
              maxLeft =
                position.cropOffsertX -
                (info.trueWidth * (1 - position.scale)) / 2 +
                (imgW - imgH) / 2
              maxTop =
                position.cropOffsertY -
                (info.trueHeight * (1 - position.scale)) / 2 +
                (imgH - imgW) / 2
              maxRight = maxLeft - imgW + position.cropW
              maxBottom = maxTop - imgH + position.cropH
              break
            default:
              maxLeft =
                position.cropOffsertX -
                (info.trueWidth * (1 - position.scale)) / 2
              maxTop =
                position.cropOffsertY -
                (info.trueHeight * (1 - position.scale)) / 2
              maxRight = maxLeft - imgH + position.cropW
              maxBottom = maxTop - imgW + position.cropH
              break
          }

          // 图片左边 图片不能超过截图框
          if (axis.x1 >= cropAxis.x1) {
            changeX = maxLeft
          }

          // 图片上边 图片不能超过截图框
          if (axis.y1 >= cropAxis.y1) {
            changeY = maxTop
          }

          // 图片右边
          if (axis.x2 <= cropAxis.x2) {
            changeX = maxRight
          }

          // 图片下边
          if (axis.y2 <= cropAxis.y2) {
            changeY = maxBottom
          }
        }
        position.x = changeX
        position.y = changeY
        // 触发图片移动事件
        emit('imgMoving', {
          moving: true,
          axis: getImgAxis(),
        })
        emit('img-moving', {
          moving: true,
          axis: getImgAxis(),
        })
      })
    }
    // 移动图片结束
    function leaveImg(e) {
      window.removeEventListener('mousemove', moveImg)
      window.removeEventListener('touchmove', moveImg)
      window.removeEventListener('mouseup', leaveImg)
      window.removeEventListener('touchend', leaveImg)
      // 触发图片移动事件
      emit('imgMoving', {
        moving: false,
        axis: getImgAxis(),
      })
      emit('img-moving', {
        moving: false,
        axis: getImgAxis(),
      })
    }
    // 缩放图片
    function scaleImg() {
      if (props.canScale) {
        window.addEventListener(info.support, changeSize, passive.value)
      }
    }

    // 移出框
    function cancelScale() {
      if (props.canScale) {
        window.removeEventListener(info.support, changeSize)
      }
    }
    // 改变大小函数
    function changeSize(e) {
      e.preventDefault()
      let scale = position.scale
      var change = e.deltaY || e.wheelDelta
      // 根据图片本身大小 决定每次改变大小的系数, 图片越大系数越小
      var isFirefox = navigator.userAgent.indexOf('Firefox')
      change = isFirefox > 0 ? change * 30 : change
      // 修复ie的滚动缩放
      if (isIE.value) {
        change = -change
      }
      // 1px - 0.2
      var coe = info.coe
      coe =
        coe / info.trueWidth > coe / info.trueHeight
          ? coe / info.trueHeight
          : coe / info.trueWidth
      var num = coe * change
      num < 0
        ? (scale += Math.abs(num))
        : scale > Math.abs(num)
        ? (scale -= Math.abs(num))
        : scale
      // 延迟0.1s 每次放大大或者缩小的范围
      let status = num < 0 ? 'add' : 'reduce'
      if (status !== info.coeStatus) {
        info.coeStatus = status
        info.coe = 0.2
      }
      if (!info.scaling) {
        info.scalingSet = setTimeout(() => {
          info.scaling = false
          info.coe = info.coe += 0.01
        }, 50)
      }
      info.scaling = true
      if (!checkoutImgAxis(position.x, position.y, scale)) {
        return false
      }
      position.scale = scale
    }

    // 修改图片大小函数
    function changeScale(num) {
      let scale = position.scale
      num = num || 1
      var coe = 20
      coe =
        coe / info.trueWidth > coe / info.trueHeight
          ? coe / info.trueHeight
          : coe / info.trueWidth
      num = num * coe
      num > 0
        ? (scale += Math.abs(num))
        : scale > Math.abs(num)
        ? (scale -= Math.abs(num))
        : scale
      if (!checkoutImgAxis(position.x, position.y, scale)) {
        return false
      }
      position.scale = scale
    }

    // 改变截图框大小
    function changeCropSize(e, w, h, typeW, typeH) {
      e.preventDefault()
      window.addEventListener('mousemove', changeCropNow)
      window.addEventListener('mouseup', changeCropEnd)
      window.addEventListener('touchmove', changeCropNow)
      window.addEventListener('touchend', changeCropEnd)
      info.canChangeX = w
      info.canChangeY = h
      info.changeCropTypeX = typeW
      info.changeCropTypeY = typeH
      info.cropX = 'clientX' in e ? e.clientX : e.touches[0].clientX
      info.cropY = 'clientY' in e ? e.clientY : e.touches[0].clientY
      info.cropOldW = position.cropW
      info.cropOldH = position.cropH
      info.cropChangeX = position.cropOffsertX
      info.cropChangeY = position.cropOffsertY
      if (props.fixed) {
        if (info.canChangeX && info.canChangeY) {
          info.canChangeY = 0
        }
      }
      emit('change-crop-size', {
        width: position.cropW,
        height: position.cropH,
      })
    }

    // 正在改变
    function changeCropNow(e) {
      e.preventDefault()
      var nowX =
        'clientX' in e ? e.clientX : e.touches ? e.touches[0].clientX : 0
      var nowY =
        'clientY' in e ? e.clientY : e.touches ? e.touches[0].clientY : 0
      // 容器的宽高
      let wrapperW = info.w
      let wrapperH = info.h

      // 不能超过的坐标轴
      let minX = 0
      let minY = 0

      if (props.centerBox) {
        let axis = getImgAxis()
        let imgW = axis.x2
        let imgH = axis.y2
        minX = axis.x1 > 0 ? axis.x1 : 0
        minY = axis.y1 > 0 ? axis.y1 : 0
        if (wrapperW > imgW) {
          wrapperW = imgW
        }
        if (wrapperH > imgH) {
          wrapperH = imgH
        }
      }
      nextTick(() => {
        var fw = nowX - info.cropX
        var fh = nowY - info.cropY
        if (info.canChangeX) {
          if (info.changeCropTypeX === 1) {
            if (info.cropOldW - fw > 0) {
              position.cropW =
                wrapperW - info.cropChangeX - fw <= wrapperW - minX
                  ? info.cropOldW - fw
                  : info.cropOldW + info.cropChangeX - minX
              position.cropOffsertX =
                wrapperW - info.cropChangeX - fw <= wrapperW - minX
                  ? info.cropChangeX + fw
                  : minX
            } else {
              position.cropW =
                Math.abs(fw) + info.cropChangeX <= wrapperW
                  ? Math.abs(fw) - info.cropOldW
                  : wrapperW - info.cropOldW - info.cropChangeX
              position.cropOffsertX = info.cropChangeX + info.cropOldW
            }
          } else if (info.changeCropTypeX === 2) {
            if (info.cropOldW + fw > 0) {
              position.cropW =
                info.cropOldW + fw + position.cropOffsertX <= wrapperW
                  ? info.cropOldW + fw
                  : wrapperW - position.cropOffsertX
              position.cropOffsertX = info.cropChangeX
            } else {
              // 右侧坐标抽 超过左侧
              position.cropW =
                wrapperW - info.cropChangeX + Math.abs(fw + info.cropOldW) <=
                wrapperW - minX
                  ? Math.abs(fw + info.cropOldW)
                  : info.cropChangeX - minX
              position.cropOffsertX =
                wrapperW - info.cropChangeX + Math.abs(fw + info.cropOldW) <=
                wrapperW - minX
                  ? info.cropChangeX - Math.abs(fw + info.cropOldW)
                  : minX
            }
          }
        }

        if (info.canChangeY) {
          if (info.changeCropTypeY === 1) {
            if (info.cropOldH - fh > 0) {
              position.cropH =
                wrapperH - info.cropChangeY - fh <= wrapperH - minY
                  ? info.cropOldH - fh
                  : info.cropOldH + info.cropChangeY - minY
              position.cropOffsertY =
                wrapperH - info.cropChangeY - fh <= wrapperH - minY
                  ? info.cropChangeY + fh
                  : minY
            } else {
              position.cropH =
                Math.abs(fh) + info.cropChangeY <= wrapperH
                  ? Math.abs(fh) - info.cropOldH
                  : wrapperH - info.cropOldH - info.cropChangeY
              position.cropOffsertY = info.cropChangeY + info.cropOldH
            }
          } else if (info.changeCropTypeY === 2) {
            if (info.cropOldH + fh > 0) {
              position.cropH =
                info.cropOldH + fh + position.cropOffsertY <= wrapperH
                  ? info.cropOldH + fh
                  : wrapperH - position.cropOffsertY
              position.cropOffsertY = info.cropChangeY
            } else {
              position.cropH =
                wrapperH - info.cropChangeY + Math.abs(fh + info.cropOldH) <=
                wrapperH - minY
                  ? Math.abs(fh + info.cropOldH)
                  : info.cropChangeY - minY
              position.cropOffsertY =
                wrapperH - info.cropChangeY + Math.abs(fh + info.cropOldH) <=
                wrapperH - minY
                  ? info.cropChangeY - Math.abs(fh + info.cropOldH)
                  : minY
            }
          }
        }

        if (info.canChangeX && props.fixed) {
          var fixedHeight =
            (position.cropW / props.fixedNumber[0]) * props.fixedNumber[1]
          if (fixedHeight + position.cropOffsertY > wrapperH) {
            position.cropH = wrapperH - position.cropOffsertY
            position.cropW =
              (position.cropH / props.fixedNumber[1]) * props.fixedNumber[0]
          } else {
            position.cropH = fixedHeight
          }
        }

        if (info.canChangeY && props.fixed) {
          var fixedWidth =
            (position.cropH / props.fixedNumber[1]) * props.fixedNumber[0]
          if (fixedWidth + position.cropOffsertX > wrapperW) {
            position.cropW = wrapperW - position.cropOffsertX
            position.cropH =
              (position.cropW / props.fixedNumber[0]) * props.fixedNumber[1]
          } else {
            position.cropW = fixedWidth
          }
        }
      })
    }
    // 结束改变
    function changeCropEnd(e) {
      window.removeEventListener('mousemove', changeCropNow)
      window.removeEventListener('mouseup', changeCropEnd)
      window.removeEventListener('touchmove', changeCropNow)
      window.removeEventListener('touchend', changeCropEnd)
    }

    onMounted(() => {
      info.support =
        'onwheel' in document.createElement('div')
          ? 'wheel'
          : document.onmousewheel !== undefined
          ? 'mousewheel'
          : 'DOMMouseScroll'
      var u = navigator.userAgent
      info.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      // 兼容blob
      if (!HTMLCanvasElement.prototype.toBlob) {
        Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
          value: function (callback, type, quality) {
            var binStr = atob(this.toDataURL(type, quality).split(',')[1]),
              len = binStr.length,
              arr = new Uint8Array(len)
            for (var i = 0; i < len; i++) {
              arr[i] = binStr.charCodeAt(i)
            }
            callback(new Blob([arr], { type: info.type || 'image/png' }))
          },
        })
      }
      showPreview()
      checkedImg()
    })
    onUnmounted(() => {
      window.removeEventListener('mousemove', moveCrop)
      window.removeEventListener('mouseup', leaveCrop)
      window.removeEventListener('touchmove', moveCrop)
      window.removeEventListener('touchend', leaveCrop)
      cancelScale()
    })

    return {
      cropper,
      cropInfo,
      ...toRefs(info),
      ...toRefs(position),
      scaleImg,
      cancelScale,
      startMove,
      cropMove,
      changeCropSize,
      refresh,
      startCrop,
      stopCrop,
      rotateLeft,
      rotateRight,
      rotateClear,
      changeScale,
      getCropData,
      clearCrop,
      getCropBlob,
    }
  },
})
</script>
