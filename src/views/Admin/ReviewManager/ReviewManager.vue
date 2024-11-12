<template>
  <div class="review-manager">
    <h1>Quản lý đánh giá</h1>
    <div class="reviews-container">
      <div
        v-for="review in paginatedReviews"
        :key="review._id"
        class="review-card"
      >
        <div class="review-header">
          <h2>{{ review.productName }}</h2>
          <p class="review-date">{{ formatDate(review.reviewDate) }}</p>
        </div>
        <div class="review-content">
          <img
            v-if="review.productImage"
            :src="review.productImage"
            alt="Product Image"
            class="product-image"
          />
          <div class="review-info">
            <p><strong>Người dùng:</strong> {{ review.userName }}</p>
            <p>
              <strong>Xếp hạng:</strong>
              <span
                v-for="star in 5"
                :key="star"
                class="star"
                :class="{ filled: star <= review.rating }"
                >&#9733;</span
              >
            </p>
            <p><strong>Bình luận:</strong> {{ review.comment }}</p>
            <!-- Nút ẩn/hiện chỉ hiển thị nếu STATUS là true -->
            <button
              v-if="review.status"
              @click="toggleReviewStatus(review._id, false)"
              class="status-button hide-button"
            >
              Ẩn
            </button>
            <button
              v-else
              @click="toggleReviewStatus(review._id, true)"
              class="status-button show-button"
            >
              Hiện
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Pagination Controls -->
    <div class="pagination">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        Trước
      </button>
      <span>Trang {{ currentPage }} / {{ totalPages }}</span>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        Sau
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toast-notification";

export default {
  name: "ReviewManager",
  data() {
    return {
      reviews: [],
      currentPage: 1, // Trang hiện tại
      reviewsPerPage: 10,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.reviews.length / this.reviewsPerPage);
    },
    paginatedReviews() {
      const start = (this.currentPage - 1) * this.reviewsPerPage;
      const end = start + this.reviewsPerPage;
      return this.reviews.slice(start, end);
    },
  },
  mounted() {
    this.fetchAllReviews();
  },
  methods: {
    async fetchAllReviews() {
      try {
        const response = await axios.get(
          "http://localhost:3000/reviews/getAllReviewsWithStatus"
        );
        this.reviews = response.data.data.sort(
          (a, b) => new Date(b.reviewDate) - new Date(a.reviewDate)
        );
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đánh giá:", error);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    async toggleReviewStatus(reviewId, newStatus) {
      const toast = useToast(); // Sử dụng toast trong phương thức
      try {
        // Gửi yêu cầu cập nhật trạng thái của đánh giá
        await axios.patch(`http://localhost:3000/reviews/hide/${reviewId}`, {
          status: newStatus,
        });

        // Cập nhật trạng thái mới cho đánh giá trong danh sách
        const review = this.reviews.find((r) => r._id === reviewId);
        if (review) {
          review.status = newStatus;
        }
        toast.open({
          message: `Đánh giá đã được ${newStatus ? "hiện" : "ẩn"} thành công!`,
          type: "success",
          duration: 3000,
          position: "top-right",
        });
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đánh giá:", error);
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
};
</script>

<style scoped>
.review-manager {
  padding: 20px;
}

h1 {
  color: #176ba3;
  text-align: center;
  margin-bottom: 20px;
}

.reviews-container {
  display: flex;
  flex-direction: column; /* Mỗi card sẽ nằm trên một hàng */
  gap: 20px;
  justify-content: center;
}

.review-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative; /* Thêm để chứa nút bên trong */
}
.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.review-date {
  font-size: 0.9em;
  color: #1380c9;
}

.review-content {
  display: flex;
  align-items: center;
  margin-top: 10px;
  justify-content: space-between; /* Căn giữa các phần tử trong thẻ review-content */
}
.review-info {
  flex: 1; /* Để phần thông tin đánh giá chiếm không gian còn lại */
}
.product-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  margin-right: 15px;
}

.review-info p {
  margin: 5px 0;
}

.star {
  color: #ccc;
  font-size: 20px;
}

.star.filled {
  color: #ff9800;
}

.status-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 8px; /* Tăng độ bo góc */
  padding: 7px 11px; /* Tăng kích thước padding */
  cursor: pointer;
  font-size: 1.1em; /* Tăng kích thước chữ */
  font-weight: bold; /* Làm chữ đậm */
}
.hide-button {
  background-color: red; /* Màu đỏ */
}
.show-button {
  background-color: #4caf50; /* Màu xanh lá */
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
}

.pagination button {
  background-color: #3ba8cd;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.pagination button:hover {
  background-color: #2a88a2;
  transform: translateY(-2px);
}

.pagination button:disabled {
  background-color: #a3d4e4;
  cursor: not-allowed;
}

.pagination span {
  font-size: 16px;
  color: #3ba8cd;
  font-weight: bold;
}
</style>
