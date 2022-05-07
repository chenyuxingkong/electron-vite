<template>
  <router-view v-slot='{ Component }'>
    <transition mode='out-in' name='scale'>
      <keep-alive>
        <component :is='Component'/>
      </keep-alive>
    </transition>
  </router-view>
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

onMounted(() => {
  // 获取全部的房间类型
  setCallback('/lol-gameflow/v1/session', function (data) {
    currentRoom(data.data)
  })
})


onActivated(() => {
  // 打开 lol 连接
  openLoLConnection(true)
})

onDeactivated(() => {
  closeLoLWebSocket()
})

</script>

<style scoped>

</style>
