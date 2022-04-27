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
                meta: {title: '英雄联盟', onRoutes: '/youxi'},
                component: () => import('../../views/game-module/LoL.vue')
            },
        ]
    },
]
export default router;
