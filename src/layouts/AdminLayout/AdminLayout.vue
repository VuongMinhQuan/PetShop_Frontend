<template>
  <div class="admin-layout">
    <Sidebar :activePage="activePage" @navigate="navigate" />
    <div class="main-content">
      <Header :title="pageTitle" />
      <div class="page-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../../components/HeaderAdmin/Header.vue";
import Sidebar from "../../components/SideBarAdmin/SidebarAdmin.vue";

export default {
  name: "AdminLayout",
  components: {
    Header,
    Sidebar,
  },
  data() {
    return {
      activePage: "dashboard",
      pageTitle: "Quản Lý Cửa Hàng Thú Cưng",
    };
  },
  methods: {
    navigate(page) {
      this.activePage = page;
      this.pageTitle = this.getPageTitle(page);
    },
    getPageTitle(page) {
      switch (page) {
        case "products":
          return "Quản lý sản phẩm";
        case "revenue":
          return "Quản lý doanh thu";
        case "users":
          return "Quản lý người dùng";
        default:
          return "Dashboard quản lý";
      }
    },
  },
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  margin-left: 250px; /* Khoảng cách cho Sidebar */
  padding: 20px;
  width: calc(100% - 250px);
  box-sizing: border-box;
}

.page-content {
  margin-top: 20px; /* Khoảng cách giữa Header và nội dung trang */
}
</style>
