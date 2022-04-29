<script setup>
import store from './store'
import {ElMessage, ElMessageBox} from "element-plus";
import logger from "@/utils/logger";

const {ipcRenderer} = require('electron')

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

window.onerror = function (message, source, lineno, colno, error) {
  console.log(message, source, lineno, colno, error)
  // do something
}

onMounted(() => {
  store.commit("app/setWindowSize", getWindowSize())
})

window.onresize = () => {
  store.commit('app/setWindowSize', getWindowSize())
}

ipcRenderer.send('check-for-updates')

ipcRenderer.on('updater-message', function (event, args) {
  logger.info("前端更新数据")
  ElMessage.success('发现可更新数据')
  ElMessageBox.confirm('', '发现可更新数据', {
    type: 'info',
    message: args.releaseNotes,
    dangerouslyUseHTMLString: true
  }).then(() => {
    logger.info("开始更新")
  }).catch(() => {
    logger.info("取消更新")
  })
})

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
