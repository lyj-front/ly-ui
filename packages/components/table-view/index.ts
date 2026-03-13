import TableView from './src/TableView.vue'

import type { App } from 'vue'

TableView.install = (app: App): void => {
  app.component(TableView.name, TableView)
}

export default TableView
export const LyTableView = TableView
