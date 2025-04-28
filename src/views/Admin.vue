<template>
  <!-- 后台主页 -->
  <n-layout has-sider style="height: 100vh">
    <n-layout-sider collapse-mode="transform" :collapsed-width="0" :width="200" show-trigger="bar"
      content-style="padding: 0px;" bordered :inverted="true">
      <div style="text-align: center;font-size: 16px;line-height: 45px;margin-top:8px">质量分析工具后台系统</div>
      <div style="color:#bbbbbb;text-align: center;margin-top: 8px">欢迎回来:{{ userStore.account }},<a @click="logout"
          style="cursor: pointer">注销</a></div>
      <n-menu :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions"
        :render-label="renderMenuLabel" collapse-mode="width" :inverted="true" v-model:value="selectMenuValue" />
    </n-layout-sider>
    <n-layout>
      <!-- <n-layout-header bordered style="padding: 24px">
        欢迎回来:{{ userStore.account }},<a
          @click="logout"
          style="cursor: pointer"
          >注销</a
        >
      </n-layout-header> -->
      <n-layout-content ref="contentRef" content-style="padding: 24px;" :native-scrollbar="false">
        <RouterView />
      </n-layout-content>
    </n-layout>
  </n-layout>

  <modal-form ref="modalForm"></modal-form>
</template>

<script setup lang="jsx">
import { ref, onMounted, provide, h } from "vue";
import {
  NInput,
  NButton,
  NMenu,
  NLayout,
  NDialogProvider,
  NLayoutSider,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
  NMessageProvider,
  NSwitch,
  NCheckbox,
  NH1,
  NIcon,
} from "naive-ui";
import { useRoute, useRouter, RouterView } from "vue-router";
import { useUserStore } from "@/stores/UserStore";
import axios from "axios";
import {
  GitNetworkSharp,
  BookSharp,
  SettingsSharp,
  Home,
  Navigate,
  Newspaper,
  GridSharp,
} from "@vicons/ionicons5";
import ModalForm from "@/components/ModalForm.vue";
import { adminRouter } from "@/router";

// provide modal form ref to child component
const modalForm = ref(null);
// In child component , you can use Inject to get modal form ref
provide("modalForm", modalForm);

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
//设置没有登录跳转到登录页！！
// if (!userStore.isLogin()) {
//   router.push({ path: "/" });
// }



async function checkToken() {
  let reqData = {};
  let reqParam = { token: userStore.token };
  let urlParam = `?token=${reqParam.token}&`;
  let checkTokenUrl = `/client/checkToken${urlParam}`;
  let result = await axios.get(checkTokenUrl, reqData);
  if (result.data.code != 200) {
    logout();
  }
  console.log(result);
}

onMounted(() => { });

function logout() {
  userStore.clearUserInfo();
  // 刷新
  router.push({ path: "/" });
}

const selectMenuValue = ref(route.path);


const collapsed = ref(false);

const menuOptions = ref(adminRouter);

fillKeyValue(menuOptions.value);
function fillKeyValue(menus) {
  for (let menu of menus) {
    menu["key"] = menu.path;
    if (menu.children && menu.children.length > 0) {
      fillKeyValue(menu.children);
    }
  }
}

function toPage(path) {
  router.push(path);
}

function renderMenuLabel(option) {
  if (option.children && option.children.length > 0) {
  } else {
    if ("path" in option) {
      return (
        <a href="javascript:void(0)" onClick={() => { toPage(option.path) }}>
          {option.name}
        </a>
      );
    }
  }

  return option.name;
}
</script>

<style lang="scss" scoped>
.title {
  padding: 5px;
  font-size: 20px;
  text-align: center
}
</style>
