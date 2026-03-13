import { buildProps } from '@element-plus/utils'
import type { ExtractPropTypes } from 'vue'
import type Bar from './bar.vue'

export const barProps = buildProps({
  always: {
    type: Boolean,
    default: true,
  },
  minSize: {
    type: Number,
    required: true,
  },
  scrollBarPosition:{
    type:Number,
  },
  scrollBarFixed:{
    type:Boolean,
    default:false
  }

} as const)
export type BarProps = ExtractPropTypes<typeof barProps>

export type BarInstance = InstanceType<typeof Bar>
