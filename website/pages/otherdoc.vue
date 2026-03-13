<template>
  <div class="page-component">
    <ly-scrollbar class="page-component__nav">
      <side-nav :data="navsData[lang]" :base="`/${lang}/otherdoc`" />
    </ly-scrollbar>
    <div class="page-component__content">
      <router-view class="content" />
      <!-- <footer-nav /> -->
    </div>
  </div>
</template>
<script lang="ts">
import bus from '../bus'
import navsData from '../ui.config.json'
import { throttle } from 'throttle-debounce'

export default {
  data() {
    return {
      lang: this.$route.meta.lang,
      navsData,
      componentScrollBar: null,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    document.body.classList.add('is-component')
  },
  unmounted() {
    document.body.classList.remove('is-component')
  },
  beforeUnmount() {},
  methods: {},
}
</script>
<style lang="scss" scoped>
.page-component {
  box-sizing: border-box;
  height: 100%;

  &.page-container {
    /* padding: 40px; */
  }

  .page-component__nav {
    width: 240px;
    position: absolute;
    top: 80px;
    left: 40px;
    bottom: 0;
    transition: padding-top 0.3s;

    ::v-deep(> .el-scrollbar__wrap) {
      height: calc(100% - 50px);
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
    padding-bottom: 0px;
    margin-right: 0px;
    box-sizing: border-box;
    height: calc(100vh - 80px);
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
