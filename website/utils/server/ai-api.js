import { post } from './unit'
import {getSteam} from "./SseClient";



/**
 * ListTablePage 模块
 */
class AiServer {
  // 列表接口配置示例
  async chatMessage(query,imageUrl) {
    let data = {
      inputs: {},
      query:query, // 可以根据需要填入查询内容
      response_mode: 'streaming',
      conversation_id: '', // 如果有对话 ID 需要填入
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
    return await getSteam('http://itest-dify.leyoujia.com/v1/chat-message',{
      'Authorization': `Bearer app-dOwhs4JFfh0NXQCtLfmgUt7r`,
      'Content-Type': 'application/json'
    },data);

  }
}

export default new AiServer()
