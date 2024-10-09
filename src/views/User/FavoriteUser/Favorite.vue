<template>
  <div class="favorite-page">
    <div class="main-content">
      <!-- Tiêu đề Danh sách yêu thích -->
      <h2 class="favorite-title">
        <i class="fa-regular fa-heart"></i>
        Danh sách các sản phẩm yêu thích của bạn
        <i class="fa-regular fa-heart"></i>
      </h2>

      <!-- Khung bao quanh sản phẩm -->
      <div class="product-container">
        <!-- Products Section -->
        <div class="products">
          <div v-if="noProductsFound" class="no-products">
            Sản phẩm không tồn tại!
          </div>
          <div
            v-else
            v-for="product in paginatedProducts"
            :key="product._id"
            class="product-card"
            @mouseenter="handleMouseEnter(product)"
            @mouseleave="handleMouseLeave(product)"
          >
            <img
              :src="
                product.currentImage || product.IMAGES[0] || '@/assets/banner.jpg'
              "
              :alt="product.NAME"
              class="product-image"
            />
            <h3 @click="goToProductDetail(product._id)" class="product-name">
              {{ product.NAME }}
            </h3>
            <p>{{ formatPrice(product.PRICE) }}</p>
            <button class="buy-button" @click="addToCart(product)">
              <font-awesome-icon icon="cart-plus" /> Thêm vào giỏ hàng
            </button>
            <button class="remove-button" @click="confirmRemoveFavorite(product._id)">
              Xóa yêu thích
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination Section -->
      <div v-if="totalPages > 1" class="pagination">
        <button :disabled="currentPage === 1" @click="changePage('prev')">
          Trang trước
        </button>
        <span>Trang {{ currentPage }} / {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="changePage('next')">
          Trang sau
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axiosClient from "../../../api/axiosClient";
import Swal from 'sweetalert2'; // Import SweetAlert

export default {
  data() {
    return {
      products: [],
      noProductsFound: false,
      currentPage: 1,
      itemsPerPage: 12,
    };
  },
  computed: {
    isLogin() {
      return this.$store.state.isLoggedIn;
    },
    totalPages() {
      return Math.ceil(this.products.length / this.itemsPerPage);
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.products.slice(start, end);
    },
  },
  mounted() {
    this.fetchFavoriteProducts();
  },
  methods: {
    async fetchFavoriteProducts() {
      try {
        const response = await axiosClient.get("/users/favorites");
        this.products = response.data.favorites || [];
        this.noProductsFound = this.products.length === 0;
        this.products.forEach((product) => {
          product.currentImage = product.IMAGES[0];
        });
      } catch (error) {
        console.error("Error fetching favorite products:", error);
        this.noProductsFound = true;
      }
    },
    changePage(direction) {
      if (direction === "prev" && this.currentPage > 1) {
        this.currentPage--;
      } else if (direction === "next" && this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    formatPrice(price) {
      if (!price) return "0.000₫";
      const formattedValue = parseFloat(price).toLocaleString("vi-VN");
      return `${formattedValue}.000₫`;
    },
    async addToCart(product) {
      if (!this.isLogin) {
        this.$toast.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.", {
          position: "top-right",
          duration: 3000,
        });
        return;
      }

      try {
        const response = await axiosClient.put("/carts/addProduct", {
          productId: product._id,
          quantity: 1,
        });

        if (response.data.success) {
          this.$toast.success("Đã thêm sản phẩm vào giỏ hàng.", {
            position: "top-right",
            duration: 3000,
          });
        } else {
          this.$toast.error(response.data.message, {
            position: "top-right",
            duration: 3000,
          });
        }
      } catch (error) {
        if (error.response && error.response.data.message) {
          this.$toast.error(error.response.data.message, {
            position: "top-right",
            duration: 3000,
          });
        } else {
          this.$toast.error("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.", {
            position: "top-right",
            duration: 3000,
          });
        }
        console.error("Lỗi thêm sản phẩm vào giỏ hàng:", error);
      }
    },
    async confirmRemoveFavorite(productId) {
      const result = await Swal.fire({
        title: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
      });

      if (result.isConfirmed) {
        await this.removeFavorite(productId); // Nếu xác nhận, gọi hàm xóa yêu thích
      }
    },
    async removeFavorite(productId) {
      try {
        const response = await axiosClient.post("/users/removeFavorite", {
          productId: productId,
        });

        if (response.data.success) {
          this.$toast.success("Sản phẩm đã được xóa khỏi danh sách yêu thích.", {
            position: "top-right",
            duration: 3000,
          });
          this.fetchFavoriteProducts();
        } else {
          this.$toast.error(response.data.message, {
            position: "top-right",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Error removing favorite product:", error);
        this.$toast.error("Có lỗi xảy ra khi xóa sản phẩm khỏi danh sách yêu thích.", {
          position: "top-right",
          duration: 3000,
        });
      }
    },
    handleMouseEnter(product) {
      if (product.IMAGES.length > 1) {
        product.currentImage = product.IMAGES[1];
      }
    },
    handleMouseLeave(product) {
      product.currentImage = product.IMAGES[0];
    },
    goToProductDetail(productId) {
      this.$router.push(`/user/products/${productId}`);
    },
  },
};
</script>

<style scoped>
.favorite-page {
  display: flex;
  flex-direction: column; /* Đặt hướng của flex là cột */
  min-height: 100vh;
}

.main-content {
  width: 100%; /* Chiếm 100% chiều rộng */
  padding: 20px;
}

.favorite-title {
  text-align: center; /* Canh giữa văn bản */
  color: #3ba8cd; /* Màu xanh cho văn bản */
  margin-bottom: 20px; /* Khoảng cách dưới tiêu đề */
  font-size: 1.5rem; /* Kích thước chữ */
}

.product-container {
  border: 2px solid transparent; /* Đường viền trong suốt để tạo ra hiệu ứng bo góc */
  border-radius: 15px; /* Bo góc cho khung */
  padding: 20px; /* Khoảng cách bên trong khung */
  background: linear-gradient(to right, #d1d9e5, #a0c4ff); /* Màu nền gradient xanh biển */
}

.products {
  padding: 50px 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

/* Thay đổi kích thước sản phẩm dựa trên kích thước màn hình */
.product-card {
  width: calc(25% - 20px); /* Hiển thị 4 sản phẩm trên một hàng */
  box-sizing: border-box;
  margin: 0;
  text-align: center;
  border: 1px solid #8d8686; /* Viền mỏng màu xám nhạt */
  border-radius: 10px; /* Bo góc nhẹ cho sản phẩm */
  padding: 10px; /* Khoảng cách bên trong viền */
  background-color: #fff; /* Màu nền trắng cho sản phẩm */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Tạo bóng nhẹ để nổi bật sản phẩm */
  transition: box-shadow 0.3s ease, transform 0.3s ease; /* Hiệu ứng khi hover */
  display: flex;
  flex-direction: column; /* Xếp chồng các phần tử theo chiều dọc */
  justify-content: space-between;
}

.product-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); /* Tăng cường bóng khi hover */
  transform: translateY(-5px); /* Nhẹ nhàng nhấc sản phẩm lên khi hover */
}

.product-card img {
  width: 200px; /* Đặt chiều rộng cố định */
  height: 200px; /* Đặt chiều cao cố định */
  object-fit: cover; /* Cắt ảnh theo kích thước cố định mà không bị méo */
  border-radius: 10px;
  transition: transform 0.3s ease; /* Hiệu ứng chuyển động */
  margin: 0 auto;
}

.product-card img:hover {
  transform: scale(1.07);
}

.product-card p {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.product-card h3,
.product-card p {
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
  background: linear-gradient(
    to right,
    #3ba8cd 0%,
    #3ba8cd 50%,
    #fff 50%,
    #fff 100%
  );
  background-size: 200% 100%; /* Gấp đôi chiều rộng để tạo hiệu ứng trượt */
  background-position: 100% 0; /* Đặt vị trí bắt đầu là phía bên phải */
  color: #333; /* Màu chữ đen */
  border: 2px solid #333; /* Đường viền màu đen để tạo sự nổi bật */
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 10px;
  transition: background-position 0.5s ease, color 0.3s ease; /* Hiệu ứng chuyển vị trí background */
}

.buy-button:hover {
  background-position: 0 0; /* Dịch chuyển background về vị trí ban đầu */
  color: #fff; /* Màu chữ trắng khi hover */
  border: 2px solid #3ba8cd; /* Đổi màu viền khi hover */
}

/* CSS cho nút "Xóa yêu thích" */
.remove-button {
  background-color: #de2b28; /* Màu nền đỏ */
  color: white; /* Màu chữ trắng */
  border: none; /* Không có viền */
  padding: 10px 20px; /* Khoảng cách bên trong nút */
  border-radius: 5px; /* Bo góc */
  cursor: pointer; /* Con trỏ khi hover */
  margin-top: 10px; /* Khoảng cách phía trên */
}

.remove-button:hover {
  background-color: #b0201e; /* Tối màu khi hover */
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
