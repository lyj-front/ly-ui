# 紧凑版时间选择器


**组件基于jq时间插件My97DatePicker，[官方文档地址](http://www.my97.net/demo/index.htm)，复杂业务需求多看文档！！！**

### 使用方法
-----
#### 1.引入方式
> 安装npm包
```bash
yarn add lyj-datepicker
```
> ##### \src\operation\index.js 增加js引入包
```javascript
import asynScript from '@/unit/asynScript'
asynScript('/lyj-front/kydd/datepicker/WdatePicker.js', 'WdatePicker')
```
![Image text](https://document.leyoujia.com/dc-document/2026-01/13/23/FjK1pdkDPqSOv6Vtd_9JXsIy6tgz.png)

> ##### \src\operation\stand-alone.js 增加js引入包(独立运行的项目如审批单内有日期组件则需要加这个)
```javascript
asynScript('/lyj-front/kydd/datepicker/WdatePicker.js', 'WdatePicker')
```
![Image text](https://document.leyoujia.com/dc-document/2026-01/13/23/FnX5DVl1SV-z3nv1HZ71nrGoNu7O.png)

-----

#### 2.基础用法

##### 引入组件
> 局部组件注册
```javascript
import { datepicker } from 'lyj-datepicker';
...
export default {
    components: {
        datepicker,
    },
...
```

> 全局注册
```javascript
import datepicker from 'lyj-datepicker';
...
const instance = createApp(App);
instance.use(datepicker);
instance.mount(container ? container.querySelector('#app') : '#app');
...
```

### 标签使用
------
#### 单个时间选择器
```html
<datepicker
    type="single" 
    v-model="singleVal" 
    placeholder="请选择时间" 
    @change="timeChange" 
    minDate="2023-02-01"
 ></datepicker>
```
> id 用来给页面元素加唯一id用，页面上只有一个时间选择器时可以不加
#### 范围时间选择器

```html
<datepicker
    type="range"
    v-model:startTime="item.begin"
    v-model:endTime="item.end"
    startPlaceholder="开始时间"
    endPlaceholder="结束时间"
    @startChange="(val) => startTimeChange(val, index)"
    @endChange="(val) => endTimeChange(val, index)"
    format="yyyy/MM/dd"
    range-separator="到"
    :beforeStartClear="startTimeClear"
    :beforeEndClear="endTimeClear"
    :startId="'myTimeStart'+index"
    :endId="'myTimeEnd'+index"
></datepicker>
```
> startId和endId 用来给页面元素加唯一id用，页面上只有一个范围时间选择器时可以不加

> beforeStartClear、beforeEndClear 为非必传参数，返回true则会中止清空操作
------
### 表单校验

```html
<ly-form :model="form" :rules="rules">
    <ly-form-item label="范围时间" prop="startTime">
        <datepicker
            type="range"
            v-model:startTime="form.startTime"
            v-model:endTime="form.endTime"
            startPlaceholder="开始日期"
            endPlaceholder="结束日期"
            format="yyyy-MM-dd"
            range-separator="至"
            startId="timeStartId"
            endId="timeEndId"
        ></datepicker>
    </ly-form-item>
</ly-form>
```

```javascript
const form = reactive({
    startTime:'',
    endTime:'',
})
function checkTime(rule, value, callback){
    if (form.endTime === '') return callback(new Error('请选择结束时间'));
    callback();
}
const rules=[
    startTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' },
    { validator: checkTime, trigger: 'blur' }],
]
```
------
### 可配置参数

| 参数                  | 说明                                           | 类型                                             | 可选值                                                                                          | 默认值               |
| --------------------- | ---------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------- | -------------------- |
| type | 时间选择器类型，单个或者范围  | string  | single/range | single       |
| id | 单个时间选择器的id，必须为当前页面中唯一的值  | string  | — | 'datepickerTime'   |
| startId | 范围时间选择器开始时间的id，必须为当前页面中唯一的值  | string  | — | 'datePickerStartTime'   |
| endId | 范围时间选择器结束时间的id，必须为当前页面中唯一的值  | string  | — | 'datePickerEndTime'   |
|v-model | 单个选择器组件绑定的值  | string  | — | ''   |
|startTime | 范围选择器组件绑定的开始值必须为 v-model:startTime 否则会失去响应式  | string  | — | ''   |
|endTime | 范围选择器组件绑定的结束值必须为 v-model:endTime 否则会失去响应式  | string  | — | ''   |
| disabled | 禁用  | boolean   | —   | false               |
| width | 时间选择器的宽度  | string/number   | —   | 100               |
| placeholder           | 非范围选择时的占位内容                         | string                                           | —                                                                                               | —                    |
| start-placeholder     | 范围选择时开始日期的占位内容                   | string                                           | —                                                                                               | —                    |
| end-placeholder       | 范围选择时结束日期的占位内容                   | string                                           | —                                                                                               | —                    |
| range-separator       | 选择范围时的分隔符 | string  | —                                                                                               | '-'                  |
| format| 日期选择器的类型 | string | 见[自定义格式](http://www.my97.net/demo/resource/2.2.asp#m224)   | yyyy-MM-dd      |
| beforeClear | 单个时间选择器清空前的回调，返回true则会中止清空操作  | function  | — | 返回值为false的函数   |
| beforeStartClear | 范围时间选择器清空开始时间前的回调，返回true则会中止清空操作  | function  | — | 返回值为false的函数   |
| beforeEndClear | 范围时间选择器清空结束时间前的回调，返回true则会中止清空操作  | function  | — | 返回值为false的函数   |
| minDate | 单个组件时当前日期选择器可选的最小值 | string | 见[日期范围限制](http://www.my97.net/demo/resource/2.4.asp#m24)   | '' |
| maxDate | 单个组件时当前日期选择器可选的最大值 | string | 见[日期范围限制](http://www.my97.net/demo/resource/2.4.asp#m24)   | '' |
| minStart | 范围时间选择器开始时间可选的最小值 | string | 见[日期范围限制](http://www.my97.net/demo/resource/2.4.asp#m24)   | '' |
| maxStart | 范围时间选择器开始时间可选的最大值,unset则不限制必须小于最大值 | string | 'unset'/ 见[日期范围限制](http://www.my97.net/demo/resource/2.4.asp#m24)   | `#F{$dp.$D(${props.endId})}` |
| minEnd | 范围时间选择器结束时间可选的最小值，unset则不限制必须大于最小值 | string | 'unset' / 见[日期范围限制](http://www.my97.net/demo/resource/2.4.asp#m24)   | `#F{$dp.$D(${props.startId})}` |
| maxEnd | 范围时间选择器结束时间可选的最大值 | string | 见[日期范围限制](http://www.my97.net/demo/resource/2.4.asp#m24)   | '' |



### 事件

| 事件名称        | 说明                                                  | 回调参数     |
| --------------- | ----------------------------------------------------- | ------------ |
| change          | 用户选定的值时触发                                | 组件绑定值   |
| startChange     | 范围时间选择器用户选定开始时间的值时触发             | 组件绑定值    |
| endChange       | 范围时间选择器用户选定结束时间的值时触发             | 组件绑定值     |

