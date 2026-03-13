<template>
  <div class="chat-container">
    <!-- 聊天对话窗口 上传图片后窗口-->
    <ly-aside class="aside_layout" >
      <ly-divider></ly-divider>
      <div v-for="(message, index) in messages" @click="openView(message)">
        <div class="flex flex-stretch">
          <div>
            <ly-image
              style="width: 100px; height: 100px"
              :src="message.image"
              :preview-src-list="[message.image]"
            ></ly-image>
          </div>
          <div class="left-divider">
            <div>时间: {{ message.time }}</div>
            <div>内容：{{ message.query }}</div>
          </div>
        </div>
        <ly-divider ></ly-divider>
      </div>
    </ly-aside>

    <ly-main v-if="!uploaded" >
    <!-- 上传区域 -->
    <div class="m-auto" style="width:840px; height:216px;margin-top:20px;" >
      <div>
        <ly-alert class="mb-10" :closable="false" title="1、目前只支持ly-ui组件库，其他组件库均不支持" type="info"> </ly-alert>
        <ly-alert class="mb-10" :closable="false" title="2、使用说明：先截图想要的网页效果，让他初始化生成代码，然后在再慢慢去调整细节" type="success"> </ly-alert>
        <ly-alert class="mb-10" :closable="false" title="3、在调整细节时，如果效果不满意，可以点击左边的记录，切换到之前的效果。然后在继续调整。" type="success"> </ly-alert>
        <ly-alert class="mb-10" :closable="false" title="相关提示：因费用太高，没办法对大模型进行微调。目前大模型没办法很好的理解组件的代码，所以出来的效果可能会有偏差，可以通过底部的代码编辑器进行手动修补即可。" type="warning"> </ly-alert>
        <ly-alert class="mb-10" :closable="false" title="调整代码：在调整时，可以先针对某个部位进行调整。可以逐个告诉大模型需要怎么调整，以此类推。例如：顶部的tabs使用有错误，并且当前页面属于第一个tab，帮我改正" type="warning"> </ly-alert>
        <ly-alert class="mb-10" :closable="false" title="如果遇到报错，可能是模型那边限制了QPS导致，可以多尝试几次让他生成。" type="error"> </ly-alert>
      </div>
      <ly-upload
        class="upload-table-demo"
        ref = "uploadRef"
        drag
        :qnDefault="true"
        show-file-list="false"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        list-type="picture-card"
        draggable
      >
        <i class="el-icon-upload3"></i>
        <div class="el-upload__text">生成代码，从效果图开始</div>
        <div class="el-upload__tips">
          <p>支持<b>jpg、png等图片格式</b></p>
        </div>
      </ly-upload>
    </div>
    </ly-main>
    <ly-main v-else>
      <div style="margin-button: 20px;">
        <MarkdownRenderer :markdown="viewByNow" ref="markdownRef"/>
      </div>
      <div class="chat-footer">
        <ly-button size="small" type="primary" @click="uploaded=false">重新开始</ly-button>
        <ly-input
          style="margin: 0 10px;"
          type="textarea"
          v-model="userMessage"
          placeholder="请输入你想改进的地方"
          @keyup.enter.native="sendMessage"
        ></ly-input>
        <ly-button size="small" type="primary" @click="sendMessage">发送</ly-button>
      </div>
    </ly-main>
  </div>
<!--  <ly-button type="primary" @click="demo">模拟</ly-button>-->
</template>

<script setup>
import {onMounted, ref, watch} from 'vue';
import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItContainer from 'markdown-it-container';
import MarkdownRenderer from "../components/MarkdownRenderer.vue";
import {getSteam} from "../utils/server/SseClient";
import {LyLoading as ElLoading} from "@element-plus/components";
// import marked from 'marked';
// import { compile } from '@vue/compiler-sfc';

// 控制是否显示上传区域
const uploaded = ref(false);
// 存储上传图片的 URL
const imageUrl = ref('');
/**
 * 存储聊天记录
 * text: ai回答内容,
 * time: 消息时间
 * query: 查询时间
 * static: 状态 1：成功 0：失败
 * image: 图片
 */
const messages = ref([]);
// 当前展示的窗口
const viewByNow = ref(null);
// 存储用户消息
const userMessage = ref('');
// 步骤进度
const active = ref(0);
// 七牛云对象
const uploadRef = ref(null);
// 模型回答中
const modelLoading = ref(false);
// 当前会话
const conversationId = ref("");

const imageUrlNow = ref(null);

const markdownRef = ref(null);

let dataDemo = ""
let dataDemo2 = "";
let loadingInstance = null;

onMounted(()=>{
  let messagesLocal = localStorage.getItem("messages");
  if(messagesLocal){
    messages.value = JSON.parse(messagesLocal);
  }

})


