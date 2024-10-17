<template>
  <header class="header-admin">
    <div class="header-left"></div>
    <h1>Quản lý cửa hàng thú cưng</h1>
    <div class="header-right">
      <div class="user-info">
        <span class="user-name">{{ userInfo?.FULLNAME }} </span>
        <font-awesome-icon :icon="['fas', 'user']" />
      </div>
      <button @click="logout" class="logout-button">Đăng xuất</button>
    </div>
  </header>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["isLoggedIn", "userInfo"]),
  },
  methods: {
    ...mapActions(["logout"]),
  },
  mounted() {
    this.$store.dispatch("checkToken"); // Kiểm tra trạng thái đăng nhập khi component được mount
  },
};
</script>

<style scoped>
.header-admin {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #358ece;
  width: 100%;
  height: 60px;
  color: white;
  border-radius: 10px;
}

.menu-icon {
  font-size: 24px;
  cursor: pointer;
}

.header-right {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-right: 20px;
  cursor: pointer;
}

.user-name {
  margin-right: 10px;
  color: black;
  font-size: 18px;
  font-weight: bold;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
}

.logout-button {
  background-color: #ffffff;
  font-weight: bold;
  color: rgb(0, 0, 0);
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
}

.logout-button:hover {
  transition: 0.5s;
  background-color: #3b3e42;
}
</style>
