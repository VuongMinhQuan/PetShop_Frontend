import { createRouter, createWebHistory } from 'vue-router'

// import AdminLayout from "../layouts/AdminLayout/AdminLayout.vue"
import UserLayout from "../layouts/UserLayout/UserLayout.vue"



// Page Organization
import store from "@/store"
import HomePageOrgan from "@/views/PageOrgan/HomePage/HomePage.vue"


import Login from '../views/User/LoginUser/Login.vue'
// import Login from '../components/Login/Login.vue'
import LoginLayout from '../layouts/Login/LoginLayout.vue'
import Register from '../views/User/RegisterUser/Register.vue'
import Home from '../views/User/HomeUser/Home.vue'
import Product from '../views/User/ProductUser/Product.vue'
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
];
const router = createRouter({
	history: createWebHistory(),
	routes,
})

// router.beforeEach((to, from, next) => {
// 	const isLoggedIn = store.getters.isLoggedIn;
// 	const userInfo = store.getters.userInfo;

// 	let userRole = '';
// 	if (userInfo?.ROLE?.IS_ADMIN) {
// 		userRole = 'admin';
// 	} else if (userInfo?.ROLE?.IS_ORGANIZATION) {
// 		userRole = 'organization';
// 	} else {
// 		userRole = 'guest';
// 	}

// 	if (to.matched.some(record => record.meta.requiresAuth)) {
// 		if (isLoggedIn && to.matched.some(record => record.meta.roles && record.meta.roles.includes(userRole))) {
// 			next();
// 		} else {
// 			next('/login');
// 		}
// 	} else {
// 		next();
// 	}


export default router;
