import TableConfig from './src/table-config.vue'

import type { App } from 'vue'

TableConfig.install = (app: App): void => {
  app.component(TableConfig.name, TableConfig)
}

export default TableConfig
export const LyTableConfig = TableConfig
