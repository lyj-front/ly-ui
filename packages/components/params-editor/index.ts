import ParamsEditor from './src/paramsEditor.vue'

import type { App } from 'vue'

ParamsEditor.install = (app: App): void => {
  app.component(ParamsEditor.name, ParamsEditor)
}

export default ParamsEditor
export const LyParamsEditor = ParamsEditor
