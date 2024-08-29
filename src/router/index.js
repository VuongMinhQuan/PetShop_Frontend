import { createRouter, createWebHistory } from 'vue-router'

// import AdminLayout from "../layouts/AdminLayout/AdminLayout.vue"
import UserLayout from "../layouts/UserLayout/UserLayout.vue"

// User
// import RegisterUser from "../views/RegisterUser/RegisterUser.vue"

// router Admin

// import BlockUserAdmin from "@/views/HomeAdmin/BlockUser/BlockUser.vue"
// import HomeAdmin from "@/views/HomeAdmin/MainHome/Home.vue"
// import Packages from "@/views/HomeAdmin/Packages/Packages.vue"
// import User from "@/views/HomeAdmin/User/User.vue"
// import LoginAdmin from "../views/LoginAdmin/LoginAdmin.vue"


// Page Organization
import store from "@/store"
import HomePageOrgan from "@/views/PageOrgan/HomePage/HomePage.vue"


// import OrganizationsList from '../components/Organization/OrganizationsList.vue'
// import UsersList from '../components/Organization/UsersList.vue'
// import registerUser from '../components/pageOrganization/registerUser.vue'
// import RegisterOrganization from '../views/Organizations/RegisterOrgan/RegisterOrganization.vue'
import Login from '../views/User/LoginUser/Login.vue'
// import Login from '../components/Login/Login.vue'
import LoginLayout from '../layouts/Login/LoginLayout.vue'
import Register from '../views/User/RegisterUser/Register.vue'
import Home from '../views/User/HomeUser/Home.vue'
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
  // router Admin
  // {
  // 	path: "/",
  // 	component: HomeAdmin,
  // 	meta: {
  // 		layout: AdminLayout,
  // 		// requiresAuth: true,
  // 		// roles: ['admin'],
  // 	}
  // },
  // {
  // 	path: "/user",
  // 	component: User,
  // 	meta: {
  // 		layout: AdminLayout,
  // 	}
  // },
  // {
  // 	path: "/user/blockUser",
  // 	component: BlockUserAdmin,
  // 	meta: {
  // 		layout: AdminLayout,
  // 	}
  // },

  // {
  // 	path: "/package",
  // 	component: Packages,
  // 	meta: {
  // 		layout: AdminLayout,
  // 	}
  // },
  // {
  // 	path: "/login",
  // 	component: LoginAdmin,
  // 	meta: {
  // 		layout: AuthLayout,
  // 	}
  // },
  // // router Organization
  // {
  // 	path: "/organization/register",
  // 	component: RegisterOrganization,
  // 	meta: {
  // 		layout: AuthLayout,
  // 	}
  // },
  // {
  // 	path: "/organization/getOrganization",
  // 	name: 'OrganizationsList',
  // 	component: OrganizationsList,
  // 	meta: {
  // 		layout: AdminLayout,
  // 	}
  // },
  // {
  // 	path: '/organization/:id',
  // 	name: 'UsersList',
  // 	component: UsersList,
  // 	meta: {
  // 		layout: AdminLayout,
  // 	},
  // 	props: true,
  // },

  // {
  // 	path: '/users/:userId',
  // 	name: 'UserDetail',
  // 	component: UserDetail,
  // 	meta: {
  // 		layout: AdminLayout,
  // 	},
  // 	props: true,
  // },
  // {
  // 	path: '/block-user/:userId',
  // 	name: 'BlockUser',
  // 	component: BlockUser,
  // 	meta: {
  // 		layout: AdminLayout,
  // 	},
  // 	props: true
  // },

  // Router User
  {
    path: "/trangchu",
    component: HomePageOrgan,
    meta: {
      layout: UserLayout,
    },
  },
];
const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach((to, from, next) => {
	const isLoggedIn = store.getters.isLoggedIn;
	const userInfo = store.getters.userInfo;

	let userRole = '';
	if (userInfo?.ROLE?.IS_ADMIN) {
		userRole = 'admin';
	} else if (userInfo?.ROLE?.IS_ORGANIZATION) {
		userRole = 'organization';
	} else {
		userRole = 'guest';
	}

	if (to.matched.some(record => record.meta.requiresAuth)) {
		if (isLoggedIn && to.matched.some(record => record.meta.roles && record.meta.roles.includes(userRole))) {
			next();
		} else {
			next('/login');
		}
	} else {
		next();
	}
});


export default router;
