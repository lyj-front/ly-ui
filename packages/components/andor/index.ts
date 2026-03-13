import AndOr from './src/andor.vue'

import type { App } from 'vue'

AndOr.install = (app: App): void => {
  app.component(AndOr.name, AndOr)
}

export default AndOr
export const LyAndOr = AndOr
