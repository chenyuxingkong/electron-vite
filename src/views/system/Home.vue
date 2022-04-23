<template>
  <el-container>
    <el-button @click="test">测试</el-button>
    听我说👂👂👂谢谢你🙏🙏🙏因为有你👉👉👉温暖了四季🌈🌈🌈谢谢你🙏🙏🙏感谢有你👉👉👉世界更美丽🌏🌏🌏我要谢谢你🙏🙏🙏因为有你👉👉👉爱常在心底💃💃💃谢谢你
    🙏🙏🙏感谢有你🙇‍♂🙇‍♂🙇‍♂把幸福传递
  </el-container>
</template>

<script lang="ts" name="Home" setup>
/**
 * <p>
 * 描述：
 * </p>
 * @author xc
 * @date 2022-04-12 22:17
 */
let ipcRenderer = require('electron').ipcRenderer;

const test = () => {
  ipcRenderer.send("javaStart")
}

</script>

<style scoped>

</style>
