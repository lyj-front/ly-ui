# pdf和图片一起预览的组件

### 使用方法

#### 引入组件

> vue 需要安装依赖

```bash
yarn add lyjPdfImg
```

``` javascript
import lyjPdfImg from 'lyjPdfImg'
```

> jq 需要在项目引入下面的cdn文件

```html
<script type="text/javascript" src="https://front.leyoujia.com/front_cdn/common/js/lyj-pdfImg.umd.js"></script>
```

#### 使用组件

``` script
const pdfImg = new lyjPdfImg()
function viewPdf() {
    let list = ['xxx.png', 'xxx.pdf', 'xxx.jpg']

    const options = {
        download: (url, idx) => {
            // 自定义下载逻辑
        },
        save: (idx) => {
            // 自定义保存图片的逻辑
        },
        del: (idx) => {
           // 自定义删除图片的逻辑
        },
        transfer: (idx) => {
        	// 自定义转移的逻辑
        },
        show: () => {
        	// 组件显示图片之前
        	// 显示转移按钮
            $('.viewer-transfer').show();
            // 显示删除按钮
            $('.viewer-del').show();
            // 显示保存按钮
            $(".viewer-save").show();
        },
        shown: (index) => {
           // 组件显示图片的时候
        }
    };
    // 参数1：需要预览的图片和pdf的数组
    // 参数2：文件名称，显示在顶部，如果没有可以传：“预览”
    // 参数3：index，打开第一张图片的索引，可以不传，默认为0
    // 参数4：自定义回调方法，可以不传，即为最基础的预览组件
    pdfImg.initViewer(list, '文件名称', 0, options)
}
```

------



### 可配置参数

| 参数       | 说明                     | 类型     | 参数                          | 默认值 |
| ---------- | ------------------------ | -------- | ----------------------------- | ------ |
| initViewer | 点击预览图片时调用的方法 | function | (list,fileName,index,options) | -      |




### 事件

| 事件名称 | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| download | 用户点击下载时的回调，内置下载方法，如需其他操作可以自定义   |
| save     | 用户点击保存时的回调，保存按钮默认隐藏，需要先在show回调中$(".viewer-save").show() |
| transfer | 用户点击转移时的回调，转移按钮默认隐藏，需要先在show回调中$(".viewer-transfer").show() |
| del      | 用户点击删除时的回调，删除按钮默认隐藏，需要先在show回调中$(".viewer-del").show() |
| show     | 组件显示图片之前的回调，在这里去显示隐藏按钮                 |
| shown    | 组件显示图片的回调                                           |