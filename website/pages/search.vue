<template>
  <div class="search-page">
    <div class="search-page-container">
      <div class="search-header">
        <h1 class="search-title">文档搜索</h1>
        <ly-input
          ref="searchInput"
          class="search-input"
          placeholder="请输入标题或正文内容检索"
          v-model="query"
          clearable
        ></ly-input>
      </div>
      <div class="search-content" v-loading="loading" element-loading-text="查询中...">
        <div class="search-results" ref="scrollDiv" @scroll="handleScroll">
          <div
            v-if="results && results.length > 0"
            v-for="(item, index) in results"
            :key="index"
            class="result-item"
            @click="handleSelect(item)"
          >
            <div class="result-content">
              <div class="result-title">
                <span class="component-name" v-html="item.highlightedCompo"></span>
                <span class="separator">/</span>
                <span class="title-text" v-html="item.title"></span>
              </div>
              <div class="result-desc" v-html="item.content"></div>
              <div class="result-meta">
                <span class="category-tag">{{ getCategoryName(item.category) }}</span>
              </div>
            </div>
          </div>
          <ly-empty
            v-else-if="!loading && hasSearched"
            style="height: 100%"
            type="nodata"
            :description="emptyText"
          ></ly-empty>
          <div v-else-if="!hasSearched" class="search-placeholder">
            <p>请输入关键词进行搜索</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Language } from '../enums/language'

