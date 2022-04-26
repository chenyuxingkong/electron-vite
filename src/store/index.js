import {createStore} from 'vuex'
import Presistent from './modules/public/persistent'

const debug = process.env.NODE_ENV !== 'production'
// 这个文件夹下面的会存放到本地 刷新不会丢失
const localFiles = import.meta.globEager('./modules/localStorage/*.js')
// 这个文件夹下面的会存放到，session中 用户关闭浏览器就没了
const sessionFiles = import.meta.globEager('./modules/sessionStorage/*.js')

let modules = {}
let local = {}
let session = {}
Object.keys(localFiles).forEach((c) => {
  const module = localFiles[c].default
  const moduleName = c.replace(/^\.\/(.*)\/(.*)\.\w+$/, '$2')
  modules[moduleName] = module
  local[moduleName] = module
})

Object.keys(sessionFiles).forEach((c) => {
  const module = sessionFiles[c].default
  const moduleName = c.replace(/^\.\/(.*)\/(.*)\.\w+$/, '$2')
  modules[moduleName] = module
  session[moduleName] = module
})

const presistent = Presistent({
  key: 'vuex',
  modules,
  modulesKeys: {
    local: Object.keys(local),
    session: Object.keys(session),
  },
})

export default createStore({
  modules: {
    ...modules,
  },
    // 如果想要开启本地缓存，就把下面注释打开
    // strict: debug,
    // plugins: [presistent],
})
