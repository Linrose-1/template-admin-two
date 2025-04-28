<template>
  <div class="background">
  <div class="login-container">
    <div class="login-item">
      <n-h1 style="margin: 0 auto">质量管理分析工具后台管理系统</n-h1>
    </div>
    <div class="login-item">
      <div>账号：</div>
      <div>
        <n-input
          v-model:value="loginForm.account"
          size="large"
          style="width: 300px"
          placeholder="请输入账号"
        />
      </div>
    </div>
    <div class="login-item">
      <div>密码：</div>
      <div>
        <n-input
          v-model:value="loginForm.password"
          size="large"
          style="width: 300px"
          placeholder="请输入密码"
          type="password"
          @keyup.enter="login"
        />
      </div>
    </div>
    <!-- <div class="login-item">
              <div>记住我：</div>
              <div><n-checkbox v-model:value="loginForm.rememberMe" /></div>
            </div> -->
    <div class="login-item">
      <n-button
        @click="login"
        round
        size="large"
        type="primary"
        style="width: 350px"
        >登录</n-button
      >
    </div>
  </div>
</div>
</template>

<script setup>
import { reactive, ref } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/UserStore";
import { useMessage } from "naive-ui";

const message = useMessage();
const router = useRouter();
const route = useRoute();


// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    if (response.status === 200) {
      return response;
    }
  },
  function (error) {
    message.error(error);
    return Promise.reject(error);
  }
);

const userStore = useUserStore();

if (userStore.isLogin()) {
  router.push({ path: "/admin/" });
}

const loginForm = reactive({
  account: "",
  password: "",
  rememberMe: false,
});

async function login() {
  let reqData =  {pwd: loginForm.password, account: loginForm.account };
  let loginUrl = `/admin/login`;
  let result = await axios.post(loginUrl,reqData);
console.log(result);
  if (result.data.code == 200) {
    userStore.setUserInfo({
      account: loginForm.account,
      token: result.data.data.token,
    });
    router.push({ path: "/admin/" });
    message.success("登录成功");
  } else {
    message.error("账号或密码错误");
  }
}
</script>

<style lang="scss" scoped>
.background {
  width: 100vw;
  height: 100vh;
  padding-top: 250px;
  background-image: url('../assets/bodybg-2.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center center;
  box-sizing: border-box;
}
.login-container {
  width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #cccccc62;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  // margin-top: 100px;
  margin-bottom: 100px;
  // background-color: #fff;
  background-color:rgba(255, 255, 255, 0.3); /* 设置背景透明 */
  box-sizing: border-box;
  font-size: 16px;
  color: #333;
}
.login-item {
  display: flex;
  align-items: center;
  margin: 20px 0px;
  justify-content: center;
}
</style>
