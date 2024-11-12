<template>
  <div class="sidebar">
    <div class="logo-container">
      <img src="@/assets/logo3.png" alt="Logo" class="logo" />
    </div>
    <ul>
      <li>
        <router-link to="/dashboard">
          <i class="fas fa-tachometer-alt"></i><span>Dashboard</span>
        </router-link>
      </li>
      <li>
        <router-link to="/products">
          <i class="fas fa-box"></i><span>Sản phẩm</span>
        </router-link>
      </li>
      <li>
        <router-link to="/order">
          <i class="fa-regular fa-file"></i><span>Đơn hàng</span>
        </router-link>
      </li>
      <li>
        <router-link to="/users">
          <i class="fas fa-users"></i><span>Người dùng</span>
        </router-link>
      </li>
      <li>
        <router-link to="/review">
          <i class="fa-regular fa-star"></i><span>Đánh giá</span>
        </router-link>
      </li>
      <li>
        <router-link to="/chat">
          <i class="fa-regular fa-comments"></i><span>Chăm sóc khách hàng</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background: #358ece;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 20px;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
}

.logo {
  width: 200px;
  height: auto;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  margin: 15px 0;
}

.sidebar a {
  color: white;
  text-decoration: none;
  font-size: 18px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
}

.sidebar a i {
  margin-right: 15px; /* Tăng khoảng cách giữa biểu tượng và chữ */
  font-size: 20px;
  flex-shrink: 0; /* Đảm bảo biểu tượng không co lại */
}

.sidebar a span {
  margin-left: 5px; /* Tạo khoảng cách bổ sung cho văn bản */
  flex-grow: 1; /* Đẩy văn bản ra xa hơn */
}

.sidebar a:hover {
  background-color: #575757;
  border-radius: 4px;
}

/* Media query for small screens */
@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }

  .sidebar a {
    font-size: 16px;
    padding: 10px;
  }

  .sidebar a i {
    font-size: 18px;
  }
}
</style>
