<template>
  <div class="sidebar">
    <div class="logo">
      <img src="../../assets/logo1.png" alt="Logo" />
    </div>
    <div class="sidebar-header" @click="toggleMenu">
      <span class="hamburger-icon">☰</span>
      <!-- Dấu 3 gạch -->
      <h4>Danh mục sản phẩm</h4>
    </div>
    <transition name="fade">
      <ul v-show="isMenuVisible">
        <li>
          <h4>Thú cưng</h4>
          <ul>
            <li
              @click="
                filterBySubType([
                  'Alaska',
                  'Husky',
                  'Golden',
                  'Bull Pháp',
                  'Corgi',
                  'Poodle',
                  'Pug',
                  'Samoyed',
                ])
              "
            >
              <i class="fas fa-dog"></i>
              Chó
            </li>
            <li
              @click="
                filterBySubType([
                  'ALD',
                  'ALN',
                  'Ba Tư',
                  'Bengal',
                  'Munchkin',
                  'Scottish',
                  'Xiêm',
                  'Sphynx',
                ])
              "
            >
              <i class="fas fa-cat"></i>
              Mèo
            </li>
          </ul>
        </li>
        <li>
          <h4>Thức ăn</h4>
          <ul>
            <li @click="filterBySubType(['FDog'])">
              <i class="fas fa-bone"></i>
              Cho chó
            </li>
            <li @click="filterBySubType(['FCat'])">
              <i class="fas fa-fish"></i>
              Cho mèo
            </li>
          </ul>
        </li>
        <li>
          <h4>Đồ dùng</h4>
          <ul>
            <li @click="filterBySubType(['Toy'])">
              <i class="fas fa-puzzle-piece"></i>
              Đồ chơi
            </li>
            <li @click="filterBySubType(['Cage'])">
              <i class="fas fa-warehouse"></i>
              Chuồng
            </li>
            <li @click="filterBySubType(['Bag'])">
              <i class="fas fa-shopping-bag"></i>
              Balo
            </li>
          </ul>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
export default {
  name: "MenuProduct",
  data() {
    return {
      isMenuVisible: false, // Trạng thái hiển thị menu
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuVisible = !this.isMenuVisible; // Chuyển đổi trạng thái hiển thị
    },
    filterBySubType(subTypes) {
      this.$emit("filterBySubType", subTypes); // Truyền mảng các subTypes lên component cha
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 15%;
  background-color: #f4f4f4;
  padding: 10px;
  border-right: 1px solid #ddd;
  text-align: left;
  height: 100vh; /* Chiều cao tối đa bằng chiều cao của viewport */
  overflow: hidden; /* Ẩn nội dung khi không cần thiết */
  position: -webkit-sticky; /* Cho các trình duyệt Webkit */
  position: sticky;
  top: 5rem;
  display: flex;
  flex-direction: column;
}

.logo {
  margin-bottom: 10px;
  text-align: center;
}

.logo img {
  max-width: 100%;
  height: auto;
}

.sidebar-header {
  display: flex;
  align-items: center;
  background-color: #3ba8cd;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  border: 1px solid #3ba8cd;
  cursor: pointer;
}

.hamburger-icon {
  font-size: 18px;
  margin-right: 5px;
}

.sidebar h4 {
  font-size: 16px;
  margin: 0;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar ul li {
  margin-bottom: 15px;
}

.sidebar ul li h4 {
  margin-bottom: 10px;
  font-weight: bold;
  color: #333;
}

.sidebar ul ul {
  margin-left: 20px;
}

.sidebar ul ul li {
  margin-bottom: 5px;
  cursor: pointer;
  font-size: 13px;
}

.sidebar ul ul li:hover {
  color: #3ba8cd;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
