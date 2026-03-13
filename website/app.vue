<script>
import { defineComponent, h, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { LyScrollbar, LyConfigProvider } from 'ly-ui'
import MainHeader from './components/header'
import zhLocale from '@element-plus/locale/lang/zh-cn'
import enLocale from '@element-plus/locale/lang/en'
import esLocale from '@element-plus/locale/lang/es'
import frLocale from '@element-plus/locale/lang/fr'
import jaLocale from '@element-plus/locale/lang/ja'
import { Language } from './enums/language'

const localeMap = {
  [Language.CN]: zhLocale,
  [Language.ES]: esLocale,
  [Language.FR]: frLocale,
  [Language.JP]: jaLocale,
  [Language.EN]: enLocale,
}

export default defineComponent({
  name: 'App',

  setup() {
    const route = useRoute()

    const lang = computed(() => route.path.split('/')[1] || Language.CN)

    const isComponent = computed(
      () =>
        /^component-/.test(route.name || '') || /^guide-/.test(route.name || '') || /^miniprogram-/.test(route.name || '') ||  /^other-/.test(route.name || '') ||  /^otherdoc-/.test(route.name || '') 
    )

    return {
      lang,
      isComponent,
    }
  },

  render() {
    const notPlay = this.lang !== 'play'

    const notComponent = !this.isComponent

    const mainHeader = notPlay
      ? h(MainHeader, {
          style: 'position: fixed;top: 0;width: 100%;z-index: 2000',
        })
      : null

    const mainFooter = null

    const content = [
      h(
        'div',
        {
          class: 'main-cnt',
        },
        [h(RouterView)]
      ),
      mainFooter,
    ]

    const contentWrapper = notComponent
      ? h(LyScrollbar, null, { default: () => content })
      : content

    return h(
      LyConfigProvider,
      {
        locale: localeMap[this.lang],
      },
      {
        default: () => {
          return h(
            'div',
            {
              id: 'app',
              class: {
                'is-component': this.isComponent,
              },
            },
            [mainHeader, contentWrapper]
          )
        },
      }
    )
  },
})
</script>
