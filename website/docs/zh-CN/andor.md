## AndOr 组件

无限层级关系组件，可以自定义各层级节点

### 基础用法
:::demo
```html
<template>
  <and-or v-model:data="data"></and-or>
</template>
<script>
  import { ref, watch } from 'vue'
  export default {
    setup(){
      const data = ref({
        relation:'且',
        children:[{
          relation:'且'
        }]
      })

      watch(data,(n)=>{console.log(data.value)},{deep:true})

      return {
        data
      }
    }
  }
</script>
```
:::
### 自定义模板内容

:::demo 组件内部会抛出level（表示哪个层级），可通过level进行自定义节点
```html
<template>
  <and-or v-model:data="data">
      <template #default="slotProps">
          <ly-input v-if="slotProps.level==1" v-model="slotProps.data.input" style="width:140px" ></ly-input>
          <ly-select v-if="slotProps.level==2" style="width:140px"  v-model="slotProps.data.select">
            <ly-option v-for="item in options" :key="item.name" :label="item.name" :value="item.name"></ly-option>
          </ly-select>
          <span v-if="slotProps.level==3" style="font-size:14px;" >自定义文本</span>
      </template>
  </and-or>
</template>
<script>
  import { ref, watch } from 'vue'
  export default {
    setup(){
      const data = ref({
        relation:'且',
        children:[{
            relation:'且',
            children:[{}]
        }]
      })
      const options = ref([{name:'options1'},{name:'options2'}])

      watch(data,(n)=>{console.log(data.value)},{deep:true})

      return {
        data,
        options
      }
    }
  }
</script>
```
:::
### AndOr Attributes

| 参数          | 说明         | 类型   | 是否必传 | 默认值   |
| ------------- | ------------ | ------ | -------- | -------- |
| v-model       | 绑定值       | object | true     | --       |
| relationField | 层级关系字段 | string | false    | relation |

### AndOr Slots
| name    | 说明           |
| ------- | -------------- |
| default | 自定义层级节点 |