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
          v-if="activeTab === 'Các sản phẩm tương tự'"
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

          <!-- Tabs trong phần Đánh giá -->
          <div class="review-tabs">
            <button
              v-for="reviewTab in reviewTabs"
              :key="reviewTab"
              :class="{ active: activeReviewTab === reviewTab }"
              @click="
                activeReviewTab = reviewTab;
                if (reviewTab === 'Đánh giá của bạn') fetchUserReview();
              "
            >
              {{ reviewTab }}
            </button>
          </div>

          <!-- Nội dung của tab Tất cả đánh giá -->
          <div v-if="activeReviewTab === 'Tất cả đánh giá'">
            <div v-if="Array.isArray(reviews) && reviews.length === 0">
              Chưa có đánh giá nào.
            </div>
            <div v-else class="average-rating-section">
              <h3>Đánh giá của người mua</h3>
              <div class="average-rating">
                <span
                  class="star"
                  v-for="n in 5"
                  :key="n"
                  :class="{ filled: n <= Math.round(averageRating) }"
                  >★</span
                >
                <span class="average-text"
                  >Dựa trên {{ reviews.length }} đánh giá</span
                >
              </div>

              <div class="rating-distribution">
                <div
                  v-for="star in [5, 4, 3, 2, 1]"
                  :key="star"
                  class="distribution-row"
                >
                  <span>{{ star }}</span>
                  <div class="bar">
                    <div
                      class="filled-bar"
                      :style="{ width: `${ratingPercentages[star]}%` }"
                    ></div>
                  </div>
                  <span>{{ ratingPercentages[star] }}%</span>
                </div>
              </div>

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
                    >★</span
                  >
                  <span class="rating-text">({{ review.RATING }} / 5)</span>
                </div>
                <p>{{ review.COMMENT }}</p>
              </div>
            </div>
          </div>
          <div v-if="activeReviewTab === 'Đánh giá của bạn'">
            <div v-if="userReviews && userReviews.length > 0">
              <div
                v-for="userReview in userReviews"
                :key="userReview._id"
                class="review"
              >
                <p>
                  <strong>{{ userReview.USER_ID.FULLNAME }}</strong>
                </p>
                <div class="rating-stars">
                  <span
                    v-for="n in 5"
                    :key="n"
                    :class="{ filled: n <= userReview.RATING }"
                    class="star"
                    >★</span
                  >
                  <span class="rating-text">({{ userReview.RATING }} / 5)</span>
                </div>
                <div class="review-content">
                  <p>{{ userReview.COMMENT }}</p>
                  <div class="review-actions">
                    <button
                      @click="openEditModal(userReview)"
                      class="edit-button"
                    >
                      <i class="fa-solid fa-pen-to-square edit-icon"></i> Sửa
                    </button>
                    <button
                      @click="deleteReview(userReview._id)"
                      class="delete-button"
                    >
                      <i class="fa-solid fa-trash delete-icon"></i> Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>Bạn chưa có đánh giá nào cho sản phẩm này.</div>
          </div>
          <div v-if="isEditModalVisible" class="overlay">
            <div class="review-form">
              <h3>Chỉnh sửa đánh giá</h3>
              <div class="star-rating">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="star"
                  :class="{ active: star <= rating }"
                  @click="setRating(star)"
                >
                  ★
                </span>
              </div>
              <textarea
                v-model="comment"
                placeholder="Nhập nhận xét của bạn..."
                class="comment-input"
              ></textarea>
              <div class="form-actions">
                <button @click="submitEditedReview" class="submit-button">
                  Cập nhật
                </button>
                <button @click="closeEditModal" class="cancel-button">
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosClient from "../../../api/axiosClient";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      product: {},
      mainImage: "", // Ảnh chính được hiển thị
      relatedProducts: [],
      accompanyingProducts: [],
      reviews: [], // Danh sách đánh giá
      userReviews: [],
      averageRating: 0, // Đánh giá trung bình
      ratingPercentages: {}, // Phần trăm phân bố đánh giá
      isLoading: false,
      currentPage: 0, // Quản lý trang hiện tại của slider
      itemsPerPage: 4, // Số sản phẩm hiển thị trên mỗi trang
      isEditModalVisible: false, // Kiểm soát hiển thị modal chỉnh sửa
      selectedReview: null, // Đánh giá được chọn để chỉnh sửa
      rating: 0,
      comment: "",
      activeTab: "Sản phẩm đi kèm", // Tab đang được chọn
      tabs: [
        "Sản phẩm đi kèm",
        "Mô tả sản phẩm",
        "Các sản phẩm tương tự",
        "Đánh giá",
      ],
      reviewTabs: ["Tất cả đánh giá", "Đánh giá của bạn"], // Tabs trong phần Đánh giá
      activeReviewTab: "Tất cả đánh giá",
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
    openEditModal(review) {
      this.selectedReview = review;
      this.rating = review.RATING;
      this.comment = review.COMMENT;
      this.isEditModalVisible = true;
    },
    closeEditModal() {
      this.isEditModalVisible = false;
      this.rating = 0;
      this.comment = "";
      this.selectedReview = null;
    },
    setRating(star) {
      this.rating = star; // Cập nhật số sao khi người dùng chọn
    },
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
    async submitEditedReview() {
      console.log("Submitting review with rating:", this.rating);
      if (!this.comment || this.rating === 0) {
        alert("Vui lòng nhập đầy đủ đánh giá và chọn số sao!");
        return;
      }

      const reviewData = {
        rating: this.rating,
        comment: this.comment,
      };

      try {
        await axiosClient.put(
          `/reviews/updateReview/${this.selectedReview._id}`,
          reviewData
        );

        this.$toast.success("Đánh giá của bạn đã được cập nhật!", {
          position: "top-right",
          duration: 3000,
        });

        // Cập nhật lại dữ liệu đánh giá
        this.fetchUserReview();
        this.fetchReviews();

        this.closeEditModal();
      } catch (error) {
        console.error("Error updating review:", error);
        this.$toast.error("Lỗi khi cập nhật đánh giá", {
          position: "top-right",
          duration: 3000,
        });
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
          this.reviews = response.data.data.filter((review) => review.STATUS);
          this.calculateAverageRating();
        }
      } catch (error) {
        console.error("Lỗi lấy đánh giá:", error);
      }
    },
    async fetchUserReview() {
      try {
        const productId = this.$route.params.id;
        const response = await axiosClient.get(
          `/reviews/getReviewsByProductId/${productId}`
        );
        console.log("Response Data:", response.data.data);

        if (response.data.success) {
          const token = localStorage.getItem("accessToken");
          if (token) {
            const userPayload = JSON.parse(atob(token.split(".")[1]));
            const userId = userPayload.userId || userPayload.id;

            // Lọc tất cả đánh giá của người dùng
            this.userReviews = response.data.data.filter(
              (review) =>
                review.USER_ID._id === userId && review.STATUS === true
            );

            console.log("User Reviews:", this.userReviews);

            // Kiểm tra nếu không có đánh giá phù hợp
            if (this.userReviews.length === 0) {
              console.log("Không tìm thấy đánh giá của người dùng này.");
            }
          }
        }
      } catch (error) {
        console.error("Lỗi lấy đánh giá của bạn:", error);
      }
    },
    async deleteReview(reviewId) {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn muốn xóa đánh giá này không?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        try {
          const response = await axiosClient.delete(
            `/reviews/deleteReview/${reviewId}`
          );
          if (response.data.success) {
            Swal.fire({
              title: "Đã xóa!",
              text: "Đánh giá đã được xóa thành công.",
              icon: "success",
              confirmButtonText: "Đóng",
            });

            // Cập nhật lại danh sách đánh giá sau khi xóa
            this.fetchUserReview();
          } else {
            this.$toast.error(response.data.msg, {
              position: "top-right",
              duration: 3000,
            });
          }
        } catch (error) {
          console.error("Lỗi khi xóa đánh giá:", error);
          this.$toast.error("Có lỗi xảy ra khi xóa đánh giá", {
            position: "top-right",
            duration: 3000,
          });
        }
      }
    },
    calculateAverageRating() {
      let totalRating = 0;
      let ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      this.reviews.forEach((review) => {
        totalRating += review.RATING;
        ratingCounts[review.RATING]++;
      });

      this.averageRating = (totalRating / this.reviews.length).toFixed(1);

      // Tính phần trăm cho mỗi mức đánh giá
      for (let i = 1; i <= 5; i++) {
        this.ratingPercentages[i] = (
          (ratingCounts[i] / this.reviews.length) *
          100
        ).toFixed(0);
      }
    },
    formatPrice(price) {
      const formattedValue = parseFloat(price).toLocaleString("vi-VN");
      return `${formattedValue}₫`;
    },
    async addToCart(product) {
      if (!this.isLogin) {
        this.$toast.warning(
          "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.",
          {
            position: "top-right",
            duration: 3000,
          }
        );
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
    goToProductDetail(productId) {
      this.isLoading = true;
      this.$router.push(`/user/products/${productId}`);
    },
  },
};
</script>
<style lang="scss">
@import "./ProductDetail.scss";
</style>
