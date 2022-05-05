<template>
  <el-dialog v-model="dialog" title="系统设置" @close="emit('close')">

  </el-dialog>
</template>

<script name="Settings" setup>
/**
 * <p>
 * 描述：
 * </p>
 * @author xc
 * @date 2022-05-05 17:14
 */
const emit = defineEmits(['close'])
const dialog = ref(true)

</script>

<style scoped>

</style>
