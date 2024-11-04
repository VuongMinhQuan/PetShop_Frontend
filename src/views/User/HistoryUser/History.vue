<template>
  <div class="history-page">
    <h2>Lịch sử đơn hàng</h2>
    <div v-if="bookings.length === 0" class="no-bookings">
      Không có đơn hàng nào
    </div>
    <div v-else>
      <div
        v-for="(booking, index) in paginatedBookings"
        :key="index"
        class="booking-card"
      >
        <div class="booking-header">
          <p>
            Trạng thái:
            <span
              :class="{
                'status-paid': booking.STATUS === 'Paid',
                'status-unpaid': booking.STATUS === 'NotYetPaid',
                'status-confirm': booking.STATUS === 'Confirm',
                'status-shipping': booking.STATUS === 'Shipping',
                'status-canceled': booking.STATUS === 'Canceled',
                'status-complete': booking.STATUS === 'Complete',
              }"
            >
              {{
                booking.STATUS === "Paid"
                  ? "Đã thanh toán"
                  : booking.STATUS === "Confirm"
                  ? "Đã xác nhận"
                  : booking.STATUS === "Shipping"
                  ? "Đang vận chuyển"
                  : booking.STATUS === "Complete"
                  ? "Hoàn thành"
                  : booking.STATUS === "Canceled"
                  ? "Đã hủy"
                  : "Chưa thanh toán"
              }}
            </span>
          </p>
        </div>

        <div class="customer-info">
          <p>
            <i class="fa-solid fa-user"></i>
            Khách hàng:
            <span class="bold-text">{{ booking.CUSTOMER_NAME }}</span>
          </p>
          <p>
            <i class="fa-solid fa-phone"></i>
            Điện thoại:
            <span class="bold-text">{{ booking.CUSTOMER_PHONE }}</span>
          </p>
          <p>
            <i class="fas fa-location-dot"></i>
            Địa chỉ:
            <span class="bold-text"
              >{{ booking.CUSTOMER_ADDRESS }}, {{ booking.WardName }},
              {{ booking.DistrictName }}, TP {{ booking.ProvinceName }}</span
            >
          </p>
        </div>

        <hr class="divider" />

        <div class="product-list">
          <h4>Sản phẩm</h4>
          <div
            v-for="(product, productIndex) in booking.LIST_PRODUCT"
            :key="productIndex"
            class="product-item"
          >
            <img
              :src="product.PRODUCT_ID.IMAGES"
              alt="product image"
              class="product-image"
            />
            <div class="product-info">
              <p>
                <strong>{{ product.PRODUCT_ID.NAME }}</strong>
              </p>
              <p>Giá: {{ formatPrice(product.PRODUCT_ID.PRICE) }} đ</p>
              <p>Số lượng: {{ product.QUANTITY }}</p>
            </div>
            <div class="total-price-product">
              Thành tiền: {{ formatPrice(product.TOTAL_PRICE_PRODUCT) }} đ
            </div>
            <div class="review-action">
              <button
                v-if="booking.STATUS === 'Complete'"
                @click="openReviewForm(booking._id, product.PRODUCT_ID._id)"
                class="review-button"
              >
                Viết đánh giá
              </button>
            </div>
          </div>
        </div>

        <div class="total-price">
          <p>
            <strong>Tổng tiền đơn hàng:</strong>
            {{ formatPrice(booking.TOTAL_PRICE) }} đ
          </p>
          <div v-if="booking.STATUS === 'NotYetPaid'">
            <button
              @click="cancelOrder(booking._id)"
              class="cancel-order-button"
            >
              Hủy đơn hàng
            </button>
          </div>
          <div
            v-if="
              booking.STATUS === 'Shipping' || booking.STATUS === 'Complete'
            "
          >
            <button
              v-if="booking.STATUS === 'Shipping'"
              @click="markAsComplete(booking._id)"
              class="complete-button"
            >
              Đã nhận được hàng
            </button>
          </div>
          <!-- Form Viết Đánh Giá với Overlay -->
          <div v-if="isReviewFormVisible[booking._id]" class="overlay">
            <div class="review-form">
              <h3>Viết đánh giá</h3>
              <div class="star-rating">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="star"
                  :class="{ active: star <= rating }"
                  @click="setRating(star)"
                >
                  &#9733;
                </span>
              </div>
              <textarea
                v-model="comment"
                placeholder="Nhập nhận xét của bạn..."
                class="comment-input"
              ></textarea>
              <div class="form-actions">
                <button @click="submitReview" class="submit-button">
                  Gửi đánh giá
                </button>
                <button
                  @click="closeReviewForm(booking._id)"
                  class="cancel-button"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">
          Trang trước
        </button>
        <span>Trang {{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">
          Trang sau
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axiosClient from "../../../api/axiosClient";

export default {
  name: "History",
  data() {
    return {
      bookings: [], // Chứa danh sách các booking
      currentPage: 1, // Trang hiện tại
      itemsPerPage: 5, // Số đơn hàng trên mỗi trang
      isReviewFormVisible: [], // Chuyển thành mảng
      selectedBooking: null, // Đơn hàng được chọn để viết đánh giá
      rating: 0,
      comment: "",
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.bookings.length / this.itemsPerPage);
    },
    paginatedBookings() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.bookings.slice(start, end);
    },
  },
  async created() {
    // Gọi phương thức fetchBooking trong created
    await this.fetchBooking();
  },
  methods: {
    // Phương thức fetchBooking để lấy dữ liệu đơn hàng
    async fetchBooking() {
      try {
        const response = await axiosClient.post("/bookings/getBookingByUserId");
        this.bookings = response.data.data.map((booking) => {
          return {
            ...booking,
            LIST_PRODUCT: booking.LIST_PRODUCT.map((product) => ({
              ...product,
              isReviewed: false, // Mặc định là false
              review: null,
            })),
          };
        });
      } catch (error) {
        console.error("Error fetching bookings:", error);
        this.$toast.error("Lỗi khi tải dữ liệu đơn hàng", {
          position: "top-right",
          duration: 3000,
        });
      }
    },
    async fetchReviewsForProducts() {
      try {
        const userId = this.$store.state.userId; // Lấy ID người dùng từ store hoặc bất kỳ nguồn nào khác

        // Duyệt qua từng booking và sản phẩm trong booking
        for (const booking of this.bookings) {
          for (const product of booking.LIST_PRODUCT) {
            // Gọi API để lấy đánh giá cho sản phẩm
            const response = await axiosClient.post(
              `/reviews/getReviewByUserAndProduct`,
              {
                userId: userId,
                productId: product.PRODUCT_ID._id, // Sử dụng ID sản phẩm
              }
            );

            if (response.data.success) {
              product.isReviewed = true; // Đánh dấu là đã đánh giá
              product.review = response.data.data; // Lưu thông tin đánh giá
            }
          }
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        this.$toast.error("Lỗi khi tải dữ liệu đánh giá", {
          position: "top-right",
          duration: 3000,
        });
      }
    },
    openReviewForm(bookingId, productId) {
      this.selectedBooking = this.bookings.find(
        (booking) => booking._id === bookingId
      );
      this.selectedProductId = productId; // Lưu id sản phẩm
      this.isReviewFormVisible[bookingId] = true; // Mở form đánh giá cho booking cụ thể

      // Gọi API để lấy thông tin đánh giá cho sản phẩm cụ thể này
      axiosClient
        .post("/reviews/getReviewByUserAndProduct", {
          userId: this.selectedBooking.USER_ID,
          productId: this.selectedProductId,
          bookingId: bookingId,
        })
        .then((response) => {
          if (response.data.success) {
            const review = response.data.data;
            this.rating = review.RATING; // Lấy rating đã lưu
            this.comment = review.COMMENT; // Lấy comment đã lưu
          } else {
            // Nếu không có đánh giá, reset lại các giá trị
            this.rating = 0;
            this.comment = "";
          }
        })
        .catch((error) => {
          console.error("Lỗi khi lấy thông tin đánh giá:", error);
          if (error.response && error.response.status === 404) {
            // Nếu không tìm thấy đánh giá, thiết lập mặc định
            this.rating = 0;
            this.comment = "";
          } else {
            // Xử lý lỗi khác nếu cần
            this.$toast.error("Lỗi khi tải dữ liệu đánh giá", {
              position: "top-right",
              duration: 3000,
            });
          }
        });
    },
    closeReviewForm(bookingId) {
      this.isReviewFormVisible[bookingId] = false; // Đóng form đánh giá cho booking cụ thể
      this.rating = 0;
      this.comment = "";
    },
    setRating(star) {
      this.rating = star;
    },
    async submitReview() {
      if (!this.comment || this.rating === 0) {
        alert("Vui lòng nhập đầy đủ đánh giá và chọn số sao!");
        return;
      }
      const reviewData = {
        userId: this.selectedBooking.USER_ID,
        bookingId: this.selectedBooking._id,
        productId: this.selectedProductId, // Sử dụng id sản phẩm đã chọn
        rating: this.rating,
        comment: this.comment,
      };
      try {
        await axiosClient.post(
          "http://localhost:3000/reviews/addReview",
          reviewData
        );
        this.$toast.success("Đánh giá của bạn đã được gửi!", {
          position: "top-right",
          duration: 3000,
        });
        this.closeReviewForm(this.selectedBooking._id);
      } catch (error) {
        console.error("Error submitting review:", error);
        this.$toast.error("Lỗi khi gửi đánh giá", {
          position: "top-right",
          duration: 3000,
        });
      }
    },
    // Phương thức formatPrice để định dạng giá tiền
    formatPrice(price) {
      return price ? parseFloat(price).toLocaleString("vi-VN") : "0";
    },
    // Chuyển sang trang trước
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    // Chuyển sang trang sau
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    async markAsComplete(bookingId) {
      try {
        await axiosClient.put(`/bookings/updateStatus`, {
          bookingId,
          status: "Complete",
        });
        this.$toast.success("Đơn hàng đã được cập nhật thành Hoàn thành", {
          position: "top-right",
          duration: 3000,
        });
        await this.fetchBooking();
      } catch (error) {
        console.error("Error updating booking status:", error);
        this.$toast.error("Lỗi khi cập nhật trạng thái đơn hàng", {
          position: "top-right",
          duration: 3000,
        });
      }
    },
    async cancelOrder(bookingId) {
      try {
        await axiosClient.put(`/bookings/updateStatus`, {
          bookingId,
          status: "Canceled",
        });
        this.$toast.success("Đơn hàng đã được hủy thành công", {
          position: "top-right",
          duration: 3000,
        });
        await this.fetchBooking(); // Cập nhật lại danh sách đơn hàng
      } catch (error) {
        console.error("Error canceling order:", error);
        this.$toast.error("Lỗi khi hủy đơn hàng", {
          position: "top-right",
          duration: 3000,
        });
      }
    },
  },
};
</script>

<style scoped>
.history-page {
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: white;
  color: #333;
}

h2 {
  text-align: center;
  font-size: 2rem;
  color: #3ba8cd;
  margin-bottom: 30px;
  font-weight: bold;
}
.status-paid {
  color: green; /* Màu xanh lá cây cho trạng thái đã thanh toán */
  font-weight: bold;
}

.status-unpaid {
  color: red; /* Màu đỏ cho trạng thái chưa thanh toán */
  font-weight: bold;
}

.status-confirm {
  color: rgb(6, 184, 89); /* Màu xanh cho trạng thái đã xác nhận */
  font-weight: bold;
}

.status-shipping {
  color: #fbc02d; /* Màu vàng cho trạng thái đang vận chuyển */
  font-weight: bold;
}

.status-complete {
  color: #13d249; /* Màu vàng cho trạng thái đang vận chuyển */
  font-weight: bold;
}

.status-canceled {
  color: red; /* Màu đỏ cho trạng thái đã hủy */
  font-weight: bold;
}

.no-bookings {
  text-align: center;
  font-size: 1.5rem;
  color: #3ba8cd;
  margin-top: 50px;
}

.booking-card {
  border: 2px solid #9babb0;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.booking-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.booking-header h3 {
  font-size: 1.5rem;
  color: #333;
  font-weight: bold;
}

.booking-header p {
  font-size: 1.2rem;
  color: #3ba8cd;
}

.customer-info {
  margin-bottom: 15px;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
  display: flex; /* Căn các thẻ p theo hàng ngang */
  justify-content: space-between; /* Phân bố khoảng cách giữa các phần tử */
}

.customer-info p {
  margin: 0 10px; /* Khoảng cách giữa các phần tử */
  font-size: 1rem;
  color: #333;
}

.bold-text {
  font-weight: bold;
  color: #333;
}

.divider {
  border: none;
  border-top: 2px solid #0a5771; /* Màu xanh biển */
  margin: 20px 0; /* Khoảng cách giữa các phần */
}

.product-list {
  margin-top: 20px;
}

.product-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 15px;
  border: 2px solid #676c6d;
}

