import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
// vue setup 的糖语法
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import {resolve} from "path";

const pathResolve = (dir) => {
    return resolve(__dirname, '.', dir)
}

const alias = {
    '@': pathResolve('src'),
}
export default defineConfig({
    // 开启 @ 路径 先安装 npm i @types/node -D
    resolve: {
        alias,
        extensions: ['.js', '.vue', '.json'],
    },
    // 正式环境的地址
    base: process.env.ELECTRON === "true" ? './' : "./",
    plugins: [
        VueSetupExtend(),
        // 开启vue
        vue({
            refTransform: true
        }),
        // 按需加载
        AutoImport({
            resolvers: [ElementPlusResolver()],
            dts: 'auto-imports.d.ts',
            imports: ['vue']
        }),
        // 按需加载
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ]
})
