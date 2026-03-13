import Descriptions from './src/index.vue'
import DescriptionsItem from './src/description-item'

import type { App } from 'vue'
import type { SFCWithInstall } from '@element-plus/utils/types'

Descriptions.install = (app: App): void => {
  app.component(Descriptions.name, Descriptions)
  app.component(LyDescriptionsItem.name, LyDescriptionsItem)
}

Descriptions.DescriptionsItem = DescriptionsItem

const _Descriptions = Descriptions as any as SFCWithInstall<
  typeof Descriptions
> & {
  DescriptionsItem: typeof DescriptionsItem
}

export default _Descriptions
export const LyDescriptions = _Descriptions
export const LyDescriptionsItem = DescriptionsItem
