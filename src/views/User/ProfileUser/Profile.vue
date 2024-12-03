<template>
  <div class="profile-page">
    <h2>Thông tin cá nhân</h2>
    <div v-if="user" class="profile-container">
      <div class="profile-avatar">
        <img
          src="@/assets/avatar-user.jpg"
          alt="User Avatar"
          class="avatar-image"
        />
        <p class="user-name">{{ user.FULLNAME }}</p>
        <p class="user-email">{{ user.EMAIL }}</p>
      </div>
      <div class="profile-info">
        <p><strong>Họ và tên:</strong> {{ user.FULLNAME }}</p>
        <p>
          <strong>Email:</strong>
          <span v-if="!isEditingEmail">{{ user.EMAIL }}</span>
          <input
            v-else
            type="email"
            v-model="newEmail"
            placeholder="Nhập email mới"
            class="email-input"
          />
        </p>
        <p><strong>Số điện thoại:</strong> {{ user.PHONE_NUMBER }}</p>
        <p>
          <strong>Tổng số tiền đã mua hàng:</strong>
          {{ formatPrice(totalSpent) }} VNĐ
        </p>

        <!-- Nút hành động nằm trong profile-info -->
        <div class="profile-actions">
          <button v-if="!isEditingEmail" @click="startEditEmail" class="btn">
            Chỉnh sửa email
          </button>
          <button v-if="isEditingEmail" @click="saveEmail" class="btn">
            Lưu email
          </button>
          <button
            v-if="isEditingEmail"
            @click="cancelEditEmail"
            class="btn-cancle"
          >
            Hủy bỏ
          </button>
          <div class="profile-actions">
            <!-- Các nút hiện có -->
            <button @click="startForgotPassword" class="btn">
              Đổi mật khẩu
            </button>
          </div>
        </div>
        <!-- Thêm nút Quên mật khẩu -->
      </div>
      <!-- Form xác thực OTP -->
      <div v-if="showOtpForm" class="modal-overlay">
        <div class="otp-modal">
          <h3>Xác thực OTP</h3>
          <p>Vui lòng nhập mã OTP đã được gửi đến email mới của bạn.</p>
          <input
            type="text"
            v-model="otpCode"
            placeholder="Nhập mã OTP"
            class="otp-input"
          />
          <button @click="verifyOtp" class="btn">Xác thực</button>
          <button @click="cancelOtpVerification" class="btn">Hủy bỏ</button>
        </div>
      </div>
      <div v-if="isPasswordModalVisible" class="modal-overlay">
        <div class="otp-modal">
          <h3>Gửi OTP để đổi mật khẩu</h3>
          <p>OTP sẽ được gửi đến email của bạn</p>
          <form @submit.prevent="sendForgotPasswordEmail">
            <div class="form-group">
              <label>Email:</label>
              <input type="email" v-model="user.EMAIL" disabled />
            </div>
            <div class="otp-buttons">
              <button type="submit" class="btn-send-otp">Gửi OTP</button>
              <button
                type="button"
                @click="closePasswordModal"
                class="btn-cancel-otp"
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      </div>
      <div v-if="isOTPPasswordVisible" class="modal-overlay">
        <div class="otp-modal">
          <h3>Nhập OTP và mật khẩu mới</h3>
          <form @submit.prevent="resetPassword">
            <div class="form-group">
              <label for="otp">OTP:</label>
              <input
                type="text"
                v-model="otpPassword"
                required
                placeholder="Nhập mã OTP"
              />
            </div>
            <div class="form-group">
              <label for="newPassword">Mật khẩu mới:</label>
              <input
                type="password"
                v-model="newPassword"
                required
                placeholder="Nhập mật khẩu mới"
              />
            </div>
            <div class="buttons">
              <button class="btn-confirm-otp" @click="verifyOtp">
                Xác nhận
              </button>
              <button class="btn-cancel-otp" @click="cancelOtpVerification">
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Đang tải thông tin...</p>
    </div>
  </div>
</template>

<script>
import axiosClient from "../../../api/axiosClient";

