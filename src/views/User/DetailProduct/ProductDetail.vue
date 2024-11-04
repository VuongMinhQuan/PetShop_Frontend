<template>
  <div class="product-detail-page">
    <!-- Spinner hiển thị khi đang tải -->
    <div v-if="isLoading" class="spinner-overlay">
      <div class="spinner"></div>
    </div>
    <!-- Nội dung chi tiết sản phẩm -->
    <div v-else>
      <div class="product-detail">
        <!-- Hình ảnh chính -->
        <div class="main-image">
          <img :src="mainImage" alt="Product Image" />
        </div>

        <!-- Hình ảnh nhỏ để lựa chọn -->
        <div class="image-thumbnails">
          <img
            v-for="(image, index) in product.IMAGES"
            :key="index"
            :src="image"
            alt="Thumbnail"
            @click="mainImage = image"
            :class="{ active: mainImage === image }"
          />
        </div>

        <!-- Thông tin sản phẩm -->
        <div class="product-info">
          <h1>{{ product.NAME }}</h1>
          <div class="product-price">
            <span class="label">Giá bán:</span>
            {{ formatPrice(product.PRICE) }}
            <span class="quantity"> | Số lượng: {{ product.QUANTITY }} |</span>
            <div v-if="product.QUANTITY === 0" class="out-of-stock">
              Hết hàng
            </div>
            <div v-else class="in-stock">Còn hàng</div>
          </div>

          <div class="special-offers">
            <h2>Đặc Quyền Chi Có Tại Q-PetShop</h2>
            <ul>
              <li>
                <span class="highlight">7 NGÀY ĐỔI TRẢ</span> với bất kỳ lý do
                gì
              </li>
              <li>
                <span class="highlight">AN TÂM SONG HÀNH</span> với bảo hiểm
                <span class="highlight">365 NGÀY (dành cho thú cưng)</span>
              </li>
              <li>Đường dây <span class="highlight">hỗ trợ 24/7</span></li>
              <li><span class="highlight">Freeship</span> toàn quốc</li>
            </ul>
          </div>
          <button
            class="add-to-cart"
            @click="addToCart(product)"
            :disabled="product.QUANTITY === 0"
            :class="{ 'disabled-button': product.QUANTITY === 0 }"
          >
            <i class="fa fa-cart-plus"></i> Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      <!-- Phần tabs để hiển thị các nội dung khác nhau -->
      <div class="tab-section">
        <div class="tabs">
          <button
            v-for="(tab, index) in tabs"
            :key="index"
            :class="{ active: activeTab === tab }"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </div>

        <div
          v-if="activeTab === 'Sản phẩm đi kèm'"
          class="accompanying-products"
        >
          <h3>Sản phẩm đi kèm</h3>

          <!-- Hiển thị thông báo nếu không có sản phẩm đi kèm -->
          <div v-if="accompanyingProducts.length === 0">
            Không có sản phẩm đi kèm.
          </div>

          <!-- Hiển thị danh sách sản phẩm đi kèm nếu có -->
          <div v-else class="product-slider">
            <button
              @click="prevPage"
              class="slider-button prev-button"
              :disabled="currentPage === 0"
            >
              <i class="fa fa-chevron-left"></i>
            </button>
            <div class="accompanying-products-list">
              <div
                v-for="(accompanyingProduct, index) in paginatedProducts"
                :key="accompanyingProduct._id"
                class="accompanying-product-card"
                @click="goToProductDetail(accompanyingProduct._id)"
              >
                <img
                  :src="accompanyingProduct.IMAGES[0] || '@/assets/banner.jpg'"
                  :alt="accompanyingProduct.NAME"
                  class="accompanying-product-image"
                />
                <h4>{{ accompanyingProduct.NAME }}</h4>
                <p>{{ formatPrice(accompanyingProduct.PRICE) }}</p>
                <button
                  class="buy-button"
                  @click.stop="addToCart(accompanyingProduct)"
                >
                  <font-awesome-icon icon="cart-plus" /> Thêm vào giỏ hàng
                </button>
              </div>
            </div>
            <button
              @click="nextPage"
              class="slider-button next-button"
              :disabled="currentPage === maxPage"
            >
              <i class="fa fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'Mô tả sản phẩm'" class="product-description">
          <h3>Mô tả sản phẩm</h3>
          <p>{{ product.DESCRIPTION }}</p>
        </div>

        <div
          v-if="
            activeTab === 'Các sản phẩm tương tự'
          "
          class="related-products"
        >
          <h3>Các sản phẩm tương tự</h3>
          <div v-if="relatedProducts.length === 0">
            Không có các sản phẩm tương tự cho sản phẩm này.
          </div>
          <div v-else class="related-products-list">
            <div
              v-for="relatedProduct in relatedProducts"
              :key="relatedProduct._id"
              class="related-product-card"
              @click="goToProductDetail(relatedProduct._id)"
            >
              <img
                :src="relatedProduct.IMAGES[0] || '@/assets/banner.jpg'"
                :alt="relatedProduct.NAME"
                class="related-product-image"
              />
              <h4>{{ relatedProduct.NAME }}</h4>
              <p>{{ formatPrice(relatedProduct.PRICE) }}</p>
            </div>
          </div>
        </div>

        <!-- Phần Đánh giá -->
        <div v-if="activeTab === 'Đánh giá'" class="reviews">
          <h3>Đánh giá</h3>
          <div v-if="Array.isArray(reviews) && reviews.length === 0">
            Chưa có đánh giá nào.
          </div>
          <div v-else>
            <div v-for="review in reviews" :key="review._id" class="review">
              <p>
                <strong>{{ review.USER_ID.FULLNAME }}</strong>
              </p>
              <div class="rating-stars">
                <span
                  v-for="n in 5"
                  :key="n"
                  :class="{ filled: n <= review.RATING }"
                  class="star"
                >
                  ★
                </span>
                <span class="rating-text">({{ review.RATING }} / 5)</span>
              </div>
              <p>{{ review.COMMENT }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosClient from "../../../api/axiosClient";

export default {
  data() {
    return {
      product: {},
      mainImage: "", // Ảnh chính được hiển thị
      relatedProducts: [],
      accompanyingProducts: [],
      reviews: [],
      isLoading: false,
      currentPage: 0, // Quản lý trang hiện tại của slider
      itemsPerPage: 4, // Số sản phẩm hiển thị trên mỗi trang
      activeTab: "Sản phẩm đi kèm", // Tab đang được chọn
      tabs: [
        "Sản phẩm đi kèm",
        "Mô tả sản phẩm",
        "Các sản phẩm tương tự",
        "Đánh giá",
      ],
    };
  },
  computed: {
    isLogin() {
      return this.$store.state.isLoggedIn; // Truy cập trực tiếp vào state trong Vuex store
    },
    paginatedProducts() {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.accompanyingProducts.slice(start, end);
    },
    maxPage() {
      return (
        Math.ceil(this.accompanyingProducts.length / this.itemsPerPage) - 1
      );
    },
  },
  mounted() {
    this.fetchProductDetail();
  },
  watch: {
    "$route.params.id": function () {
      this.fetchProductDetail(); // Gọi lại hàm lấy chi tiết sản phẩm khi route thay đổi
    },
  },
  methods: {
    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.maxPage) {
        this.currentPage++;
      }
    },
    async fetchProductDetail() {
      try {
        const productId = this.$route.params.id;
        const response = await axiosClient.get(
          `/products/getProduct/${productId}`
        );
        this.product = response.data.data;
        this.mainImage = this.product.IMAGES[0]; // Đặt ảnh chính ban đầu

        this.fetchRelatedProducts();
        this.fetchAccompanyingProducts();
        this.fetchReviews();
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setTimeout(() => {
          this.isLoading = false; // Ẩn spinner sau 2 giây
        }, 300); // Đặt thời gian 2 giây
      }
    },
    async fetchRelatedProducts() {
      try {
        const response = await axiosClient.post("/products/filter", {
          subType: this.product.TYPE.subTypes, // Sử dụng subType của sản phẩm hiện tại
        });
        this.relatedProducts = response.data.data || response.data;
        // Loại bỏ sản phẩm hiện tại khỏi danh sách sản phẩm liên quan
        this.relatedProducts = this.relatedProducts.filter(
          (item) => item._id !== this.product._id
        );
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    },
    async fetchAccompanyingProducts() {
      try {
        const productId = this.product._id; // Lấy ID sản phẩm hiện tại
        const response = await axiosClient.get(
          `/products/getAccompanyProduct/${productId}`
        ); // Gọi API với phương thức GET
        this.accompanyingProducts = response.data.data || response.data;

        // Loại bỏ sản phẩm hiện tại khỏi danh sách sản phẩm đi kèm
        this.accompanyingProducts = this.accompanyingProducts.filter(
          (item) => item._id !== this.product._id
        );
      } catch (error) {
        console.error("Error fetching accompanying products:", error);
      }
    },
    async fetchReviews() {
      try {
        const productId = this.$route.params.id;
        const response = await axiosClient.get(
          `/reviews/getReviewsByProductId/${productId}`
        );
        if (response.data.success) {
          this.reviews = response.data.data;
        }
      } catch (error) {
        console.error("Lỗi lấy đánh giá:", error);
      }
    },
    formatPrice(price) {
      const formattedValue = parseFloat(price).toLocaleString("vi-VN");
      return `${formattedValue}₫`;
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
    goToProductDetail(productId) {
      this.isLoading = true;
      this.$router.push(`/user/products/${productId}`);
    },
  },
};
</script>

<style scoped>
.product-detail-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 130px;
  background-color: #f5f5f5;
}

