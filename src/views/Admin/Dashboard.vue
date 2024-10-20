<template>
  <div class="dashboard-container">
    <!-- Dashboard Cards -->
    <div class="card card-red">
      <div class="card-icon bordered-icon">
        <i class="fa-solid fa-user"></i>
      </div>
      <div class="card-content">
        <h1>{{ totalUser }}</h1>
        <p>Tổng số user đăng ký</p>
        <small>Other hand, we denounce</small>
      </div>
    </div>

    <div class="card card-blue">
      <div class="card-icon bordered-icon">
        <i class="fa-solid fa-boxes-stacked"></i>
      </div>
      <div class="card-content">
        <h1>{{ totalProduct }}</h1>
        <p>Tổng số sản phẩm</p>
        <small>Other hand, we denounce</small>
      </div>
    </div>

    <div class="card card-green">
      <div class="card-icon bordered-icon">
        <i class="fa-solid fa-cart-flatbed"></i>
      </div>
      <div class="card-content">
        <h1>{{ totalOrder }}</h1>
        <p>Tổng đơn hàng đã đặt</p>
        <small>Other hand, we denounce</small>
      </div>
    </div>
  </div>

  <!-- Quản lý Đơn hàng -->
  <div class="table-container">
    <div class="table-header">
      <h2>Quản lý Đơn hàng</h2>
      <div class="filter-container">
        <label for="statusFilter"><i class="fa-solid fa-filter"></i></label>
        <select
          id="statusFilter"
          v-model="selectedStatus"
          @change="filterOrders"
        >
          <option value="">Tất cả</option>
          <option value="Paid">Đã thanh toán</option>
          <option value="NotYetPaid">Chờ xác nhận</option>
          <option value="Confirm">Đã xác nhận</option>
          <option value="Canceled">Đã hủy</option>
        </select>
      </div>
    </div>
    <table class="order-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên khách hàng</th>
          <th>Số điện thoại</th>
          <th>Ngày đặt</th>
          <th>Tổng giá (VND)</th>
          <th>Phương thức thanh toán</th>
          <th>Trạng thái thanh toán</th>
          <th>Hành động</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(order, index) in filteredOrders" :key="index">
          <td>#{{ index + 1 }}</td>
          <td>{{ order.USER_INFO.FULLNAME }}</td>
          <td>{{ order.USER_INFO.PHONE_NUMBER }}</td>
          <td>{{ formatDate(order.createdAt) }}</td>
          <td class="total-price">
            {{ order.TOTAL_PRICE.toLocaleString("vi-VN") }} ₫
          </td>
          <td>{{ order.PAYMENT_METHOD }}</td>
          <td>
            <span :class="['status-label', order.STATUS]">
              {{
                order.STATUS === "Paid"
                  ? "Đã thanh toán"
                  : order.STATUS === "NotYetPaid"
                  ? "Chờ xác nhận"
                  : order.STATUS === "Confirm"
                  ? "Đã xác nhận"
                  : order.STATUS === "Canceled"
                  ? "Đã hủy"
                  : ""
              }}
            </span>
          </td>

          <td>
            <button
              class="approve-btn"
              :disabled="order.STATUS !== 'NotYetPaid'"
              :class="{ disabled: order.STATUS !== 'NotYetPaid' }"
              @click="updateStatus(order.bookingId, 'Confirm')"
            >
              Duyệt
            </button>
            <button
              class="cancel-btn"
              :disabled="order.STATUS !== 'NotYetPaid'"
              :class="{ disabled: order.STATUS !== 'NotYetPaid' }"
              @click="updateStatus(order.bookingId, 'Canceled')"
            >
              Hủy
            </button>
          </td>
          <td>
            <button class="details-order" @click="openForm(order)">
              <i class="fa-solid fa-eye"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <transition name="fade">
    <div v-show="isFormVisible"></div>
  </transition>
  <!-- Form Chi Tiết Đơn Hàng -->
  <transition
    name="slide"
    @before-enter="beforeEnter"
    @after-enter="afterEnter"
    @leave="leave"
  >
    <div v-show="isFormVisible" class="details-form">
      <button class="close-button" @click="closeForm">
        <i class="fa-solid fa-x"></i>
      </button>
      <h3>Chi tiết đơn hàng</h3>
      <hr class="separator-line" />

      <p><strong>Mã đơn:</strong> {{ selectedOrder.bookingId }}</p>
      <p>
        <i class="fa-regular fa-compass compass-icon"></i>
        <span class="customer-name">{{ selectedOrder.CUSTOMER_NAME }}</span
        >,
        <span class="customer-phone">{{ selectedOrder.CUSTOMER_PHONE }}</span>
      </p>
      <p><strong>Địa chỉ:</strong> {{ selectedOrder.CUSTOMER_ADDRESS }}</p>
      <hr class="separator-line" />
      <ul class="product-list">
        <li v-for="(product, index) in selectedOrder.LIST_PRODUCT" :key="index">
          <!-- Phần hình ảnh -->
          <div class="product-images">
            <img
              :src="product.IMAGES[0]"
              alt="Ảnh sản phẩm"
              class="product-img"
              v-if="product.IMAGES && product.IMAGES.length > 0"
            />
          </div>

          <!-- Phần thông tin -->
          <div class="product-info">
            <p>
              <strong>{{ product.NAME }}</strong>
            </p>
            <p class="faded-text">
              {{ product.QUANTITY }} x {{ formatPrice(product.PRICE) }}
            </p>
            <p>Thành tiền: {{ formatPrice(product.TOTAL_PRICE_PRODUCT) }}</p>
          </div>
        </li>
      </ul>
      <div class="bottom-section">
        <p>Ngày đặt hàng: {{ formatDateTime(selectedOrder.createdAt) }}</p>
        <p>
          Tổng cộng:
          <span class="total-price-text">{{
            formatPrice(selectedOrder.TOTAL_PRICE)
          }}</span>
        </p>
      </div>
    </div>
  </transition>
