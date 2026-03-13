## PC/H5生成海报

### jq老项目使用方法

> 1.引入方式

```html
<script src="https://front.leyoujia.com/js/setposter/set-poster.js"></script>
```

> 2.基础用法

```javascript

let  initPoster = new TranCanvas({ 
    type: 'workeAge', //birthday、workeAge
    data: {  //目前固定birthday/worke
        name: '名字',  //人名
        workeAge: '10', //工作年限
        age: '15', //年龄
        headPic: 'https://imgcloud.leyoujia.com/nhr/head_img/00459514_hr_20220308161941_head.jpg',
        textLine: '亲爱的xxx,你快乐xxxxxx'
    },
})
let res =  iniPoster.getPoster() //会返回base64的数据
```
### VUE项目使用方法
> 1、在src\operation\plugIn.js中加上如下配置
```javascript
const PLUGIN =['autoComplugins',{
  // 富文本编辑器
  plugName: 'set-poster',
  url: 'https://front.leyoujia.com/js/setPoster/set-poster.js',
  type: 1
 }]
//  用法同上
```
### 可配置参数

| 参数         | 说明                       | 类型   | 默认值 | 必传 |
| ------------| -------------------------- | ---- | ------ | ---- |
| type           | 生成的海报类型（目前仅有workeAge/工作纪念 birthday/生日纪念 ）    | String | --     | TRUE |
| data | 需要的参数（参数看用例） | String | --     | TRUE |

### 事件
| 方法名         |说明                          |参数     |
|---------------|------------------------------|--------|
|iniPoster         | 获取生成的海报         | 无     |