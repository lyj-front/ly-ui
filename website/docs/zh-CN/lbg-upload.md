## 乐办公上传附件组件文档

### jq老项目使用方法

> 1.引入方式

```html
<script src="https://front.leyoujia.com/js/lbgUpload/upload-lbg.umd.1.0.19.js"></script>
```

> 2.基础用法


```html
<!-- 挂载的元素 -->
<div id="lbg_upload"></div>
```

```javascript

var UploadLbg  
window.onload = () => {
    UploadLbg = new UploadLbg({
        el:'#lbg_upload',
        baseUrl:'https://itest.leyoujia.com',
        position:'top',
        showList:[], //默认展示的数据  
        callback:function(valus){ //valus 每次上传完后都会调callback
            console.log( valus)
            
        },
    })
}
//或者
var UploadLbg  
$(function(){
    UploadLbg = new UploadLbg({
        el:'#lbg_upload',
        baseUrl:'https://itest.leyoujia.com',
        showList:[], //默认展示的数据  
        position:'top',
        maxNum:'5', //上传数量
        maxSize:'5', //单位M
        showList:[], //默认展示的数据  
        needToast:true, // 文件大小/个数超过限制时进行提示
        callback:function(valus){ //valus 每次上传完后都会调callback
            console.log( valus)
            
        },
        errorback:function(value){ //valus 每次上传完后都会调callback
            console.log( value)
        },
    }) 
})
```
### VUE项目使用方法
> 1、安装包


```bash
yarn add upload-lbg
```

>2、页面引入组件 
```javascript
import upload from 'upload-lbg'
...
export default {
    components: {
        upload
    }
}
...
```

>2、在vue中使用需要在mounted之后初始化
```javascript
<template>
	<upload systemId="jjsky" position="center" baseUrl="https://i.leyoujia.com" :callback="uploadCallBack" :errorback="errorback" multiple needToast></upload>
</template>

import { defineComponent } from 'vue'
import upload from 'upload-lbg'
export default defineComponent({
	components: {
		upload,
	},
	setup() {
        //上传成功的回调
		function uploadCallBack(valus){
			console.log('valus: ', valus);
		}
        // 上传失败的回调
		function errorback(err){
			console.log('err: ', err);
		}
		return {
			uploadCallBack,
			errorback
		};
	},
});

```
### 可配置参数

| 参数     | 说明                                                                                         | 类型                  | 默认值 | 必传 |
| -------- | -------------------------------------------------------------------------------------------- | --------------------- | ------ | ---- |
| el       | 需要挂载的容器ID，需要带上#号                                                                | String                | --     | TRUE |
| baseUrl  | 接口域名，需要传新系统地址                                                                   | String                | --     | TRUE |
| showList | 自动保存的回调函数(默认格式：[] {url: 'xxx.jpg',type: 图片：1，视频：2，其他：3,name: 'xx',noDel: true,desc:"右侧描述，可以是html"})（单个上传可用） | String                | --     | TRUE |
| position | 二维码展示的位置top：右上，bottom：右下                                                      | String , center：右中 | String | --   | TRUE |
| callback | 数据回调方法，每次上传数据后就会回调 数据源跟showList一样                                    | Function              | --     | TRUE |
| errorback| 提示回调方法，上传附件超过限制后的回调（会反一个value为提示的文案）                          | Function              | --     | TRUE |
| maxNum   | 上传文件数量限制（单个上传可用）                                                                             | String                | --     | TRUE |
| maxSize  | 上传文件大小限制(单位M)                                                                      | String                | --     | TRUE |
| showTip  | 是否显示提示                                        | Boolean                | true     | false |
| tipContent  | 提示的内容                                        | String                | ''     | false |
| tipPosition  | 提示的位置可选（top/left/right/bottom）                                       | String                | 'bottom'     | false |
| limitFileType  | 限制上传的类型                 | Array                | ['.xls','.xlsx','.doc','.docx','.pdf','.rar','.zip','.jpg','.jpeg','.png']     | false |
| multiple  | 是否支持多选                 | Array                |  false    | false |
| isShowQrCode  | 是否显示扫码上传                 | Boolean                |  true    | false |
| isChengjiao | 是否成交类型（上传到公司服务器且没有域名） | Boolean | false | false |
| handleUpload | 选择文件回调（单个上传可用） | Function | -- | false |
| btnList | 多字段上传(list的格式跟showList一致) | Array | [{key: "区分不同类别字段，相同会被删除", name: "显示的名字", red: "是否显示星号", customBtn: [{name:"自定义按钮名", callback: "自定义按钮点击回调"}], list: [], handleUpload: function(){}(选择文件回调，非必传)}] | false |
| needToast | 上传异常(超过大小/个数等)是否需要toast提示 | Boolean | false | false |
| version | 默认为1返回字符串拼接，2返回数组字符串，版本1不支持多字段 | String | 1 | false |
| qiniuObj | 默认请求/jjslogin/qiniu/buildToken，如果需要自定义传参对象{token:'123',qiniuDomain:'123'} | Object | {} | false |
| viewFile | 自定义预览方法,点击预览返回图片的val, key, item | Function | function(){} | false |
| limitToast| 是否限制扫码移动端文件类型上传 | Boolean | false | false
| uploadKey | 自定义上传key，不传默认七牛 | String | a8b1647aabded12787c1d545b672d8d2 | false