</template>

<script>
import axiosClient from "@/api/axiosClient"; // Đảm bảo đã import axiosClient

export default {
  name: "Dashboard",
  data() {
    return {
      totalUser: 10,
      totalProduct: 120,
      totalOrder: 50,
      orders: [], // Mảng lưu trữ danh sách đơn hàng
      filteredOrders: [], // Mảng lưu trữ danh sách đơn hàng đã lọc
      selectedStatus: "", // Trạng thái đã chọn để lọc
      isFormVisible: false, // Trạng thái mở/đóng form
      selectedOrder: {},
      overlayElement: null, // Để lưu trữ phần tử overlay
    };
  },
  methods: {
    async fetchAllBookings() {
      try {
        // Gọi API lấy tất cả các booking
        const response = await axiosClient.get("/bookings/getAllBookings");
        if (response.data.success) {
          this.orders = response.data.data; // Gán dữ liệu từ API vào orders
          this.filteredOrders = this.orders;
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    },
    filterOrders() {
      if (this.selectedStatus) {
        this.filteredOrders = this.orders.filter(
          (order) => order.STATUS === this.selectedStatus
        );
      } else {
        this.filteredOrders = this.orders; // Hiển thị tất cả nếu không có trạng thái nào được chọn
      }
    },
    formatPrice(price) {
      const formattedValue = parseFloat(price).toLocaleString("vi-VN");
      return `${formattedValue}₫`;
    },
    formatDateTime(dateTimeString) {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Định dạng 24 giờ
      };
      return new Date(dateTimeString).toLocaleString("vi-VN", options);
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(dateString).toLocaleDateString("vi-VN", options);
    },
    async updateStatus(bookingId, status) {
      try {
        // Gọi API cập nhật trạng thái booking
        const response = await axiosClient.put("/bookings/updateStatus", {
          bookingId: bookingId,
          status: status,
        });

        if (response.data.success) {
          this.$toast.success(response.data.msg); // Hiển thị thông báo thành công
          this.fetchAllBookings(); // Cập nhật danh sách đơn hàng sau khi thay đổi trạng thái
        } else {
          this.$toast.error(response.data.msg); // Hiển thị thông báo lỗi nếu có
        }
      } catch (error) {
        console.error("Error updating booking status:", error);
        this.$toast.error("Cập nhật trạng thái thất bại"); // Thông báo lỗi chung
      }
    },
    addOverlay() {
      if (!this.overlayElement) {
        this.overlayElement = document.createElement("div");
        this.overlayElement.style.position = "fixed";
        this.overlayElement.style.top = "0";
        this.overlayElement.style.left = "0";
        this.overlayElement.style.width = "100%";
        this.overlayElement.style.height = "100%";
        this.overlayElement.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        this.overlayElement.style.zIndex = "1000";
        document.body.appendChild(this.overlayElement);
      }
    },

    // Xóa overlay khỏi body
    removeOverlay() {
      if (this.overlayElement) {
        document.body.removeChild(this.overlayElement);
        this.overlayElement = null;
      }
    },
    async openForm(order) {
      console.log("Opening form for order:", order);
      this.selectedOrder = order; // Lưu đơn hàng được chọn

      // Gọi API để lấy chi tiết đơn hàng
      try {
        const response = await axiosClient.get(
          `/bookings/getBookingDetails/${order.bookingId}`
        );
        if (response.data.success) {
          this.selectedOrder = response.data.data; // Cập nhật selectedOrder với dữ liệu nhận được
          this.isFormVisible = true; // Hiển thị form
          this.addOverlay();
        } else {
          this.$toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
        this.$toast.error("Lấy thông tin chi tiết đơn hàng thất bại");
      }
    },
    closeForm() {
      this.isFormVisible = false; // Đóng form
      this.selectedOrder = {}; // Xóa đơn hàng đã chọn

      this.removeOverlay();
    },
    beforeEnter(el) {
      // Thiết lập trạng thái ban đầu của form
      el.style.transform = "translateX(100%)";
      el.style.transition = "transform 0.35s ease";
    },
    afterEnter(el) {
      // Đảm bảo form ở vị trí đúng sau khi hiệu ứng hoàn thành
      el.style.transform = "translateX(0%)";
    },
    leave(el, done) {
      // Khi rời khỏi, trượt phần tử ra khỏi màn hình
      el.style.transform = "translateX(100%)";
      el.style.transition = "transform 0.5s ease"; // Thêm hiệu ứng transition
      requestAnimationFrame(() => {
        el.style.transform = "translateX(100%)";
      });
      setTimeout(() => done(), 500); // Chờ 0.5s để hoàn thành hiệu ứng trượt
    },
  },
  created() {
    // Khi component được tạo, gọi hàm fetchAllBookings để lấy dữ liệu
    this.fetchAllBookings();
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 0 40px;
}

.card {
  border: 2px solid #ccc;
  border-radius: 12px;
  width: 250px;
  padding: 30px;
  text-align: center;
  margin: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-red {
  background-color: #e57373;
}

.card-blue {
  background-color: #64b5f6;
}

.card-green {
  background-color: #81c784;
}

.bordered-icon {
  background-color: #ffff;
  border: 2px solid #ccc;
  border-radius: 50%;
  margin-left: 55px;
  display: inline-block;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-content h1 {
  color: #ffff;
  margin: 0;
  font-size: 36px;
}

.card-content p {
  color: #ffff;
  margin: 10px 0 5px;
  font-size: 18px;
}

.card-content small {
  font-size: 12px;
  color: #777;
}

/* Bảng Quản lý Đơn hàng */
.table-container {
  margin-top: 20px;
}
.table-container select {
  margin-left: 10px;
}
.table-header {
  display: flex; /* Sử dụng Flexbox để căn chỉnh */
  justify-content: space-between; /* Đẩy các phần tử ở 2 đầu */
  align-items: center; /* Căn giữa theo chiều dọc */
  margin-bottom: 20px; /* Khoảng cách dưới để tách khỏi bảng */
}

.filter-container {
  display: flex; /* Sử dụng Flexbox để căn chỉnh nội dung */
  align-items: center; /* Căn giữa theo chiều dọc */
}

#statusFilter {
  margin-left: 10px; /* Khoảng cách giữa label và select */
  padding: 5px; /* Thêm khoảng cách bên trong cho select */
  border-radius: 5px; /* Bo góc cho select */
  border: 1px solid #ccc; /* Viền cho select */
  background-color: #fff; /* Màu nền cho select */
}


.total-price {
  font-size: 1.1rem;
  font-weight: bold;
}
.order-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.order-table th,
.order-table td {
  border: 1px solid #d1cbcb;
  padding: 8px;
  text-align: center;
}

.order-table th {
  background-color: #f4f4f4;
}
.product-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.product-list li {
  padding: 5px 0; /* Khoảng cách giữa các sản phẩm trong danh sách */
}

/* CSS cho trạng thái */
.status-label {
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
  display: inline-block;
  font-size: 1rem;
}

.Paid {
  border: 2px solid #4caf50; /* Màu xanh cho đã thanh toán */
  color: #e7ebe7;
  background-color: #4caf50;
}

.Confirm {
  border: 2px solid rgb(20, 193, 215); /* Màu xanh cho đã thanh toán */
  color: #e7ebe7;
  background-color: rgb(20, 193, 215);
}

.NotYetPaid {
  border: 2px solid #e57373; /* Màu đỏ cho chưa thanh toán */
  color: #e57373;
}

.Canceled {
  border: 2px solid #d20c0c; /* Màu xanh nhạt cho đang xử lý */
  color: #ffff;
  background-color: #d20c0c;
}

.approve-btn {
  background-color: #4caf50;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}

.cancel-btn {
  background-color: #e57373;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* Thêm trạng thái cho nút bị vô hiệu hóa */
.disabled {
  background-color: #ccc !important; /* Màu xám cho nút bị disabled */
  color: #666 !important; /* Màu chữ xám nhạt */
  cursor: not-allowed; /* Con trỏ không cho phép */
}

/* Tùy chọn khác cho nút khi bị disabled */
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.details-order {
  border-radius: 5px;
  padding: 5px 10px;
  color: #199fb7;
}

.close-button {
  background-color: #d20c0c; /* Nền màu đỏ */
  color: #ffffff; /* Biểu tượng màu trắng */
  border: none; /* Xóa viền nút */
  border-radius: 5px; /* Bo góc nút */
  padding: 8px 12px; /* Khoảng cách trong nút */
  cursor: pointer; /* Thay đổi con trỏ khi hover */
  display: flex; /* Để căn giữa biểu tượng */
  align-items: center;
  justify-content: center;
  position: absolute; /* Đặt vị trí tuyệt đối */
  top: 10px; /* Cách phía trên 10px */
  right: 10px; /* Cách phía phải 10px */
  z-index: 10; /* Đảm bảo nút hiển thị phía trên các phần tử khác */
}

.close-button i {
  color: #ffffff; /* Biểu tượng màu trắng */
  font-size: 16px; /* Kích thước biểu tượng */
}

.details-form {
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  border-radius: 5px;
  position: fixed; /* Đặt vị trí cố định */
  top: 0;
  right: 0; /* Đặt ở bên phải màn hình */
  width: 33%; /* Chiếm 1/3 kích thước trang web */
  height: 100%; /* Chiều cao đầy đủ */
  background-color: white; /* Màu nền trắng */
  border-left: 2px solid #ccc; /* Viền bên trái */
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3); /* Bóng đổ */
  z-index: 2001;
  overflow-y: auto;
}

.details-form h3 {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  color: #64b5f6;
}
.details-form ul {
  list-style-type: none; /* Loại bỏ dấu chấm */
}
.separator-line {
  border: 0;
  height: 1px;
  background-color: #1d67a4; /* Màu xanh biển */
  margin: 20px 0; /* Khoảng cách trên và dưới */
}

.compass-icon {
  color: #d20c0c;
}

.customer-name,
.customer-phone {
  margin-left: 5px;
  font-weight: bold; /* Làm cho văn bản đậm hơn */
}

ul {
  list-style-type: none; /* Loại bỏ dấu chấm */
  padding: 0;
  margin: 0;
}

.product-list li {
  display: flex; /* Sử dụng Flexbox để căn chỉnh */
  align-items: center; /* Căn giữa theo chiều dọc */
  margin-bottom: 10px; /* Khoảng cách giữa các mục sản phẩm */
}
.faded-text {
  color: rgba(0, 0, 0, 0.6); /* Màu đen với độ mờ 60% */
}
.product-images {
  margin-right: 15px; /* Khoảng cách giữa ảnh và thông tin */
}

.product-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.product-info {
  display: flex;
  flex-direction: column; /* Căn thông tin theo chiều dọc */
}

.product-info p {
  margin: 2px 0; /* Khoảng cách giữa các dòng thông tin */
}

.bottom-section {
  margin-top: auto; /* Đẩy phần này xuống cuối form */
  padding-top: 20px; /* Thêm khoảng cách trên cùng */
  border-top: 1px solid #ccc; /* Đường gạch ngang để phân cách */
}

.total-price-text {
  font-size: 20px;
  font-weight: bold;
}

/* Responsive layout */
@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
    align-items: center;
  }
}
</style>
