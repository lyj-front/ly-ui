

# 广告条组件

### 使用方法

> 1.引入方式

```bash
yarn add ad-dialog
```

> 2.基础用法

#### 使用组件
> Vue3 使用
```html
<adList customClass="afawfwa" :closeNoShow="false" :type="adType" @closeCallback="bannerClose"></adList>
	<ly-button style="margin-top: 20px;" @click="showAd">设置广告条</ly-button>
	<adDialog v-model="AdShow" :type="adType" title="自定义tittle" changeModel :list="[{ value: '10', label: '成交列表' },
	{ value: '11', label: '发函诉讼管理' }]"></adDialog>
```
```javascript
import { adList, adDialog } from 'ad-dialog';
...

export default {
    components: {
        adList,
        adDialog,
    },
    setup() {
		const adType = 10
		function bannerClose() {
			console.log('关闭广告条了');
		}
		const AdShow = ref(false)
		function showAd(){
			AdShow.value = true
		}
		return {
			AdShow,
			showAd,
			bannerClose,
			adType
		};
	},
}
...
```

> jq 使用，只支持广告条，不支持弹框。且必须先引入jq文件

```html
<script src="https://front.leyoujia.com/front_cdn/common/js/ad-dialog.js"></script>

<div id="banner"></div>
<div id="banner2"></div>
```

```javascript
const adBanner = new AdBanner({
    el:'#banner', //挂载元素
    type: '10', // 广告条默认类型
    closeNoShow:true, // 关闭后不再显示
	storageKey:'my_customerKey' //自定义localstorage的key
    closeCallback: () => {
        console.log('广告已关闭');
    }
});


const adBanner2 = new AdBanner({
    el:'#banner2', //挂载元素
    type: '10',// 广告条默认类型
    closeNoShow:false,// 暂时关闭
    closeCallback: () => {
        console.log('广告已关闭');
    }
});
```

### adList可配置参数

| 参数                  | 说明                                           | 类型                                             | 可选值                                                                                          | 默认值               |
| --------------------- | ---------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------- | -------------------- |
| type | 广告type | String/Number |  | ''     |
| customClass | 自定义样式 | String | | ‘’ |
| closeNoShow | 是否关闭后不再显示（设置localStorage） | Boolean | | true |
| storageKey | localStorage设置不显示的key | String | | common_advert_${type} |


### adList事件

| 事件名称        | 说明                                                  | 回调参数     |
| --------------- | ----------------------------------------------------- | ------------ |
| closeCallback | 关闭广告条回调 |   |

------


### adDialog可配置参数

| 参数                  | 说明                                           | 类型                                             | 可选值                                                                                          | 默认值               |
| --------------------- | ---------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------- | -------------------- |
| model-value / v-model | 弹框显示隐藏 | Boolean | true/false | false |
| type | 默认广告类型 | String/Number | | ‘’ |
| list | 广告模块List | Array | [{ value: '10', label: '成交列表' }] | [] |
| changeModel | 是否允许修改广告模块 | Boolean | true/false | false |
| title | 弹框title | String |  | 更换广告条 |
| width | 弹框宽度 | String |  | 600px |
| customClass | 弹框自定义样式 | String |  | custom-ad-dialog |


### adDialog事件

| 事件名称        | 说明                                                  | 回调参数     |
| --------------- | ----------------------------------------------------- | ------------ |
| open | 弹框打开 |   |
| close | 弹框关闭 | |
| save | 广告条保存完成 | |