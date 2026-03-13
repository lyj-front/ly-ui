/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

import fs from 'fs'
import { slugify } from 'transliteration'
import fg from 'fast-glob'
import { getMiscRoutesData } from '../website/routes-data'

slugify.config({
  replace: [
    ['.', '-'],
    ['1', 'one'],
    ['2', 'two'],
    ['3', 'three'],
    ['4', 'four'],
    ['5', 'five'],
    ['6', 'six'],
    ['7', 'seven'],
    ['8', 'eight'],
    ['9', 'nine'],
    ['0', 'zero'],
  ],
})

interface Index {
  component: string
  title: string
  anchor: string
  content: string
  sort: number
  path: string
  routePath?: string
  category?: string
}

// 确保输出目录存在
const outputDir = './website/public'
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// 只处理中文 (zh-CN)
const lang = 'zh-CN'
const indexName = 'element-zh'

// 获取路由配置
const routers = getMiscRoutesData('zh-CN')

// 从路由配置中提取文档路径映射
const routePathMap = new Map<string, { path: string; category: string; title: string }>()

routers.forEach((route) => {
  if (route.children) {
    route.children.forEach((child) => {
      // 从路由路径推断文档路径
      const routePath = child.path
      const category = route.path.split('/').pop() || 'component'
      const title = child.meta?.title || child.name || routePath
      
      // 将路由路径映射到文档路径
      routePathMap.set(routePath, {
        path: routePath,
        category,
        title
      })
    })
  }
})

const files = fg.sync(`website/docs/${lang}/*.md`)
let indices: Index[] = []

files.forEach((file) => {
  const regExp = new RegExp(`website\/docs\/${lang}\/(.*).md`)
  const pathContent = file.match(regExp)!
  const path = pathContent[1]
  const index = path.lastIndexOf('/')
  const names = index !== -1 ? path.split('/') : []
  const component = names.length ? names[names.length - 1] : path
  const content = fs.readFileSync(file, 'utf8')
  const matches = content
    .replace(/:::[\s\S]*?:::/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .match(/#{2,4}[^#]*/g)!
    .map((match) =>
      match
        .replace(/\n+/g, '\n')
        .split('\n')
        .filter((part) => !!part)
    )
    .map((match) => {
      const length = match.length
      if (length > 2) {
        const desc = match.slice(1, length).join('')
        return [match[0], desc]
      }
      return match
    })

  let i = 0
  indices = indices.concat(
    matches.map((match) => {
      const title = match[0].replace(/#{2,4}/, '').trim()
      const index = { component, title } as Index
      index.anchor = slugify(title)
      index.content = (match[1] || title).replace(/<[^>]+>/g, '')
      index.path = path
      index.sort = i++
      
      // 尝试从路由映射中找到对应的路由信息
      // 先尝试完整路径匹配，再尝试文件名匹配
      let routeInfo = routePathMap.get(path)
      if (!routeInfo) {
        // 如果完整路径没找到，尝试用文件名匹配
        const fileName = path.split('/').pop() || path
        routeInfo = routePathMap.get(fileName)
      }
      
      if (routeInfo) {
        index.category = routeInfo.category
      }else{
        index.category = 'component'
      }
      
      return index
    })
  )
})

// 为路由配置中的每个路由生成索引条目
routers.forEach((route) => {
  if (route.children) {
    route.children.forEach((child) => {
      const routePath = child.path
      const category = route.path.split('/').pop() || 'component'
      const title = child.meta?.title || child.name || routePath
      
      // 检查是否已经存在该路径的索引
      const existingIndex = indices.find(index => index.path === routePath)
      if (!existingIndex) {
        indices.push({
          component: routePath,
          title: title,
          anchor: slugify(title),
          content: child.meta?.description || title,
          sort: indices.length,
          path: routePath,
          category: category
        })
      }
    })
  }
})

// 将数据保存为JSON文件
const outputPath = `${outputDir}/${indexName}.json`
fs.writeFileSync(outputPath, JSON.stringify(indices, null, 2))
console.log(`已生成 ${outputPath}，共 ${indices.length} 条数据`)

// 输出统计信息
const categoryStats = new Map<string, number>()
indices.forEach(index => {
  const category = index.category || 'unknown'
  categoryStats.set(category, (categoryStats.get(category) || 0) + 1)
})

console.log('分类统计:')
categoryStats.forEach((count, category) => {
  console.log(`  ${category}: ${count} 条`)
})