# 工作流碎片化规范样式

### 1 .使用方法

---

> html 增加 link 标签引入样式

```html
<link src="https://front.leyoujia.com/lyj-oa/oaCommon.css" />
```

> 特例说明

```html
注意事项：
1：设计要求每一列的label需要对齐，所以第三方的样式需要单独设置宽度，保持每一列“:（用英文冒号）”在同位置
2：pc端关于所有人名的地方都可以点击（如下方违规人姓名），人名常态是黑色文字，鼠标滑过变成蓝色文字，点击人名进入人事档案（类名.oa-hoverlink）
3：.oa-outer可以不使用，只需注意iframe内部加外部padding是否为符合设计规范上下左右16px间距，工作流公共部分默认会加左右内边距16px，下内边距存在10px
4：表格td序号列固定42px宽度，其他td设置根据字符长度设置宽度，部分长内容字段（备注等）需自行设置换行显示
5：图片样式不做大小限制，第三方自行取图片适合比列
```

---

#### 2.试例，（下方案列包含所有引用文件的类名使用，如有与设计图不通或遗漏望补充修改）

:::demo

```html
<template>
  <div class="oa-outer">
    <div class="oa-line">
      <div class="oa-line-item ">
        <div class="oa-label" style="width:77px">违规人姓名:</div>
        <div class="oa-content">
          <a class="oa-hoverlink" href="">林乐乐-人力资源中心</a>
        </div>
      </div>
      <div class="oa-line-item">
        <div class="oa-label" style="width:82px">当前周期:</div>
        <div class="oa-content">
          <span>2</span>
          <span class="oa-link">链接样式</span>
        </div>
      </div>
      <div class="oa-line-item ">
        <div class="oa-label" style="width:69px">是否红黄线:</div>
        <div class="oa-content">否</div>
      </div>
    </div>
    <div class="oa-line">
      <div class="oa-line-item">
        <div class="oa-label" style="width:77px">违规等级:</div>
        <div class="oa-content">不作为</div>
      </div>
      <div class="oa-line-item">
        <div class="oa-label" style="width:82px">违规类型:</div>
        <div class="oa-content">业务</div>
      </div>
      <div class="oa-line-item">
        <div class="oa-label" style="width:69px">当前分值:</div>
        <div class="oa-content">12分</div>
      </div>
    </div>
    <div
      style="display: flex;justify-content: space-between;align-items: center;"
    >
      <div class="oa-title">基本信息</div>
      <div class="oa-btn">查人员信息</div>
    </div>
    <div class="oa-line">
      <div class="oa-line-item ">
        <div class="oa-label" style="width:77px">四列样式:</div>
        <div class="oa-content">
          <span class="oa-hoverlink">四列样式</span>
        </div>
      </div>
      <div class="oa-line-item">
        <div class="oa-label" style="width:82px">四列样式:</div>
        <div class="oa-content">
          <span>2</span>
          <span class="oa-link">链接样式</span>
        </div>
      </div>
      <div class="oa-line-item ">
        <div class="oa-label" style="width:69px">四列样式:</div>
        <div class="oa-content">四列样式</div>
      </div>
      <div class="oa-line-item ">
        <div class="oa-label" style="width:69px">四列样式:</div>
        <div class="oa-content">四列样式</div>
      </div>
    </div>
    <div class="oa-line">
      <div class="oa-line-item ">
        <div class="oa-label" style="width:77px">四列样式:</div>
        <div class="oa-content">
          <span class="oa-hoverlink">四列样式</span>
        </div>
      </div>
      <div class="oa-line-item">
        <div class="oa-label" style="width:82px">四列样式:</div>
        <div class="oa-content">
          <span>2</span>
          <span class="oa-link">链接样式</span>
        </div>
      </div>
      <div class="oa-line-item ">
        <div class="oa-label" style="width:69px">四列样式:</div>
        <div class="oa-content">四列样式</div>
      </div>
      <div class="oa-line-item ">
        <div class="oa-label" style="width:69px">四列样式:</div>
        <div class="oa-content">四列样式</div>
      </div>
    </div>
    <div class="oa-line">
      <div class="oa-line-item">
        <div class="oa-label" style="width:77px">违规内容:</div>
        <div class="oa-content">
          (不作为，扣0.5分)超过6小时【未登客】，录入假电话，假客户资料
        </div>
      </div>
    </div>
    <div class="oa-line">
      <div class="oa-line-item">
        <div class="oa-label" style="width:77px">备注(含凭证):</div>
        <div class="oa-content">
          备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注
        </div>
      </div>
    </div>
    <div>
      <table class="oa-table">
        <thead>
          <tr>
            <td width="42px">序号</td>
            <td>公司名称</td>
            <td>公司类型</td>
            <td>注册号</td>
            <td>公司法人</td>
            <td>成立日期</td>
            <td>到期日期</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>深圳市龙华区棒棒哒传媒经营部</td>
            <td>个体工商户</td>
            <td>8989898989898989898989898</td>
            <td>林乐乐</td>
            <td>20/06/02</td>
            <td>20/09/02</td>
          </tr>
          <tr>
            <td>2</td>
            <td>深圳市龙华区棒棒哒传媒经营部</td>
            <td>个体工商户</td>
            <td>8989898989898989898989898</td>
            <td>林乐乐</td>
            <td>20/06/02</td>
            <td>20/09/02</td>
          </tr>
          <tr>
            <td>3</td>
            <td>深圳市龙华区棒棒哒传媒经营部</td>
            <td>个体工商户</td>
            <td>8989898989898989898989898</td>
            <td>林乐乐</td>
            <td>20/06/02</td>
            <td>20/09/02</td>
          </tr>
          <tr>
            <td>4</td>
            <td>深圳市龙华区棒棒哒传媒经营部</td>
            <td>个体工商户</td>
            <td>8989898989898989898989898</td>
            <td>林乐乐</td>
            <td>20/06/02</td>
            <td>20/09/02</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="oa-line">
      <div class="oa-line-item ">
        <div class="oa-label" style="width:77px">营业执照:</div>
        <div class="oa-content">
          <div class="oa-video">
            <img
              style="width:72px;height:72px"
              src="https://images-tests.leyoujia.com/nhr/entryImportant/FrZPxMBVVchLLjkndUUsJMc7d1LZ.jpg"
            />
          </div>
        </div>
      </div>
      <div class="oa-line-item ">
        <div class="oa-label" style="width:82px">社保立户凭证:</div>
        <div class="oa-content">
          <img
            class="oa-image"
            style="width:72px;height:72px"
            src="https://images-tests.leyoujia.com/nhr/entryImportant/FrZPxMBVVchLLjkndUUsJMc7d1LZ.jpg"
          />
        </div>
      </div>
      <div class="oa-line-item "></div>
    </div>
  </div>
</template>
```

:::
