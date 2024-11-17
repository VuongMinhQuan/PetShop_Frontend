import { createRouter, createWebHistory } from 'vue-router'

import AdminLayout from '../layouts/AdminLayout/AdminLayout.vue'
import UserLayout from "../layouts/UserLayout/UserLayout.vue"


import Login from '../views/User/LoginUser/Login.vue'
// import Login from '../components/Login/Login.vue'
import LoginLayout from '../layouts/Login/LoginLayout.vue'
import Register from '../views/User/RegisterUser/Register.vue'
import Home from '../views/User/HomeUser/Home.vue'
import History from '../views/User/HistoryUser/History.vue'
import Product from '../views/User/ProductUser/Product.vue'
import Cart from '../views/User/CartUser/Cart.vue'
import ProductDetail from '../views/User/DetailProduct/ProductDetail.vue'
import Payment from '../views/User/PaymentUser/Payment.vue'
import Favorite from '../views/User/FavoriteUser/Favorite.vue'
import Profile from '../views/User/ProfileUser/Profile.vue'
import Dashboard from '../views/Admin/Dashboard.vue'
import ProductManager from  '../views/Admin/ProductManager.vue'
import OrderManager from '../views/Admin/OrderManager/OrderManager.vue'
import UserManager from '../views/Admin/UserManager/UserManager.vue'
import Chat from "../components/Chat/Chat.vue";
import ReviewManager from '../views/Admin/ReviewManager/ReviewManager.vue'
import About from '../views/User/AboutUser/About.vue'
import WarehouseManager from '../views/Admin/WarehouseManager/WarehouseManager.vue'


const routes = [
  {
    path: "/login",
    component: Login,
    meta: {
      layout: LoginLayout,
    },
  },
  {
    path: "/user/register",
    component: Register,
    meta: {
      layout: LoginLayout,
    },
  },
  {
    path: "/user/home",
    component: Home,
    meta: {
      layout: UserLayout,
    },
  },
  {
    path: "/user/about",
    component: About,
    meta: {
      layout: UserLayout,
    },
  },
  {
    path: "/user/profile",
    component: Profile,
    meta: {
      layout: UserLayout,
    },
  },
  {
    path: "/user/product",
    component: Product,
    meta: {
      layout: UserLayout,
    },
  },
  {
    path: "/user/cart",
    name: "CartPage",
    component: Cart,
    meta: {
      layout: UserLayout,
    },
  },
  {
    path: "/user/products/:id",
    component: ProductDetail,
    meta: {
      layout: UserLayout,
    },
  },
  {
    path: "/user/booking/payment",
    name: "PaymentPage",
    component: Payment,
    meta: {
      layout: UserLayout,
    },
  },
  {
    path: "/user/favorite",
    component: Favorite,
    meta: {
      layout: UserLayout,
    },
  },
  {
    path: "/user/history",
    name: "History",
    component: History,
    meta: {
      layout: UserLayout,
    },
  },
  {
    path: "/chat",
    component: Chat,
    meta: {
      layout: AdminLayout,
    },
  },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: {
      layout: AdminLayout,
    },
  },
  {
    path: "/products",
    component: ProductManager,
    meta: {
      layout: AdminLayout,
    },
  },
  {
    path: "/order",
    component: OrderManager,
    meta: {
      layout: AdminLayout,
    },
  },
  {
    path: "/users",
    component: UserManager,
    meta: {
      layout: AdminLayout,
    },
  },
  {
    path: "/review",
    component: ReviewManager,
    meta: {
      layout: AdminLayout,
    },
  },
  {
    path: "/warehouse",
    component: WarehouseManager,
    meta: {
      layout: AdminLayout,
    },
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition; // Nếu có vị trí cuộn được lưu, cuộn lại vị trí đó
    } else {
      return { top: 0 }; // Cuộn về đầu trang
    }
  },
});

export default router;
