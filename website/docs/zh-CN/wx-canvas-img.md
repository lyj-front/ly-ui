# 小程序canvas生成海报（适用于小程序内海报、分享图片、卡片绘制）

组件说明文档
### 备注
小程序生成海报方法封装处理页面直接引用即可，返回图片为微信临时路径 

### 示例 
fangMINI 项目

调用案例：转发分享见面地点 

文件路径：beetingAddressPages\sendMeetingAddress\sendMeetingAddress.js 

### 使用方法

> 1.引入方式page.js文件加入如下代码

```javascript
//canvas绘图生成海报图片
canvasImg(options) {
    return new Promise((resolve, reject) => {
        const ctx = wx.createCanvasContext(options.canvasId);
        ctx.setFillStyle('#fff')
        ctx.rect(0, 0, options.canvasSize.split("*")[0], options.canvasSize.split("*")[1])
        ctx.fill()
        if (options.imgList && options.imgList.length > 0) {
            let _allNum = options.imgList.length || 0
            let _curNum = 0
            let _getImage = []
            _getImageInfo()
            function _getImageInfo() {
                let _curimg = options.imgList[_curNum]
                getImageInfo(_curimg.url).then(res => {
                    _curNum++
                    _getImage.push(res)
                    if (_curNum >= _allNum) {
                        _drawImage()
                    } else { _getImageInfo() }
                })
            }
            function _drawImage() {
                for (let i = 0; i < _getImage.length; i++) { 
                    let _curimg = options.imgList[i]
                    _curimg.url = _getImage[i].path
                    _curimg.imgW = _getImage[i].width
                    _curimg.imgH = _getImage[i].height
                    if (_curimg.isRadius) {
                        ctx.save()
                        ctx.beginPath()
                        ctx.arc(_curimg.imgX + (_curimg.drawW || _curimg.imgW) / 2, _curimg.imgY + (_curimg.drawH || _curimg.imgH) / 2, (_curimg.drawW || _curimg.imgW) / 2, 0, 2 * Math.PI)
                        ctx.clip()
                    }
                    let _scale = 1
                    let _drawW = _curimg.imgW
                    let _drawH = _curimg.imgH
                    if (_curimg.drawW) {
                    _scale = Math.min(_curimg.imgW / _curimg.drawW, _curimg.imgH / _curimg.drawH)
                    _drawW = _curimg.drawW * _scale
                    _drawH = _curimg.drawH * _scale
                    }
                    ctx.drawImage(_curimg.url, (_curimg.imgW - _drawW) / 2, (_curimg.imgH - _drawH) / 2, _drawW, _drawH, _curimg.imgX, _curimg.imgY, _curimg.drawW || _curimg.imgW, _curimg.drawH || _curimg.imgH)
                    ctx.restore()
                    if (i == _getImage.length - 1) {
                        drawNext()
                    }
                }
            }
        } else {
            drawNext()
        }
        function drawNext() {
            if (options.textList && options.textList.length > 0) {
                let _textList = options.textList
                for (let i = 0; i < _textList.length; i++) {
                    let _wrap = _textList[i].wrap
                    let _h = _textList[i].textY
                    let _string = _textList[i].string
                    if ((_textList[i].string.length > _wrap) && !_textList[i].isWrap) {
                    let _arrText = []
                    _arrText = [(_textList[i].string).replace(/\s+/g,"")]
                    let _x = 0
                    let _this = this
                    calcImgText(_x)
                    function calcImgText(x) {
                        var res = []
                        var str = ''
                        var nums = 0
                        for (var k = 0; k <= _arrText[x].length; k++) {
                        if (nums < _wrap && !(k == _arrText[x].length)) {
                            (/[0-9a-ln-z.]/.test(_arrText[x][k])) ? nums += 0.5 : nums++
                            str += _arrText[x][k] 
                        } else {
                            res.push(str)
                            let _item = cloneObj(_textList[i])
                            _item.string = str
                            _item.textY = _h
                            if (_item.string.length > _wrap) _item.isWrap = true
                            _textList.push(_item)
                            _h += _item.lineHeight
                            str = _arrText[x][k]
                            nums = 1
                        }
                        }
                    }
                    function cloneObj(obj) {
                        var newObj = {};
                        if (obj instanceof Array) {
                        newObj = [];
                        }
                        for (var key in obj) {
                        var val = obj[key];
                        newObj[key] = typeof val === 'object' ? cloneObj(val) : val;
                        }
                        return newObj;
                    } 
                    _textList.splice(i, 1)
                    }
                }
                for (let i = 0; i < options.textList.length; i++) {
                    let _curText = options.textList[i]
                    // ctx.font = "50px ygyxsziti2"
                    ctx.font = `${_curText.fontStyle || 'normal'} ${_curText.fontSize || 24}px ${_curText.fontFamily || 'Arial'}`
                    console.log("ctx.font",  ctx.font)
                    // ctx.setFontSize(_curText.fontSize)
                    ctx.setFillStyle(_curText.color)
                    ctx.setTextAlign(_curText.textAlign || 'left')
                    ctx.setTextBaseline('top')
                    ctx.fillText(_curText.string, _curText.textX, _curText.textY)
                    if (_curText.bold) {
                    ctx.fillText(_curText.string, _curText.textX, _curText.textY - 0.5)
                    ctx.fillText(_curText.string, _curText.textX - 0.5, _curText.textY)
                    }
                    ctx.fillText(_curText.string, _curText.textX, _curText.textY)
                    if (_curText.bold) {
                    ctx.fillText(_curText.string, _curText.textX, _curText.textY + 0.5)
                    ctx.fillText(_curText.string, _curText.textX + 0.5, _curText.textY)
                    }
                }
                //ctx.draw(true)
            }
            ctx.draw(true, () => {
                setTimeout(() => {
                    canvasToTempImage(options.canvasId).then(res => {
                        resolve(res)
                    })
                }, 100)
            })
        }
    })
}
//获取图片信息
const getImageInfo = imgUrl => {
    return new Promise(resolve => {
      wx.getImageInfo({
        src: imgUrl,
        success(res) {
          resolve(res)
        }
      })
    })
}
//把canvas转换成本地图片路径
const canvasToTempImage = (canvasId, w, h, x = 0, y = 0) => {
    return new Promise((resolve, reject) => {
        wx.canvasToTempFilePath({
            canvasId,
            x: x,
            y: y,
            width: w,
            height: h,
            success(res) {
                resolve(res.tempFilePath)
            },
            fail(res) {
                reject(res);
            }
        })
    })
}
```

