import Layout from '@/layout/index.vue'
import {createNameComponent} from "@/router/createNode";

const router = [
    {
        path: '/youxi',
        component: Layout,
        redirect: '/index',
        children: [
            {
                path: 'index',
                meta: {title: '游戏', onRoutes: '/youxi'},
                component: createNameComponent(() => import('../../views/game-module/index.vue'))
            },
            {
                path: 'riot',
                component: createNameComponent(() => import('@/views/game-module/lol/index.vue')),
                children: [
                    {
                        path: 'lol',
                        meta: {title: '召唤师峡谷', onRoutes: '/youxi', lolSocket: true},
                        component: createNameComponent(() => import('../../views/game-module/lol/LoL.vue'))
                    },
                    {
                        path: 'tft',
                        meta: {title: '云顶之弈', onRoutes: '/youxi', lolSocket: true},
                        component: createNameComponent(() => import('../../views/game-module/lol/TFT.vue'))
                    },
                    {
                        path: 'heroDetails',
                        name: 'heroDetails',
                        meta: {title: '云顶之弈', onRoutes: '/youxi', lolSocket: true},
                        component: createNameComponent(() => import('../../views/game-module/lol/HeroDetails.vue'))
                    },
                ]
            },
        ]
    },
]
export default router;
