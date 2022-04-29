<script setup>
import store from './store'
import {ElMessageBox} from "element-plus";
import logger from "@/utils/logger";


let ipcRenderer = require('electron').ipcRenderer


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
})

window.onresize = () => {
  store.commit('app/setWindowSize', getWindowSize())
}

ipcRenderer.send('check-for-updates')

let box = null;

ipcRenderer.on('updater-message', (event, args) => {
      if (box === null) {
        box = ElMessageBox.confirm('', '发现可更新数据', {
          type: 'info',
          message: args.releaseNotes,
          dangerouslyUseHTMLString: true
        }).then(() => {
          logger.info("开始更新")
        }).catch(() => {
          logger.info("取消更新")
        })
      }
    }
)

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
