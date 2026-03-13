## 上传XLSX读取文档流数据

> 1.安装XLSX第一种方式

```html
npm install XLSX
```

> 2.第二种方式

```html
删除node_modules文件夹
在package.json的dependencies中加入："xlsx": "^0.16.8"
再yarn
```

> 3.使用

```js
按需引入
import XLSX from 'xlsx';

ly-upload事件回调
:before-upload="beforeUpload"

具体方法
const uploadRef = ref(null) //ly-upload
function beforeUpload(){
    const isExcel = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isExcel) {
        LyMessage.error('只能上传Excel文件！')
        return false;
    }
    //声明FileReader对象读取Excel文件
    const reader = new FileReader();
    //转换成ArrayBuffer格式
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
        //转换成JSON格式
        const data = new Uint8Array(reader.result);
        const workbook = XLSX.read(data);
        if (workbook.SheetNames.length > 0) {
        //表头    
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        //具体的内容
        const excelData = XLSX.utils.sheet_to_json(worksheet);
        if (excelData.length > 0) { // 判断文件是否有数据
            console.log(excelData);
            // 在这里处理读取到的文件内容
            return true; // 文件格式正确且有数据，则允许上传
        } else {
            LyMessage.error('该文件无数据导入，请核对后操作')
            //取消上传
            uploadRef.value.abort()
        }
        } else {
            LyMessage.error('无效的Excel文件！')
            //取消上传
            uploadRef.value.abort()
        }
    };
    reader.onerror = (error) => {
        LyMessage.error(error.toString());
        return false;
    };
}
使用lu-ui的upload组件来实现文件上传功能。在beforeUpload()方法中，我们首先检查上传的文件类型是否为Excel文件。
如果文件类型正确，则使用FileReader对象读取Excel文件，并将其转换成ArrayBuffer格式。然后，使用XLSX库读取ArrayBuffer数据，并将其转换成JSON格式。
在判断文件格式和读取文件内容时，我们与之前的示例代码类似。不过，在处理出错时，我们使用LyMessage.error()方法显示错误消息，并返回false以阻止文件上传。
在判断 Excel 文件内容是否有数据时：
1，如果文件格式正确且有数据，则允许上传并返回 true。
2，如果文件格式正确但无数据，则弹出错误提示并返回 false。
3，如果文件格式无效，则同样弹出错误提示并返回 false。
GitHub 仓库地址：https://github.com/SheetJS/sheetjs
官方网站：https://sheetjs.com/
```
### 在使用 XLSX 库时，你需要根据实际情况选择正确的版本号，并了解不同版本之间的区别和 API 的变化

