<template>
  <ly-scrollbar ref="componentScrollBar" class="page-component__scroll">
    <div class="page-container page-component">
      <ly-scrollbar class="page-component__nav">
        <side-nav :data="navsData[lang]" :base="`/${lang}/component`" />
      </ly-scrollbar>
      <div class="page-component__content">
        <div class="content-wrap">
          <router-view class="content" />
        </div>
        <!-- <footer-nav /> -->
      </div>
      <ly-backtop
        v-if="showBackToTop"
        target=".page-component__scroll .el-scrollbar__wrap"
        :right="100"
        :bottom="50"
      />
    </div>
    <search-dialog :visible.sync="showSearchDialog" />
  </ly-scrollbar>
</template>
<script lang="ts">
import bus from '../bus'
import navsData from '../nav.config.json'
import { throttle } from 'throttle-debounce'
import SearchDialog from '../components/search-dialog.vue'

export default {
  components: {
    SearchDialog,
  },
  data() {
    return {
      lang: this.$route.meta.lang,
      navsData,
      showHeader: true,
      scrollTop: 0,
      componentScrollBar: null,
      componentScrollBoxElement: null,
      showSearchDialog: false,
      isRemovingSearchParam: false, // 标记是否正在移除 search 参数
    }
  },
  computed: {
    showBackToTop() {
      return !this.$route.path.match(/backtop/)
    },
  },
  watch: {
    '$route.path': function () {
      // 触发伪滚动条更新
      if (this.componentScrollBox) {
        this.componentScrollBox.scrollTop = 0
        this.$nextTick(() => {
          if (this.componentScrollBar) {
            this.componentScrollBar.update()
          }
        })
      }
      // 如果正在移除参数，不触发检查
      if (this.isRemovingSearchParam) {
        return
      }
      // 延迟检查，确保路由已更新
      this.$nextTick(() => {
        setTimeout(() => {
          this.checkSearchParam()
        }, 100)
      })
    },
    '$route.hash': function () {
      this.$nextTick(() => {
        this.goAnchor()
      })
    },
    '$route.query': {
      handler(newQuery, oldQuery) {
        // 如果正在移除参数，不触发检查，直接返回
        if (this.isRemovingSearchParam) {
          console.log('Skipping checkSearchParam - isRemovingSearchParam is true')
          return
        }
        // 延迟检查，确保查询参数已更新
        this.$nextTick(() => {
          setTimeout(() => {
            this.checkSearchParam()
          }, 50)
        })
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    bus.$on('nav-fade', (val) => {
      this.navFaded = val
    })
  },
  mounted() {
    this.componentScrollBar = this.$refs.componentScrollBar
    this.componentScrollBox = this.componentScrollBar.$el.querySelector(
      '.el-scrollbar__wrap'
    )
    this.throttledScrollHandler = throttle(300, this.handleScroll)
    this.componentScrollBox.addEventListener(
      'scroll',
      this.throttledScrollHandler
    )
    document.body.classList.add('is-component')
    this.addContentObserver()
    this.goAnchor()
    
    // 立即检查一次
    this.checkSearchParam()
    
    // 使用 nextTick 和延迟确保路由已完全初始化
    this.$nextTick(() => {
      // 延迟检查，确保路由查询参数已正确解析
      setTimeout(() => {
        this.checkSearchParam()
      }, 200)
    })
    
    // 再延迟一次，确保 window.open 的场景也能检测到
    setTimeout(() => {
      this.checkSearchParam()
    }, 500)
  },
  unmounted() {
    document.body.classList.remove('is-component')
  },
  beforeUnmount() {
    this.componentScrollBox.removeEventListener(
      'scroll',
      this.throttledScrollHandler
    )
    this.observer.disconnect()
  },
  methods: {
    addContentObserver() {
      this.observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList') {
            this.renderAnchorHref()
            this.goAnchor()
          }
        }
      })
      this.observer.observe(document.querySelector('.content-wrap'), {
        childList: true,
      })
    },
    renderAnchorHref() {
      if (/changelog/g.test(location.href)) return
      const anchors = document.querySelectorAll('h2 a,h3 a,h4 a,h5 a')
      const basePath = location.href.split('#').splice(0, 2).join('#')

      ;[].slice.call(anchors).forEach((a) => {
        const href = a.getAttribute('href')
        if (href.indexOf('#') === 0) {
          a.href = basePath + href
        }
      })
    },

    goAnchor() {
      if (location.href.match(/#/g).length > 1) {
        const anchor = location.href.match(/#[^#]+$/g)
        if (!anchor) return
        const elm = document.querySelector(anchor[0])
        if (!elm) return

        setTimeout(() => {
          this.componentScrollBox.scrollTop = (elm as HTMLElement).offsetTop
        }, 50)
      }
    },

    handleScroll() {
      const scrollTop = this.componentScrollBox.scrollTop
      if (this.showHeader !== this.scrollTop > scrollTop) {
        this.showHeader = this.scrollTop > scrollTop
      }
      if (scrollTop === 0) {
        this.showHeader = true
      }
      if (!this.navFaded) {
        bus.$emit('fade-nav')
      }
      this.scrollTop = scrollTop
    },

    checkSearchParam() {
      // 如果正在移除参数，直接返回，不执行任何操作
      if (this.isRemovingSearchParam) {
        return
      }
      
      // 在 hash 模式下，查询参数可能在 hash 中，需要从 hash 解析
      let searchParam = null
      
      // 方法1: 从路由查询参数读取（Vue Router 解析后的）
      if (this.$route && this.$route.query && this.$route.query.search) {
        searchParam = this.$route.query.search
      }
      
      // 方法2: 从 hash 中解析（hash 模式：/#/path?search=1）
      if (!searchParam && window.location.hash) {
        // 匹配 hash 中的查询参数：/#/path?search=1 或 #/path?search=1
        const hashMatch = window.location.hash.match(/[?&]search=([^&#]*)/)
        if (hashMatch && hashMatch[1]) {
          searchParam = hashMatch[1]
        }
      }
      
      // 方法3: 从完整 URL 中解析（备用方案）
      if (!searchParam) {
        const fullUrl = window.location.href
        const urlMatch = fullUrl.match(/[?&]search=([^&#]*)/)
        if (urlMatch && urlMatch[1]) {
          searchParam = urlMatch[1]
        }
      }
      
      console.log('checkSearchParam - searchParam:', searchParam, 'route.query:', this.$route?.query, 'hash:', window.location.hash, 'isRemoving:', this.isRemovingSearchParam)
      
      if (searchParam === '1' || String(searchParam) === '1') {
        console.log('Opening search dialog')
        // 先设置标志位，防止后续的检查关闭弹框
        this.isRemovingSearchParam = true
        this.showSearchDialog = true
        
        // 延迟移除 URL 参数，确保弹框已经打开并渲染完成
        this.$nextTick(() => {
          setTimeout(() => {
            // 使用 router.replace 移除查询参数
            const currentPath = this.$route.path
            const newQuery = { ...this.$route.query }
            delete newQuery.search
            
            // 如果还有其他查询参数，保留它们
            this.$router.replace({
              path: currentPath,
              query: Object.keys(newQuery).length > 0 ? newQuery : undefined,
            }).then(() => {
              // 延迟重置标志位，确保路由更新完成且弹框已显示
              // 使用较长的延迟，确保所有路由监听器都已执行完毕
              setTimeout(() => {
                this.isRemovingSearchParam = false
                console.log('Search param removed, flag reset')
              }, 500)
            }).catch((err) => {
              console.error('Failed to remove search param:', err)
              // 如果路由替换失败，也重置标志位
              setTimeout(() => {
                this.isRemovingSearchParam = false
              }, 500)
            })
          }, 200)
        })
      } else {
        // 只有在不是正在移除参数时才关闭弹框
        if (!this.isRemovingSearchParam) {
          this.showSearchDialog = false
        } else {
          // 如果正在移除参数，确保弹框保持打开
          this.showSearchDialog = true
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.page-component__scroll {
  height: 100%;

  ::v-deep(> .el-scrollbar__wrap) {
    overflow-x: auto;
  }
}

.page-component {
  box-sizing: border-box;
  height: 100%;

  &.page-container {
    padding: 40px;
  }

  .page-component__nav {
    width: 240px;
    position: absolute;
    top: 0;
    bottom: 0;
    transition: padding-top 0.3s;

    ::v-deep(> .el-scrollbar__wrap) {
      height: 100%;
      overflow-x: auto;
    }

    &.is-extended {
      padding-top: 0;
    }
  }

  .side-nav {
    height: 100%;
    padding-bottom: 50px;
    padding-right: 0;

    & > ul {
      padding-bottom: 50px;
    }
  }

  .page-component__content {
    padding-left: 270px;
    padding-bottom: 100px;
    margin-right: 150px;
    box-sizing: border-box;
  }
  .content-wrap {
    min-height: 500px;
  }

  .content {
    ::v-deep(>) {
      table {
        border-collapse: collapse;
        width: 100%;
        background-color: #fff;
        font-size: 14px;
        margin-bottom: 45px;
        line-height: 1.5em;

        strong {
          font-weight: normal;
        }

        td,
        th {
          border-bottom: 1px solid #dcdfe6;
          padding: 15px;
          max-width: 250px;
        }

        th {
          text-align: left;
          white-space: nowrap;
          color: var(--el-text-color-secondary);
          font-weight: normal;
        }

        td {
          color: var(--el-text-color-regular);
        }

        th:first-child,
        td:first-child {
          padding-left: 10px;
        }
      }

      ul:not(.timeline) {
        margin: 10px 0;
        padding: 0 0 0 20px;
        font-size: 14px;
        color: #5e6d82;
        line-height: 2em;
      }
    }
  }
}

@media (max-width: 1000px) {
  .page-component {
    .page-component__content {
      margin-right: 0;
    }
  }
}

@media (max-width: 768px) {
  .page-component {
    .page-component__nav {
      width: 100%;
      position: static;
      margin-top: 0;
    }
    .side-nav {
      padding-top: 0;
      padding-left: 50px;
    }
    .page-component__content {
      padding-left: 10px;
      padding-right: 10px;
    }
    .content {
      padding-top: 0;
    }
    .content > table {
      overflow: auto;
      display: block;
    }
  }
}
</style>
