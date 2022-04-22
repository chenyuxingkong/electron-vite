<script setup>
import store from './store'
import {closeWebSocket, initWebSocket} from "@/utils/websocket";

/**
 * 获取窗口大小
 */
function getWindowSize() {
  const w = window.innerWidth
  const h = window.innerHeight
  const width = w + 'px'
  const height = h + 'px'
  return {w, h, width, height}
}

onMounted(() => {
  store.commit("app/setWindowSize", getWindowSize())
  closeWebSocket()
  initWebSocket()
})

window.onresize = () => {
  store.commit('app/setWindowSize', getWindowSize())
}


</script>

<template>
  <router-view/>
</template>

<style>
* {
  padding: 0;
  margin: 0;
}
</style>
<style lang="scss" scoped>
@import "assets/css/index.scss";
</style>
