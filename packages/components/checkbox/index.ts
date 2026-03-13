import Checkbox from './src/checkbox.vue'
import CheckboxButton from './src/checkbox-button.vue'
import CheckboxGroup from './src/checkbox-group.vue'

import type { App } from 'vue'
import type { SFCWithInstall } from '@element-plus/utils/types'

Checkbox.install = (app: App): void => {
  app.component(Checkbox.name, Checkbox)
  app.component(CheckboxButton.name, CheckboxButton)
  app.component(CheckboxGroup.name, CheckboxGroup)
}

Checkbox.CheckboxButton = CheckboxButton
Checkbox.CheckboxGroup = CheckboxGroup

const _Checkbox = Checkbox as any as SFCWithInstall<typeof Checkbox> & {
  CheckboxButton: typeof CheckboxButton
  CheckboxGroup: typeof CheckboxGroup
}

export default _Checkbox
export const LyCheckbox = _Checkbox
export const LyCheckboxButton = CheckboxButton
export const LyCheckboxGroup = CheckboxGroup