watch(() => modelLoading.value, (newVal) => {
  if (newVal) {
    loadingInstance = ElLoading.service({fullscreen: true,text:"生成中...."})
  }else{
    loadingInstance?.close()
  }
});

fetch('/demo_static/data.txt')
  .then(response => response.text())
  .then(data => {
    dataDemo = data
    // 这里的 data 就是文件的内容
    // console.log(data);
  });

fetch('/demo_static/data2.txt')
  .then(response => response.text())
  .then(data => {
    dataDemo2 = data
    // 这里的 data 就是文件的内容
    // console.log(data);
  });


// 处理上传成功
async function handleUploadSuccess(response) {
  imageUrl.value = uploadRef.value.qiniuObj.qiniuDomain + response.key;
  await sendImageToAPI(imageUrl.value,"初始化");
}

  // 处理上传失败
async function  handleUploadError(err){
  console.error('Upload error:', err);
}
  // 发送图片到 API
async function sendImageToAPI(imageUrl,query,inputs={}){
  // 新会话：app-dOwhs4JFfh0NXQCtLfmgUt7r
  // 旧会话：app-yyvnioMJbm4bZzwJR7bNR0wf
  let auth =  "app-yyvnioMJbm4bZzwJR7bNR0wf"
  if(imageUrlNow.value != imageUrl ){
    auth = "app-dOwhs4JFfh0NXQCtLfmgUt7r";
  }

  try {
    modelLoading.value = true;
    let data = {
      inputs: {...inputs},
      query:query,
      response_mode: 'streaming',
      conversation_id: '',
      user: 'ly-ui',
    };
    if(imageUrl){
      data.files = [
        {
          type: 'image',
          transfer_method: 'remote_url',
          url: imageUrl
        }
      ]
    }
    console.log("发送数据",data)

    let answer = "";
    await getSteam('https://itest-dify.leyoujia.com/v1/chat-messages',{
      'Authorization': `Bearer ${auth}`,
      'Content-Type': 'application/json'
    },data,{
      data:(chunk)=> {
        let data = chunk.toString().replace("data: ", "");
        console.log(data)
        data = JSON.parse(data);
        console.log(data)
        if (data.event === "message") {
          answer += data.answer;
        } else if (data.event === "message_end") {
          console.log("最终内容", answer)
          conversationId.value = data.conversation_id
          saveMessage({type: 'bot', text: answer,time: new Date().toLocaleString(),query:query,static: 1,image:imageUrl });
          uploaded.value = true;

          modelLoading.value = false;
          userMessage.value = "";
        }
      },
      end:()=>{
        modelLoading.value = false;
      }
    });
  } catch (error) {
    console.error('API request error:', error);
    saveMessage({ type: 'bot', text: '出错啦~',time: new Date().toLocaleString(),query:query,static: 0,image:imageUrl  });
    modelLoading.value = false;

  }
}

// 发送消息
async function sendMessage(){
  if (userMessage.value.trim() === '') return;
  let code = markdownRef.value?.getAllCode()
  await sendImageToAPI(imageUrlNow.value,userMessage.value,{code:code});
}


async function demo(){
  saveMessage({ type: 'bot', text: dataDemo,time: new Date().toLocaleString(),query:"初始化",static: 0,image:imageUrl });
}

async function demo2(){
  saveMessage({ type: 'bot', text: dataDemo2,time: new Date().toLocaleString(),query:"初始化",static: 0,image:imageUrl });
}


function openView(message){
  uploaded.value = true
  viewByNow.value = message.text;
  imageUrlNow.value = message.image;
}

/**
 * 保存数据
 * @param data
 * @returns {Promise<void>}
 */
function saveMessage(data){
  uploaded.value = true;
  viewByNow.value = data.text;
  imageUrlNow.value = data.image;
  messages.value.unshift(data);
  localStorage.setItem("messages",JSON.stringify(messages.value))
}

</script>

<style scoped>
.chat-container {
  width: 1480px;
  margin:0 auto;
  display: flex;
  //height: 100vh;
  flex-direction: row;
  flex-wrap: nowrap;
}
.box-card{
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
.m-auto{
  margin: 0 auto;
}
.flex{
  display: flex;
}
.flex-stretch{
  align-items: stretch;
}
.chat-footer {
  display: flex;
  align-items: baseline;
  padding: 10px;
  border-top: 1px solid #ddd;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
}

/* 自定义容器样式（可选） */
.custom-container {
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px 0;
}
.left-divider{
  margin-left: 5px;
  padding-left: 5px;
  border-left: 1px solid #dcdfe6;
  font-size: 14px;
}
.aside_layout{
  width: 300px;
  height: 90vh;
  overflow-x: scroll;
}
.mb-10{
  margin-bottom: 10px;
}
</style>
