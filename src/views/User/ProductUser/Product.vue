<template>
  <div class="product-page">
    <MenuProduct @filterBySubType="filterProductsBySubType" />
    <div class="main-content">
      <!-- Banner Section -->
      <div class="carousel">
        <div class="carousel-inner">
          <div
            v-for="(banner, index) in banners"
            :key="index"
            class="carousel-item"
            :class="{ active: index === currentIndex }"
          >
            <img :src="banner" alt="Banner" />
          </div>
        </div>
      </div>
      <!-- Search Section -->
      <div class="search-section">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm sản phẩm..."
          @keyup.enter="filterProducts"
        />
      </div>
      <!-- Price Range Filter Section -->
      <div class="price-filter">
        <h3>Lọc sản phẩm theo giá</h3>
        <select
          v-model="selectedPriceRange"
          @change="filterProductsByPriceRange"
        >
          <option value="all">Tất cả</option>
          <option value="0-500000">0 - 500.000 ₫</option>
          <option value="500000-1000000">500.000 ₫ - 1.000.000 ₫</option>
          <option value="1000000-5000000">1.000.000 ₫ - 5.000.000 ₫</option>
          <option value="5000000-10000000">5.000.000 ₫ - 10.000.000 ₫</option>
          <option value="10000000-20000000">10.000.000 ₫ - 20.000.000 ₫</option>
          <option value="20000000-50000000">20.000.000 ₫ - 50.000.000 ₫</option>
        </select>
      </div>

      <!-- Products Section -->
      <div class="products">
        <div v-if="noProductsFound" class="text-center mt-5">
          <div class="alert" role="alert">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9VJb44bt8yuWo0v1o6D5muQyMpM7nmHRJCg&s"
              alt="No products"
              class="img-fluid mb-3"
              style="max-width: 400px"
            />
            <p class="font-italic">Không có sản phẩm phù hợp</p>
          </div>
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

          <div class="action-container">
            <button
              class="buy-button"
              @click="addToCart(product)"
              :disabled="product.QUANTITY === 0"
              :class="{ 'disabled-button': product.QUANTITY === 0 }"
            >
              <font-awesome-icon icon="cart-plus" /> Thêm vào giỏ hàng
            </button>
            <!-- Icon Heart in Circle -->
            <div class="heart-icon" @click="toggleFavorite(product)">
              <font-awesome-icon
                :icon="product.isFavorite ? 'heart' : ['far', 'heart']"
                :class="{ 'red-heart': product.isFavorite }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination Section -->
      <div v-if="totalPages > 1" class="pagination">
        <button :disabled="currentPage === 1" @click="changePage('prev')">
          Trang trước
        </button>
        <span>Trang {{ currentPage }} / {{ totalPages }}</span>
        <button
          :disabled="currentPage === totalPages"
          @click="changePage('next')"
        >
          Trang sau
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import bannerProduct from "@/assets/bannerproduct.jpg";
import bannerProduct1 from "@/assets/bannerproduct1.jpg";
import bannerProduct2 from "@/assets/bannerproduct2.jpg";
import MenuProduct from "@/components/MenuProduct/MenuProduct.vue"; // Import MenuProduct
import axiosClient from "../../../api/axiosClient";

