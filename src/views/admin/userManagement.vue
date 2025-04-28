<template>
  <n-tabs v-model:value="tabName" type="line" animated>
    <n-tab-pane name="list" tab="用户列表">
      <auto-form
        :inline="true"
        :form-info="searchFormInfo"
        :form-data="keyword"
      ></auto-form>
      <editor-table :columns="columns" :data="data"></editor-table>
      <n-pagination
        v-model:page="page"
        :page-count="pageCount"
        @update:page="loadUserData"
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
import { NButton, useMessage } from "naive-ui";
import axios from "axios";
const tabName = ref("list");

const page = ref(1);
const pageCount = ref(1);
const message = useMessage();
const columns = ref([
  // {
  //     title: "编号",
  //     key: "id",
  // },
  {
    title: "用户名",
    key: "username",
  },
  {
    title: "手机号",
    key: "phone",
  },
  {
    title: "性别",
    key: "gender",
    render(row) {
      switch (row.gender) {
        case 0:
          return "男";
        case 1:
          return "女";
        default:
          break;
      }
    },
  },
  {
    title: "邮箱",
    key: "email",
  },
  {
    title: "行业",
    key: "industry",
  },
  {
    title: "单位名称",
    key: "organizationName",
  },
  {
    title: "注册时间",
    key: "createTime",
  },
  {
    title: "使用套餐",
    key: "goodsType",
    render(row) {
      switch (row.goodsType) {
        case 1:
          return "年卡";
        case 2:
          return "季卡";
        case 3:
          return "月卡";
        default:
        break;
      }
    },
  },
  {
    title: "有效期",
    key: "vipExp",
  },
  {
    title: "审核通过",
    key: "verified",
    render(row) {
      switch (row.verified) {
        case 1:
          return <n-tag type="success"> 是 </n-tag>;
        case 0:
          return <n-tag type="error"> 否 </n-tag>;

        default:
          break;
      }
    },
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
              deleteAdmin(row);
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
            审核
          </n-button>
        </n-space>
      );
    },
  },
]);

const keyword = ref({
  keyword: "",
});
const searchFormInfo = ref([
  { type: "input", label: "查询用户", key: "keyword", onEnter: "查询",width: "500px", },
  {
    type: "button",
    label: "查询",
    click: (item, formData) => {
      loadUserData();
    },
  },
]);

function changetabName(row) {
  console.log(row,'5656565');
  tabName.value = "update";
  // updateFromData.value.id = row.id;
  if (row.vipExp) {
    row.vipExp = new Date(row.vipExp).getTime();;
  }
 
  updateFromData.value = row;
  updaBtn.value = false
}

const data = ref([]);
async function loadUserData() {
  let reqData = {};
  let reqParam = { page: page.value, size: 10, keyword:  keyword.value.keyword };
  let urlParam = `?page=${reqParam.page}&size=${reqParam.size}&keyword=${reqParam.keyword}`;
  let selectPageUrl = `/user/page${urlParam}`;
  let result = await axios.get(selectPageUrl, reqData);
  console.log(result);
  data.value = result.data.data.list;
  pageCount.value = result.data.data.pager.pageCount;
}
loadUserData();

const updaBtn = ref(true);
const updateFromData = ref({
  id: null,
  username: null,
  password: null,
  phone: null,
  email: null,
  gender: null,
  industry: null,
  organizationName: null,
  salt: "",
  verified: null,
  lastIp: null,
  goodsType: null,
  loginExp: null,
  vipExp: null,
  version: 0,
});

