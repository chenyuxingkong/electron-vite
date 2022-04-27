<template>
  <div class="error">
    <div class="error-flex">
      <div class="left">
        <div class="left-item">
          <div class="left-item-animation left-item-num">404</div>
          <div class="left-item-animation left-item-title">
            该功能正在开发中~~
          </div>
          <div class="left-item-animation left-item-msg">
            正在努力开发中。
          </div>
          <div class="left-item-animation left-item-btn">
            <el-button round type="primary" @click="onGoHome">返回</el-button>
          </div>
        </div>
      </div>
      <div class="right">
        <img :src="mei"/>
      </div>
    </div>
  </div>
</template>

<script name="404" setup>
import router from '@/router'
import mei from '@/assets/404_images/404.png'

/**
 * <p>
 * 描述：
 * </p>
 * @author xc
 * @date 2022-04-19 13:58
 */
const onGoHome = () => {
  router.go(-1)
}

</script>

<style scoped>
.error {
  height: 100%;
  background-color: white;
  display: flex;
}

.error-flex {
  margin: auto;
  display: flex;
  height: 350px;
  width: 900px;
}

.left {
  flex: 1;
  height: 100%;
  align-items: center;
  display: flex;
}

.left-item-animation {
  animation-name: error-num;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

.left-item-num {
  color: #d6e0f6;
  font-size: 55px;
}

.left-item-title {
  font-size: 20px;
  color: #333333;
  margin: 15px 0 5px 0;
  animation-delay: 0.1s;
}

.left-item-msg {
  color: #c0bebe;
  font-size: 12px;
  margin-bottom: 30px;
  animation-delay: 0.2s;
}

.left-item-btn {
  animation-delay: 0.2s;
}

.right {
  flex: 1;
  animation-name: error-img;
  animation-duration: 2s;
  animation-fill-mode: forwards;
}

img {
  width: 100%;
  height: 100%;
}
</style>