export default {
  data() {
    return {
      user: null,
      totalSpent: 0,
      isEditingEmail: false, // Điều khiển trạng thái chỉnh sửa email
      showOtpForm: false, // Hiển thị form OTP
      otpCode: "", // Mã OTP nhập từ người dùng
      newEmail: "", // Email mới cần xác thực
      isPasswordModalVisible: false, // Hiển thị modal gửi OTP
      isOTPPasswordVisible: false, // Hiển thị form nhập OTP và mật khẩu mới
      otpPassword: "", // Lưu mã OTP
      newPassword: "", // Mật khẩu mới
    };
  },
  async created() {
    await this.fetchUserProfile();
    await this.fetchTotalSpent();
  },
  methods: {
    async fetchUserProfile() {
      try {
        const response = await axiosClient.get("users/profile");
        this.user = response.data;
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
          this.totalSpent = response.data.data.totalSpent;
        } else {
          this.$toast.error(response.data.message, {
            position: "top-right",
            duration: 3000,
          });
        }
      } catch (error) {
        this.$toast.error("Không thể tải tổng số tiền mua hàng", {
          position: "top-right",
          duration: 3000,
        });
      }
    },
    startForgotPassword() {
      this.isPasswordModalVisible = true; // Hiển thị modal gửi OTP
    },
    async sendForgotPasswordEmail() {
      try {
        await axiosClient.post("/users/forgotPassword", {
          email: this.user.EMAIL,
        });
        this.$toast.success("OTP đã được gửi đến email của bạn.", {
          position: "top-right",
          duration: 3000,
        });
        this.isPasswordModalVisible = false;
        this.isOTPPasswordVisible = true; // Hiển thị modal nhập OTP và mật khẩu mới
      } catch (error) {
        console.error("Lỗi khi gửi OTP:", error);
        this.$toast.error("Không thể gửi OTP. Vui lòng thử lại.", {
          position: "top-right",
          duration: 3000,
        });
      }
    },
    async resetPassword() {
      try {
        const response = await axiosClient.post("/users/resetPassword", {
          email: this.user.EMAIL,
          otp: this.otpPassword,
          newPassword: this.newPassword,
        });
        if (response.data.success) {
          this.$toast.success("Mật khẩu đã được thay đổi thành công.", {
            position: "top-right",
            duration: 3000,
          });
          this.closeOTPPasswordModal(); // Đóng modal nhập OTP
        } else {
          this.$toast.error("OTP không chính xác hoặc hết hạn.", {
            position: "top-right",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Lỗi khi đổi mật khẩu:", error);
        this.$toast.error("Không thể thay đổi mật khẩu. Vui lòng thử lại.", {
          position: "top-right",
          duration: 3000,
        });
      }
    },
    closePasswordModal() {
      this.isPasswordModalVisible = false;
    },
    closeOTPPasswordModal() {
      this.isOTPPasswordVisible = false;
      this.otpPassword = ""; // Reset OTP
      this.newPassword = ""; // Reset mật khẩu mới
    },
    formatPrice(price) {
      return price ? parseFloat(price).toLocaleString("vi-VN") : "0";
    },
    startEditEmail() {
      this.isEditingEmail = true;
      this.newEmail = this.user.EMAIL; // Đặt email hiện tại vào trường nhập liệu
    },
    cancelEditEmail() {
      this.isEditingEmail = false;
      this.newEmail = "";
    },
    async saveEmail() {
      try {
        const response = await axiosClient.put("/users/updateUser", {
          EMAIL: this.newEmail,
        });
        if (response.data.success) {
          this.showOtpForm = true;
          this.isEditingEmail = false;
          this.$toast.info(
            "Email đã được cập nhật. Vui lòng xác thực qua OTP.",
            {
              position: "top-right",
              duration: 3000,
            }
          );
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật email:", error);
        this.$toast.error("Không thể cập nhật email", {
          position: "top-right",
          duration: 3000,
        });
      }
    },
    async verifyOtp() {
      try {
        const response = await axiosClient.post(
          "/users/verifyOTPAndActivateUser",
          {
            email: this.newEmail,
            otp: this.otpCode,
          }
        );
        if (response.data.success) {
          this.$toast.success("Xác thực email thành công!", {
            position: "top-right",
            duration: 3000,
          });
          this.user.IS_ACTIVATED = true;
          this.user.EMAIL = this.newEmail; // Cập nhật email đã xác thực
          this.showOtpForm = false;
          this.otpCode = "";
        } else {
          this.$toast.error("Mã OTP không chính xác", {
            position: "top-right",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Lỗi khi xác thực OTP:", error);
        this.$toast.error("Xác thực thất bại!", {
          position: "top-right",
          duration: 3000,
        });
      }
    },
    cancelOtpVerification() {
      this.showOtpForm = false;
      this.otpCode = "";
      this.newEmail = ""; // Hủy bỏ email mới nếu hủy xác thực
    },
  },
};
</script>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  background-image: url("@/assets/background2.jpg");
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
  background-color: rgba(255, 255, 255, 0.2);
  z-index: 0;
}

.profile-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 20px; /* Khoảng cách giữa avatar và thông tin */
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  position: relative; /* Đặt relative để z-index hoạt động */
  z-index: 1; /* Cao hơn lớp ::before */
}

.profile-avatar {
  text-align: center;
  flex: 0 0 150px; /* Đảm bảo phần avatar có chiều rộng cố định */
  border-right: 2px solid rgba(0, 0, 0, 0.1); /* Đường thẳng ngăn cách */
  padding-right: 20px; /* Khoảng cách giữa đường thẳng và avatar */
}

.avatar-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #3ba8cd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.user-name,
.user-email {
  margin-top: 10px;
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.6); /* Kiểu chữ mờ */
}

.user-name {
  font-weight: bold;
}

.user-email {
  font-style: italic;
  font-size: 0.9rem;
}

.profile-info {
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  width: 100%; /* Điều chỉnh chiều rộng để tránh tràn */
  max-width: 500px;
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

.email-input {
  width: calc(100% - 20px); /* Điều chỉnh độ rộng để có khoảng cách bên trong */
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box; /* Đảm bảo padding không làm tràn chiều rộng */
}

.otp-form {
  margin-top: 20px;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.otp-input {
  width: 80%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.profile-actions {
  display: flex;
  justify-content: center; /* Căn giữa các nút */
  margin-top: 20px; /* Khoảng cách với phần thông tin bên trên */
  gap: 15px; /* Khoảng cách giữa các nút */
  width: 100%; /* Đảm bảo nút nằm ngang toàn phần */
  flex-wrap: wrap; /* Đặt các nút xuống dòng nếu cần */
}

.btn {
  padding: 10px 20px;
  background-color: #3ba8cd;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.btn-cancle {
  padding: 10px 20px;
  background-color: #d81e1e;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.btn:hover {
  background-color: #007bff;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* Lớp phủ tối */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2; /* Đảm bảo lớp phủ ở trên cùng */
}

.otp-modal {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 350px;
  text-align: center;
}

.otp-modal h3 {
  color: #3ba8cd;
}

.otp-input {
  width: 80%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.otp-modal .btn {
  margin-top: 10px;
}
.modal-content h2 {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s, box-shadow 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #3498db;
  box-shadow: 0 0 8px rgba(52, 152, 219, 0.5);
  outline: none;
}

.buttons {
  display: flex;
  justify-content: space-between; /* Căn đều các nút */
  align-items: center;
}

.otp-buttons {
  display: flex;
  justify-content: space-between; /* Căn đều hai nút */
  gap: 10px; /* Khoảng cách giữa hai nút */
}

.btn-send-otp {
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  background-color: #2ecc71; /* Màu xanh */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-send-otp:hover {
  background-color: #27ae60; /* Đậm hơn khi hover */
  transform: translateY(-2px); /* Nhẹ nhàng nâng lên */
}

.btn-confirm-otp {
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-confirm-otp:hover {
  background-color: #27ae60;
  transform: translateY(-2px);
}

.btn-cancel-otp {
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-cancel-otp:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
}

.buttons button {
  flex: 1; /* Đảm bảo các nút đều nhau */
  margin: 0 10px; /* Khoảng cách giữa các nút */
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.buttons button:first-child {
  margin-left: 0; /* Xóa khoảng cách bên trái của nút đầu tiên */
}

.buttons button:last-child {
  margin-right: 0; /* Xóa khoảng cách bên phải của nút cuối cùng */
}

.buttons .btn-confirm {
  background-color: #2ecc71;
  color: white;
}

.buttons .btn-confirm:hover {
  background-color: #27ae60;
  transform: translateY(-2px);
}

.buttons .btn-close {
  background-color: #e74c3c;
  color: white;
}

.buttons .btn-close:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
