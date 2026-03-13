# 评价组件（适用于页面内评价弹窗、满意度调查、服务评价）

组件说明文档
### 备注
评价组件用于在页面中显示评价弹窗，支持满意度等级选择、标签选择、文本评论等功能。组件会自动调用接口获取评价配置，并支持提交评价数据。

### 使用方法

> 1.引入方式

在HTML页面中引入evaluate.js文件：

```html
<script src="https://front.leyoujia.com/front_cdn/common/js/evaluate/evaluate.min.js"></script>
```

> 2.基础用法

```javascript
// 创建评价组件实例
var evaluate = Evaluate.create({
    source: 1,                    // 来源：1签约评价 2交房评价 3按揭评价 4过户评价 5带看评价 6租房评价 7房源推广
    businessId: '123456',         // 业务ID（必填）
    businessUrl: '/detail/123',   // 业务跳转链接（可选）
    businessCode: 'CODE001',      // 业务编号（可选）
    peopleType: 1,                // 被评价人员类型：1员工，2客户（必填）
    workerId: 'worker001',        // 被评价人ID（可选）
    workerName: '张三',           // 被评价人姓名（可选）
    evaluatedPersonQh: '+86',     // 被评价人手机区号（可选）
    evaluatedPersonPhone: '13800138000', // 被评价人手机号码（可选）
    peopleType1: 1,               // 评价人员类型：1业主，2客户（必填）
    peopleId: 'people001',        // 评价人id-客户id（可选）
    peopleName: '李四',           // 评价人姓名-客户名称（可选）
    telQh: '+86',                 // 评价人手机区号（可选）
    phone: '13900139000',         // 评价人手机号（可选）
    sceneCode: 'SCENE001'         // 场景编号（必填）
}, function(result) {
    // 评价提交成功后的回调
    console.log('评价结果:', result);
    // result包含：{level, tags, comment, evaluateId, config}
    // level: 满意度等级(1-5)
    // tags: 选中的标签数组
    // comment: 评论内容
    // evaluateId: 评价ID
    // config: 配置对象
}, {
    level: 5,              // 可选：默认选中的满意度等级(1-5)
    autoShow: true,        // 可选：是否默认打开评价弹框，默认为 true
    lockBodyScroll: true,  // 可选：弹框弹出时是否锁定页面滚动，默认为 true
    title: '评价',         // 可选：弹框标题，默认为 "评价"
    question: '您对{workerName}的服务满意吗?',  // 可选：评价问题文本，{workerName}会被替换
    placeholder: '用心好评会传达给经纪人'      // 可选：评论输入框占位符，默认为 "用心好评会传达给经纪人"
});
```

> 3.使用构造函数方式

```javascript
var evaluate = new EvaluateComponent(config, callBack, options);
```

> 4.控制弹窗显示和隐藏

```javascript
var evaluate = Evaluate.create(config, callBack, options);

// 显示弹窗
evaluate.show();

// 隐藏弹窗
evaluate.hide();

// 销毁组件（从DOM中移除）
evaluate.destroy();
```

> 5.手动控制显示（使用 autoShow: false）

```javascript
// 创建组件但不自动显示弹窗
var evaluate = Evaluate.create({
    source: 1,
    businessId: '123456',
    peopleType: 1,
    peopleType1: 1,
    sceneCode: 'SCENE001'
}, function(result) {
    console.log('评价结果:', result);
}, {
    autoShow: false  // 不自动显示，需要手动调用 show() 方法
});

// 在需要的时候手动显示弹窗
document.getElementById('evaluateBtn').addEventListener('click', function() {
    evaluate.show();
});
```

> 6.完整示例

