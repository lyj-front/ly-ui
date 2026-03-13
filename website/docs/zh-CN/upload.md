## Upload 上传

通过点击或者拖拽上传文件

### 照片墙

使用 `list-type` 属性来设置文件列表的样式。

:::demo

```html
<ly-upload
  list-type="picture-card"
  :on-remove="handleRemove"
  :file-list="fileList"
  :limit="2"
  :limitHiden="true"
  :before-upload="beforeAvatarUpload"
>
  <div class="avatar-uploader-out">
    <i class="el-icon-plus avatar-uploader-icon"></i>
    <span class="avatar-uploader-text">上传</span>
  </div>
  <template #tip>
    <div class="el-upload__tip">支持jpg格式文件，且单个文件不超过0.5M</div>
  </template>
</ly-upload>
<script>
  export default {
    data() {
      return {
        fileList: [
          
        ],
        dialogImageUrl: '',
        dialogVisible: false,
      }
    },
    mounted(){
      this.fileList.push({
            name: '附件名称附件名称附件名称附件名称附件名称附件名称附件名称附件名称',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          },
          {
            name: 'food2.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
            status:"fail"
          })
    },
    watch:{
      fileList:{
        handler(val1){
          console.log('val: ', va22l1);
        }
      }
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
    },
  }
</script>
<!--<setup>
import { defineComponent, onMounted, watch, ref } from 'vue';
export default defineComponent({
    setup() {
        const fileList = ref([]);
        const dialogImageUrl = ref('');
        const dialogVisible = ref(false);
        onMounted(() => {
            fileList.value.push(
                {
                    name: '附件名称附件名称附件名称附件名称附件名称附件名称附件名称附件名称',
                    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
                },
                {
                    name: 'food2.jpeg',
                    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
                    status: 'fail',
                }
            );
        });
        watch(
            () => fileList.value,
            (val1) => {
                console.log('val: ', va22l1);
            }
        );
        return {
            fileList,
            beforeUpload,
        };
    },
});
</setup>-->

```

:::

### 表格文件列表

