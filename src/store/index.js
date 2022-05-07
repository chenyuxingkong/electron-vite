import {createStore} from 'vuex'

// 这个文件夹下面的会存放到本地 刷新不会丢失
const localFiles = import.meta.globEager('./modules/localStorage/*.js')

let modules = {}
Object.keys(localFiles).forEach((c) => {
    const module = localFiles[c].default
    const moduleName = c.replace(/^\.\/(.*)\/(.*)\.\w+$/, '$2')
    modules[moduleName] = module
})

export default createStore({
    modules: {
        ...modules,
    },
})
