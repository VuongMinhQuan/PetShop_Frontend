import { createRouter, createWebHistory } from 'vue-router'

// import AdminLayout from "../layouts/AdminLayout/AdminLayout.vue"
import UserLayout from "../layouts/UserLayout/UserLayout.vue"


import Login from '../views/User/LoginUser/Login.vue'
// import Login from '../components/Login/Login.vue'
import LoginLayout from '../layouts/Login/LoginLayout.vue'
import Register from '../views/User/RegisterUser/Register.vue'
import Home from '../views/User/HomeUser/Home.vue'
import Product from '../views/User/ProductUser/Product.vue'
import Cart from '../views/User/CartUser/Cart.vue'
import ProductDetail from '../views/User/DetailProduct/ProductDetail.vue'
import Booking from '../views/User/BookingUser/Booking.vue'
import Favorite from '../views/User/FavoriteUser/Favorite.vue'
const routes = [
  {
    path: "/user/login",
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
      layout: LoginLayout,
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
    name: "BookingPage",
    component: Booking,
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
