import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import naive from "naive-ui";
import axios from "axios";

import App from "./App.vue";
import router from "./router";
import { useUserStore } from "@/stores/UserStore";

// if (import.meta.env.MODE == "development") {
//     axios.defaults.baseURL = "//localhost:7001";
// } else {
//     axios.defaults.baseURL = "//localhost:7001";//生产环境用这个
// }

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const app = createApp(App);
app.use(naive);
app.use(createPinia());
app.use(router);

// axios拦截器,默认添加header
axios.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    if (userStore.isLogin()) {
      config.headers.token = userStore.token;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);



app.mount("#app");
