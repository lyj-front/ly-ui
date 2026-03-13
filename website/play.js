import { createApp } from 'vue'
import LyUi from 'ly-ui'
import App from './play/index.vue'
import '../packages/theme-chalk/src/index.scss'

const app = createApp(App)
app.use(LyUi)
app.mount('#app')
