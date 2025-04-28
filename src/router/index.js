import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import { h } from "vue";
import { NIcon } from "naive-ui";
import {
  GitNetworkSharp,
  BookOutline,
  SettingsSharp,
  Home,
  Navigate,
  Newspaper,
  GridSharp,
  PeopleOutline,
  StorefrontOutline,
  AccessibilityOutline,
} from "@vicons/ionicons5";
import HomeView from "../views/HomeView.vue";

const adminRouter = [
  {
    path: "/admin/admin",
    name: "管理员",
    icon: renderIcon(AccessibilityOutline),
    component: () => import("@/views/admin/Admin.vue"),
  },
  {
    path: "/admin/userManagement",
    name: "用户管理",
    icon: renderIcon(PeopleOutline),
    component: () => import("@/views/admin/userManagement.vue"),
  },
  {
    path: "/admin/commodity",
    name: "商品管理",
    icon: renderIcon(StorefrontOutline),
    component: () => import("@/views/admin/commodity.vue"),
  },
  {
    path: "/admin/order",
    name: "订单管理",
    icon: renderIcon(BookOutline),
    component: () => import("@/views/admin/Order.vue"),
  },
 
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "index",
      component:() => import("@/views/Index.vue"),
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("@/views/Admin.vue"),
      children: adminRouter,
    },
  ],
});

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export default router;
export { adminRouter };