通过 `list-type` 和`tableHeader`设置为对列表进行控制，此处的`tableHeader`字段参数配置见[tablepage-表头参数](/lyj-front/ly-ui/#/zh-CN/component/table-page#tableconfig-header)，`prop`参数一般为上传完成后file的字段，如name|size|status等

:::demo

```html
<ly-upload
  class="upload-table-demo"
  ref = "tableupload"
  drag
  :file-list="fileList"
  list-type="table"
  :tableHeader="tableHeader"
  :on-change="onchange"
  multiple
>
  <i class="el-icon-upload3"></i>
  <div class="el-upload__text">点击或拖动文件上传</div>
  <div class="el-upload__tips">
    <p>支持<b>pdf、doc、docx、jpg、png等各类文档</b></p>
    <p>格式多文件上传；单文件大小不超过<b>10MB</b></p>
  </div>
  <template #size="scope">
      <span>{{(scope.row.size/1024).toFixed(1)}}KB</span>
    </template>
  <template #status="scope">
    <span style="display: flex;align-items: center;">
      <i :class="fileStatus[scope.row.status].icon"></i>
      <span style="margin-left:2px">{{fileStatus[scope.row.status].text}}</span>
    </span>
  </template>
  <template #operate="scope">
    <span style="color:#3188e8;cursor: pointer;" @click="fileStatus[scope.row.status].func(scope.row,scope.index)">{{fileStatus[scope.row.status].handler}}</span>
  </template>
</ly-upload>
<script>
  export default {
    data() {
      return {
        fileList: [
          {
            name: '附件名称附件名称附件名称附件名称附件名称附件名称附件名称附件名称',
            size:"100456",
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          },
          {
            name: 'food2.jpeg',
            size:"1065",
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
            status:"fail"
          },
          {
            name: '我在模拟正在上传',
            size:"1065",
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
            status:"uploading",
            percentage:"88"
          },
        ],
        tableHeader:[
          {
            label: '简历名称',
            minWidth: '200',
            prop: 'name',
          },
          {
            label: '附件大小',
            minWidth: '',
            prop: 'size',
            custom: true,
          },
          {
            label: '上传状态',
            minWidth: '',
            prop: 'status',
            custom: true,
          },
          {
            label: '操作',
            prop:"operate",
            minWidth: '',
            custom: true,
          }
        ],
        fileStatus:{
          success:{
            icon:"el-icon-success1",
            text:"上传成功",
            handler:"查看",
            func:(file)=>{
              if(file.url){
                window.open(file.url)
              }
            }
          },
          fail:{
            icon:"el-icon-fail1",
            text:"上传失败",
            handler:"重新上传",
            func:(file,index)=>{
              this.fileList.splice(index,1)
              this.$refs.tableupload.uploadRef.handleClick()
            }
          },
          uploading:{
            icon:"el-icon-uploading",
            text:"正在上传...",
            handler:"取消上传",
            func:(file,index)=>{
              this.$refs.tableupload.abort(file)
              this.fileList.splice(index,1)
            }
          },
          ready:{
            icon:"el-icon-uploading",
            text:"正在上传...",
            handler:"取消上传",
            func:(file,index)=>{
              this.$refs.tableupload.abort(file)
              this.fileList.splice(index,1)
            }
          }
        }
      }
    },
    methods: {
      onchange(file,fileList){
        this.fileList = fileList
      }
    }
  }
</script>
<!--<setup>
import { defineComponent, reactive, ref } from 'vue';

export default defineComponent({
    setup() {
        const fileList = ref([
            {
                name: '附件名称附件名称附件名称附件名称附件名称附件名称附件名称附件名称',
                size: '100456',
                url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
            },
            {
                name: 'food2.jpeg',
                size: '1065',
                url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
                status: 'fail',
            },
            {
                name: '我在模拟正在上传',
                size: '1065',
                url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
                status: 'uploading',
                percentage: '88',
            },
        ]);
        const tableHeader = ref([
            {
                label: '简历名称',
                minWidth: '200',
                prop: 'name',
            },
            {
                label: '附件大小',
                minWidth: '',
                prop: 'size',
                custom: true,
            },
            {
                label: '上传状态',
                minWidth: '',
                prop: 'status',
                custom: true,
            },
            {
                label: '操作',
                prop: 'operate',
                minWidth: '',
                custom: true,
            },
        ]);
        const fileStatus = reactive({
            success: {
                icon: 'el-icon-success1',
                text: '上传成功',
                handler: '查看',
                func: (file) => {
                    if (file.url) {
                        window.open(file.url);
                    }
                },
            },
            fail: {
                icon: 'el-icon-fail1',
                text: '上传失败',
                handler: '重新上传',
                func: (file, index) => {
                    this.fileList.splice(index, 1);
                    this.$refs.tableupload.uploadRef.handleClick();
                },
            },
            uploading: {
                icon: 'el-icon-uploading',
                text: '正在上传...',
                handler: '取消上传',
                func: (file, index) => {
                    this.$refs.tableupload.abort(file);
                    this.fileList.splice(index, 1);
                },
            },
            ready: {
                icon: 'el-icon-uploading',
                text: '正在上传...',
                handler: '取消上传',
                func: (file, index) => {
                    this.$refs.tableupload.abort(file);
                    this.fileList.splice(index, 1);
                },
            },
        });
        function onchange(file, fileList) {
            this.fileList = fileList;
        }
        return {
            onchange,
        };
    },
});
</setup>-->
```

:::
### 点击上传

:::demo 通过 slot 你可以传入自定义的上传按钮类型和文字提示。可通过设置`limit`和`on-exceed`来限制上传文件的个数和定义超出限制时的行为。可通过设置`before-remove`来阻止文件移除操作。

```html
<ly-upload
  class="upload-demo"
  action="/upload"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :before-remove="beforeRemove"
  :on-success="handleSuccess"
  :limit="3"
  :on-exceed="handleExceed"
  :file-list="fileList"
>
  <ly-button size="mini" style='width:68px;height:30px'>上传附件</ly-button>
  <template #tip>
    <div class="el-upload__tip">支持jpg/png格式文件，且单个文件不超过0.5M</div>
  </template>
</ly-upload>
<script>
  export default {
    data() {
      return {
        fileList: [
          {
            name: '附件名称附件名称附件名称附件名称附件名称附件名称附件名称附件名称',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          },
          {
            name: 'food2.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          },
        ],
      }
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePreview(file) {
        console.log(file)
      },
      handleExceed(files, fileList) {
        this.$message.warning(
          `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
            files.length + fileList.length
          } 个文件`
        )
      },
      handleSuccess(response, file, fileArr){
        console.log(response, file, fileArr)
        console.log('fileList',this.fileList);
      },
      beforeRemove(file, fileList) {
        // return this.$confirm(`确定移除 ${file.name}？`)
      },
    },
    mounted(){
    }
  }
</script>
<!--<setup>
import { defineComponent, reactive, ref } from 'vue';

export default defineComponent({
    setup() {
        const imageUrl = ref('');
        function handleAvatarSuccess(res, file) {
            imageUrl.value = URL.createObjectURL(file.raw);
        }
        function beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
                return isJPG;
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
                return isLt2M;
            }
            return true;
        }
        return {
            imageUrl,
            handleAvatarSuccess,
            beforeAvatarUpload,
        };
    },
});
</setup>-->
```

