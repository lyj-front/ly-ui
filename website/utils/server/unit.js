import LyMessage from '@element-plus/components/message'
import axios from 'axios'

const exp = new RegExp(/(\{([a-z]|[A-Z]|[0-9])+\})+/, 'gm')

/**
 * UIL中携带参数转换
 * @param {*} url
 * @param {*} params
 * @returns
 */
function urlParam(url, params) {
  url = url.replace(exp, function (urlParam) {
    const key = urlParam.replace(/^\{/, '').replace(/\}$/, '')
    const data = params[key]
    delete params[key]
    return data
  })
  return {
    url,
    params,
  }
}

/**
 * * 通过柯里化创建装饰器
 */
const createHttp =
  (ctx) =>
  (method) =>
  (postType) =>
  (config = {}) =>
  (target, property, descriptor) => {
    const { checkSuccess = true, errorToast = true } = config
    const apiUrl = descriptor.value()
    let headers = {}

    if (method === 'post') {
      headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json, text/javascript, */*; q=0.01',
      }
      if (postType === 'form' || postType === 'formData') {
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
      }
    } else {
      headers = {
        contentType: 'application/json',
      }
    }

    // headers 去掉空的字段
    Object.keys(headers).forEach((key) => {
      if (
        headers[key] === '' ||
        headers[key] === undefined ||
        headers[key] === null
      ) {
        delete headers[key]
      }
    })

    descriptor.value = (query) => {
      // urlParam转换
      const { url, params } = urlParam(apiUrl, query)
      let ajax = Promise.resolve()
      switch (method) {
        case 'get':
          ajax = ctx.get(url, { headers, params })
          break
        case 'post':
          if (postType === 'query' || postType === 'form') {
            ajax = ctx.post(url, null, { headers, params })
          } else if (postType === 'formData') {
            let formData = ''
            Object.keys(params).forEach((key, index) => {
              const val = params[key]
              if (index > 0) formData += '&'
              formData += `${key}=${val}`
            })
            ajax = ctx.post(url, formData, { headers })
          } else ajax = ctx.post(url, params, { headers })
          break
        case 'delete':
          ajax = ctx.delete(url, { headers })
          break
        case 'put':
          ajax = ctx.put(url, params, { headers })
          break
        default:
          break
      }

      // 调用 ajax 实例，返回结果
      return new Promise((resolve, reject) => {
        ajax
          .then((res) => {
            const result = res.data
            if (checkSuccess) {
              if (result.success || result.status || result.code === '200') {
                // 数据正常，直接抛出
                resolve(result)
              } else {
                // 状态校验错误
                if (!!errorToast) {
                  LyMessage.error(
                    result.desc ||
                      result.errorInfo ||
                      result.errorMsg ||
                      '服务器异常，请稍后重试'
                  )
                }
                reject(result)
              }
            } else {
              // 通过配置 checkSuccess 直接跳过检查，返回结果
              resolve(result)
            }
          })
          .catch((error) => {
            if (error.response.status === 403) {
              // 返回登录页面
              window.location.href = '/'
            } else {
              reject({
                code: error.response.status,
                data: error,
                msg: '服务器错误',
              })
            }
          })
      })
    }
  }

/**
 * * 创建 axios 实例
 */
const instance = axios.create({
  baseURL: '/',
  timeout: 100000,
})

/**
 * * 创建 API工厂
 */
const createApi = createHttp(instance)
const getModel = createApi('get')
const postModel = createApi('post')
/**
 * * 通过 API工厂 生成装饰器
 */
export const get = getModel() // get 方法，使用标准的 query 传参
export const post = postModel('body') // post 方法，用标准的 JSON 格式
export const postQuery = postModel('query') // post方法，用 JSON 格式，但是服务器是通过 query 接收参数的情况
export const postFormQuery = postModel('form') // post方法，用 from 格式，但是服务器是通过 query 接收参数的情况
export const postFormData = postModel('formData') // post方法，用 from 格式，但是服务器接收参数，并非标准的from格式，也并非query的情况，可以尝试使用这个
