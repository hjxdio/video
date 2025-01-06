import { createApp, type App as VueApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'vfonts/FiraCode.css'
import '@/assets/common.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import piniaPersist from "pinia-plugin-persist"
const pinia = createPinia()
pinia.use(piniaPersist)
const app: VueApp = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(pinia)
app.use(router)
app.mount('#app')