:::

### 用户头像上传

使用 `before-upload` 限制用户上传的图片格式和大小。

:::demo

```html
<ly-upload
  class="el-upload--avatar-uploader"
  action="https://jsonplaceholder.typicode.com/posts/"
  :show-file-list="false"
  :on-success="handleAvatarSuccess"
  :before-upload="beforeAvatarUpload"
>
  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
  <div class="avatar-uploader-out" v-else>
    <i class="el-icon-plus avatar-uploader-icon"></i>
    <span class="avatar-uploader-text">上传</span>
  </div>
  <template #tip>
    <div class="el-upload__tip">支持jpg/png格式文件，且单个文件不超过0.5M</div>
  </template>
</ly-upload>

<script>
  export default {
    data() {
      return {
        imageUrl: '',
      }
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
          return isJPG
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
          return isLt2M
        }
        return true
      },
    },
  }
</script>
<!--<setup>
import { defineComponent, ref } from 'vue';
import { LyMessage } from 'ly-ui';

export default defineComponent({
    setup() {
        const imageUrl = ref('');
        function handleAvatarSuccess(res, file) {
            imageUrl.value = URL.createObjectURL(file.raw);
        }
        function beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                LyMessage.error('上传头像图片只能是 JPG 格式!');
                return isJPG;
            }
            if (!isLt2M) {
                LyMessage.error('上传头像图片大小不能超过 2MB!');
                return isLt2M;
            }
            return true;
        }
        return {
            imageUrl,
            handleAvatarSuccess,
            beforeAvatarUpload,
        };
    },
});
</setup>-->
```


:::

### 文件缩略图

使用 `scoped-slot` 去设置缩略图模版。

:::demo

```html
<ly-upload action="#" list-type="picture-card" :auto-upload="false">
  <template #default>
    <div class="avatar-uploader-out">
      <i class="el-icon-plus avatar-uploader-icon"></i>
      <span class="avatar-uploader-text">上传</span>
    </div>
  </template>
  <template #file="{file}">
    <div>
      <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
      <span class="el-upload-list__item-actions">
        <span
          class="el-upload-list__item-preview"
          @click="handlePictureCardPreview(file)"
        >
          <i class="el-icon-zoom-in"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="handleDownload(file)"
        >
          <i class="el-icon-download"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="handleRemove(file)"
        >
          <i class="el-icon-delete"></i>
        </span>
      </span>
    </div>
  </template>
</ly-upload>
<ly-dialog v-model="dialogVisible">
  <img width="100%" :src="dialogImageUrl" alt="" />
</ly-dialog>
<script>
  export default {
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
      }
    },
    methods: {
      handleRemove(file) {
        console.log(file)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handleDownload(file) {
        console.log(file)
      },
    },
  }
</script>
<!--<setup>
import { defineComponent, ref } from 'vue';
import { LyMessage } from 'ly-ui';

export default defineComponent({
    setup() {
        const dialogImageUrl = ref('');
        const disabled = ref(false);
        const dialogVisible = ref(false);
        function handleRemove(file) {
            console.log(file);
        }
        function handlePictureCardPreview(file) {
            dialogImageUrl.value = file.url;
            dialogVisible.value = true;
        }
        function handleDownload(file) {
            console.log(file);
        }
        return {
            dialogImageUrl,
            disabled,
            dialogVisible,
            handleRemove,
            handlePictureCardPreview,
            handleDownload,
        };
    },
});
</setup>-->
```

