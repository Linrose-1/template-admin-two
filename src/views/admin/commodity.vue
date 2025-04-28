<template>
  <n-tabs v-model:value="tabName" type="line" animated>
    <n-tab-pane name="list" tab="列表">
      <!-- 请输入用户id：<input type="text"> <n-button type="info" @click="selectUserData">查询</n-button> -->
      <editor-table :columns="columns" :data="data"></editor-table>
      <n-pagination
        v-model:page="page"
        :page-count="pageCount"
        @update:page="loadCommodityData"
      />
    </n-tab-pane>
    <n-tab-pane name="add" tab="新增">
      <auto-form
        :form-info="addFormInfo"
        v-model:form-data="addFromData"
        labelPlacement="left"
        :labelWidth="140"
      ></auto-form>
    </n-tab-pane>
    <n-tab-pane name="update" tab="修改">
      <auto-form
        :form-info="updateFormInfo"
        v-model:form-data="updateFromData"
        labelPlacement="left"
        :labelWidth="140"
      ></auto-form>
    </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="jsx">
import { ref, h, defineComponent } from "vue";
import { useUserStore } from "@/stores/UserStore";
import AutoTable from "@/components/AutoTable.vue";
import AutoForm from "@/components/AutoForm.vue";
import EditorTable from "@/components/EditorableTable.vue";
import DeleteButton from "@/components/DeleteButton.vue";
import { create, descriptionsDark, NButton, useMessage } from "naive-ui";
import axios from "axios";
const tabName = ref("list");

const page = ref(1);
const pageCount = ref(1);
const message = useMessage();

const columns = ref([
  {
    title: "编号",
    key: "id",
  },
  {
    title: "商品名",
    key: "name",
    
  },
  {
    title: "原价",
    key: "price",
  },
  {
    title: "折扣",
    key: "discount",
  },
  {
    title: "现价",
    key: "nowPrice",
  },
  {
    title: "商品描述",
    key: "description",
  },
  {
    title: "类型",
    key: "type",
    render(row) {
      switch (row.type) {
        case 1:
          return "年卡";
        case 2:
          return "季卡";
        case 3:
          return "月卡";
        case 4:
          return "次卡";

        default:
          break;
      }
    },
  },
  {
    title: "创建时间",
    key: "createTime",
  },
  {
    title: "更新时间",
    key: "updateTime",
  },
  {
    title: "操作",
    key: "actions",
    render(row) {
      return (
        <n-space>
          <DeleteButton
            title="删除"
            comfirm={() => {
              deleteCommodity(row);
            }}
            size="medium"
          ></DeleteButton>
          <n-button
            type="success"
            ghost
            onClick={() => {
              changetabName(row);
            }}
          >
            修改
          </n-button>
        </n-space>
      );
    },
  },
]);

const data = ref([]);
async function loadCommodityData() {
  let reqData = {};
  let reqParam = { page: page.value, size: 10, keyword: "" };
  let urlParam = `?page=${reqParam.page}&size=${reqParam.size}&keyword=${reqParam.keyword}&`;
  let selectPageUrl = `/goods/page${urlParam}`;
  let result = await axios.get(selectPageUrl, reqData);
  console.log(result);
  data.value = result.data.data.list;
  pageCount.value = result.data.data.pager.pageCount;
}
loadCommodityData();
const updaBtn = ref(true)
function changetabName(row) {
  console.log(row);
  tabName.value = "update";
  updateFromData.value.id = row.id;
  updateFromData.value = row;
  updaBtn.value = false
}

const addFromData = ref({
  // id: "",
  name: null,
  type: null,
  price: null,
  nowPrice: null,
  discount: null,
  description: null
});

const addFormInfo = ref([
  { type: "input", label: "商品名", key: "name",required: true, },
  { type: "input", label: "原价", key: "price" ,required: true},
  { type: "input", label: "现价", key: "nowPrice" ,required: true,},
  { type: "input", label: "折扣", key: "discount",required: true },
  { type: "input", label: "商品描述", key: "description" ,required: true},
  {
    type: "select",
    label: "类型",
    key: "type",
    options: [
      { label: "年卡", value: 1 },
      { label: "季卡", value: 2 },
      { label: "月卡", value: 3 },
      { label: "次卡", value: 4 },
    ],
  },
  {
    type: "button",
    label: "提交",
    click: async () => {
      if (!isFormComplete(addFromData.value)) return message.error("请完善信息");
      let reqData = addFromData.value;
      console.log(reqData);
      let createGoodsUrl = `/goods/createGoods`;
      let result = await axios.post(createGoodsUrl, reqData);
      console.log(result);
      if (result.data.code == 200) {
          message.success("添加成功");
          loadCommodityData();
          tabName.value = "list";
          addFromData.value = {};
      }
    },
  },
]);

function isFormComplete(formData) {
  for (const key in formData) {
    if (!formData[key]) {
      return false;
    }
  }
  return true;
}
// async function selectUserData() {
//     let reqData = {};
//     let reqParam = { "id": "1" };
//     let urlParam = `?id=${reqParam.id}&`;
//     let getUserByIdUrl = `/user/findById/{id}${urlParam}`;
//     let result = await axios.get(getUserByIdUrl, reqData);
//     console.log(result);
// }

async function deleteCommodity(row) {
  console.log(row.id);
  let reqData = {};
  let reqParam = { id: row.id };
  let result = await axios.delete(`/goods/delete/${reqParam.id}`, reqData);
  console.log(result);
  if (result.data.code == 200) {
    message.success("删除成功");
    loadCommodityData();
  }
}

const updateFromData = ref({
  name: null,
  type: null,
  price: null,
  nowPrice: null,
  discount: null,
  description: null,
});

const updateFormInfo = ref([
  { type: "input", label: "商品名称", key: "name" ,required: true,},
  { type: "input", label: "原价", key: "price",required: true, },
  { type: "input", label: "折扣", key: "discount",required: true, },
  { type: "input", label: "现价", key: "nowPrice",required: true },
  { type: "input", label: "商品描述", key: "description",required: true },
  {
    type: "select",
    label: "类型",
    key: "type",
    required: true,
    options: [
      { label: "年卡", value: 1 },
      { label: "季卡", value: 2 },
      { label: "月卡", value: 3 },
      { label: "次卡", value: 4 },
    ],
  },
  {
    type: "button",
    label: "修改",
    disabled: updaBtn,
    click: async () => {
      console.log(updateFromData.value);
      let reqData = updateFromData.value;
      let updateUrl = `/goods/update`;
      let result = await axios.put(updateUrl, reqData);
      console.log(result);
      if (result.data.code == 200) {
        message.success("修改成功");
        updaBtn.value = true
        loadCommodityData()
        tabName.value = "list";
        updateFromData.value = {};

      }
    },
  },
]);
</script>

<style scoped lang="scss">
:deep(.n-form-item){
width: 50%
}
</style>
