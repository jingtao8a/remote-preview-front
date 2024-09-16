import { createApp } from 'vue'
import App from './App.vue'
import Router from './router/index.js'
// 引入组件库的少量全局样式变量
import 'tdesign-mobile-vue/es/style/index.css'
import TDesign from 'tdesign-mobile-vue'
//图标
import './assets/icon/iconfont.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(Router)
app.use(TDesign)
app.use(ElementPlus)

app.mount('#app')