> 2.基础用法(以分享卡片为例)
```javascript
//获取分享海报
getSharePoster() {
    var _this = this
    return new Promise(async (resovle) => {
        _this.canvasImg({
            canvasId: 'myCanvas', 
            canvasSize: '750*600',
            imgList: [ 
                { url: "https://front.leyoujia.com/images/sendMeetingAddress/back.png", drawW: 750, drawH: 600, imgX: 0, imgY: 0 },
                { url: app.globalData.userInfo.portrait || 'https://front.leyoujia.com/fangMini/images/agent_default.png', drawW: 80, drawH: 80, isRadius: true, imgX: 32, imgY: 60 },
                { url: `https://api.map.baidu.com/staticimage/v2?ak=nBIBdYlwIUiTU3Trtq5kXOSxBNm3lPhz&mcode=666666&center=${_this.data.form.lon},${_this.data.form.lat}&width=638&height=160&zoom=18`, drawW: 638, drawH: 160, imgX: 56, imgY: 346 },
                { url: 'https://front.leyoujia.com/images/sendMeetingAddress/landmark.png', drawW: 72, drawH: 102, imgX: 350, imgY: 350 },
                { url: 'https://front.leyoujia.com/images/sendMeetingAddress/18.png', drawW: 30, drawH: 30, imgX: 665, imgY: 280 },
            ],
            textList: [
                { string: "邀请您在以下地点见面", color: '#333333', fontSize: '44', fontFamily: 'PingFangSC', bold: false, textX: 136, textY: 78 },
                { string: "约见时间：", color: '#666666', fontSize: '32', fontFamily: 'PingFangSC', bold: false, textX: 56, textY: 212 },
                { string: _this.data.dateTime, color: '#000000', fontSize: '32', fontFamily: 'PingFangSC', bold: false, textX: 216, textY: 212 },
                { string: "见面地点：", color: '#666666', fontSize: '32', fontFamily: 'PingFangSC', bold: false, textX: 56, textY: 277 },
                { string: _this.data.form.addrName.length > 10 ? _this.data.form.addrName.slice(0, 10) + '...' : _this.data.form.addrName , color: '#000000', fontSize: '32', fontFamily: 'PingFangSC', bold: false, textX: 216, textY: 277 },
                { string: "去导航", color: '#3D5688', fontSize: '26', fontFamily: 'PingFangSC', bold: false, textX: 591, textY: 281 },
            ]
        }).then((imageUrl) => {
            // 图片地址 微信临时路径
            resovle(imageUrl)
        })
    })
}
/**
 * 用户点击右上角分享
 */
onShareAppMessage() {
    const _this = this
    return new Promise(async (resovle) => {
        const imageUrl = await _this.getSharePoster()
        resovle({
            imageUrl,
            title: '乐有家',
            path: 'beetingAddressPages/scheduleInfo/scheduleInfo'
        })
    })
}
```

### 可配置参数

| 参数                  | 说明                                           | 类型                                             | 可选值                                                                                          | 默认值               |
| --------------------- | ---------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------- | -------------------- |
| canvasId |  画布id  | String  | myCanvas | 无 |
| canvasSize |  画布宽高  | String  | 750*600 | 无 |
| imgList |  图片集合  | Array  | 下方详细描述 | 无 |
| textList |  文案集合  | Array  | 下方详细描述 | 无 |




### imgList参数

| 参数名        | 说明                                                  | 
| --------------- | ----------------------------------------------------- |
| url  | 仅支持https路径  |
| drawW  | 图片宽度  |
| drawH  | 图片高度  |
| imgX  | 图片距离画布原点X轴位置  |
| imgY  | 图片距离画布原点Y轴位置  |
| isRadius  | 图片是否设置圆角50%  |



### textList参数

| 参数名        | 说明                                                  | 
| --------------- | ----------------------------------------------------- |
| string  | 文案  |
| color  | 字体颜色 例 #333333  |
| fontSize  | 字体大小  |
| fontFamily  | 系统字体  |
| bold  | 是否加粗  |
| textX  | 文案距离画布原点X轴位置  |
| textY  | 文案距离画布原点Y轴位置  |


### 回调

| 事件名称        | 说明                                                  | 回调参数     |
| --------------- | ----------------------------------------------------- | ------------ |
| Promise then  | 返回微信临时路径  | imageUrl |