:::

### 图片列表缩略图

:::demo

```html
<ly-upload
  class="upload-demo"
  action="https://jsonplaceholder.typicode.com/posts/"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :file-list="fileList"
  list-type="picture"
>
  <ly-button size="small" type="primary">点击上传</ly-button>
  <template #tip>
    <div class="el-upload__tip">只能上传 jpg/png 文件，且不超过 500kb</div>
  </template>
</ly-upload>
<script>
  export default {
    data() {
      return {
        fileList: [
          {
            name: 'food.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          },
          {
            name: 'food2.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          },
        ],
      }
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePreview(file) {
        console.log(file)
      },
    },
  }
</script>
<!--<setup>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const fileList = ref([
            {
                name: 'food.jpeg',
                url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
            },
            {
                name: 'food2.jpeg',
                url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
            },
        ]);
        function handleRemove(file, fileList) {
            console.log(file, fileList);
        }
        function handlePreview(file) {
            console.log(file);
        }
        return {
            fileList,
            handleRemove,
            handlePreview,
        };
    },
});
</setup>-->
```

:::

### 上传文件列表控制

通过 `on-change` 钩子函数来对列表进行控制

:::demo

```html
<ly-upload
  class="upload-demo"
  action="https://jsonplaceholder.typicode.com/posts/"
  :on-change="handleChange"
  :file-list="fileList"
>
  <ly-button size="small" type="primary">点击上传</ly-button>
  <template #tip>
    <div class="el-upload__tip">只能上传 jpg/png 文件，且不超过 500kb</div>
  </template>
</ly-upload>
<script>
  export default {
    data() {
      return {
        fileList: [
          {
            name: 'food.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          },
          {
            name: 'food2.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          },
        ],
      }
    },
    methods: {
      handleChange(file, fileList) {
        this.fileList = fileList.slice(-3)
      },
    },
  }
</script>
<!--<setup>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const fileList = ref([
            {
                name: 'food.jpeg',
                url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
            },
            {
                name: 'food2.jpeg',
                url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
            },
        ]);
        function handleChange(file, fileList) {
            fileList.value = fileList.value.slice(-3);
        }
        return {
            fileList,
            handleChange,
        };
    },
});
</setup>-->
```

:::
### 拖拽上传

:::demo

```html
<ly-upload
  class="upload-demo"
  drag
  action="https://jsonplaceholder.typicode.com/posts/"
  multiple
>
  <i class="el-icon-upload3"></i>
  <div class="el-upload__text">点击或拖动文件上传</div>
  <div class="el-upload__tips">
    <p>支持<b>pdf、doc、docx、jpg、png等各类文档</b></p>
    <p>格式多文件上传；单文件大小不超过<b>10MB</b></p>
  </div>
</ly-upload>
```

:::

### 手动上传

:::demo

```html
<ly-upload
  class="upload-demo"
  ref="upload"
  action="https://jsonplaceholder.typicode.com/posts/"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :file-list="fileList"
  :auto-upload="false"
>
  <template #trigger>
    <ly-button size="small" type="primary">选取文件</ly-button>
  </template>
  <ly-button
    style="margin-left: 10px;"
    size="small"
    type="success"
    @click="submitUpload"
    >上传到服务器</ly-button
  >
  <template #tip>
    <div class="el-upload__tip">只能上传 jpg/png 文件，且不超过 500kb</div>
  </template>
</ly-upload>
<script>
  export default {
    data() {
      return {
        fileList: [
          {
            name: 'food.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          },
          {
            name: 'food2.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          },
        ],
      }
    },
    methods: {
      submitUpload() {
        this.$refs.upload.submit()
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePreview(file) {
        console.log(file)
      },
    },
  }
</script>
<!--<setup>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const fileList = ref([
            {
                name: 'food.jpeg',
                url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
            },
            {
                name: 'food2.jpeg',
                url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
            },
        ]);
        function submitUpload() {
            this.$refs.upload.submit();
        }
        function handleRemove(file, fileList) {
            console.log(file, fileList);
        }
        function handlePreview(file) {
            console.log(file);
        }
        return {
            fileList,
            submitUpload,
            handleRemove,
            handlePreview,
        };
    },
});
</setup>-->
```

