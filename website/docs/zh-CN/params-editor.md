## ParamsEditor 参数模板编辑器

可插入参数，自定义文本模板的编辑器
### 基础用法
:::demo
```html
<template>
  <ly-select v-model="value" @change="selectChange">
    <ly-option v-for="option in options" 
      :key="option.value" 
      :label="option.label" 
      :value="option.label"></ly-option>
  </ly-select>
  <params-editor :data="editorData" ref="paramsEditor" @data-update="onDataUpdate"></params-editor>
</template>
<script>
  import { ref, watch } from 'vue'
  export default {
    setup(){
      const content = ref('')
      const paramsEditor = ref(null)
      const value = ref('')
      const editorData = ref('https://www.baidu.com?search=<span class=\"blue\" contenteditable=\"false\">【参数3】</span>')
      const options = [{
        label:'参数1',
        value:1
      },{
        label:'参数2',
        value:2
      },{
        label:'参数3',
        value:3
      }]

      function onDataUpdate(e){
        console.log('onDataUpdate:',e)
      }

      function selectChange(e){
        paramsEditor.value.insertField(e)
      }

      return {
        editorData,
        value,
        options,
        paramsEditor,
        content,
        onDataUpdate,
        selectChange
      }
    }
  }
</script>
```
:::
### ParamsEditor Attributes

| 参数        | 说明                         | 类型   | 是否必传 | 默认值       |
| ----------- | ---------------------------- | ------ | -------- | ------------ |
| id          | 编辑器domId                  | String | false    | paramsEditor |
| data        | 编辑器初始渲染内容           | string | false    | ''           |
| limitNum    | 字数显示，一个参数算一个字符 | Number | false    | 100          |
| placeholder | 占位符                       | String | false    | ''           |

### ParamsEditor Methods
| 参数        | 说明     | 类型     |
| ----------- | -------- | -------- |
| insertField | 插入参数 | Function |