```javascript
// 创建评价组件
var evaluateInstance = Evaluate.create({
    source: 7, // 来源：7：房源推广
    businessId: '1', // 业务ID
    businessUrl: '', // 业务跳转链接（可选）
    businessCode: '', // 业务编号（可选）
    peopleType: 1, // 被评价人员类型：1员工，2客户
    workerId: '', // 被评价人ID（可选）
    workerName: '', // 被评价人姓名（可选）
    evaluatedPersonQh: '', // 被评价人手机区号（可选）
    evaluatedPersonPhone: '', // 被评价人手机号码（可选）
    peopleType1: 1, // 评价人员类型：1业主，2客户
    peopleId: '', // 评价人id-客户id（可选）
    peopleName: '', // 评价人姓名-客户名称（可选）
    telQh: '', // 评价人手机区号（可选）
    phone: '', // 评价人手机号（可选）
    sceneCode: 'TG0001' // 场景编号
}, function(result) {
    console.log('满意度等级:', result.level);
    console.log('选中标签:', result.tags);
    console.log('评论内容:', result.comment);
    console.log('评价ID:', result.evaluateId);
    
    // 可以在这里处理评价提交成功后的业务逻辑
    // 例如：跳转页面、显示提示等
    alert('评价提交成功！');
}, {
    level: 5,              // 默认选中"非常好"
    autoShow: true,        // 创建时自动显示弹窗，设置为 false 则不自动显示
    lockBodyScroll: true,  // 弹框弹出时锁定页面滚动，设置为 false 则不锁定
    title: '服务评价',     // 自定义弹框标题
    question: '您对{workerName}的服务是否满意？',  // 自定义问题文本
    placeholder: '请输入您的评价意见'  // 自定义占位符文本
});

// 如果 autoShow 设置为 false，可以手动控制显示
// evaluateInstance.show();
```

> 7.自定义标题、问题和占位符示例

```javascript
// 创建评价组件，自定义标题、问题和占位符
var evaluateInstance = Evaluate.create({
    source: 1,
    businessId: '123456',
    peopleType: 1,
    peopleType1: 1,
    sceneCode: 'SCENE001',
    workerName: '张三'  // 被评价人姓名，会在问题中替换{workerName}
}, function(result) {
    console.log('评价结果:', result);
}, {
    title: '服务满意度调查',                    // 自定义弹框标题
    question: '请评价{workerName}的服务质量',    // 自定义问题，{workerName}会被替换为"张三"
    placeholder: '请输入您的宝贵意见',           // 自定义占位符
    lockBodyScroll: false,                      // 不锁定页面滚动
    autoShow: true
});
```

> 8.不锁定页面滚动示例

```javascript
// 如果页面需要保持滚动，可以设置 lockBodyScroll 为 false
var evaluateInstance = Evaluate.create({
    source: 1,
    businessId: '123456',
    peopleType: 1,
    peopleType1: 1,
    sceneCode: 'SCENE001'
}, function(result) {
    console.log('评价结果:', result);
}, {
    lockBodyScroll: false  // 弹框弹出时不锁定页面滚动
});
```

### 可配置参数

| 参数                  | 说明                                           | 类型     | 必填 | 可选值                                                                                          | 默认值   |
| --------------------- | ---------------------------------------------- | -------- | ---- | ----------------------------------------------------------------------------------------------- | -------- |
| config                | 配置参数对象                                   | Object   | 是   | 下方详细描述                                                                                    | 无       |
| callBack              | 表单提交后的回调函数                           | Function | 否   | 函数，参数为{level, tags, comment, evaluateId, config}                                        | 无       |
| options               | 可选参数对象                                   | Object   | 否   | 下方详细描述                                                                                    | {}       |

### config参数

| 参数名              | 说明                                    | 类型   | 必填 | 说明                                                       |
| ------------------- | --------------------------------------- | ------ | ---- | ---------------------------------------------------------- |
| source              | 来源                                    | Number | 是   | 1：签约评价 2：交房评价 3：按揭评价 4：过户评价 5：带看评价 6：租房评价 7：房源推广 |
| businessId          | 业务ID                                  | String | 是   | 业务标识ID                                                 |
| businessUrl         | 业务跳转链接                            | String | 否   | 业务详情页链接                                             |
| businessCode        | 业务编号                                | String | 否   | 业务编号                                                   |
| peopleType          | 被评价人员类型                          | Number | 是   | 1：员工，2：客户                                           |
| workerId            | 被评价人ID                              | String | 否   | 被评价人的唯一标识                                         |
| workerName          | 被评价人姓名                            | String | 否   | 被评价人姓名，会显示在问题文本中                           |
| evaluatedPersonQh   | 被评价人手机区号                        | String | 否   | 如：+86                                                    |
| evaluatedPersonPhone| 被评价人手机号码                        | String | 否   | 手机号码                                                   |
| peopleType1         | 评价人员类型                            | Number | 是   | 1：业主，2：客户                                           |
| peopleId            | 评价人id                                | String | 否   | 评价人的唯一标识（客户id）                                 |
| peopleName          | 评价人姓名                              | String | 否   | 评价人姓名（客户名称）                                     |
| telQh               | 评价人手机区号                          | String | 否   | 如：+86                                                    |
| phone               | 评价人手机号                            | String | 否   | 手机号码                                                   |
| sceneCode           | 场景编号                                | String | 是   | 场景唯一标识                                               |

