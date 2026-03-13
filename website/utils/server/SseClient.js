/**
 * 获取流
 * callback: on("data",data) // 接受消息
 *           on("end") // 结束
 * @param callback
 * @returns {Promise<void>}
 */
export async function getSteam(url, headers, postData, callback) {
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(postData),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const reader = response.body.getReader();
  const textDecoder = new TextDecoder();
  let result = true;
  let buffer = '';
  while (result) {
    const { done, value } = await reader.read();
    if (done) {
      result = false;
      callback?.end && callback.end();
      break;
    }
    buffer += textDecoder.decode(value, { stream: true });
    let boundary = buffer.lastIndexOf('\n');
    if (boundary !== -1) {
      let data = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 1);
      let lines = data.split('\n');
      lines.forEach(line => {
        if (line.trim().length && line !== 'event: ping') {
          callback?.data && callback.data(line);
        }
      });
    }
  }
  if (buffer.length > 0) {
    callback?.data && callback.data(buffer);
  }
}
