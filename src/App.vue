<script setup>
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
import { zhCN,dateZhCN } from "naive-ui";
</script>

<template>
  <n-loading-bar-provider>
    <n-dialog-provider>
      <n-message-provider>
        <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
          <RouterView />
        </n-config-provider>
      </n-message-provider>
    </n-dialog-provider>
  </n-loading-bar-provider>
</template>

<style scoped></style>
