import layout from '../../layout/index.vue'
import {createNameComponent} from "@/router/createNode";

const router = [
    {
        path: '/',
        component: layout,
        redirect: '/home',
        children: [
            {
                //这里是配置404路由的不能用 * 现在必须使用带有自定义正则表达式的参数进行定义
                ///user-:afterUser(.*)这个是会匹配user开头的路由
                path: '/:catchAll(.*)*',
                name: '404',
                meta: {title: '404'},
                component: createNameComponent(() => import('../../views/system/404.vue')),
            },
            {
                path: '/home',
                meta: {title: '首页'},
                component: createNameComponent(() => import('@/views/system/Home.vue')),
            }
        ]

    },

]
export default router;
