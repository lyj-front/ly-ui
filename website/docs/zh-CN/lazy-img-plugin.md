# 图片懒加载sdk

### 使用方法
-----
#### 1.引入方式
> \public\index.html vue项目增加script标签引入包
```html
<script src="/lyj-front/tapd-manage/lazyLoadPlugin/lazyLoadPlugin.js"></script>
```
![Image text](https://images-tests.leyoujia.com/jjsky/dispatch/2025-03/03/10/FhZv3ZZXJB2wVzJLua8v7yI42t62.png)


> jq 需要在项目引入下面的cdn文件

```html
<script type="text/javascript" src="https://front.leyoujia.com/front_cdn/common/js/lazyLoadPlugin.js"></script>
```

-----

#### 使用组件

``` script
该组件会默认调用LazyLoadSDK.init()方法，若需手动调用，可以参照LazyLoadSDK.init()方法

window.LazyLoadSDK.init({
    rootMargin: '0px', // 根元素的边距，用于控制图片加载时机，默认值为 '0px'
    selector: 'img[data-src]' // 选择器，用于选择需要懒加载的图片，默认值为 'img[data-src]'
});
```

------



### 可配置参数

| 参数       | 说明                     | 类型     | 参数                          | 默认值 |
| ---------         | ------------------------ | -------- | ----------------------------- | ------ |
| init              | 初始化图片懒加载方法       | function | (options)                     | -      |




### 事件

| 事件名称 | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| handleContent | 处理内容图片更新时的data-src属性并重新初始化init，window.LazyLoadSDK.handleContent(content，options)   |
| processImages     | 处理图片data-src方法，适用于编辑器内容更新时，设置图片data-src属性，window.LazyLoadSDK.processImages(content) |
| restoreImages     | 恢复图片src属性方法，适用于编辑器内容更新时，恢复图片src属性，window.LazyLoadSDK.restoreImages(options) |
| update     | 更新内容时调用该方法，window.LazyLoadSDK.update(options)