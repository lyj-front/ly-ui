import TableViewDialog from './src/table-view-dialog.vue'

import type { App } from 'vue'

TableViewDialog.install = (app: App): void => {
  app.component(TableViewDialog.name, TableViewDialog)
}
export default TableViewDialog
export const LyTableViewDialog = TableViewDialog
