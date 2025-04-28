<template>
  <n-tabs type="line" animated v-model:value="tabValue" @update:value="handleUpdateValue">
    <n-tab-pane name="list" tab="管理员列表">
      <auto-table :columns="columns" :data="data"></auto-table>
      <n-pagination v-model:page="page" :page-count="pageCount" @update:page="loadData" />
    </n-tab-pane>
    <n-tab-pane name="add" tab="新增">
      <auto-form ref="formRef" :form-info="adminFormInfo" :form-data="adminFormData"  labelPlacement="left"
        :labelWidth="140"></auto-form>
    </n-tab-pane>
    <n-tab-pane name="update" tab="修改">
      <auto-form :form-info="adminFormInfo" :form-data="adminFormData" labelPlacement="left"
        :labelWidth="140"></auto-form>
    </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="jsx">
import { ref, h, watch } from "vue";
import { useUserStore } from "@/stores/UserStore";
import AutoTable from "@/components/AutoTable.vue";
import AutoForm from "@/components/AutoForm.vue";
import DeleteButton from "@/components/DeleteButton.vue";
import { NButton, useMessage } from "naive-ui";
import axios from "axios";

const message = useMessage();
const tabValue = ref("list");
const handleUpdateValue = (value) => {
  if (value == "add") {
    adminFormData.value = {};
    disUpdate.value = false
  }
  if (value == "update") {
    if (!adminFormData.value.id) {
       disUpdate.value = true
    }
   
  }
};
const adminFormData = ref({
  account: "",
  pwd: "",
});

const disUpdate = ref(true);
const adminFormInfo = ref([
  { type: "input", label: "账号", key: "account", width: "500px" ,required:true },
  { type: "input", label: "密码", key: "pwd", width: "500px",required:true },
  {
    type: "button",
    label: "提交",
    key: "button",
    disabled:disUpdate,
    click: async () => {
      if (adminFormData.value.id) {
        updateAdmin();
      } else {
        if (adminFormData.value.account&&adminFormData.value.pwd) {
           addAdmin();
        }else{
          message.error("账号或密码不能为空");
        }
       
      }
    },
  },
]);
const updateAdmin = async () => {
  let reqData = adminFormData.value;
  console.log("111", reqData);
  let updateUrl = `/admin/update`;
  let result = await axios.put(updateUrl, reqData);
  console.log(result);
  if (result.data.code == 200) {
    message.success("修改成功");
    loadData();
    tabValue.value = "list";
    adminFormData.value = {};
  }
};
const addAdmin = async () => {
  console.log(adminFormData.value);
  let reqData = adminFormData.value;
  let addUrl = `/admin/add`;
  let result = await axios.post(addUrl, reqData);
  if (result.data.code == 200) {
    message.success("添加成功");
    loadData();
    tabValue.value = "list";
    adminFormData.value = {};
  }
};

const page = ref(1);
const pageCount = ref(1);
const columns = ref([
  // {
  //   title: "编号",
  //   key: "id",
  // },
  {
    title: "账号",
    key: "account",
  },

  {
    title: "创建时间",
    key: "createTime",
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
          <n-button type="success"
          ghost
            onClick={() => {
              exitAdmin(row);
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

async function deleteAdmin(row) {
  let reqData = {};
  let reqParam = { "id": row.id };
  let urlParam = `?id=${reqParam.id}&`;
  let deleteUrl = `/admin/delete${urlParam}`;
  let result = await axios.delete(deleteUrl, reqData);
  console.log(result);
  if (result.data.code == 200) {
    message.success("删除成功")
    loadData()
  }
}
async function exitAdmin(row) {
  console.log(row.id);
  tabValue.value = "update";
  adminFormData.value = row;
  disUpdate.value = false
}

//获取数据
async function loadData() {
  let reqData = { "paginator": { "limit": 10, "page": page.value } };
  let pagesUrl = `/admin/pages`;
  let result = await axios.post(pagesUrl, reqData);
  console.log(result);
  data.value = result.data.data.list;
  pageCount.value = result.data.data.pager.pageCount;
}

loadData();
</script>

<style lang="scss" scoped>
:deep(.n-form-item){
width: 50%
}
</style>
