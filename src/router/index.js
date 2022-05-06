import {createRouter, createWebHashHistory} from 'vue-router'
import system from './system/system'
import game from "./system/game";
import {closeLoLWebSocket} from "@/utils/game/lol/riotGames";

let routes = []
routes = routes.concat(system, game)


export const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    // 如果路由 不在这两个 页面就管理连接
    if (!to.meta.lolSocket) {
        closeLoLWebSocket()
    }
    next()
})

export default router

