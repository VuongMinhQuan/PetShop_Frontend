<template>
  <div class="profile-page">
    <h2>Thông tin cá nhân</h2>
    <div v-if="user">
      <div class="profile-info">
        <p><strong>Họ và tên:</strong> {{ user.FULLNAME }}</p>
        <p><strong>Email:</strong> {{ user.EMAIL }}</p>
        <p><strong>Số điện thoại:</strong> {{ user.PHONE_NUMBER }}</p>
        <p><strong>Tổng số tiền đã mua hàng:</strong> {{ formatPrice(totalSpent) }} VNĐ</p>
        <!-- Hiển thị tổng số tiền -->
      </div>
      <div class="profile-actions">
        <button @click="editProfile" class="btn">Chỉnh sửa thông tin</button>
      </div>
    </div>
    <div v-else>
      <p>Đang tải thông tin...</p>
    </div>
  </div>
</template>

<script>
import axiosClient from "../../../api/axiosClient"; // Giả sử bạn có axiosClient để gọi API

export default {
  data() {
    return {
      user: null, // Chứa thông tin người dùng
      totalSpent: 0, // Khởi tạo biến để lưu tổng số tiền
    };
  },
  async created() {
    await this.fetchUserProfile();
    await this.fetchTotalSpent(); // Gọi phương thức để lấy tổng số tiền
  },
  methods: {
    async fetchUserProfile() {
      try {
        const response = await axiosClient.get("users/profile");
        this.user = response.data; // Lưu thông tin người dùng vào biến user
      } catch (error) {
        console.error("Lỗi khi tải thông tin người dùng:", error);
        this.$toast.error("Không thể tải thông tin người dùng", {
          position: "top-right",
          duration: 3000,
        });
      }
    },
    async fetchTotalSpent() {
      try {
        const response = await axiosClient.get("bookings/totalspent");
        if (response.data.success) {
          this.totalSpent = response.data.data.totalSpent; // Lấy totalSpent từ response.data.data
        } else {
          console.error("Lỗi khi lấy dữ liệu:", response.data.message);
          this.$toast.error(response.data.message, {
            position: "top-right",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Lỗi khi tải tổng số tiền:", error);
        this.$toast.error("Không thể tải tổng số tiền mua hàng", {
          position: "top-right",
          duration: 3000,
        });
      }
    },
    formatPrice(price) {
      return price ? parseFloat(price).toLocaleString("vi-VN") : "0";
    },
    editProfile() {
      this.$router.push("/user/edit-profile"); // Điều hướng đến trang chỉnh sửa thông tin
    },
  },
};
</script>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  align-items: center; /* Căn giữa theo chiều ngang */
  justify-content: center;
  min-height: 80vh; /* Chiều cao tối thiểu là toàn màn hình */
  background-image: url("@/assets/background2.jpg"); /* Đường dẫn tới hình nền */
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.profile-page::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2); /* Lớp phủ mờ */
  z-index: 0;
}

.profile-info {
  background-color: rgba(255, 255, 255, 0.3); /* Nền trắng mờ */
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Bóng cho hộp */
  border: 2px solid rgba(59, 168, 205, 0.5); /* Viền màu xanh mờ và trong suốt */
  width: 100vh;
  height: 30vh;
  max-width: 500px; /* Giới hạn chiều rộng tối đa */
  position: relative;
  z-index: 1;
}

h2 {
  text-align: center;
  font-size: 2rem;
  color: #3ba8cd;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.profile-info p {
  font-size: 1.2rem;
  margin: 10px 0;
}

.profile-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  position: relative;
  z-index: 1;
}

.btn {
  padding: 10px 20px;
  background-color: #3ba8cd;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Bóng cho nút */
}

.btn:hover {
  background-color: #007bff;
}
</style>
