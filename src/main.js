import {createApp} from 'vue'
import App from './App.vue'
// 安装 element-plus 的样式
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import router from "./router";
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import store from './store'
import '../src/icons/iconfont.css'
import * as Icons from '@element-plus/icons'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(ElementPlus, {locale: zhCn, size: 'small'})
app.mount('#app')


// 注册全局组件
for (const name in Icons) {
    app.component(name, (Icons)[name])
}
