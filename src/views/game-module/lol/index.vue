<template>
  <el-container>
    <div class="lol-setting" @click="riotSetting">
      <el-icon :size="27">
        <setting/>
      </el-icon>
      <RiotConfig v-if="riotConfigDialog" @close="riotConfigDialog = false"/>
    </div>
    <el-main>
      <router-view v-slot='{ Component }'>
        <transition mode='out-in' name='scale'>
          <keep-alive>
            <component :is='Component'/>
          </keep-alive>
        </transition>
      </router-view>
    </el-main>
  </el-container>
</template>

<script name="index" setup>
/**
 * <p>
 * 描述：
 * </p>
 * @author xc
 * @date 2022-05-07 10:31
 */
import {closeLoLWebSocket, currentRoom, openLoLConnection, setCallback} from "@/utils/game/lol/riot-games";
import RiotConfig from "../../../components/game/lol/RiotConfig";

const riotConfigDialog = ref(false)

const riotSetting = () => {
  riotConfigDialog.value = true
}

onMounted(() => {
  // 获取全部的房间类型
  setCallback('/lol-gameflow/v1/session', function (data) {
    currentRoom(data.data)
  })
  setCallback('message', function (data) {
    // console.log(data)
  })
})

onActivated(() => {
  // 打开 lol 连接
  openLoLConnection(true)
})

onDeactivated(() => {
  // 关闭和lol的连接
  closeLoLWebSocket()
})

</script>

<style lang="scss" scoped>
.lol-setting {
  position: absolute;
  right: 24px;
  white-space: normal;
  word-break: break-all;
  top: 40%;
  z-index: 999;
  cursor: pointer;

  .el-icon {
    border-radius: 4px;
    background-color: #409eff;
    padding: 5px;
    color: white;
  }

  .el-icon:hover {
    box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, .04), 0px 8px 20px rgba(0, 0, 0, .08)
  }


}
</style>
