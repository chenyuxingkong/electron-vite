<template>
  123123
  <router-view v-slot='{ Component }'>
    <transition mode='out-in' name='scale'>
      <keep-alive>
        <component :is='Component'/>
      </keep-alive>
    </transition>
  </router-view>
</template>

<script name="Index" setup>
/**
 * <p>
 * 描述：
 * </p>
 * @author xc
 * @date 2022-05-06 17:06
 */

</script>

<style scoped>

</style>