const updateFormInfo = ref([
  { type: "input", label: "用户名", key: "username", width: "500px" },
  // { type: "input", label: "密码", key: "password", width: "500px" },
  { type: "input", label: "电话", key: "phone", width: "500px" },
  { type: "input", label: "邮箱", key: "email", width: "500px" },
  {
    type: "select",
    label: "性别",
    key: "gender",
    width: "500px",
    options: [
      { label: "男", value: 0 },
      { label: "女", value: 1 },
    ],
  },
  { type: "input", label: "行业", key: "industry", width: "500px" },
  { type: "input", label: "组织名称", key: "organizationName", width: "500px" },
  { type: "select", label: "套餐类型", key: "goodsType", options: [
      { label: "年卡", value: 1 },
      { label: "季卡", value: 2 },
      { label: "月卡", value: 3 },
    ],},
  { type: "date", label: "套餐过期时间", key: "vipExp", },
  {
    type: "select",
    label: "审核是否通过",
    key: "verified",
    options: [
      { label: "是", value: 1 },
      { label: "否", value: 0 },
    ],
  },
  {
    type: "button",
    label: "修改",
    disabled: updaBtn,
    click: async () => {
      // if (!isFormComplete(updateFromData.value)) return message.error("请完善信息");
      console.log(updateFromData.value,'5454546');
      let reqData = updateFromData.value;
      let updateUserUrl = `/user/update`;
      let result = await axios.put(updateUserUrl, reqData);
      console.log(result);
      if (result.data.code == 200) {
        message.success("修改成功");
        updaBtn.value = true;
        loadUserData();
        tabName.value = "list";
        updateFromData.value = {};
      }
    },
  },
]);
// function isFormComplete(formData) {
//   for (const key in formData) {
//     if (!formData[key]) {
//       return false;
//     }
//   }
//   return true;
// }
async function selectUserData() {
  let reqData = {};
  let reqParam = { id: "1" };
  let urlParam = `?id=${reqParam.id}&`;
  let getUserByIdUrl = `/user/findById/{id}${urlParam}`;
  let result = await axios.get(getUserByIdUrl, reqData);
  console.log(result);
}

const addFromData = ref({
  // id: "",
  username: null,
  password: null,
  phone: null,
  email: null,
  gender: 0,
  industry: null,
  organizationName: null,
  verified: 1,
  goodsType: null,
  loginExp: 0,
  vipExp: null,
  version: 0,
});
//手机验证
const validatePhone = (value) => {
  if (!value) {
    message.error("请输入手机号")
    return false
  }else if (!/^1[3456789]\d{9}$/.test(value)) {
    message.error("请输入正确的手机号")
    return false
  }else{
    return true;
  }
};
const addFormInfo = ref([
  { type: "input", label: "用户名", key: "username", width: "500px" ,required:true},
  // { type: "input", label: "密码", key: "password", width: "500px", },
  { type: "input", label: "电话", key: "phone", width: "500px",required:true },
  { type: "input", label: "邮箱", key: "email", width: "500px",required:true },
  {
    type: "select",
    label: "性别",
    key: "gender",
    width: "500px",
    options: [
      { label: "男", value: 0 },
      { label: "女", value: 1 },
    ],
  },
  { type: "input", label: "行业", key: "industry", width: "500px" ,},
  { type: "input", label: "组织名称", key: "organizationName", width: "500px" },
  {
    type: "select",
    label: "是否审核通过",
    key: "verified",
    width: "500px",
    options: [
      { label: "是", value: 0 },
      { label: "否", value: 1 },
    ],
  },
  {
    type: "button",
    label: "提交",
    click: async () => {
      console.log("addFromData.value",addFromData.value);
      
      if (!addFromData.value.phone || !addFromData.value.username || !addFromData.value.email) {
       console.log(addFromData.value.phone);
       
      }

      if (!addFromData.value.phone || !addFromData.value.username || !addFromData.value.email) {
        return message.error("请完善信息");
      }else {
        if (validatePhone(addFromData.value.phone)) {
        let reqData = addFromData.value;
        let createUserUrl = `/user/create`;
        let result = await axios.post(createUserUrl, reqData);
        console.log(result);
        if (result.data.code == 200) {
          message.success("添加成功");
          loadUserData();
          tabName.value = "list";
          addFromData.value = {};
        }
        }
      }
    },
  },
]);

async function deleteAdmin(row) {
      let reqData =  {};
      let reqParam = {id:row.id};
      let deleteSupplierByIdUrl = `/user/delete/${reqParam.id}`;
      let result = await axios.delete(deleteSupplierByIdUrl,reqData);
      console.log(result);
          if (result.data.code == 200) {
              message.success("删除成功");
              loadUserData();
          }
}



</script>

<style scoped lang="scss">
:deep(.n-form-item){
width: 50%
}
</style>
