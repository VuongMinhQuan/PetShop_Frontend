<template>
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
          <option value="Shipping">Đang vận chuyển</option>
          <option value="Complete">Hoàn thành</option>
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
          <th>
            Tổng giá (VND)
            <button class="sort-button" @click="sortOrdersByPrice">
              <i class="fa-solid fa-sort"></i>
            </button>
          </th>

          <th>Phương thức thanh toán</th>
          <th>Trạng thái thanh toán</th>
          <th>Hành động</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(order, index) in getPaginatedOrders()" :key="index">
          <td>#{{ index + 1 + (currentPage - 1) * ordersPerPage }}</td>
          <td>{{ order.CUSTOMER_NAME }}</td>
          <td>{{ order.CUSTOMER_PHONE }}</td>
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
                  : order.STATUS === "Shipping"
                  ? "Đang vận chuyển"
                  : order.STATUS === "Complete"
                  ? "Hoàn thành"
                  : order.STATUS === "Canceled"
                  ? "Đã hủy"
                  : ""
              }}
            </span>
          </td>

          <td>
            <!-- Hiển thị nút Duyệt và Hủy nếu trạng thái là 'NotYetPaid' -->
            <div
              v-if="
                order.STATUS === 'NotYetPaid' || order.STATUS === 'Canceled'
              "
            >
              <button
                class="approve-btn"
                :class="{ disabled: order.STATUS === 'Canceled' }"
                @click="
                  order.STATUS !== 'Canceled'
                    ? updateStatus(order.bookingId, 'Confirm')
                    : null
                "
              >
                Duyệt
              </button>
              <button
                class="cancel-btn"
                @click="
                  order.STATUS === 'NotYetPaid'
                    ? updateStatus(order.bookingId, 'Canceled')
                    : null
                "
                :class="{ disabled: order.STATUS === 'Canceled' }"
              >
                Hủy
              </button>
            </div>

            <!-- Chỉ hiển thị nút Vận chuyển nếu trạng thái là 'Paid' hoặc 'Confirm' -->
            <div v-if="order.STATUS === 'Paid' || order.STATUS === 'Confirm'">
              <button
                v-if="order.STATUS !== 'Shipping'"
                class="shipping-btn"
                @click="handleShipping(order.bookingId)"
              >
                Vận chuyển
              </button>
              <span v-else class="Shipping">Đang vận chuyển</span>
            </div>
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

  <div class="pagination">
  <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
    Trước
  </button>
  <span>Trang {{ currentPage }} / {{ totalPages }}</span>
  <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
    Sau
  </button>
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
      <p>
        <strong>Địa chỉ:</strong> {{ selectedOrder.CUSTOMER_ADDRESS }},
        {{ selectedOrder.WardName }}, {{ selectedOrder.DistrictName }},
        {{ selectedOrder.ProvinceName }}
      </p>
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

  <!-- Form Vận Chuyển -->
  <transition name="fade">
    <div v-show="isShippingFormVisible" class="shipping-form-overlay">
      <div class="shipping-form">
        <h3>Thông tin Vận Chuyển</h3>
        <form @submit.prevent="submitShipping">
          <label for="weight">Trọng lượng:</label>
          <input
            type="number"
            v-model="shippingInfo.weight"
            id="weight"
            required
          />

          <label for="length">Chiều dài:</label>
          <input
            type="number"
            v-model="shippingInfo.length"
            id="length"
            required
          />

          <label for="width">Chiều rộng:</label>
          <input
            type="number"
            v-model="shippingInfo.width"
            id="width"
            required
          />

          <label for="height">Chiều cao:</label>
          <input
            type="number"
            v-model="shippingInfo.height"
            id="height"
            required
          />

          <label for="required_note">Ghi chú yêu cầu:</label>
          <select v-model="shippingInfo.required_note" id="required_note">
            <option value="CHOXEMHANGKHONGTHU">Cho xem hàng</option>
            <option value="KHONGCHOXEMHANG">Không cho xem hàng</option>
          </select>
          <button type="submit">Xác nhận</button>
          <button type="button" @click="closeShippingForm">Đóng</button>
        </form>
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
      orders: [], // Mảng lưu trữ danh sách đơn hàng
      filteredOrders: [], // Mảng lưu trữ danh sách đơn hàng đã lọc
      selectedStatus: "", // Trạng thái đã chọn để lọc
      currentPage: 1, // Trang hiện tại
      ordersPerPage: 10, // Số đơn hàng mỗi trang
      totalPages: 0, // Tổng số trang
      isFormVisible: false, // Trạng thái mở/đóng form
      selectedOrder: {},
      overlayElement: null, // Để lưu trữ phần tử overlay
      isShippingFormVisible: false, // Trạng thái hiển thị form
      sortOrder: 0,
      shippingInfo: {
        weight: 1,
        length: 1,
        width: 1,
        height: 1,
        required_note: "",
      },
    };
  },
  methods: {
    calculateTotalPages() {
      this.totalPages = Math.ceil(
        this.filteredOrders.length / this.ordersPerPage
      );
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    getPaginatedOrders() {
      const start = (this.currentPage - 1) * this.ordersPerPage;
      let end = this.currentPage * this.ordersPerPage;

      if (end > this.filteredOrders.length) {
        end = this.filteredOrders.length;
      }

      return this.filteredOrders.slice(start, end);
    },
    async fetchAllBookings() {
      try {
        // Gọi API lấy tất cả các booking
        const response = await axiosClient.get("/bookings/getAllBookings");
        if (response.data.success) {
          this.orders = response.data.data; // Gán dữ liệu từ API vào orders
          this.filteredOrders = this.orders;
          this.calculateTotalPages();
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
      this.calculateTotalPages();
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
    handleShipping(bookingId) {
      this.selectedOrder.bookingId = bookingId;
      this.isShippingFormVisible = true; // Hiển thị form khi nhấn nút Vận chuyển
    },
    closeShippingForm() {
      this.isShippingFormVisible = false; // Đóng form
      this.shippingInfo = {
        // Reset dữ liệu khi đóng form
        weight: 1,
        length: 1,
        width: 1,
        height: 1,
        required_note: "",
      };
    },
    async submitShipping() {
      try {
        // console.log(this.selectedOrder.bookingId);
        const response = await axiosClient.post("/bookings/shipping", {
          bookingId: this.selectedOrder.bookingId, // Lấy bookingId từ đơn hàng được chọn
          weight: this.shippingInfo.weight,
          length: this.shippingInfo.length,
          width: this.shippingInfo.width,
          height: this.shippingInfo.height,
          required_note: this.shippingInfo.required_note,
        });

        // Xử lý phản hồi từ server
        if (response.data.success) {
          this.$toast.success("Đã gửi thông tin vận chuyển thành công!"); // Hiển thị thông báo thành công
          this.updateStatus(this.selectedOrder.bookingId, "Shipping");
          this.closeShippingForm(); // Đóng form
        } else {
          this.$toast.error("Có lỗi xảy ra: " + response.data.msg); // Hiển thị thông báo lỗi
        }
      } catch (error) {
        console.error("Error submitting shipping info:", error);
        this.$toast.error("Đã xảy ra lỗi khi gửi thông tin vận chuyển."); // Hiển thị thông báo lỗi chung
      }
    },
    sortOrdersByPrice() {
      console.log("Clicked to sort by price");
      if (this.sortOrder === 0) {
        this.sortOrder = 1; // Đổi sang giảm dần
        this.filteredOrders.sort((a, b) => b.TOTAL_PRICE - a.TOTAL_PRICE);
      } else if (this.sortOrder === 1) {
        this.sortOrder = -1; // Đổi sang tăng dần
        this.filteredOrders.sort((a, b) => a.TOTAL_PRICE - b.TOTAL_PRICE);
      } else {
        this.sortOrder = 0; // Trở lại mặc định
        this.filteredOrders = [...this.orders]; // Sao chép từ orders ban đầu
      }
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
  background-color: #4caf50;
  color: #ffffff;
  border: 2px solid #4caf50;
}

.Confirm {
  background-color: #2196f3;
  color: #ffffff;
  border: 2px solid #2196f3;
}

.NotYetPaid {
  background-color: #f44336;
  color: #ffffff;
  border: 2px solid #f44336;
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

.shipping-btn {
  color: rgb(19, 177, 19);
  padding: 5px 10px;
  border: 1px solid rgb(19, 177, 19);
  border-radius: 5px;
  cursor: pointer;
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
.shipping-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.shipping-form {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.shipping-form h3 {
  margin-bottom: 20px;
}

.shipping-form label {
  display: block;
  margin: 10px 0 5px;
}

.shipping-form input,
.shipping-form select {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.shipping-form button {
  padding: 10px 15px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.Shipping {
  border: 2px solid #fbc02d; /* Màu vàng cho đang vận chuyển */
  color: #ffffff;
  background-color: #fbc02d;
}

.Complete {
  border: 2px solid #4caf50; /* Màu xanh cho hoàn thành */
  color: #ffffff;
  background-color: #4caf50;
}

.complete-btn {
  background-color: #4caf50; /* Nền xanh lá */
  color: white; /* Chữ trắng */
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.complete-btn:hover {
  background-color: #388e3c; /* Màu xanh đậm khi hover */
}

.fa-sort {
  cursor: pointer; /* Thêm con trỏ chuột */
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


/* Responsive layout */
@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
    align-items: center;
  }
}
</style>
