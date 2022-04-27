<template>
  <el-container :style="{height : store.state.app.windowSize.h + 'px'}">
    <el-aside width="64px">
      <CyMenu></CyMenu>
    </el-aside>
    <el-container>
      <el-header class="header"
                 style="height: 30px;margin-bottom: 5px;box-shadow : 0 12px 32px 4px rgba(0, 0, 0, .04), 0 8px 20px rgba(0, 0, 0, .08)">
        <Breadcrumb></Breadcrumb>
      </el-header>
      <el-main class="main">
        <router-view v-slot='{ Component }'>
          <transition mode='out-in' name='fade-transform'>
            <keep-alive>
              <component :is='Component'/>
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script name="index" setup>
import CyMenu from '../layout/menu/menu.vue'
import Breadcrumb from '../layout/header/Breadcrumb.vue'
import store from '../store'
import {computed} from "vue";

/**
 * <p>
 * 描述：首页的页面
 * </p>
 * @author xc
 * @date 2022-04-09 04:08
 */
const isCollapse = computed(() => {
  return store.state.app.isCollapse
})

</script>

<style lang='scss' scoped>
.main {
  .el-container {
    height: 100%;
  }
}

.el-header {
  padding-left: 0;
  padding-right: 0;
}

.el-aside {
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  // 样式过度代码没有这个就会没有动画
  transition: 0.3s;
  background-color: #324157;

  &::-webkit-scrollbar {
    width: 0 !important;
  }
}

.el-main {
  background-color: var(--system-container-background);
  height: 100%;
  padding: 0;
}

.el-main-box {
  width: 100%;
  min-width: 1200px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

@media screen and (max-width: 1000px) {
  .el-aside {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;

    &.hide-aside {
      left: -250px;
    }
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999;
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>
