import { defineStore } from "pinia";

export const useUserStore = defineStore("useUserStore", {
  // arrow function recommended for full type inference
  state: () => {
    return {
      account: "",
      pwd: "",
      token : "",
      init: false
    };
  },
  actions: {
    isLogin(){
      if(!this.init){
        const userInfo = localStorage.getItem("userInfo");
        if(userInfo){
         
          this.setUserInfo(JSON.parse(userInfo));
        }
        this.init = true;
      }
      return this.account !== "";
    },
    setUserInfo(userInfo) {
      this.pwd = userInfo.pwd;
      this.account = userInfo.account;
      this.token = userInfo.token;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    clearUserInfo() {
      this.pwd = "";
      this.account = "";
      this.token = "";
      localStorage.removeItem("userInfo");
    },
  },
});
