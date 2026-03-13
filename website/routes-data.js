// 路由数据文件，只包含纯数据，不包含任何前端依赖
// 专门用于 Node 脚本和构建工具

export const getMiscRoutesData = function (lang) {
  const resourceRoute = {
    path: `/${lang}/resource`, // 资源
    meta: { lang },
    name: 'resource' + lang,
  }

  const indexRoute = {
    path: `/${lang}`, // 首页
    meta: { lang },
    name: 'home' + lang,
  }

  const otherRoute = {
    path: `/${lang}/other`, // PC端其他组件
    redirect: `/${lang}/other/rich-text`,
    children: [
      {
        path: 'rich-text',
        name: 'other-rich-text' + lang,
        meta: { lang },
      },
      {
        path: 'lbg-upload',
        name: 'other-lbg-upload' + lang,
        meta: { lang },
      },
      {
        path: 'set-poster',
        name: 'other-set-poster' + lang,
        meta: { lang },
      },
      {
        path: 'lyj-datepicker',
        name: 'other-lyj-datepicker' + lang,
        meta: { lang },
      },
      {
        path: 'lyj-xlsx',
        name: 'other-lyj-xlsx' + lang,
        meta: { lang },
      },
      {
        path: 'lyj-oa',
        name: 'other-lyj-oa' + lang,
        meta: { lang },
      },
      {
        path: 'lyj-refresh',
        name: 'other-lyj-refresh' + lang,
        meta: { lang },
      },
      {
        path: 'wx-canvas-img',
        name: 'other-wx-canvas-img' + lang,
        meta: { lang },
      },
      {
        path: 'ad-dialog-doc',
        name: 'other-ad-dialog-doc' + lang,
        meta: { lang },
      },
      {
        path: 'pdf-img-preview',
        name: 'other-pdf-img-preview' + lang,
        meta: { lang },
      },
      {
        path: 'lazy-img-plugin',
        name: 'other-lazy-img-plugin' + lang,
        meta: { lang },
      },
      {
        path: 'lyj-public-sdk',
        name: 'other-lyj-public-sdk' + lang,
        meta: { lang },
      },
      {
        path: 'pdf-img-convert',
        name: 'other-pdf-img-convert' + lang,
        meta: { lang },
      },
      {
        path: 'evaluate',
        name: 'other-evaluate' + lang,
        meta: { lang },
      },
    ],
  }

  return [resourceRoute, indexRoute, otherRoute]
} 