const router = [
    {
        path: '/youxi',
        component: () => import('@/views/index.vue'),
        redirect: '/index',
        children: [
            {
                path: '/index',
                meta: {title: '游戏', onRoutes: '/youxi'},
                component: () => import('../../views/game-module/index.vue')
            },
            {
                path: '/lol',
                meta: {title: '召唤师峡谷', onRoutes: '/youxi', lolSocket: true},
                component: () => import('../../views/game-module/lol/LoL.vue')
            },
            {
                path: '/tft',
                meta: {title: '云顶之弈', onRoutes: '/youxi', lolSocket: true},
                component: () => import('../../views/game-module/lol/TFT.vue')
            },
        ]
    },
]
export default router;
