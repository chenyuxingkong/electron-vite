<template>
  <RightMenu v-model="rightClick" :height="90" :menu="menu" :title="rightClick.data.name" :width="90"
             @itemClick="checked"/>
  <hero-rune-config v-if="runeDiaLog" :data="runeList" @close="runeDiaLog = false"/>
  <el-main style="margin-top: 10px">
    <ul :style="{maxHeight: windowSize.h - 100 + 'px'}" class="hero_list">
      <template v-for="item in props.data">
        <li @contextmenu.prevent="seeDetails(item,$event)">
          <div class="hero_img">
            <div class="hero_position">
              <span>
                <em v-for="(val,key) in item.position">
                  <i>
                   {{ heroPositionChinese(key) }}
                  </i>
                </em>
              </span>
              <img :src="heroImg(item.alias)" class="image"/>
            </div>
          </div>
          <div class="hero_name">
            <p style="font-size: 12px">{{ item.name }}</p>
          </div>
        </li>
      </template>
    </ul>
  </el-main>
</template>

<script name="MainLoLData" setup>
import store from "@/store";
import {heroPositionChinese} from "@/utils/game/lol/lol-utils";
import RightMenu from "@/components/public/RightMenu.vue";
import {openBrowserPage} from "@/utils/public/electron-utils";
import HeroRuneConfig from "@/components/game/lol/HeroRuneConfig.vue";
import {getRuneList} from "@/api/game-mod/lol/lol-qq";

/**
 * <p>
 * 描述：
 * </p>
 * @author xc
 * @date 2022-04-20 10:25
 */
const props = defineProps({
  data: {
    type: Array,
  }
})

const menu = [
  {name: '打开QQ'},
  {name: '打开OPGG'},
  {name: '打开符文'},
]

const rightClick = ref({
  show: false,
  winX: 0,
  winY: 0,
  data: {},
})
const runeDiaLog = ref(false)

const windowSize = computed(() => {
  return store.state.app.windowSize
})

const runeList = ref([])


const heroImg = (val) => {
  return `https://game.gtimg.cn/images/lol/act/img/champion/${val}.png`;
}

const seeDetails = (val, event) => {
  rightClick.value.winX = event.clientX
  rightClick.value.winY = event.clientY
  rightClick.value.show = true
  rightClick.value.data = val
}

const checked = async (item, data) => {
  switch (item) {
    case 0:
      await openBrowserPage(`https://101.qq.com/#/hero-detail?heroid=${data.heroId}`)
      break;
    case 1:
      await openBrowserPage(`https://www.op.gg/champions/${data.alias}`)
      break
    case 2:
      runeDiaLog.value = true
      break;
  }
}

onMounted(async () => {
  runeList.value = await getRuneList()
  // console.log(runeList.value.rune)
})


// 想要父组件调用需要暴露出去
defineExpose({
  seeDetails
})

</script>

<style lang="scss" scoped>
.maskBox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 88888;
  font-size: 0.8rem;

  .open_the_web_page {
    display: flex;
    flex-direction: column-reverse;
    top: 20px;
    text-align: center;
    cursor: pointer;
    z-index: 99999;
    position: fixed;
    box-shadow: 0 2px 4px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
    background: #fff;
    border-radius: 4px;
    padding: 8px 0;
    user-select: none;
    box-sizing: border-box;

    .box {
      display: flex;
      flex-direction: column-reverse;

      span {
        padding: 2px;
      }

      span:hover {
        background: #ecf5ff;
        color: #409eff;
      }
    }
  }
}


.hero_list {
  float: left;
  padding: 0;
  position: relative;
  overflow-x: hidden;

  .hero_mask {
    width: 100px;
    height: 120px;
    border: 1px solid;
    position: absolute;
    z-index: 9999;
    display: none;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .lol_skin {
    line-height: 20px;
    margin-top: 10px;
    color: white;
  }

  .hero_mask div:nth-child(1) {
    border-radius: 5px;
    margin-top: 30px;
    border: 1px solid #409eff;
    background-color: #409eff;
  }

  .hero_mask div:nth-child(2) {
    border-radius: 5px;
    background-color: white;
    color: #000;
    border: 1px solid white;
  }

  .hero_mask div:hover {
    border: 1px solid #b59758;
  }

  li {
    float: left;
    width: 80px;
    height: 100px;
    margin: 10px;
    padding: 5px;
    text-align: center;
    line-height: 15px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border: 1px solid;
    background-color: #111419;
  }

  .hero_img {
    height: 82px;
    position: relative;
    overflow: hidden;
  }

  li:hover {
    cursor: pointer;
    border: 1px solid #b59758;
    transform: scale(1.1);

    .hero_mask {
      display: block;
    }
  }


  .hero_position {
    position: absolute;
    top: .1rem;
  }

  span {
    display: inline-block;
    position: absolute;
    right: 0;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    overflow: hidden;
    object-position: center top;
  }

  .hero_name {
    background-color: #000;
    line-height: 10px;
    color: white;
    display: flex;
    justify-content: center;
    align-content: center;
  }

  em {
    text-align: right;
    display: block;

    i {
      color: rgb(255, 255, 255);
      line-height: 10px;
      font-size: 12px;
      letter-spacing: -0.9px;
      font-style: normal;
      background: rgb(53, 59, 62);
      padding: 1px 6px 0 4px;
    }
  }


}
</style>
