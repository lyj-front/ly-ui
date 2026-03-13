import Radio from './src/radio.vue'
import RadioButton from './src/radio-button.vue'
import RadioGroup from './src/radio-group.vue'

import type { App } from 'vue'
import type { SFCWithInstall } from '@element-plus/utils/types'

Radio.install = (app: App): void => {
  app.component(Radio.name, Radio)
  app.component(RadioButton.name, RadioButton)
  app.component(RadioGroup.name, RadioGroup)
}

Radio.RadioButton = RadioButton
Radio.RadioGroup = RadioGroup

const _Radio = Radio as any as SFCWithInstall<typeof Radio> & {
  RadioButton: typeof RadioButton
  RadioGroup: typeof RadioGroup
}

export default _Radio
export const LyRadio = _Radio
export const LyRadioGroup = RadioGroup
export const LyRadioButton = RadioButton

export * from './src/token'
