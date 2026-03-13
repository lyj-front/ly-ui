/**
 * 基础类 —— 接口基础信息以及调用
 */
// TODO: 使得hooks可以编译 VUE
// import LyMessage from '@element-plus/components/message'
import axios from 'axios'
axios.defaults.baseURL = '/'
export default class ServerConstruction {
  /**
   * ----------  http 方法：开始调用接口 ------------
   */
  async http(serverName, param) {
    let httpData = null, // 服务器数据
      paramOk = true, // 参数正常
      // eslint-disable-next-line prefer-const
      serverInfo = this[serverName]()

    if (serverInfo === null) {
      return new Promise((resolve, reject) => {
        reject({
          code: -1,
          data: null,
          msg: `找不到接口 ${serverName} 的配置信息`,
        })
      })
    } else {
      let noSetParam = serverInfo.mustParam // 保存缺少的必传参数
      // 判断必传参数
      if (serverInfo.mustParam) {
        if (param !== null) {
          const paramKey = Object.keys(param)
          if (paramKey.length === 0 && serverInfo.mustParam.length !== 0)
            paramOk = false
          else {
            noSetParam = serverInfo.mustParam.filter((item) => {
              return paramKey.indexOf(item) === -1
            })
            if (noSetParam.length !== 0) paramOk = false
          }
        } else paramOk = false
      } else paramOk = true
      // 调用服务器接口
      if (paramOk) {
        if (serverInfo.test) {
          // 测试接口，直接返回 construction 中的数据
          return new Promise((resolve) => {
            resolve(
              serverInfo && serverInfo.construction && serverInfo.construction()
            )
          })
        } else {
          // 检测URL是否携带参数，如果携带参数，则传参去掉该参数
          let url = serverInfo.name
          if (serverInfo.isUrlParam && serverInfo.isUrlParam.length !== 0) {
            serverInfo.isUrlParam.forEach((item) => {
              const exp = new RegExp(`{${item}}`, 'g')
              url = url.replace(exp, param[item])
              delete param[item]
            })
          }
          // 获取 Header
          const header = await this.setHeader(
            serverInfo.method ? serverInfo.method : 'get',
            !serverInfo.postType
              ? serverInfo.method === 'post'
                ? 'body'
                : 'query'
              : serverInfo.postType
          )
          try {
            const requestGetData = {
              checkSuccess:
                serverInfo.checkSuccess === undefined
                  ? true
                  : serverInfo.checkSuccess,
              header,
              postType: !serverInfo.postType
                ? serverInfo.method === 'post'
                  ? 'body'
                  : 'query'
                : serverInfo.postType,
              url,
              options: param === null ? {} : param,
              method: serverInfo.method ? serverInfo.method : 'get',
            }
            httpData = await this.requestGet(requestGetData)
            // 不传 construction 则不对数据做任何处理
            return new Promise((resolve) => {
              if (serverInfo && serverInfo.construction) {
                httpData = serverInfo.construction(
                  httpData,
                  param === null ? {} : param
                )
              }
              resolve(httpData)
            })
          } catch (e) {
            if (e.code === 403) {
              // 返回登录页面
              window.location.href = '/'
            } else {
              if (serverInfo.errorToast !== false) {
                // TODO: 使得hooks可以编译 VUE
                // LyMessage(
                //   e.desc ||
                //     e.errorInfo ||
                //     e.errorMsg ||
                //     '服务器异常，请稍后重试'
                // )
              }
              return new Promise((resolve, reject) => {
                reject(e)
              })
            }
          }
        }
      } else {
        console.error(
          `接口 ${serverName} 缺少必传参数 ${
            noSetParam ? noSetParam.join(', ') : ''
          }, 请先检查参数正确`
        )
        return new Promise((resolve, reject) => {
          reject({
            code: -1,
            data: null,
            msg: `接口 ${serverName} 缺少必传参数 ${
              noSetParam ? noSetParam.join(', ') : ''
            }, 请先检查参数正确`,
          })
        })
      }
    }
  }

  /**
   * 处理 Header 数据
   */
  // requestId 自增数字
  setHeader(method, postType) {
    return new Promise((resolve) => {
      // 设置 header 头部信息
      let header = {}
      if (method === 'post') {
        header = {
          'Content-Type': 'application/json; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
          Accept: 'application/json, text/javascript, */*; q=0.01',
        }
        if (postType === 'form') {
          header['Content-Type'] = 'application/x-www-form-urlencoded'
        }
      } else {
        header = {
          contentType: 'application/json',
        }
      }
      // header 去掉空的字段
      Object.keys(header).forEach((key) => {
        if (
          header[key] === '' ||
          header[key] === undefined ||
          header[key] === null
        ) {
          delete header[key]
        }
      })
      resolve(header)
    })
  }

  /*
   * @param {String} name      接口名称
   * @param {Object} options   参数
   */
  async requestGet({
    checkSuccess,
    header,
    method = 'get',
    postType,
    url,
    options = {},
  }) {
    // options 去掉空的字段
    Object.keys(options).forEach((key) => {
      // options[key] === '' ||
      if (options[key] === undefined || options[key] === null) {
        // eslint-disable-next-line no-console
        console.debug(
          `调用接口 ${url} 时， ${key} 的值为 undefined || null ，已经被程序自动过滤`
        )
        delete options[key]
      }
    })

    return new Promise((resolve, reject) => {
      let ajax = null
      switch (method) {
        case 'get':
          ajax = axios.get(url, {
            headers: header,
            params: options,
          })
          break
        case 'post':
          if (postType === 'query' || postType === 'form') {
            ajax = axios.post(url, null, {
              headers: header,
              params: options,
            })
          } else {
            ajax = axios.post(url, options, { headers: header })
          }
          break
        case 'delete':
          ajax = axios.delete(url, { headers: header })
          break
        case 'put':
          ajax = axios.put(url, options, { headers: header })
          break
        default:
          console.error(
            `接口 method 属性配置错误, 请使用正确的 get、post、delete、put`
          )
          reject({
            code: 500,
            data: null,
            msg: '前端配置错误',
          })
          break
      }

      ajax &&
        ajax
          .then((res) => {
            const result = res.data
            if (checkSuccess) {
              if (result.success || result.status) {
                resolve(res.data)
              } else {
                reject(res.data)
              }
            } else {
              resolve(result)
            }
          })
          .catch((error) => {
            reject({
              code: error.response.status,
              data: error,
              msg: '服务器错误',
            })
          })
    })
  }

  getMock(obj) {
    const mock = new Object({
      code: 200,
      data: obj,
      desc: '',
      status: true,
    })
    return mock
  }
}
