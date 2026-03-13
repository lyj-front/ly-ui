import type { PropType } from 'vue'
import type { Store } from '../store'
import type {
  ColumnCls,
  ColumnStyle,
  DefaultRow,
  Table,
} from '../table/defaults'

interface TableBodyProps<T> {
  store: Store<T>
  stripe?: boolean
  clickdelay?:boolean
  context: Table<T>
  rowClassName: ColumnCls<T>
  rowStyle: ColumnStyle<T>
  fixed: string
  highlight: boolean
  tooltipEffect: string,
  rowHeight:Number,
  columnWidth:Number,
  bodyWidth:String
}

const defaultProps = {
  store: {
    required: true,
    type: Object as PropType<TableBodyProps<DefaultRow>['store']>,
  },
  stripe: Boolean,
  clickdelay:{
    type:Boolean,
    default:false,
  },
  tooltipEffect: String,
  context: {
    default: () => ({}),
    type: Object as PropType<TableBodyProps<DefaultRow>['context']>,
  },
  rowClassName: [String, Function] as PropType<
    TableBodyProps<DefaultRow>['rowClassName']
  >,
  rowStyle: [Object, Function] as PropType<
    TableBodyProps<DefaultRow>['rowStyle']
  >,
  fixed: {
    type: String,
    default: '',
  },
  highlight: Boolean,
  virtualScroll: Boolean,
  rowHeight: Number,
  columnWidth:Number,
  bodyWidth:String
}

export { TableBodyProps }
export default defaultProps
