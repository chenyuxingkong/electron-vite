<template>
  <el-main>
    <ul :style="{maxHeight: windowSize.h - 100 + 'px'}" class="hero_list">
      <template v-for="item in props.data">
        <li>
          <div class="hero_mask">
            <div class="lol_skin" @click="openSkin(item.alias)">
              打开换肤
            </div>
            <div class="lol_skin" @click="clickToViewHeroDetails">
              查看详情
            </div>
          </div>
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
import {stringIsBlank} from "@/utils/blankUtils.ts";
import {ElMessage, ElMessageBox} from "element-plus";
import {heroPositionChinese, openSkin} from "@/utils/game/lol/lolUtils";

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
const windowSize = computed(() => {
  return store.state.app.windowSize
})

const heroImg = (val) => {
  return `https://game.gtimg.cn/images/lol/act/img/champion/${val}.png`;
}

const clickToViewHeroDetails = () => {
  ElMessageBox.alert('该功能正在制作中', '提示', {}).then(() => {
  }).catch(() => {
  })
}

</script>

<style lang="scss" scoped>
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
    width: 100px;
    height: 120px;
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
    transform: scale(1.2);

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
    line-height: 30px;
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
      line-height: 15px;
      font-size: 12px;
      letter-spacing: -0.9px;
      font-style: normal;
      background: rgb(53, 59, 62);
      padding: 1px 6px 0 4px;
    }
  }


}
</style>
