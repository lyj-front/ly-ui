## 计算器 组件

### 基础用法
:::demo
```html
<template>
  <ly-button size="mini" type="primary" @click="add">添加字段</ly-button>
  <calculator ref="calcRef" :disabledCalc="false" :data="data" @change="change" @errorInfoChange="errorInfoChange"></calculator>
</template>
<script>
  import { ref, watch } from 'vue'
  export default {
    setup(){
      const calcRef = ref(null)
      const data = ref([{
        content:'1', // 回显名称
        type:'calcobj', // 类型
        code:'1', // 唯一标识
        isEval:false, // 是否运算符
      },{
        content:'-', // 回显名称
        type:'calcobj', // 类型
        code:'-', // 唯一标识
        isEval:true, // 是否运算符
      },{
        content:'2', // 回显名称
        type:'calcobj', // 类型
        code:'2', // 唯一标识
        isEval:false, // 是否运算符
      },{
        content:'成交单价', // 回显名称
        type:'field', // 类型
        code:'cjdj', // 唯一标识
        isEval:false, // 是否运算符
      }])

      const change = (e) =>{
        console.log('data change:',e)
      }

      const errorInfoChange = (e) =>{
        console.log('calculator errorInfo:',e)
      }

      const add = () =>{
        calcRef.value.add({
            content:'自定义字段', // 回显名称
            type:'field', // 类型
            code:'cjdj', // 唯一标识
            isEval:false, // 是否运算符
        })
      }
      
      watch(data,(n)=>{
        console.log('calculator data:',data.value)
      })

      return {
        data,
        change,
        calcRef,
        add,
        errorInfoChange
      }
    }
  }
</script>
```
:::

### 自定义计算函数
:::demo
```html
<template>
  <ly-button size="mini" type="primary" @click="add">添加字段</ly-button>
  <calculator ref="calcRef" :disabledCalc="false" :data="data" :calcFun="calcFun" @change="change" @errorInfoChange="errorInfoChange"></calculator>
</template>
<script>
  import { ref, watch } from 'vue'
  export default {
    setup(){
      const calcRef = ref(null)
      const data = ref([{
        content:'1', // 回显名称
        type:'calcobj', // 类型
        code:'1', // 唯一标识
        isEval:false, // 是否运算符
      },{
        content:'-', // 回显名称
        type:'calcobj', // 类型
        code:'-', // 唯一标识
        isEval:true, // 是否运算符
      },{
        content:'2', // 回显名称
        type:'calcobj', // 类型
        code:'2', // 唯一标识
        isEval:false, // 是否运算符
      },{
        content:'成交单价', // 回显名称
        type:'field', // 类型
        code:'cjdj', // 唯一标识
        isEval:false, // 是否运算符
      }])

      // 自定义计算函数
      const calcFun = () =>{
        console.log('执行自定义计算')
        return '返回计算结果进行展示，非必须'
      }

      const change = (e) =>{
        console.log('data change:',e)
      }

      const errorInfoChange = (e) =>{
        console.log('calculator errorInfo:',e)
      }

      const add = () =>{
        calcRef.value.add({
            content:'自定义字段', // 回显名称
            type:'field', // 类型
            code:'cjdj', // 唯一标识
            isEval:false, // 是否运算符
        })
      }
      
      watch(data,(n)=>{
        console.log('calculator data:',data.value)
      })

      return {
        data,
        calcFun,
        change,
        calcRef,
        add,
        errorInfoChange
      }
    }
  }
</script>
```
:::

### 自定义公式校验方法
:::demo
```html
<template>
  <ly-button size="mini" type="primary" @click="add">添加字段</ly-button>
  <calculator ref="calcRef" :disabledCalc="false" :data="data" :validateFun="validate" @change="change" @errorInfoChange="errorInfoChange"></calculator>
</template>
<script>
  import { ref, watch } from 'vue'
  export default {
    setup(){
      const calcRef = ref(null)
      const data = ref([{
        content:'1', // 回显名称
        type:'calcobj', // 类型
        code:'1', // 唯一标识
        isEval:false, // 是否运算符
      },{
        content:'-', // 回显名称
        type:'calcobj', // 类型
        code:'-', // 唯一标识
        isEval:true, // 是否运算符
      },{
        content:'2', // 回显名称
        type:'calcobj', // 类型
        code:'2', // 唯一标识
        isEval:false, // 是否运算符
      },{
        content:'成交单价', // 回显名称
        type:'field', // 类型
        code:'cjdj', // 唯一标识
        isEval:false, // 是否运算符
      }])


      // 自定义校验函数
      const validate = (data) =>{
        console.log('validate data',data)
        return {
          valid:false,
          errorInfo:'自定义校验函数返回的错误信息'
        }
      }

      const change = (e) =>{
        console.log('data change:',e)
      }

      const errorInfoChange = (e) =>{
        console.log('calculator errorInfo:',e)
      }

      const add = () =>{
        calcRef.value.add({
            content:'自定义字段', // 回显名称
            type:'field', // 类型
            code:'cjdj', // 唯一标识
            isEval:false, // 是否运算符
        })
      }
      
      watch(data,(n)=>{
        console.log('calculator data:',data.value)
      })

      return {
        data,
        validate,
        change,
        calcRef,
        add,
        errorInfoChange
      }
    }
  }
</script>
```
:::

### Calculator Attributes

| 参数         | 说明                                         | 类型     | 是否必传 | 默认值          |
| ------------ | -------------------------------------------- | -------- | -------- | --------------- |
| data         | 初始公式集合                                 | Array    | false    | []              |
| disabledCalc | 试算按钮不可点击                             | Boolean  | false    | false           |
| calcFun      | 计算函数，该函数返回值会作为计算结果进行回显 | Function | false    | ()=>{return ''} |
| validateFun   | 校验函数，默认不允许出现两个连续操作符和两个连续自定义字段 | Function | false    | -- |

### data Attributes
| 参数    | 说明                  | 类型   | 是否必传 | 默认值 |
| ------- | --------------------- | ------ | -------- | ------ |
| content | 显示内容              | String | true     | ''     |
| type    | 类型：calcobj / field | String | true     | ''     |
| code    | 唯一标识              | String | false    | ''     |
| isEval  | 是否运算符            | String | true     | --     |

### Calculator Methods（ref）

| 参数 | 说明             | 参数    |
| ---- | ---------------- | ------- |
| add  | 添加公式集合对象 | data[0] |

### Calculator emits

| 参数            | 说明             | 返回      |
| --------------- | ---------------- | --------- |
| change          | 公式集合变动回调 | data      |
| errorInfoChange | 公式错误信息回调 | errorInfo |