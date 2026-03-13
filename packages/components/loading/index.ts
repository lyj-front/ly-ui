import Loading from './src'
import vLoading from './src/directive'

import type { App } from 'vue'

// installer and everything in all
const LyLoading = {
  install(app: App) {
    app.directive('loading', vLoading)
    app.config.globalProperties.$loading = Loading
  },
  directive: vLoading,
  service: Loading,
}

export default LyLoading

export { LyLoading }

export const LyLoadingDirective = vLoading
export const LyLoadingService = Loading

export * from './src/loading.type'