.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3; /* Màu xám nhạt cho viền ngoài */
  border-top: 5px solid #3ba8cd; /* Màu xanh cho phần xoay */
  border-radius: 50%;
  animation: spin 1s linear infinite; /* Hiệu ứng xoay */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.product-detail {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  background-color: #ffffff;
  padding: 20px 120px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.main-image img {
  width: 400px;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
}

.image-thumbnails {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.image-thumbnails img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 4px;
}

.image-thumbnails img.active {
  border-color: #3ba8cd;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Đẩy nội dung giữa tiêu đề và nút xuống cuối */
  height: 400px; /* Chiều cao của thẻ sản phẩm, điều chỉnh theo ý muốn */
}

.product-info h1 {
  font-weight: bold;
  font-size: 28px;
  color: #333;
}

.product-price {
  font-size: 24px;
  color: #de2b28;
  margin: 10px 0;
}
.product-price .label {
  font-weight: bold; /* Làm đậm chữ */
  font-size: 20px; /* Tăng kích thước chữ (nếu cần) */
  color: #de2b28; /* Màu chữ (có thể tùy chỉnh theo ý muốn) */
}
.quantity {
  font-size: 18px;
  color: #333;
  margin-left: 10px;
}

.out-of-stock {
  background-color: red;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  display: inline-block;
  margin-top: 10px;
}

.in-stock {
  background-color: green;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  display: inline-block;
  margin-top: 10px;
}

.product-description {
  margin: 20px 0;
  padding: 0 120px;
}

.highlight {
  color: #3ba8cd; /* Màu xanh biển */
  font-weight: bold; /* In đậm chữ */
}

.add-to-cart {
  align-self: flex-start; /* Canh giữa theo chiều ngang */
  padding: 10px 20px;
  background-color: #3ba8cd;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: auto; /* Đẩy nút xuống cuối */
}

.add-to-cart i {
  margin-right: 5px;
}

.add-to-cart:disabled {
  background-color: #ccc; /* Màu nền khi bị vô hiệu hóa */
  cursor: not-allowed; /* Con trỏ không cho phép */
  color: #666; /* Màu chữ mờ hơn */
}

.disabled-button {
  opacity: 0.6; /* Làm mờ nút khi bị vô hiệu hóa */
}

.product-extra-info {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.accompanying-products {
  margin-top: 20px; /* Khoảng cách với phần trên */
  padding: 20px;
  background-color: #f9f9f9;
  border-top: 1px solid #ddd;
  width: 100%;
}

.accompanying-products h3 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: center;
}

.accompanying-products-list {
  transition: transform 0.5s ease; /* Hiệu ứng chuyển động mượt */
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.accompanying-product-card {
  width: calc(25% - 20px); /* Hiển thị 4 sản phẩm trên một hàng */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  margin: 0;
  text-align: center;
  border: 1px solid #8d8686;
  border-radius: 0px;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  cursor: pointer;
  flex-shrink: 0;
}

.accompanying-product-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.accompanying-product-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  transition: transform 0.3s ease;
  margin: 0 auto;
}

.accompanying-product-image:hover {
  transform: scale(1.07);
}

.accompanying-product-card h4 {
  margin: 10px 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.accompanying-product-card p {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}
.product-slider {
  position: relative;
  /* display: flex;
  align-items: center; */
}

/* CSS cho nút Next */
.slider-button.next-button {
  position: absolute;
  top: 50%;
  right: 0;
  background-color: #3ba8cd;
  color: #fff;
  border: none;
  padding: 10px;
  font-size: 1.5rem;
  cursor: pointer;
  border-radius: 50%;
  transform: translateY(-50%); /* Canh giữa theo chiều dọc */
}

/* CSS cho nút Prev */
.slider-button.prev-button {
  position: absolute;
  top: 50%;
  left: 0;
  background-color: #3ba8cd;
  color: #fff;
  border: none;
  padding: 10px;
  font-size: 1.5rem;
  cursor: pointer;
  border-radius: 50%;
  transform: translateY(-50%); /* Canh giữa theo chiều dọc */
  z-index: 10;
}

.slider-button:hover {
  background-color: #007bff;
}

.slider-button:disabled {
  background-color: #ccc; /* Màu xám nhạt khi bị vô hiệu hóa */
  cursor: not-allowed;
}

.special-offers,
.extra-documents {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.special-offers h2 {
  background-color: #3ba8cd; /* Màu xanh biển */
  color: #ffffff; /* Chữ trắng */
  padding: 10px;
  border-radius: 8px 8px 0 0; /* Bo góc trên */
  margin: 0; /* Xóa khoảng cách trên và dưới */
  font-size: 18px;
}

ul {
  list-style: none;
  padding: 3px;
  margin-top: 10px;
}

li {
  margin-bottom: 10px;
}

.contact-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
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

.related-products {
  margin-top: 20px; /* Khoảng cách với phần trên */
  padding: 20px;
  background-color: #f9f9f9;
  border-top: 1px solid #ddd;
  width: 100%;
}

.related-products h3 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: center;
}

.related-products-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.related-product-card {
  width: calc(25% - 20px); /* Hiển thị 4 sản phẩm trên một hàng */
  box-sizing: border-box;
  margin: 0;
  text-align: center;
  border: 1px solid #8d8686;
  border-radius: 0px;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  cursor: pointer;
}

.related-product-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.related-product-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  transition: transform 0.3s ease;
  margin: 0 auto;
}

.related-product-image:hover {
  transform: scale(1.07);
}

.related-product-card h4 {
  margin: 10px 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.related-product-card p {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.reviews {
  padding: 20px;
  background-color: #f9f9f9;
  border-top: 1px solid #ddd;
}
.review {
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  background-color: #ffffff;
}
.review p {
  margin: 0;
}
.review strong {
  font-weight: bold;
}
.rating-stars {
  font-size: 18px;
  color: #ccc; /* Màu mặc định của ngôi sao */
}

.star.filled {
  color: #fbc02d; /* Màu vàng cho ngôi sao đã được đánh giá */
}

.rating-text {
  margin-left: 5px;
  font-size: 14px;
  color: #333;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.tabs button {
  padding: 10px 20px;
  background-color: #f5f5f5;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.tabs button.active {
  background-color: #3ba8cd;
  color: white;
}
</style>
