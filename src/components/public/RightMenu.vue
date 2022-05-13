<template>
  <div v-show="props.modelValue.show">
    <div
        :style="{width: props.width + 'px',height: props.height + 'px',top:props.modelValue.winY + 'px',left: props.modelValue.winX+'px'}"
        class="box">
      <div>
        <div class="box_title">
          {{ props.title }}
        </div>
        <div v-for="(item,index) in props.menu" :key="index" class="box_item">
              <span @click="checked(index)">
                {{ item.name }}
              </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script name="RightMenu" setup>
const props = defineProps({
  modelValue: {
    type: Object,
    default: {
      show: false,
      winX: 0,
      winY: 0,
      data: {}
    }
  },
  menu: {
    type: Array,
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  },
  title: {
    type: String
  }
})

const emit = defineEmits(['itemClick'])

const close = () => {
  props.modelValue.show = false
}

const checked = (item) => {
  emit('itemClick', item, props.modelValue.data)
}

onUpdated(async () => {
  const {innerWidth: windowWidth, innerHeight: windowHeight} = window;
  await nextTick();
  if (props.modelValue.winX + props.width > innerWidth) {
    props.modelValue.winX = props.modelValue.winX - props.width
  }
  if (props.modelValue.winY + props.height > innerHeight) {
    props.modelValue.winY = props.modelValue.winY - props.height
  }
  if (props.modelValue.show) {
    window.removeEventListener('click', close);
    window.addEventListener("click", close);
  } else {
    window.removeEventListener('click', close);
  }
})

</script>

<style lang="scss" scoped>
.box {
  position: fixed;
  z-index: 88888;
  font-size: 0.8rem;
  display: flex;
  flex-direction: column-reverse;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
  background: #fff;
  border-radius: 4px;
  padding: 8px 0;

  .box_title {
    margin: 0;
    padding: 0;
    background-color: #938a8abd;
    color: white;
  }

  div {
    padding: 4px;
  }

  .box_item:hover {
    background: #ecf5ff;
    color: #409eff;
  }
}


</style>