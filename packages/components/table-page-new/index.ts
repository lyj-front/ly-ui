import TablePageNew from './src/table-page.vue'

import type { App } from 'vue'

TablePageNew.install = (app: App): void => {
  app.component(TablePageNew.name, TablePageNew)
}

export default TablePageNew
export const LyTablePageNew = TablePageNew
