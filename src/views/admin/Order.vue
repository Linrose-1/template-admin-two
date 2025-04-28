<template>
  <n-tabs
    type="line"
    animated
    v-model:value="tabValue"
    @update:value="handleUpdateValue"
  >
    <n-tab-pane name="list" tab="订单列表">
      <auto-form
        :inline="true"
        :form-info="searchFormInfo"
        :form-data="keyword"
      ></auto-form>
      <n-button type="primary" secondary  class="export" @click="exportOrder">
        <a  @click="exportOrder"></a>
        导出未开发票的订单</n-button>
      <auto-table :columns="columns" :data="data"></auto-table>
      <n-pagination
        v-model:page="page"
        :page-count="pageCount"
        @update:page="loadData"
      />
    </n-tab-pane>
    <n-tab-pane name="update" tab="修改">
      <auto-form
        :form-info="orderFormInfo"
        :form-data="orderFormData"
        labelPlacement="left"
        :labelWidth="140"
      ></auto-form>
    </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="jsx">
import { ref, h } from "vue";
import { useUserStore } from "@/stores/UserStore";
import AutoTable from "@/components/AutoTable.vue";
import AutoForm from "@/components/AutoForm.vue";
import { NButton, useMessage ,NTag } from "naive-ui";
import axios from "axios"

const message = useMessage();
const tabValue = ref("list");
const handleUpdateValue = (value) => {
  if (value == "add") {
    orderFormData.value = {};
  }
};

const exportOrder= async()=>{
let exportOrderOpenInvoiceUrl = `${import.meta.env.VITE_SERVER_URL}/order/exportOrderOpenInvoice`;
try {
  const response =  await axios.get(exportOrderOpenInvoiceUrl, {
      responseType: 'blob', // 重要：设置响应类型为 'blob'
    });
    console.log(response);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '未开发票订单.xlsx'); // 设置下载文件的名称
    document.body.appendChild(link);
    link.click();
    // 清理工作：移除链接和撤销对象 URL
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
} catch (error) {
  console.error('导出订单失败：', error);
}

}

const searchFormInfo = ref([
  { type: "input", label: "查询订单", key: "keyword", onEnter: "查询",width: "500px", },
  {
    type: "button",
    label: "查询",
    click: (item, formData) => {
      loadData();
    },
  },
]);
const updateBtn = ref(true)
const orderFormData = ref({
  createTime: "",
  empty: "",
  goodsId: "",
  goodsInfo: "",
  goodsNum: "",
  id: "",
  invoiceInfo: "",
  invoiceState: "",
  key: "",
  orderId: "",
  state: "",
  timeExpire: "",
  total: "",
  type: "",
  updateTime: "",
  userId: "",
  version: "",
  vipExp: "",
});

const orderFormInfo = ref([
  {
    type: "input",
    label: "订单编号",
    key: "orderId",
    width: "500px",
    disabled: true,
  },
  { type: "input", label: "订单金额", key: "total", width: "500px" ,disabled: true,},
  { type: "select", label: "商品类型", key: "type", width: "500px" ,disabled: true, options: [{ label: "年卡", value: 1 }, { label: "季卡", value: 2 },{ label: "月卡", value: 3 },{ label: "次卡", value: 4 },] },
  { type: "select", label: "支付状态", key: "state", width: "500px" ,disabled: true,options: [{ label: "失效", value: -1 }, { label: "待支付", value: 0 },{ label: "已支付", value: 1 },]},
  { type: "select", label: "是否申请发票", key: "invoiceState", width: "500px",options: [{ label: "未申请开发票", value: 0 }, { label: "已申请开发票", value: 1 },{ label: "已开发票", value: 2 },] },
  // { type: "input", label: "交易有效期", key: "timeExpire", width: "500px" },
  { type: "input", label: "套餐过期时间", key: "vipExp", width: "500px" ,disabled: true,},
  // { type: "input", label: "发票信息", key: "invoiceInfo", width: "500px" },
  // { type: "input", label: "用户ID", key: "userId", width: "500px" },
  // { type: "input", label: "商品ID", key: "goodsId", width: "500px" },
  // { type: "input", label: "商品信息", key: "goodsInfo.useLimit", width: "500px" },
  // { type: "input", label: "商品数量", key: "goodsNum", width: "500px" },
  { type: "input", label: "创建时间", key: "createTime", width: "500px", disabled:true},
  // { type: "input", label: "更新时间", key: "updateTime", width: "500px" },
  {
    type: "button",
    label: "提交",
    key: "button",
    disabled:updateBtn,
    click: async () => {
      let reqData = orderFormData.value;
      console.log("111", reqData);
      let updateOrderUrl = `/order/update`;
      let result = await axios.put(updateOrderUrl, reqData);
      console.log(result);
      if (result.data.code == 200) {
        message.success("修改成功");
        loadData();
        tabValue.value = "list";
        orderFormData.value = {};
        updateBtn.value=true
      }
    },
  },
]);

