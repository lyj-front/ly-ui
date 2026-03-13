# pdf和图片互转

### 图片转pdf

#### 安装依赖

```bash
yarn add pdf-lib
```
#### 代码

``` javascript
import { PDFDocument } from 'pdf-lib';

// 获取图片二进制数据的函数
async function getImageData(imageUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                // 根据图片URL判断格式
                const isPng = imageUrl.toLowerCase().includes('.png');
                const mimeType = isPng ? 'image/png' : 'image/jpeg';

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('无法创建图片blob'));
                            return;
                        }

                        const reader = new FileReader();
                        reader.onload = function () {
                            try {
                                const arrayBuffer = this.result;
                                const uint8Array = new Uint8Array(arrayBuffer);
                                resolve(uint8Array);
                            } catch (error) {
                                reject(new Error(`读取图片数据失败: ${error.message}`));
                            }
                        };
                        reader.onerror = () => reject(new Error('读取图片文件失败'));
                        reader.readAsArrayBuffer(blob);
                    },
                    mimeType,
                    0.8
                );
            } catch (error) {
                reject(new Error(`处理图片失败: ${error.message}`));
            }
        };
        img.onerror = () => reject(new Error('图片加载失败'));
        img.src = imageUrl;
    });
}

// 创建pdf
async function createPdf(imageFiles, index) {
    return new Promise(async (resolve, reject) => {
        try {
            const pdfDoc = await PDFDocument.create();
            const totalFiles = imageFiles.length;

            // 处理每个图片文件
            for (let i = 0; i < imageFiles.length; i++) {
                const file = imageFiles[i];
                try {
                    let httpRegx = /^https?:\/\/.*$/;
                    // 获取图片的二进制数据
                    let url = httpRegx.test(file.url) ? file.url : window.location.origin + file.url;
                    const imageBytes = await getImageData(url);

                    // 根据文件扩展名决定嵌入方式
                    const fileExtension = file.name.toLowerCase().split('.').pop();
                    let image;

                    try {
                        if (fileExtension === 'png') {
                            image = await pdfDoc.embedPng(imageBytes);
                        } else {
                            // 默认使用 JPG
                            image = await pdfDoc.embedJpg(imageBytes);
                        }
                    } catch (embedError) {
                        throw new Error(`嵌入图片失败: ${embedError.message || '未知错误'}`);
                    }

                    const page = pdfDoc.addPage([595, 842]); // A4尺寸

                    // 计算图片在A4页面中的合适尺寸，保持原始比例
                    const imageWidth = image.width;
                    const imageHeight = image.height;
                    const pageWidth = 595;
                    const pageHeight = 842;

                    // 计算缩放比例
                    const scale = Math.min(pageWidth / imageWidth, pageHeight / imageHeight);

                    // 计算居中位置
                    const scaledWidth = imageWidth * scale;
                    const scaledHeight = imageHeight * scale;
                    const x = (pageWidth - scaledWidth) / 2;
                    const y = (pageHeight - scaledHeight) / 2;

                    page.drawImage(image, {
                        x,
                        y,
                        width: scaledWidth,
                        height: scaledHeight,
                    });
                } catch (error) {
                    throw new Error(`处理图片 ${file.name} 失败: ${error.message || '未知错误'}`);
                }
            }

            // 返回PDF的二进制数据
            const pdfBytes = await pdfDoc.save();
            resolve(pdfBytes);
        } catch (error) {
            reject(error);
        }
    });
}
```

------

### pdf转图片

#### 安装依赖
> 目前测试过比较稳定的版本是2.10.377，workerSrc也是此版本，如果需要换版本，自己本地重新加上此文件

```bash
yarn add pdfjs-dist@2.10.377
```
#### 代码

``` javascript
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://front.leyoujia.com/front_cdn/pdfjs/worker.min.js';

async function renderPdfToImages(pdfUrl, index) {
    let httpRegx = /^https?:\/\/.*$/;
    let url = httpRegx.test(pdfUrl) ? pdfUrl : window.location.origin + pdfUrl;
    return new Promise(async (resolve, reject) => {
        try {
            const loadingTask = pdfjsLib.getDocument({
                url: url,
                cMapUrl: 'https://front.leyoujia.com/front_cdn/pdfjs/cmaps/',
                cMapPacked: true,
                useSystemFonts: true,
            });

            const pdf = await loadingTask.promise;
            let imgList = new Array(pdf.numPages); // 预分配数组大小
            const totalPages = pdf.numPages;

            // 按顺序处理每一页
            for (let i = 1; i <= totalPages; i++) {
                const page = await pdf.getPage(i);
                // 图片清晰度自己微调
                const scale = window.devicePixelRatio * 1.68;
                const viewport = page.getViewport({ scale });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d', {
                    alpha: false,
                    willReadFrequently: false,
                });
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                
                // 白底
                context.fillStyle = '#fff';
                context.fillRect(0, 0, canvas.width, canvas.height);
                
                // 默认抗锯齿
                context.imageSmoothingEnabled = true;
                context.imageSmoothingQuality = 'medium';
                
                await page.render({
                    canvasContext: context,
                    viewport: viewport,
                    intent: 'display',
                    renderInteractiveForms: true,
                }).promise;

                // 图片清晰度自己微调
                const imageUrl = canvas.toDataURL('image/png', 1);
                
                // 使用索引确保页面顺序正确
                imgList[i - 1] = {
                    url: imageUrl,
                    showUrl: imageUrl,
                    name: `第${i}页`,
                };

                // 清理资源
                context.clearRect(0, 0, canvas.width, canvas.height);
                canvas.width = 0;
                canvas.height = 0;
            }

            resolve(imgList);
        } catch (error) {
            console.error('PDF渲染失败:', error);
            reject(error);
        }
    });
}

```


