<template>
  <ly-autocomplete
    v-model="query"
    size="small"
    :popper-class="`local-search${isEmpty ? ' is-empty' : ''}`"
    :fetch-suggestions="querySearch"
    :placeholder="placeholder"
    :trigger-on-focus="false"
    highlight-first-item
    @select="handleSelect"
  >
    <template #default="props">
      <p v-if="props && props.item.title" class="local-search-title">
        <span v-html="props.item.highlightedCompo"></span>
        <span class="local-search-separator"></span>
        <span v-html="props.item.title"></span>
      </p>
      <p
        v-if="props && props.item.content"
        class="local-search-content"
        v-html="props.item.content"
      ></p>
      <p v-if="props && props.item.isEmpty" class="local-search-empty">
        {{ emptyText }}
      </p>
    </template>
  </ly-autocomplete>
</template>

<script>
import { Language } from '../enums/language'

export default {
  data() {
    return {
      searchData: [],
      query: '',
      isEmpty: false,
      langs: {
        [Language.CN]: {
          search: '搜索文档',
          empty: '无匹配结果',
        },
      },
    }
  },

  computed: {
    lang() {
      return this.$route.meta.lang
    },

    placeholder() {
      return this.lang ? this.langs[this.lang].search : ''
    },

    emptyText() {
      return this.lang ? this.langs[this.lang].empty : ''
    },
  },

  mounted() {
    this.initSearchData()
  },

  methods: {
    async initSearchData() {
      try {
        // 动态加载 JSON 数据（从 public 目录）
        // 生产环境和开发环境都使用相同的 publicPath
        const response = await fetch('/lyj-front/ly-ui/element-zh.json')
        if (response.ok) {
          this.searchData = await response.json()
          // console.log(`搜索数据加载成功，共 ${this.searchData.length} 条记录`)
        } else {
          console.error('加载搜索数据失败:', response.statusText)
          // 开发环境降级方案：尝试从根路径加载
          if (process.env.NODE_ENV !== 'production') {
            const fallbackResponse = await fetch('/element-zh.json')
            if (fallbackResponse.ok) {
              this.searchData = await fallbackResponse.json()
              console.log('使用降级路径加载搜索数据成功')
            }
          }
        }
      } catch (error) {
        console.error('加载搜索数据时出错:', error)
      }
    },

    // 高亮匹配的文本
    highlightText(text, query) {
      if (!query) return text
      const regex = new RegExp(`(${query})`, 'gi')
      return text.replace(regex, '<span class="local-highlight">$1</span>')
    },

    // 本地搜索逻辑
    querySearch(query, cb) {
      if (!query || query.trim() === '') {
        cb([])
        return
      }

      const searchQuery = query.toLowerCase().trim()
      const results = []

      // 遍历搜索数据
      this.searchData.forEach((item) => {
        let score = 0
        let matchedFields = []

        // 搜索标题
        if (item.title && item.title.toLowerCase().includes(searchQuery)) {
          score += 10
          matchedFields.push('title')
        }

        // 搜索组件名
        if (item.component && item.component.toLowerCase().includes(searchQuery)) {
          score += 8
          matchedFields.push('component')
        }

        // 搜索内容
        if (item.content && item.content.toLowerCase().includes(searchQuery)) {
          score += 5
          matchedFields.push('content')
        }

        // 搜索分类
        if (item.category && item.category.toLowerCase().includes(searchQuery)) {
          score += 3
          matchedFields.push('category')
        }

        // 如果有匹配，添加到结果中
        if (score > 0) {
          let content = item.content || ''
          // 限制内容长度
          if (content.length > 100) {
            const index = content.toLowerCase().indexOf(searchQuery)
            if (index > -1) {
              const start = Math.max(0, index - 30)
              const end = Math.min(content.length, index + searchQuery.length + 30)
              content = (start > 0 ? '...' : '') + content.slice(start, end) + (end < content.length ? '...' : '')
            } else {
              content = content.slice(0, 100) + '...'
            }
          }

          results.push({
            ...item,
            score,
            matchedFields,
            highlightedCompo: this.highlightText(item.component || '', searchQuery),
            title: this.highlightText(item.title || '', searchQuery),
            content: this.highlightText(content, searchQuery),
          })
        }
      })

      // 按分数排序并限制结果数量
      const sortedResults = results
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)

      if (sortedResults.length > 0) {
        this.isEmpty = false
        cb(sortedResults)
      } else {
        this.isEmpty = true
        cb([{ isEmpty: true }])
      }
    },

    handleSelect(val) {
      if (val.isEmpty) return
      
      const component = val.component || ''
      const anchor = val.anchor
      const category = val.category
      
      // 根据分类构建不同的路由
      const routePath = `/${this.lang}/${category}/${component}`
      
      this.$router.push(`${routePath}${anchor ? `#${anchor}` : ''}`)
    },
  },
}
</script>
<style lang="scss">
.local-search {
  width: 450px !important;
  max-width: 450px !important;

  .el-autocomplete-suggestion {
    width: 450px !important;
  }

  &.is-empty {
    .el-autocomplete-suggestion__list {
      padding-bottom: 0;
    }
  }

  .el-autocomplete-suggestion__list {
    position: static !important;
  }

  li {
    border-bottom: solid 1px var(--el-border-color-base);

    &:last-child {
      border-bottom: none;
    }
  }

  .local-highlight {
    color: #409eff;
    font-weight: bold;
  }

  .local-search-title {
    font-size: 14px;
    margin: 6px 0;
    line-height: 1.8;
  }

  .local-search-separator {
    padding: 0 6px;
  }

  .local-search-content {
    font-size: 12px;
    margin: 6px 0;
    line-height: 2.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .local-search-empty {
    margin: 5px 0;
    text-align: center;
    color: var(--el-text-color-secondary);
  }
}
</style>
