<template>
  <div>
      <h3>基础用法:</h3>
      <auto-form :form-info="formInfo01" v-model:form-data="fromData01" labelPlacement="left" :labelWidth="140"></auto-form>
  </div>
  <div>{{ fromData01 }}</div>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeMount, h, } from "vue";
import { useRoute, useRouter } from "vue-router";
import { NButton, NPopconfirm, useMessage, NSpace } from "naive-ui";
import AutoForm from "@/components/AutoForm.vue";

const fromData01 = ref({
  type: 1,
  onlyLabel: "纯文字",
  data: [
      { type: 1, input: "输入框" },
      { type: 2, input: "输入框" },
  ],
  cas: [1, 3],
  richtext:"test richtext",
  upload: "",
  daterange: [],
  checkbox: [],
  product:"",
  codemirror: 'console.log("打印一句话")',
  fileDialog:[ { "id": "1809481866160508928", "name": "1.png", "status": "finished", "type": "text/plain", "url": "//localhost:7001/public/uploads/20240706/1809481866160508928.png" } ]
})
const formInfo01 = ref([
  { type: "select", label: "选项框1", key: "type", options: [{ label: "选项01", value: 1 }, { label: "选项02", value: 2 }] },
  { type: "label", label: "纯文字", key: "onlyLabel", },
  { type: "textarea", label: "文本框", key: "textarea", options: [{ label: "选项01", value: 1 }, { label: "选项02", value: 2 }], },
  { type: "switch", label: "开关", key: "sw", },
  {
      type: "dynamicInput", label: "动态表单", key: "data", width: "100%",
      table: true, //表格展示形式 
      editroAble: true, //是否可编辑
      editroInfo:['ADD', 'DEL', 'UP', 'DOWN'], //显示的操作按钮
      headerFormInfo: [
          { type: "button", label: "额外按钮", click: () => { console.log("额外按钮") } }
      ],
      formInfo: [
          { type: "select", label: "选项框", key: "type", options: [{ label: "选项01", value: 1 }, { label: "选项02", value: 2 }], },
          { type: "input", label: "输入框", key: "input", width: "500px", },
      ]
  },
  { type: "inputnumber", label: "数字输入框", key: "num", },
  { type: "autoComplete", label: "提示输入框,请输入a", key: "autoComp", options: ["abc", "aaaa"], },
  { type: "multiselect", label: "多选框", key: "mselect", options: [{ label: "选项01", value: 1 }, { label: "选项02", value: 2 }], },
  {
      type: "onecascader", label: "单选-级联选框", key: "ocas", options: [{ label: "选项01", value: 1, children: [{ label: "选项01-01", value: 3 }] }, { label: "选项02", value: 2 }],
      onchange: (selectOptionInfo, form, val) => {
          console.log("onecascader-onchange", selectOptionInfo, form, val)
      }
  },
  { type: "cascader", label: "多选-级联选框", key: "cas", options: [{ label: "选项01", value: 1, children: [{ label: "选项01-01", value: 3 }] }, { label: "选项02", value: 2 }] },
  { type: "upload", label: "上传按钮", key: "upload", },
  { type: "richtext", label: "富文本", key: "richtext", },
  { type: "date", label: "日期", key: "date", },
  { type: "daterange", label: "日期范围", key: "daterange", },
  { type: "checkbox", label: "选项框", key: "checkbox", options: [{ label: "选项01", value: 1 }, { label: "选项02", value: 2 }] },
  { type: "button", label: "按钮(默认样式)", key: "button", click: () => { console.log("点我了...") } },
  {
      type: "buttonGroup", label: "按钮组", key: "buttonGroup", buttons: [
          { type: "button", label: "info", key: "button", style: "info", click: () => { console.log("点我了01...") } },
          { type: "button", label: "default", key: "button", style: "default", click: () => { console.log("点我了02...") } },
          { type: "button", label: "tertiary", key: "button", style: "tertiary", click: () => { console.log("点我了02...") } },
          { type: "button", label: "primary", key: "button", style: "primary", click: () => { console.log("点我了02...") } },
          { type: "button", label: "success", key: "button", style: "success", click: () => { console.log("点我了02...") } },
          { type: "button", label: "warning", key: "button", style: "warning", click: () => { console.log("点我了02...") } },
          { type: "button", label: "error", key: "button", style: "error", click: () => { console.log("点我了02...") } },
          { type: "button", label: "不可点击", key: "button", style: "info", disabled: true, click: () => { console.log("点我了02...") } },
      ]
  },

])
</script>

<style lang="scss" scoped></style>