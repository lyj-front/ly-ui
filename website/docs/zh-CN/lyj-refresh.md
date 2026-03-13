# lyj-refresh（vu2版本 适用于轻应用、vue2h5项目；原生html版本请阅读至底部）

组件说明文档
### 备注
下拉使用的是transform实现的(定位没有transform丝滑)，固在lyj-refresh组件内部不能放fixed定位的元素，否则该fixed定位的元素将失效

### 使用方法

> 1.引入方式

```bash
yarn add lyj-refresh
```

> 2.基础用法
```javascript
<template>
	<div class="search-box">
		<LyjRefresh @reload="reload" :loading="loading">
			<div class="item" v-for="item in 20" :key="item">{{ item }}</div>
		</LyjRefresh>
	</div>
</template>
<script>
import { LyjRefresh} from '../packages/index';
export default {
	components: {
		LyjRefresh
	},
	data() {
		return {
            loading: false,
        };
	},
	methods:{
		reload(){
			this.loading = true
			setTimeout(() => {
				this.loading = false
				this.disable = true
			},2000)
		}
	}
};
</script>
```

#### 引入组件
> 局部引入
```javascript
import { LyjRefresh } from 'lyj-refresh';
...
export default {
    components: {
        LyjRefresh
    },
...
```

> 全局引入
```javascript
import { LyjRefresh } from 'lyj-refresh';
...
const app = new Vue({
    render: h => h(App),
})
Vue.use(LyjRefresh)
app.$mount('#app')
...
```

------



### 可配置参数

| 参数                  | 说明                                           | 类型                                             | 可选值                                                                                          | 默认值               |
| --------------------- | ---------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------- | -------------------- |
| loading |  下拉刷新状态  | Boolean  | true/false | true |




### 事件

| 事件名称        | 说明                                                  | 回调参数     |
| --------------- | ----------------------------------------------------- | ------------ |
| reload  | 自定义异步更新数据（使用此方法前将loading置为true，更新完数据将loading置为false）；没有定义reload方法则刷新整个页面  | 无  |


# html版本
### 使用方法
>1. 引入js
```bash
<script src="https://front.leyoujia.com/js/lyj-refresh.js"></script>
```
>2. 使用（刷新页面和异步更新数据两种）
```
// wraper 为需要实现下拉刷新的容器id 注意 wraper内部子元素不可有fixed定位元素  否则fixed 定位将失效
// 方式一 h5直接刷新页面
// let refresh = new LyjRefresh('wraper')
// 方式二 异步刷新数据
let refresh = new LyjRefresh('wraper',{
    reload:function(){
        console.log(2222)
        // 异步请求 请求完成需要调用loaded方法 关闭刷新
        setTimeout(() => {
            refresh.completed()
        }, 2000);
    }
})
```
### 事件

| 事件名称        | 说明                                                  | 回调参数     |
| --------------- | ----------------------------------------------------- | ------------ |
| reload  | 自定义异步更新数据（数据请求完成需要调用completed方法将刷新关闭）  | 无  |
| completed  | 关闭刷新  | 无  |