const page = ref(1);
const pageCount = ref(1);
const keyword = ref({
  keyword: "",
});
const columns = ref([
  {
    title: "订单编号",
    key: "orderId",
  },
  {
    title: "购买的用户ID",
    key: "userId",
  },
  // {
  //   title: "商品ID",
  //   key: "goodsId",
  // },
  // {
  //   title: "商品信息",
  //   key: "goodsInfo",
  // },
  {
    title: "商品类型",
    key: "type",
    render(row) {
      switch (row.type) {
    case 1:
      return '年卡';
    case 2:
      return '季卡';
    case 3:
      return '月卡';
    case 4:
      return '次卡';
  
    default:
      break;
  }
    },
  },
  {
    title: "商品数量",
    key: "goodsNum",
  },
  {
    title: "金额",
    key: "total",
  },
  
  {
    title: "状态",
    key: "state",
    render(row) {
      switch (row.state) {
    case 1:
      return <n-tag  type="success"> 已支付 </n-tag>;
    case 0:
      return <n-tag type="error"> 待支付 </n-tag>;
    case -1:
      return <n-tag> 失效 </n-tag>;
  
    default:
      break;
  }
    },
  },
  {
    title: "交易有效期",
    key: "timeExpire",
  },
  {
    title: "套餐过期时间",
    key: "vipExp",
  },
  // {
  //   title: "发票信息",
  //   key: "invoiceInfo",
  // },
  {
    title: "是否申请发票",
    key: "invoiceState",
    render(row) {
    switch (row.invoiceState) {
      case 0:
        return <n-tag type="warning">未申请发票</n-tag>;
      case 1:
        return <n-tag type="info">已申请发票</n-tag>;
      case 2:
        return <n-tag type="success">已开发票</n-tag>;
      default:
        return null;
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
          <n-button
            type="success"
            ghost
            onClick={() => {
              exitOrder(row);
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

async function exitOrder(row) {
  console.log(row.id);
  tabValue.value = "update";
  orderFormData.value = row;
  updateBtn.value = false
  console.log(orderFormData.value);
  
}

const stateDate = ref('1');
//获取数据
async function loadData() {
  let reqData = {};
  let reqParam = { page: page.value, size: 10, keyword: keyword.value.keyword };
  console.log(reqParam);
  let urlParam = `?page=${reqParam.page}&size=${reqParam.size}&keyword=${reqParam.keyword}&`;
  let selectPageUrl = `/order/page${urlParam}`;
  let result = await axios.get(selectPageUrl, reqData);
  console.log(result);
  data.value = result.data.data.list;
  pageCount.value = result.data.data.pager.pageCount;
}
loadData();


</script>

<style lang="scss" scoped>
.export{
  margin-bottom: 10px
}
:deep(.n-form-item){
width: 50%
}
</style>
