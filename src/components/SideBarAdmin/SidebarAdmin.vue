<template>
  <div class="sidebar">
    <ul>
      <li>
        <router-link to="/dashboard">
          <i class="fas fa-tachometer-alt"></i>Dashboard
        </router-link>
      </li>
      <li>
        <router-link to="/products">
          <i class="fas fa-box"></i>Sản phẩm
        </router-link>
      </li>
      <li>
        <router-link to="/order">
          <i class="fa-regular fa-file"></i>Đơn hàng
        </router-link>
      </li>
      <li>
        <router-link to="/revenue">
          <i class="fas fa-chart-line"></i>Doanh thu
        </router-link>
      </li>
      <li>
        <router-link to="/users">
          <i class="fas fa-users"></i>Người dùng
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
  margin-right: 10px;
  font-size: 20px;
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