### options参数

| 参数名         | 说明                                                           | 类型    | 必填 | 可选值      | 默认值                     |
| -------------- | -------------------------------------------------------------- | ------- | ---- | ----------- | -------------------------- |
| level          | 默认选中的满意度等级                                           | Number  | 否   | 1, 2, 3, 4, 5 | 无                         |
| autoShow       | 是否默认打开评价弹框                                           | Boolean | 否   | true, false | true                       |
| lockBodyScroll | 弹框弹出时是否锁定页面滚动（设置html overflow: hidden）        | Boolean | 否   | true, false | true                       |
| title          | 弹框标题                                                       | String  | 否   | -           | "评价"                     |
| question       | 评价问题文本，支持{workerName}占位符，会被替换为被评价人姓名或"该服务" | String  | 否   | -           | "您对{workerName}的服务满意吗?" |
| placeholder    | 评论输入框的占位符文本                                         | String  | 否   | -           | "用心好评会传达给经纪人"   |

### 满意度等级

组件支持5个满意度等级，每个等级对应不同的表情和文本：

| 等级 | 文本   | 值 |
| ---- | ------ | -- |
| 1星  | 非常差 | 1  |
| 2星  | 差     | 2  |
| 3星  | 一般   | 3  |
| 4星  | 很好   | 4  |
| 5星  | 非常好 | 5  |

注：满意度等级的文本和标签列表由接口返回的配置决定，以上为默认值。

### 实例方法

| 方法名  | 说明                 | 参数 | 返回值 |
| ------- | -------------------- | ---- | ------ |
| show()  | 显示评价弹窗         | 无   | void   |
| hide()  | 隐藏评价弹窗         | 无   | void   |
| destroy() | 销毁组件，从DOM中移除 | 无   | void   |

### 回调函数

| 参数名     | 说明                     | 类型   | 说明                                                         |
| ---------- | ------------------------ | ------ | ------------------------------------------------------------ |
| result     | 评价结果对象             | Object | 包含评价提交后的所有数据                                     |
| result.level | 满意度等级             | Number | 1-5的数字，表示用户选择的满意度等级                          |
| result.tags | 选中的标签数组         | Array  | 用户选中的标签文本数组                                       |
| result.comment | 评论内容             | String | 用户输入的文本评论                                           |
| result.evaluateId | 评价ID             | String | 接口返回的评价记录ID                                         |
| result.config | 配置对象           | Object | 创建组件时传入的config配置对象                               |

### 接口说明

组件会自动调用以下接口：

**1. 获取评价配置接口**

- **接口地址**: `/epapi/epController/saveEpService`
- **请求方式**: POST
- **请求参数**: config对象中的参数
- **返回数据**: 包含评价ID、满意度等级配置、标签列表等

**2. 提交评价接口**

- **接口地址**: `/epapi/epController/saveSimpleEvaluate`
- **请求方式**: POST
- **请求参数**: 
  - id: 评价ID
  - evaluateRemark: 评论内容
  - pjFlag: 是否匿名（false表示匿名）
  - typeForms: 评价表单数组，包含满意度等级和标签

### 注意事项

1. 组件需要传入完整的配置参数（source、businessId、peopleType、peopleType1、sceneCode）才能正常调用接口获取评价配置
2. 如果配置参数不完整，组件仍会显示，但不会调用接口获取配置，使用默认配置
3. 组件默认在创建时自动显示弹窗（autoShow默认为true），如果设置`autoShow: false`则不会自动显示，需要手动调用`show()`方法显示弹窗
4. 组件会自动插入样式到页面head中，多次创建实例时样式只会插入一次
5. 组件支持匿名评价，评价数据会通过接口提交到服务器
6. 评价提交成功后，弹窗会自动关闭
7. 如果传入了callBack回调函数，提交成功后会调用该函数；否则会触发自定义事件'evaluateSubmit'到document.body

