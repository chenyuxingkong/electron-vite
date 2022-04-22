<template>
  <div class="header_box">
    <div style="display: flex; padding: 3px">
      <div>
        <el-button :icon="ArrowLeftBold" circle @click="router.go(-1)"></el-button>
      </div>
      &nbsp;&nbsp;&nbsp;
      <div>
        <el-button :icon="ArrowRightBold" circle @click="router.go(1)"></el-button>
      </div>
      <div>
        <el-divider direction="vertical"></el-divider>
      </div>
      <div style="">{{ pageHelp }}</div>
      <!--      <el-page-header :content="pageHelp" class="page_header"-->
      <!--                      @back="router.go(-1)"/>-->
    </div>
    <!--  拖动的地方  -->
    <div class="region"></div>
    <!--  按钮的地方  -->
    <div class="button_box">
      <div title="最小化">
        <el-button :icon="Minus" type="text" @click="minWindow"></el-button>
      </div>
      <div title="退出">
        <el-button :icon="CloseBold" type="text" @click="quitApp"></el-button>
      </div>
    </div>
  </div>
</template>

<script name="Breadcrumb" setup>
import {computed} from "vue";
import router from "../../router";
import {ArrowLeftBold, ArrowRightBold, CloseBold, Minus} from "@element-plus/icons"
import {serverQuit} from "../../api/web-server/web-server";


/**
 * <p>
 * 描述：头部的面包屑
 * </p>
 * @author xc
 * @date 2022-04-12 19:58
 */

const pageHelp = computed(() => {
  return router.currentRoute.value.meta.title
})
let ipcRenderer = require('electron').ipcRenderer;

const minWindow = () => {
  ipcRenderer.send("minWindow")
}

const quitApp = () => {
  serverQuit()
  ipcRenderer.send("quitApp")
}

</script>

<style scoped>
.header_box {
  height: 30px;
  display: flex;
  justify-content: space-between
}

.region {
  -webkit-app-region: drag;
  flex: 1
}

.button_box {
  width: 9%;
  line-height: 30px;
  display: flex;
  justify-content: space-around
}

:deep(.el-button) {
  font-size: 20px
}
</style>
