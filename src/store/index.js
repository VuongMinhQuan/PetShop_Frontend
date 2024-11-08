import { createStore } from "vuex";
import axios from "../api/axiosClient";
import { message } from "ant-design-vue";
import router from "../router";

const store = createStore({
  state: {
    isLoggedIn: false,
    userInfo: null,
    editingMode: false,
    users: [],
    cartProducts: [],
    selectedProductsCart: [],
  },
  mutations: {
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo;
      state.isLoggedIn = true;
    },
    SET_LOGIN_STATE(state, userInfo) {
      state.isLoggedIn = true;
      state.userInfo = userInfo;
    },
    LOGOUT(state) {
      state.isLoggedIn = false;
      state.userInfo = null;
    },
    SET_CART_PRODUCTS(state, cart) {
      state.cartProducts = cart.PRODUCTS;
    },
    SET_SELECTEDPRODUCTS_CART(state, products) {
      state.selectedProductsCart = products;
    },
  },
  actions: {
    async login({ commit, dispatch }, credentials) {
      try {
        // Xác định email hoặc số điện thoại trong credentials
        const isEmail = credentials.EMAIL ? true : false;
        const payload = {
          [isEmail ? "EMAIL" : "PHONE_NUMBER"]:
            credentials.EMAIL || credentials.PHONE_NUMBER,
          PASSWORD: credentials.PASSWORD,
        };

        const response = await axios.post("/users/loginUser", payload);

        if (response.status >= 200 && response.status <= 300) {
          const token = response.data.accessToken;
          localStorage.setItem("accessToken", token);
          // commit("SET_LOGIN_STATE", userInfo);

          const userInfo = await dispatch("checkToken"); // Lấy thông tin người dùng sau khi login thành công
          if (userInfo) {
            const roles = userInfo.ROLE;

            // Kiểm tra vai trò và điều hướng dựa trên role
            if (roles.ADMIN) {
              router.push("/dashboard"); // Điều hướng admin đến Dashboard
            } else {
              router.push("/user/home"); // Điều hướng người dùng thông thường
            }
          }
        }
      } catch (error) {
        // message.error("Đăng nhập thất bại!");
        throw error;
      }
    },
    async logout({ commit }) {
      localStorage.removeItem("accessToken");
      commit("LOGOUT");
      message.success("Đã đăng xuất thành công!");
      router.push("/login");
    },
    async checkToken({ commit, dispatch }) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await axios.get("/users/profile");
          if (response.status >= 200 && response.status < 300) {
            const userInfo = response.data;

            commit("SET_USER_INFO", userInfo);
            // const roles = userInfo.ROLE;

            return userInfo;
          } else {
            console.error("Unexpected response status:", response.status);
            dispatch("LOGOUT");
          }
        } catch (error) {
          console.error("Error while checking token:", error);
          dispatch("LOGOUT");
        }
      } else {
        console.log("No token found in localStorage.");
      }
    },
    async fetchCart({ commit }) {
      try {
        const response = await axios.post("/carts/getCartById");

        if (response.data.success) {
          commit("SET_CART_PRODUCTS", response.data.data);
        } else {
          console.error("API response error:", response.data.message);
        }
      } catch (error) {
        console.error(
          "Error fetching cart:",
          error.response ? error.response.data : error.message
        );
      }
    },
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    userInfo: (state) => state.userInfo,
    cartItemCount: (state) => {
      return state.cartProducts.length;
    },
    getSelectedProductsCart: (state) => state.selectedProductsCart,
  },
});

export default store;
