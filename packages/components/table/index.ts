import { withInstall, withNoopInstall } from '@element-plus/utils/index'
import Table from './src/table.vue'
import TableColumn from './src/tableColumn'
import type { SFCWithInstall } from '@element-plus/utils'

export const LyTable: SFCWithInstall<typeof Table> & {
  TableColumn: typeof TableColumn
} = withInstall(Table, {
  TableColumn,
})
export default LyTable
export const LyTableColumn: SFCWithInstall<typeof TableColumn> =
  withNoopInstall(TableColumn)

export type TableInstance = InstanceType<typeof Table>

export type TableColumnInstance = InstanceType<typeof TableColumn>

export type {
  SummaryMethod,
  Table,
  TableProps,
  TableRefs,
  ColumnCls,
  ColumnStyle,
  CellCls,
  CellStyle,
  TreeNode,
  RenderRowData,
  Sort,
  Filter,
  TableColumnCtx,
} from './src/table/defaults'
