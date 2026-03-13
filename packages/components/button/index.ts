import { withInstall } from '@element-plus/utils/with-install'
import Button from './src/button.vue'
import ButtonGroup from './src/button-group.vue'

export const LyButton = withInstall(Button, {
  ButtonGroup,
})
export const LyButtonGroup = ButtonGroup
export default LyButton

export * from './src/button'