export default {
  name: 'SearchPage',
  data() {
    return {
      searchData: [],
      query: '',
      results: [],
      loading: false,
      hasSearched: false,
      pageSize: 20,
      currentPage: 1,
      allResults: [],
      debounceTimer: null, // 防抖定时器
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
    emptyText() {
      return this.lang ? this.langs[this.lang].empty : '无匹配结果'
    },
  },
  watch: {
    // 监听 query 变化，实现防抖搜索
    query(newVal) {
      this.handleInput()
    },
  },
  mounted() {
    this.initSearchData()
    // 页面加载后自动聚焦输入框
    this.$nextTick(() => {
      if (this.$refs.searchInput && this.$refs.searchInput.$el) {
        const input = this.$refs.searchInput.$el.querySelector('input')
        if (input) {
          input.focus()
        }
      }
    })
  },
  beforeDestroy() {
    // 清除防抖定时器
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }
  },
  methods: {
    async initSearchData() {
      try {
        const response = await fetch('/lyj-front/ly-ui/element-zh.json')
        if (response.ok) {
          this.searchData = await response.json()
        } else {
          console.error('加载搜索数据失败:', response.statusText)
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

    highlightText(text, query) {
      if (!query || !text) return text
      const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi')
      return text.replace(regex, '<span class="highlight">$1</span>')
    },

    escapeRegex(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    },

    // 输入事件处理，带防抖
    handleInput() {
      // 清除之前的定时器
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer)
      }

      // 如果输入为空，清空结果
      if (!this.query || this.query.trim() === '') {
        this.results = []
        this.hasSearched = false
        this.allResults = []
        this.currentPage = 1
        return
      }

      // 设置防抖，300ms 后执行搜索
      this.debounceTimer = setTimeout(() => {
        this.handleSearch()
      }, 300)
    },

    handleSearch() {
      // 如果查询为空，不执行搜索
      if (!this.query || this.query.trim() === '') {
        this.results = []
        this.hasSearched = false
        this.allResults = []
        this.currentPage = 1
        return
      }

      this.loading = true
      this.hasSearched = true
      this.currentPage = 1
      this.allResults = []
      this.results = []

      const searchQuery = this.query.toLowerCase().trim()
      const matchedResults = []

      this.searchData.forEach((item) => {
        let score = 0
        let matchedFields = []

        if (item.title && item.title.toLowerCase().includes(searchQuery)) {
          score += 10
          matchedFields.push('title')
        }

        if (item.component && item.component.toLowerCase().includes(searchQuery)) {
          score += 8
          matchedFields.push('component')
        }

        if (item.content && item.content.toLowerCase().includes(searchQuery)) {
          score += 5
          matchedFields.push('content')
        }

        if (item.category && item.category.toLowerCase().includes(searchQuery)) {
          score += 3
          matchedFields.push('category')
        }

        if (score > 0) {
          let content = item.content || ''
          if (content.length > 150) {
            const index = content.toLowerCase().indexOf(searchQuery)
            if (index > -1) {
              const start = Math.max(0, index - 50)
              const end = Math.min(content.length, index + searchQuery.length + 50)
              content =
                (start > 0 ? '...' : '') +
                content.slice(start, end) +
                (end < content.length ? '...' : '')
            } else {
              content = content.slice(0, 150) + '...'
            }
          }

          matchedResults.push({
            ...item,
            score,
            matchedFields,
            highlightedCompo: this.highlightText(item.component || '', searchQuery),
            title: this.highlightText(item.title || '', searchQuery),
            content: this.highlightText(content, searchQuery),
          })
        }
      })

      this.allResults = matchedResults.sort((a, b) => b.score - a.score)
      this.loadMoreResults()

      this.loading = false
    },

    loadMoreResults() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      const newResults = this.allResults.slice(start, end)
      this.results = this.results.concat(newResults)
    },

    handleScroll() {
      const div = this.$refs.scrollDiv
      if (
        !this.loading &&
        div &&
        div.scrollTop + div.clientHeight >= div.scrollHeight - 10
      ) {
        if (this.results.length < this.allResults.length) {
          this.currentPage++
          this.loadMoreResults()
        }
      }
    },

    handleSelect(item) {
      if (!item || item.isEmpty) return

      const component = item.component || ''
      const anchor = item.anchor
      const category = item.category || 'component'
     
      const routePath = `/${this.lang}/${category}/${component}`
      if(window.parent !== window.self) {
        let path = this.$router.resolve(`${routePath}${anchor ? `#${anchor}` : ''}`)
        window.parent.open(path.href, '_blank')
      }else{
        this.$router.push(`${routePath}${anchor ? `#${anchor}` : ''}`)
      }
    },

    getCategoryName(category) {
      const categoryMap = {
        component: '组件',
        guide: '指南',
        other: '其他',
        miniprogram: '小程序',
      }
      return categoryMap[category] || category || '组件'
    },
  },
}
</script>

<style lang="scss" scoped>
.search-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  padding: 0;
  margin: 0;
  overflow: hidden;
  z-index: 9999;
}

.search-page-container {
  width: 100%;
  height: 100%;
  margin: 0;
  background-color: #fff;
  border-radius: 0;
  padding: 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.search-title {
  font-size: 24px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 24px;
}

.search-header {
  margin-bottom: 24px;
  flex-shrink: 0;

  .search-input {
    width: 100%;
  }
}

.search-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.search-results {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #fff;
}

.result-item {
  padding: 16px 0;
  border-bottom: 1px solid #ebeef5;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f7fa;
  }

  &:last-child {
    border-bottom: none;
  }
}

.result-content {
  padding: 0 10px;
}

.result-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  line-height: 1.5;
  display: flex;
  align-items: center;

  .component-name {
    color: #409eff;
  }

  .separator {
    margin: 0 8px;
    color: #909399;
  }

  .title-text {
    color: #303133;
  }
}

.result-desc {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.result-meta {
  display: flex;
  align-items: center;

  .category-tag {
    display: inline-block;
    padding: 4px 12px;
    background-color: #ecf5ff;
    color: #409eff;
    border-radius: 4px;
    font-size: 12px;
  }
}

.search-placeholder {
  height: 100%;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 16px;
}

::v-deep(.highlight) {
  color: #409eff;
  font-weight: bold;
  background-color: #ecf5ff;
  padding: 0 2px;
}
</style>

