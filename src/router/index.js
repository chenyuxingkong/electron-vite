import {createRouter, createWebHashHistory} from 'vue-router'
import system from './system/system'
import game from "./system/game";

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
    next()
})

export default router

