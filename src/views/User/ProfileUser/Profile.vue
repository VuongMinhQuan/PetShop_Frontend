<template>
  <div class="profile-page">
    <h2>Thông tin cá nhân</h2>
    <div v-if="user">
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
      </div>

      <!-- Các nút hành động -->
      <div class="profile-actions">
        <button v-if="!isEditingEmail" @click="startEditEmail" class="btn">
          Chỉnh sửa email
        </button>
        <button v-if="isEditingEmail" @click="saveEmail" class="btn">
          Lưu email
        </button>
        <button v-if="isEditingEmail" @click="cancelEditEmail" class="btn-cancle">
          Hủy bỏ
        </button>
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

.profile-info {
  background-color: rgba(255, 255, 255, 0.3);
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(59, 168, 205, 0.5);
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
  justify-content: center;
  margin-top: 20px;
  position: relative;
  z-index: 1;
  gap: 15px; /* Khoảng cách giữa các nút */
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
  width: 300px;
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
</style>
