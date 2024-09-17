<template>
  <div class="product-page">
    <MenuProduct/>
    <div class="main-content">
      <!-- Banner Section -->
      <div class="carousel">
        <div class="carousel-inner">
          <div v-for="(banner, index) in banners" :key="index" class="carousel-item" :class="{ active: index === currentIndex }">
            <img :src="banner" alt="Banner" />
          </div>
        </div>
      </div>

      <!-- Search Section -->
      <div class="search-section">
        <input type="text" v-model="searchQuery" placeholder="Tìm kiếm sản phẩm..." @input="filterProducts" />
      </div>

      <!-- Products Section -->
      <div class="products">
        <div v-for="product in products" :key="product._id" class="product-card">
          <img :src="product.IMAGES[0] || '@/assets/banner.jpg'" :alt="product.NAME" />
          <h3>{{ product.NAME }}</h3>
          <p>{{ formatPrice(product.PRICE) }}</p>
          <button class="buy-button">Chọn mua</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../../api/axiosClient';
import bannerProduct from '@/assets/bannerproduct.jpg';
import bannerProduct1 from '@/assets/bannerproduct1.jpg';
import bannerProduct2 from '@/assets/bannerproduct2.jpg';
import MenuProduct from '@/components/MenuProduct/MenuProduct.vue'; // Import MenuProduct

export default {
  components: {
    MenuProduct // Register component
  },
  data() {
    return {
      banners: [
        bannerProduct,
        bannerProduct1,
        bannerProduct2
      ],
      currentIndex: 0,
      products: [] // Đảm bảo biến này được khởi tạo đúng
    };
  },
  mounted() {
    this.startCarousel();
    this.fetchProducts(); // Gọi hàm để lấy sản phẩm khi component được gắn
  },
  methods: {
    startCarousel() {
      const items = document.querySelectorAll('.carousel-item');
      this.currentIndex = 0; // Set the initial index to show the first item

      setInterval(() => {
        items[this.currentIndex].classList.remove('active');
        this.currentIndex = (this.currentIndex + 1) % items.length;
        items[this.currentIndex].classList.add('active');
      }, 5000); // Change every 5 seconds
    },
    async fetchProducts() {
      try {
        const response = await axios.get('/products/getAllProducts'); // URL của endpoint API
        console.log(response.data);
        this.products = response.data.data || response.data; // Gán dữ liệu sản phẩm vào biến products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    formatPrice(price) {
      if (!price) return '0.000đ'; // Đảm bảo giá có giá trị
      const formattedValue = parseFloat(price).toLocaleString('vi-VN');
      return `${formattedValue}.000đ`; // Thêm đuôi ".000 đ" cho mọi giá trị
    }
  }
};
</script>

<style scoped>
.product-page {
  display: flex; /* Chia trang làm hai phần: sidebar và main content */
}

.main-content {
  width: 85%; /* Chiếm 80% chiều rộng */
  padding: 20px;
}

.carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-bottom: 30px; /* Khoảng cách với danh sách sản phẩm */
}
.product-page {
  text-align: center;
}

.carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.carousel-inner {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-item {
  min-width: 100%;
  box-sizing: border-box;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.carousel-item img {
  width: 100%;
  height: auto;
}

.carousel-item.active {
  opacity: 1;
}

.search-section {
  margin-bottom: 20px; /* Khoảng cách giữa ô tìm kiếm và danh sách sản phẩm */
}

.search-section input {
  width: 100%; /* Đảm bảo ô tìm kiếm chiếm toàn bộ chiều rộng của phần tìm kiếm */
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease; /* Thêm hiệu ứng chuyển màu viền và bóng */
}

.search-section input:focus {
  border-color: #3dafd5; /* Màu xanh biển nhạt khi focus vào ô tìm kiếm */
  outline: none; /* Loại bỏ viền mặc định của trình duyệt */
  box-shadow: 0 0 8px #25809f; /* Tạo bóng màu xanh biển quanh ô tìm kiếm */
}

.products {
  padding: 50px 20px;
  display: flex;
  flex-wrap: wrap; /* Cho phép các sản phẩm chuyển xuống hàng mới khi cần */
  gap: 20px; /* Khoảng cách giữa các sản phẩm */
  justify-content: center; /* Canh giữa các sản phẩm */
}

/* Thay đổi kích thước sản phẩm dựa trên kích thước màn hình */
.product-card {
  width: calc(25% - 20px); /* Hiển thị 4 sản phẩm trên một hàng */
  box-sizing: border-box;
  margin: 0;
  text-align: center; /* Canh giữa nội dung bên trong card */
}

.product-card img {
  width: 200px; /* Đặt chiều rộng cố định */
  height: 200px; /* Đặt chiều cao cố định */
  object-fit: cover; /* Cắt ảnh theo kích thước cố định mà không bị méo */
  border-radius: 10px;
  transition: transform 0.3s ease; /* Hiệu ứng chuyển động */
}

.product-card img:hover {
  transform: scale(1.1); /* Phóng to ảnh lên 10% khi hover */
}

.product-card p {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.product-card h3, .product-card p {
  transition: color 0.3s ease; /* Hiệu ứng chuyển màu mượt mà */
}

.product-card:hover h3, 
.product-card:hover p {
  color: #3ba8cd; /* Màu xanh biển nhạt khi hover */
}

.product-card h3 {
  margin: 10px 0;
}

.product-card p {
  font-size: 1.2rem; /* Tăng kích thước chữ */
  font-weight: bold; /* Đặt chữ đậm */
  color: #333; /* Đảm bảo màu chữ */
  transition: color 0.3s ease; /* Hiệu ứng chuyển màu mượt mà */
}

/* CSS cho nút "Chọn mua" */
.buy-button {
  background-color: #fff; /* Màu nền trắng */
  color: #333; /* Màu chữ đen */
  border: 2px solid #333; /* Đường viền màu đen để tạo sự nổi bật */
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 10px;
  transition: background-color 0.3s ease, color 0.3s ease; /* Hiệu ứng chuyển màu nền và chữ */
}

.buy-button:hover {
  background-color: #3ba8cd; /* Màu nền xanh biển khi hover */
  color: #fff; /* Màu chữ trắng khi hover */
  border: 2px solid #3ba8cd; /* Đổi màu viền khi hover */
}

/* Media queries */
@media (max-width: 1200px) {
  .product-card {
    width: calc(33.33% - 20px); /* Hiển thị 3 sản phẩm trên một hàng */
  }
}

@media (max-width: 900px) {
  .product-card {
    width: calc(50% - 20px); /* Hiển thị 2 sản phẩm trên một hàng */
  }
}

@media (max-width: 600px) {
  .product-card {
    width: calc(100% - 20px); /* Hiển thị 1 sản phẩm trên một hàng */
  }
}

</style>

