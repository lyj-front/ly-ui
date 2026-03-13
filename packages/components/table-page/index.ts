import TablePage from './src/table-page.vue'

import type { App } from 'vue'

TablePage.install = (app: App): void => {
  app.component(TablePage.name, TablePage)
}

export default TablePage
export const LyTablePage = TablePage
