<template>
  <el-container>
    <el-dialog v-model="dialog" title="英雄符文设置" @closed="emit('close')">

    </el-dialog>
  </el-container>
</template>
<script name="HeroRuneConfig" setup>/**
 * <p>
 * 描述：
 * </p>
 * @author xc
 * @date 2022-05-12 20:17
 */
const props = defineProps({
      runeData: {
        type: Array
      }
    })

const dialog = ref(true)
const emit = defineEmits(['close'])

const heroRune = ref({})
onMounted(() => {
  console.log(props.runeData)
})

</script>

<style scoped>

</style>
