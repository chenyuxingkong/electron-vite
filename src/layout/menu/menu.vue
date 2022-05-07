<template>
  <div>
    <div class="logo_box">
      <img :src="logo">
    </div>
    <el-menu
        :collapse='true'
        :default-active='onRoutes'
        :unique-opened='true'
        active-text-color='#20a0ff'
        background-color='#324157'
        router
        style='border: 1px solid #324157'
        text-color='#eeeeee'
        unique-opened
    >
      <template v-for='item in menuData'>
        <template v-if='item.children && item.children.length > 0'>
          <el-sub-menu :key='item.path' :index='item.path'>
            <template #title>
              <i :class="['iconfont','icon-' + item.icon]"></i>&nbsp;
              <span>{{ item.name }}</span>
            </template>
            <template v-for='subItem in item.children'>
              <el-sub-menu
                  v-if='subItem.children'
                  :key='subItem.path'
                  :index='subItem.path'
              >
                <template #title>
                  <i :class="['iconfont','icon-' + subItem.icon]"></i>&nbsp;
                  <span>{{ subItem.name }}</span>
                </template>
                <el-menu-item
                    v-for='(threeItem, i) in subItem.children'
                    :key='i'
                    :index='threeItem.path'
                >
                  <template #title>
                    <i :class="['iconfont','icon-' + threeItem.icon]"></i>&nbsp;
                    <span>{{ threeItem.name }}</span>
                  </template>
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :key='subItem.path' :index='subItem.path'>
                <template #title>
                  <i :class="['iconfont','icon-' + subItem.icon]"></i>&nbsp;
                  <span>{{ subItem.name }}</span>
                </template>
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :key='item.path' :index='item.path'>
            <i :class="['iconfont', 'icon-' +  item.icon]"></i>&nbsp;
            <template #title>
              <span>{{ item.name }}</span>
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import {menuData} from "@/data/menu-data";
import router from '@/router';
import store from '@/store'
import logo from '@/assets/img/logo.png'

/**
 * <p>
 * 描述：
 * </p>
 * @author xc
 * @date 2022-04-12 17:41
 */

const onRoutes = computed(() => {
  if (router.currentRoute.value.meta.onRoutes) {
    return router.currentRoute.value.meta.onRoutes
  }
  return router.currentRoute.value.path
})
</script>

<style lang="scss" scoped>
.logo_box {
  display: flex;
  justify-content: center;
  align-content: center;
  background-color: white;

  img {
    width: 40px;
    margin: 10px
  }
}

</style>
