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
              }"
            >
              {{
                booking.STATUS === "Paid"
                  ? "Đã thanh toán"
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
            <span class="bold-text">{{ booking.CUSTOMER_ADDRESS }}</span>
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
          </div>
        </div>

        <div class="total-price">
          <p>
            <strong>Tổng tiền đơn hàng:</strong>
            {{ formatPrice(booking.TOTAL_PRICE) }} đ
          </p>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Trang trước</button>
        <span>Trang {{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Trang sau</button>
      </div>
    </div>
  </div>
</template>


<script>
import axiosClient from "../../../api/axiosClient";

export default {
  data() {
    return {
      bookings: [], // Chứa danh sách các booking
      currentPage: 1, // Trang hiện tại
      itemsPerPage: 5, // Số đơn hàng trên mỗi trang
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
        this.bookings = response.data.data; // Gán dữ liệu booking vào biến bookings
      } catch (error) {
        console.error("Error fetching bookings:", error);
        this.$toast.error("Lỗi khi tải dữ liệu đơn hàng", {
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
  margin-bottom: 10px;
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

.total-price {
  margin-top: 20px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #3ba8cd;
  text-align: right;
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

</style>
