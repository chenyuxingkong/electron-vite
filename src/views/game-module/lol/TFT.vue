<template>
  <el-container>
    这里是云顶
  </el-container>
</template>

<script name="TFT" setup>
/**
 * <p>
 * 描述：
 * </p>
 * @author xc
 * @date 2022-05-05 15:10
 */
import {createARoomType} from "@/utils/game/lol/lolUtils";
import {openLoLConnection} from "@/utils/game/lol/riotGames";

onMounted(() => {
  createARoomType()
})

onActivated(() => {
  openLoLConnection(true)
})


</script>

<style scoped>


</style>