.product-info {
  flex: 1;
}

.product-info p {
  margin: 5px 0;
  font-size: 1rem;
  color: #333;
}
.review-action {
  text-align: center; /* Căn giữa nút */
}
.total-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #3ba8cd;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  padding: 10px 20px;
  border: none;
  background-color: #3ba8cd;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  margin: 0 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.pagination button:hover {
  background-color: #25809f;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  font-size: 1.2rem;
}

.complete-button {
  background-color: #4caf50; /* Màu xanh lá cây */
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.complete-button:hover {
  background-color: #388e3c; /* Màu xanh lá cây đậm hơn khi hover */
}

.review-button {
  background-color: #ff9800;
  color: white;
  border: none;
  margin-left: 10px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.review-button:hover {
  background-color: #e68900;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  animation: fadeIn 0.3s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.review-form {
  background-color: white;
  padding: 20px 30px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform: scale(0.9);
  animation: scaleIn 0.3s forwards;
}

@keyframes scaleIn {
  to {
    transform: scale(1);
  }
}

.star-rating {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.star {
  font-size: 2rem;
  color: #ccc;
  cursor: pointer;
  transition: color 0.2s;
}

.star.active {
  color: #ffc107;
}

.comment-input {
  width: 100%;
  height: 80px;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
}

.comment-input:focus {
  outline: none;
  border-color: #3ba8cd;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.submit-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.2s;
  flex: 1;
}

.cancel-button {
  background-color: #f44336;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.2s;
  flex: 1;
}

.submit-button:hover {
  background-color: #388e3c;
}

.cancel-button:hover {
  background-color: #d32f2f;
}

.cancel-order-button {
  background-color: #f44336; /* Màu đỏ */
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.cancel-order-button:hover {
  background-color: #d32f2f; /* Màu đỏ đậm hơn khi hover */
}
</style>
