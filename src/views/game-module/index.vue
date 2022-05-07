<template>
  <el-container>
    <el-col v-for="(item,index) in gameData" :key="item.path" :offset="1" :span="4">
      <el-card :body-style="{ padding: '0px' }" shadow="hover">
        <img :src="item.img" class="image">
        <div style="padding: 14px">
          <span>{{ item.title }}</span>
          <div class="bottom">
            <el-button size="default" @click="router.push(item.path)">打开</el-button>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-container>
</template>

<script name="index" setup>
/**
 * <p>
 * 描述：
 * </p>
 * @author xc
 * @date 2022-04-18 15:56
 */
import {gameData} from "@/data/game";
import router from '../../router';

onActivated(() => {
  // if (gameData.length === 1) {
  //   router.push(gameData[0].path)
  // }
})

</script>

<style scoped>
.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.image {
  display: block;
  width: 100%;
}
</style>
