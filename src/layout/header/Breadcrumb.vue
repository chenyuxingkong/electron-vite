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
    </div>
    <div style="flex: 1">
      <span v-if="appDownloadData.flag" style=" width: 100%;font-size: 12px">
        正在下载更新:
        {{ appDownloadData.transferred }} /  {{ appDownloadData.total }}
        | 每秒:
        {{ appDownloadData.bytesPerSecond }}
      <el-progress :percentage="appDownloadData.percent"/>
      </span>
    </div>
    <div style="margin-right: 20px">
      <el-input></el-input>
    </div>
  </div>
</template>

<script name="Breadcrumb" setup>
import router from "../../router";
import {ArrowLeftBold, ArrowRightBold} from "@element-plus/icons"
import logger from "@/utils/logger";
import {ElMessage, ElMessageBox} from "element-plus";
import {convertSize} from '../../utils/bToMb'

const {ipcRenderer} = require('electron')

const appDownloadData = ref({
  total: '',
  delta: '',
  transferred: '',
  percent: '',
  bytesPerSecond: '',
  flag: false,
  updateFailed: false,
})
/**
 * <p>
 * 描述：头部的面包屑
 * </p>
 * @author xc
 * @date 2022-04-12 19:58
 */
// 开启自动更新
ipcRenderer.send('check-for-updates')

let box = null;

ipcRenderer.on('updater-message', (event, args) => {
      if (box === null && !appDownloadData.value.flag) {
        box = ElMessageBox.confirm('', '发现可更新数据', {
          type: 'info',
          message: args.releaseNotes,
          dangerouslyUseHTMLString: true,
          closeOnClickModal: false
        }).then(() => {
          ipcRenderer.send('confirm-download-update')
          box = null
        }).catch(() => {
          logger.info("取消更新")
          box = null
        })
      }
    }
)

ipcRenderer.on('app-download-progress', function (event, args) {
  try {
    appDownloadData.value.flag = true
    appDownloadData.value.total = convertSize(args.total)
    appDownloadData.value.detail = convertSize(args.delta)
    appDownloadData.value.transferred = convertSize(args.transferred)
    let percent = Number(args.percent / 100).toFixed(2)
    if (percent === '1.00') {
      percent = 100
    }
    appDownloadData.value.percent = percent
    appDownloadData.value.bytesPerSecond = convertSize(args.bytesPerSecond)
    logger.info("下载的args", args)
  } catch (e) {
    ElMessage.error(e)
  }
})

ipcRenderer.on("update-err", function (event, args) {
  if (box === null) {
    box = ElMessageBox.alert('更新失败是否要重新更新', '提示').then((res) => {
      appDownloadData.value.flag = false
      ipcRenderer.send('check-for-updates')
      box = null
    }).catch(() => {
      box = null
    })
  }
})

</script>

<style scoped>
.header_box {
  height: 30px;
  display: flex;
}

:deep(.el-button) {
  font-size: 20px
}

</style>