:::

### Attribute

| 参数             | 说明                                                                                                                                 | 类型                               | 可选值                    | 默认值 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- | ------------------------- | ------ |
| action           | 必选参数，上传的地址，若该接口需要登录验证且登录token失效的情况下上传会进行提示，并自动跳转到登录页 | string        | —         | —      |
| headers          | 设置上传的请求头部                                                                                                                   | object                             | —                         | —      |
| method           | 设置上传的请求方法                                                                                                                   | string                             | post/put                  | post   |
| multiple         | 是否支持多选文件                                                                                                                     | boolean                            | —                         | —      |
| data             | 上传时附带的额外参数                                                                                                                 | object                             | —                         | —      |
| name             | 上传的文件字段名                                                                                                                     | string                             | —                         | file   |
| with-credentials | 支持发送 cookie 凭证信息                                                                                                             | boolean                            | —                         | false  |
| show-file-list   | 是否显示已上传文件列表                                                                                                               | boolean                            | —                         | true   |
| drag             | 是否启用拖拽上传                                                                                                                     | boolean                            | —                         | false  |
| accept           | 接受上传的[文件类型](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept)（thumbnail-mode 模式下此参数无效） | string                             | —                         | —      |
| on-preview       | 点击文件列表中已上传的文件时的钩子                                                                                                   | function(file)                     | —                         | —      |
| on-remove        | 文件列表移除文件时的钩子                                                                                                             | function(file, fileList)           | —                         | —      |
| on-success       | 文件上传成功时的钩子                                                                                                                 | function(response, file, fileList) | —                         | —      |
| on-error         | 文件上传失败时的钩子                                                                                                                 | function(err, file, fileList)      | —                         | —      |
| on-progress      | 文件上传时的钩子                                                                                                                     | function(event, file, fileList)    | —                         | —      |
| on-change        | 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用                                                                       | function(file, fileList)           | —                         | —      |
| before-upload    | 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。                                        | function(file)                     | —                         | —      |
| before-remove    | 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。                              | function(file, fileList)           | —                         | —      |
| list-type        | 文件列表的类型                                                                                                                       | string                             | text/picture/picture-card | text   |
| auto-upload      | 是否在选取文件后立即进行上传                                                                                                         | boolean                            | —                         | true   |
| file-list        | 上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]                                                       | array                              | —                         | []     |
| http-request     | 覆盖默认的上传行为，可以自定义上传的实现                                                                                             | function                           | —                         | —      |
| disabled         | 是否禁用                                                                                                                             | boolean                            | —                         | false  |
| limit            | 最大允许上传个数                                                                                                                     | number                             | —                         | —      |
| on-exceed        | 文件超出个数限制时的钩子                                                                                                             | function(files, fileList)          | —                         | -      |
| limitHiden        | 文件超出个数限制时的影藏上传图标                                                                                                             | Boolean          | —                         | false      |
| canCut        | 是否支持裁剪图片，只有单选图片时才支持此属性  | Boolean          | —                         | false      |
| cutWidth      | 裁剪图片框的宽度  | Number          | —                         | 100      |
| cutHeight     | 裁剪图片框的高度 | Number          | —                         | 100      |
| cutFixed      | 是否固定裁剪图片框的大小  | Boolean          | —                         | false      |
| uploadKey<sup>1.5.12</sup>      | 废弃：原腾讯云相关配置，当前版本已不再生效  | String          | —                         | —      |
| serviceName<sup>1.5.13</sup>      | 废弃：原腾讯云相关配置，当前版本已不再生效  | String          | —                         | —      |
### Slot

| name    | 说明                 |
| ------- | -------------------- |
| trigger | 触发文件选择框的内容 |
| tip     | 提示说明文字         |

### Methods

| 方法名     | 说明                                                        | 参数                                |
| ---------- | ----------------------------------------------------------- | ----------------------------------- |
| clearFiles | 清空已上传的文件列表（该方法不支持在 before-upload 中调用） | —                                   |
| abort      | 取消上传请求                                                | （ file: fileList 中的 file 对象 ） |
| submit     | 手动上传文件列表                                            | —                                   |
