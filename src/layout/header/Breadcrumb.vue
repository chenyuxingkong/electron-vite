<template>
  <div class="header_box">
    <div style="display: flex; padding: 3px">
      <div>
        <el-button :icon="ArrowLeftBold" circle class="no_drag" @click="router.go(-1)"></el-button>
      </div>
      &nbsp;&nbsp;&nbsp;
      <div>
        <el-button :icon="ArrowRightBold" circle class="no_drag" @click="router.go(1)"></el-button>
      </div>
      &nbsp;&nbsp;&nbsp;
      <div>
        <el-button :icon="RefreshLeft" circle class="no_drag" @click="refreshPage"></el-button>
      </div>
      &nbsp;&nbsp;&nbsp;
      {{ router.currentRoute.value.meta.title }}
    </div>
    <div class="region">
      <!--   先关闭自动更新   -->
      <!--      <span v-if="appDownloadData.flag" style=" width: 100%;font-size: 12px">-->
      <!--        正在下载更新:-->
      <!--        {{ appDownloadData.transferred }} /  {{ appDownloadData.total }}-->
      <!--        | 每秒:-->
      <!--        {{ appDownloadData.bytesPerSecond }}-->
      <!--      <el-progress :percentage="appDownloadData.percent"/>-->
      <!--      </span>-->
    </div>
    <div style="margin-right: 20px">
      <el-input class="no_drag"></el-input>
    </div>
    <div class="system_icon">
      <div>
        <el-dropdown class="no_drag" @command="receiptsOpts">
          <el-button :icon="Operation" class="no_drag" type="text"></el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="checkForUpdates">检查更新</el-dropdown-item>
              <el-dropdown-item command="settingsDialog" divided>系统设置</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div>
        <el-button :icon="SemiSelect" class="no_drag" type="text" @click="miniWindow"></el-button>
      </div>
      <div>
        <el-button :icon="CloseBold" class="no_drag" type="text" @click="appClose"></el-button>
      </div>
    </div>
  </div>
  <settings v-if="settingsDialog" @close="settingsDialog = false"/>
</template>

<script name="Breadcrumb" setup>
import router from "../../router";
import {ArrowLeftBold, ArrowRightBold, RefreshLeft, SemiSelect, CloseBold, Operation} from "@element-plus/icons"
import logger from "@/utils/logger";
import {ElMessage, ElMessageBox} from "element-plus";
import {convertSize} from '@/utils/bToMb'
import Settings from "@/components/system/Settings";

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
const refreshPage = () => {
  location.reload()
}

const receiptsOpts = (command) => {
  switch (command) {
    case 'checkForUpdates':
      // 开启自动更新
      ipcRenderer.send('check-for-updates')
      break;
    case 'settingsDialog':
      settingsDialog.value = true
      break;
  }
}

const miniWindow = () => {
  ipcRenderer.send('mini-window')
}

const appClose = () => {
  ipcRenderer.send('app-close')
}

const settingsDialog = ref(true)


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

<style lang="scss" scoped>
.header_box {
  height: 30px;
  display: flex;
  -webkit-app-region: drag,
}

:deep(.el-button) {
  font-size: 20px
}

.system_icon {
  display: flex;

  div {
    margin: 2px 5px 2px 5px;
  }
}

.region {
  flex: 1;
  border: 1px #000;
}

.no_drag {
  -webkit-app-region: no-drag,
}


</style>
