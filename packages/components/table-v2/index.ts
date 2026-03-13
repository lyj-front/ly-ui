import Table from './src/table.vue'
import TableColumn from './src/tableColumn'

import type { App } from 'vue'
import type { SFCWithInstall } from '@element-plus/utils/types'

Table.install = (app: App): void => {
  // console.log(Table,'Table')
  app.component(Table.name, Table)
  app.component(TableColumn.name, TableColumn)
}

Table.TableColumn = TableColumn

const _Table = Table as any as SFCWithInstall<typeof Table> & {
  TableColumn: typeof TableColumn
}

export default _Table
export const LyTableV2 = _Table
export const LyTableColumnV2 = TableColumn