export default {
  components: {
    MenuProduct, // Register component
  },
  data() {
    return {
      banners: [bannerProduct, bannerProduct1, bannerProduct2],
      currentIndex: 0,
      products: [], // Đảm bảo biến này được khởi tạo đúng
      searchQuery: "",
      filteredProducts: [],
      selectedPriceRange: "all",
      noProductsFound: false,
      currentPage: 1, // Trang hiện tại
      itemsPerPage: 12, // Số sản phẩm mỗi trang
    };
  },
  computed: {
    isLogin() {
      return this.$store.state.isLoggedIn; // Truy cập trực tiếp vào state trong Vuex store
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProducts.slice(start, end); // Sử dụng `filteredProducts` thay vì `products`
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage); // Tổng số trang dựa trên sản phẩm đã lọc
    },
  },
  mounted() {
    this.startCarousel();
    const subType = this.$route.query.subType;

    // Đảm bảo gọi API lấy danh sách yêu thích trước
    this.fetchUserFavorites().then(() => {
      if (subType) {
        this.filterProductsBySubType([subType]); // Gọi hàm lọc sản phẩm
      } else {
        this.fetchProducts(); // Lấy tất cả sản phẩm
      }
    });
  },

  methods: {
    startCarousel() {
      const items = document.querySelectorAll(".carousel-item");
      this.currentIndex = 0; // Set the initial index to show the first item

      setInterval(() => {
        items[this.currentIndex].classList.remove("active");
        this.currentIndex = (this.currentIndex + 1) % items.length;
        items[this.currentIndex].classList.add("active");
      }, 5000); // Change every 5 seconds
    },
    syncFavorites() {
      if (!this.favoriteIds) return; // Nếu chưa có danh sách yêu thích, thoát sớm

      this.filteredProducts.forEach((product) => {
        product.isFavorite = this.favoriteIds.includes(product._id);
      });
    },
    async filterProductsByPriceRange() {
      if (this.selectedPriceRange === "all") {
        this.filteredProducts = this.products; // Hiển thị tất cả sản phẩm
      } else {
        const [minPrice, maxPrice] = this.selectedPriceRange
          .split("-")
          .map(Number);

        // Lọc sản phẩm theo khoảng giá
        this.filteredProducts = this.products.filter((product) => {
          const price = Number(product.PRICE); // Chuyển `PRICE` sang số
          return price >= minPrice && price <= maxPrice;
        });
      }

      // Kiểm tra nếu không có sản phẩm nào phù hợp
      this.noProductsFound = this.filteredProducts.length === 0;
      this.currentPage = 1; // Reset về trang đầu tiên khi lọc
    },
    async fetchProducts() {
      try {
        const response = await axiosClient.get("/products/getAllProducts");
        this.products = response.data.data || response.data;
        this.filteredProducts = this.products; // Ban đầu hiển thị tất cả sản phẩm
        this.syncFavorites();
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    async fetchUserFavorites() {
      try {
        const response = await axiosClient.get("/users/profile"); // API trả về thông tin người dùng
        const user = response.data; // Dữ liệu người dùng
        this.favoriteIds = user.FAVORITES || []; // Lưu danh sách ID sản phẩm yêu thích
      } catch (error) {
        console.error("Error fetching user favorites:", error);
      }
    },

    changePage(direction) {
      if (direction === "prev" && this.currentPage > 1) {
        this.currentPage--;
      } else if (direction === "next" && this.currentPage < this.totalPages) {
        this.currentPage++;
      }
      this.scrollToTop();
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Cuộn mượt mà
      });
    },
    formatPrice(price) {
      const formattedValue = parseFloat(price).toLocaleString("vi-VN");
      return `${formattedValue} ₫`; // Thêm đuôi ".000 đ" cho mọi giá trị
    },
    async addToCart(product) {
      // Kiểm tra trạng thái đăng nhập từ computed isLogin
      if (!this.isLogin) {
        this.$toast.warning(
          "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.",
          {
            position: "top-right",
            duration: 3000,
          }
        );
        return; // Ngăn không cho thực hiện hành động nếu chưa đăng nhập
      }

      try {
        const response = await axiosClient.put("/carts/addProduct", {
          productId: product._id,
          quantity: 1, // Số lượng sản phẩm muốn thêm, mặc định là 1
        });

        if (response.data.success) {
          // Hiển thị thông báo thành công
          this.$toast.success("Đã thêm sản phẩm vào giỏ hàng.", {
            position: "top-right",
            duration: 3000,
          });

          this.$store.dispatch("fetchCart");
        } else {
          // Nếu có lỗi, hiển thị thông báo lỗi
          this.$toast.error(response.data.message, {
            position: "top-right",
            duration: 3000,
          });
        }
      } catch (error) {
        // Xử lý lỗi nếu có
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
    async toggleFavorite(product) {
      try {
        if (product.isFavorite) {
          // Gọi API để xóa sản phẩm khỏi danh sách yêu thích
          await axiosClient.post("/users/removeFavorite", {
            productId: product._id,
          });
          this.$toast.success(
            "Sản phẩm đã được xóa khỏi danh sách yêu thích.",
            {
              position: "top-right",
              duration: 3000,
            }
          );
        } else {
          // Gọi API để thêm sản phẩm vào danh sách yêu thích
          await axiosClient.put("/users/addFavorite", {
            productId: product._id,
          });
          this.$toast.success(
            "Sản phẩm đã được thêm vào danh sách yêu thích.",
            {
              position: "top-right",
              duration: 3000,
            }
          );
        }

        // Thay đổi trạng thái yêu thích
        product.isFavorite = !product.isFavorite; // Thay đổi trạng thái yêu thích
      } catch (error) {
        console.error("Error updating favorite product:", error);
        this.$toast.error("Có lỗi xảy ra khi cập nhật danh sách yêu thích.", {
          position: "top-right",
          duration: 3000,
        });
        product.isFavorite = !product.isFavorite; // Khôi phục lại trạng thái cũ nếu có lỗi
      }
    },
    async filterProducts() {
      try {
        const keyword = this.searchQuery.trim(); // Lấy từ khóa tìm kiếm
        if (keyword === "") {
          // Nếu ô tìm kiếm trống, hiển thị tất cả sản phẩm
          this.filteredProducts = [...this.products]; // Đảm bảo Vue nhận diện thay đổi
          this.noProductsFound = false;
          this.syncFavorites();
          return;
        }

        // Gọi API tìm kiếm sản phẩm
        const response = await axiosClient.get("/products/search", {
          params: { keyword },
        });

        // Cập nhật danh sách sản phẩm đã lọc
        this.filteredProducts = [...(response.data.data || response.data)];

        // Kiểm tra nếu không có sản phẩm
        this.noProductsFound = this.filteredProducts.length === 0;
        this.syncFavorites();

        // Reset về trang đầu tiên
        this.currentPage = 1;
      } catch (error) {
        console.error("Error searching products:", error);

        // Xử lý lỗi
        this.filteredProducts = [];
        this.noProductsFound = true;
      }
    },
    async filterProductsBySubType(subTypes) {
      try {
        const response = await axiosClient.post("/products/filter", {
          subType: subTypes, // Truyền danh mục cần lọc vào API
        });

        // Gán kết quả trả về vào filteredProducts
        this.filteredProducts = [...(response.data.data || [])];

        // Kiểm tra nếu không có sản phẩm
        this.noProductsFound = this.filteredProducts.length === 0;

        // Reset lại pagination
        this.currentPage = 1;
      } catch (error) {
        console.error("Lỗi lọc sản phẩm theo subType:", error);
        this.filteredProducts = [];
        this.noProductsFound = true;
      }
    },
    handleMouseEnter(product) {
      // Kiểm tra nếu có ảnh thứ 2, thay đổi ảnh khi hover
      if (product.IMAGES.length > 1) {
        product.currentImage = product.IMAGES[1];
      } else {
        // Nếu không có ảnh thứ 2, không làm gì
      }
    },
    handleMouseLeave(product) {
      // Quay lại ảnh ban đầu khi không hover nữa
      product.currentImage = product.IMAGES[0];
    },
    goToProductDetail(productId) {
      this.$router.push(`/user/products/${productId}`);
    },
  },
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
}

/* Thay đổi kích thước sản phẩm dựa trên kích thước màn hình */
.product-card {
  width: calc(25% - 20px); /* Hiển thị 4 sản phẩm trên một hàng */
  box-sizing: border-box;
  margin: 0;
  text-align: center; /* Canh giữa nội dung bên trong card */
  border: 1px solid #8d8686; /* Viền mỏng màu xám nhạt */
  border-radius: 0px; /* Bo góc nhẹ cho sản phẩm */
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
.text-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh; /* Chiều cao vùng thông báo */
  margin: 0 auto; /* Căn giữa */
}

.text-center img {
  max-width: 300px; /* Giới hạn kích thước ảnh */
  margin-bottom: 20px; /* Khoảng cách dưới hình ảnh */
}

.text-center p {
  font-size: 1.2rem; /* Kích thước chữ */
  font-weight: bold; /* Đậm chữ */
  color: #666; /* Màu chữ */
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

/* CSS cho nút bị vô hiệu hóa */
.disabled-button {
  background-color: #ccc; /* Màu nền khi bị vô hiệu hóa */
  color: #666; /* Màu chữ khi bị vô hiệu hóa */
  cursor: not-allowed; /* Con trỏ không cho phép */
  opacity: 0.6; /* Hiệu ứng làm mờ */
}

.action-container {
  display: flex; /* Sử dụng flex để căn chỉnh icon và nút */
  align-items: center; /* Căn giữa theo chiều dọc */
  justify-content: flex-start; /* Canh trái */
  margin-top: 10px; /* Khoảng cách bên trên */
}

.heart-icon {
  width: 40px; /* Chiều rộng của vòng tròn */
  height: 40px; /* Chiều cao của vòng tròn */
  border: 2px solid #8d8686; /* Đường viền màu xám nhạt */
  border-radius: 50%; /* Bo góc thành vòng tròn */
  background-color: white; /* Màu nền trắng */
  display: flex; /* Sử dụng flex để căn giữa icon */
  justify-content: center; /* Căn giữa icon theo chiều ngang */
  align-items: center; /* Căn giữa icon theo chiều dọc */
  margin-left: 10px; /* Khoảng cách giữa nút và icon */
  cursor: pointer; /* Thay đổi con trỏ khi hover */
}

.red-heart {
  color: red;
}

.pagination {
  display: flex; /* Sử dụng Flexbox để căn giữa */
  align-items: center; /* Căn giữa theo chiều dọc */
  justify-content: center; /* Căn giữa theo chiều ngang */
  margin-top: 20px; /* Thêm khoảng cách trên cùng */
  gap: 10px; /* Khoảng cách giữa các nút */
}

.pagination button {
  background-color: #3ba8cd; /* Màu nền chính */
  color: white; /* Màu chữ trắng */
  border: none; /* Xóa viền nút */
  border-radius: 5px; /* Bo góc nút */
  padding: 8px 16px; /* Khoảng cách bên trong nút */
  font-size: 16px; /* Kích thước chữ */
  cursor: pointer; /* Con trỏ thành nút bấm */
  transition: background-color 0.3s, transform 0.2s; /* Thêm hiệu ứng chuyển đổi */
}

.pagination button:hover {
  background-color: #2a88a2; /* Màu khi hover */
  transform: translateY(-2px); /* Hiệu ứng nhấn nổi */
}

.pagination button:disabled {
  background-color: #a3d4e4; /* Màu xám nhạt khi nút bị vô hiệu hóa */
  cursor: not-allowed; /* Con trỏ không cho phép bấm */
}

.pagination span {
  font-size: 16px; /* Kích thước chữ của số trang */
  color: #3ba8cd; /* Màu chữ chính */
  font-weight: bold; /* Chữ đậm */
}
.price-filter {
  margin: 20px 0;
  text-align: left;
  width: 250px;
}

.price-filter h3 {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.price-filter select {
  width: 100%; /* Đảm bảo chiều rộng 100% */
  padding: 10px; /* Khoảng cách bên trong */
  font-size: 1rem; /* Kích thước chữ */
  border: 1px solid #ccc; /* Viền xám nhạt */
  border-radius: 5px; /* Bo góc */
  transition: border-color 0.3s ease, box-shadow 0.3s ease; /* Hiệu ứng chuyển màu */
}

.price-filter select:focus {
  border-color: #3dafd5; /* Màu viền khi focus */
  outline: none; /* Xóa viền mặc định */
  box-shadow: 0 0 8px #25809f; /* Tạo hiệu ứng bóng */
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
