import {createStore} from 'vuex'
import Presistent from "@/store/modules/public/persistent";

const appStore = import.meta.globEager('./modules/app-store/*.js')
const localFiles = import.meta.globEager('./modules/localStorage/*.js')

let modules = {}
let local = {}
Object.keys(localFiles).forEach((c) => {
    const module = localFiles[c].default
    const moduleName = c.replace(/^\.\/(.*)\/(.*)\.\w+$/, '$2')
    modules[moduleName] = module
    local[moduleName] = module
})

Object.keys(appStore).forEach((c) => {
    const module = appStore[c].default
    const moduleName = c.replace(/^\.\/(.*)\/(.*)\.\w+$/, '$2')
    modules[moduleName] = module
})

const presistent = Presistent({
    modules,
    modulesKeys: {
        local: Object.keys(local)
    }
})

export default createStore({
    modules: {
        ...modules,
    },
    strict: false,
    plugins: [presistent]
})
