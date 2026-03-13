## 富文本编辑器组件文档

### jq老项目使用方法

> 1.引入方式

```html
<script src="https://front.leyoujia.com/js/richEditor-44.js"></script>
<!-- 正常使用不需要引入此CSS,在需要回显内容的页面引入此样式 -->
<link rel="stylesheet" href="https://front.leyoujia.com/css/richEditor.css"/>
```

> 2.基础用法

```css
/* 编辑器固定高度情况 */
#app{
    width:100%;
    height:400px;
}

/* 如果是高度不固定的情况用css修改最小高度，默认260px，如果有固定高度小于260px的情况需自己微调 */
#app .ckeditor-box .ck-editor__editable{
    min-height:400px;
}

```
```html
<!-- 挂载的元素 -->
<div id="app"></div>
<!-- 回显的div需要加上  ck-content 样式-->
<div class="ck-content"></div>
```

```javascript
const edit = new RichEditor({
    el: '#app', //需要挂载的容器ID
    saveId: 'ckEditorData1',    //自动保持时自动保持内容存储的localstorage key
    disabled: false,//是否禁用
    saveCallBack: (data) => {   //自动保存的回调函数
        console.log('回调中的data: ', data);
    },
    //编辑器事件
    editReady: () => {
        console.log('富文本编辑器初始化完成')
    },
    editFocus: () => {
        console.log('富文本编辑器获取焦点')
    },
    editBlur: () => {
        console.log('富文本编辑器失去焦点')
    },
    editInput: () => {
        console.log('富文本编辑器输入事件')
    }
    saveWaitTime: 2000, //不输入多少毫秒后进行自动保存
});
edit.VueInit()  //必须执行初始化函数
edit.setEditData('<p>Hello World</p>')  //正常设置值

// edit.setEditData(window.localStorage.getItem('#ckEditorData1'))  //回显自动保存的值

edit.getEditData()  //获取编辑器组件的值

edit.getCountLength()   //获取已输入的字符长度，用于提交阶段进行表单验证
```
### VUE项目使用方法
> 1、在src\operation\plugIn.js中加上如下配置
```javascript
const PLUGIN =['autoComplugins',{
  // 富文本编辑器
  plugName: 'rich-text',
  url: 'https://front.leyoujia.com/js/richEditor-44.js',
  type: 1
 }]
```

>2、在vue中使用需要在mounted之后初始化
``` html
<div id="rich"></div>
```
```javascript
import { onMounted } from 'vue';
//需要在mounted之后获取元素初始化
onMounted(() => {
    const edit = new RichEditor({
        el: '#rich', //需要挂载的容器ID
    });
    edit.VueInit(); //必须执行初始化函数
    edit.setEditData('<p>Hello World</p>'); //正常设置值

    edit.getEditData(); //获取编辑器组件的值
});

```
### 可配置参数

| 参数         | 说明                       | 类型   | 默认值 | 必传 |
| ------------| -------------------------- | ---- | ------ | ---- |
| el           | 需要挂载的容器ID，需要带上#号    | String | --     | TRUE |
| saveId | 自动保持时自动保持内容存储的localstorage key，需要和后端配合确保与之前和之后的id都不重复 | String | --     | FALSE |
| saveCallBack | 自动保存的回调函数 | Function | --     | FALSE |
| saveWaitTime | 间隔多少毫秒不输入后进行自动保存 | Number | --     | FALSE |
| maxCount     | 可输入的字符数                 | Number | 3000 | FALSE|
| showCount     | 显示字符限制                  | Boolean| true|FALSE|
| tipText       | 输入框提示文字                |String | '' | FALSE|
| disabled       | 是否禁用                |Boolean | false | FALSE|

### 事件
| 方法名         |说明                          |参数     |
|---------------|------------------------------|--------|
|VueInit         | 组件初始化必须调用的函数         | 无     |
|setEditData|设置富文本编辑器的内容，用于数据回显等场景|需要回显的data值|
|getEditData|获取富文本编辑器的内容，用于获取值进行提交的场景|无|
|getCountLength|获取富文本编辑器内容的长度|无|
|editReady|富文本编辑器初始化完成|无|
|editFocus|富文本编辑器获取焦点|无|
|editBlur|富文本编辑器失去焦点|无|
|editInput|富文本编辑器输入事件|无|