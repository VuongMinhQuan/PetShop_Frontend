<template>
  <div class="login-page">
    <div class="login-container">
      <h2>Chào mừng bạn đến với PetMart</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-floating mb-2">
          <input
            type="text"
            id="login-identifier"
            v-model="identifier"
            class="form-control form-control-lg blue-border"
            placeholder=""
            required
          />
          <label for="login-identifier" class="text-blue">Nhập Email/Số điện thoại</label>
        </div>
        <div class="form-floating mb-2">
          <input
            v-model="password"
            type="password"
            id="login-password"
            class="form-control form-control-lg blue-border"
            placeholder=" "
          />
          <label for="login-password" class="text-blue">Mật khẩu</label>
        </div>

        <button type="submit">Đăng nhập</button>
        <div
          style="
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
          "
        >
          <p style="margin: 0">
            <a href="#" @click.prevent="showForgotPasswordModal"
              >Quên mật khẩu?</a
            >
          </p>
          <p style="margin: 0">
            <a href="/user/register">Chưa có tài khoản?</a>
          </p>
        </div>
      </form>
      <div class="text-center mb-4">
        <p class="text-muted">Hoặc đăng nhập bằng:</p>
        <div class="social-buttons">
          <button type="button" class="btn btn-google rounded-pill mb-2">
            <i class="fab fa-google"></i> Google
          </button>
          <button type="button" class="btn btn-facebook rounded-pill mb-2">
            <i class="fab fa-facebook-f"></i> Facebook
          </button>
          <button type="button" class="btn btn-apple rounded-pill mb-2">
            <i class="fab fa-apple"></i> Apple
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Forgot Password -->
    <div
      class="modal fade"
      id="forgotPasswordModal"
      tabindex="-1"
      aria-labelledby="forgotPasswordModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="forgotPasswordModalLabel">
              Quên mật khẩu
            </h5>
            <button
              type="button"
              class="btn-close ms-auto"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleForgotPassword">
              <div v-if="!otpSent" class="mb-3">
                <label for="forgotEmail" class="form-label">Nhập Email:</label>
                <input
                  type="email"
                  id="forgotEmail"
                  v-model="forgotEmail"
                  class="form-control"
                  required
                />
                <button
                  type="button"
                  class="btn btn-primary mt-2"
                  @click="sendOtp"
                >
                  Gửi OTP
                </button>
              </div>
              <div v-if="otpSent" class="mb-3">
                <label for="otp" class="form-label">Mã xác nhận OTP:</label>
                <input
                  type="text"
                  id="otp"
                  v-model="otp"
                  class="form-control"
                  required
                />
              </div>
              <button v-if="otpSent" type="submit" class="btn btn-primary">
                Xác nhận
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      identifier: "",
      password: "",
    };
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      // Kiểm tra giá trị đầu vào để xác định là email hay số điện thoại
      const isEmail = this.identifier.includes('@');
      const payload = {
        [isEmail ? 'EMAIL' : 'PHONE_NUMBER']: this.identifier,
        PASSWORD: this.password,
      };
      try {
        // const result = await this.$store.dispatch('login', payload);
        await this.login(payload);
        this.$router.push('/user/home');
        
      } catch (error) {
        this.$message.error(
          error.response?.data?.message || "Đăng nhập thất bại!"
        );
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  height: 100vh; /* Chiếm toàn bộ chiều cao màn hình */
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("@/assets/background2.jpg"); /* Đường dẫn tới hình nền */
  background-size: cover; /* Để hình ảnh phủ toàn bộ màn hình */
  background-position: center; /* Để hình ảnh căn giữa */
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-container {
  width: 400px; /* Thay đổi kích thước form */
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3); /* Đường viền mờ */
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  background-color: rgba(241, 240, 244, 0.6);
  text-align: center;
  animation: fadeInUp 1s ease-out; /* Thêm hiệu ứng animation */
}

.form-group {
  margin-bottom: 15px; /* Giảm khoảng cách giữa các trường */
}

label {
  display: block;
  margin-bottom: 8px; /* Giảm khoảng cách giữa label và input */
  font-size: 1.1em; /* Giảm kích thước font của label */
}

input {
  width: 100%;
  padding: 8px; /* Giảm padding của input */
  font-size: 1em; /* Giảm kích thước font của input */
  box-sizing: border-box;
  background-color: #fff;
  border: 1px solid rgba(10, 10, 10, 0.5); /* Đường viền input trong suốt */
}

button {
  width: 100%;
  padding: 10px; /* Giảm padding của nút */
  background-color: rgba(18, 140, 185, 0.8); /* Nút trong suốt */
  border: none;
  color: white;
  font-size: 1em; /* Giảm kích thước font của nút */
  cursor: pointer;
}

button:hover {
  background-color: rgba(72, 111, 217, 0.8);
}

.text-center {
  text-align: center;
}

.mb-4 {
  margin-top: 4%; /* Giảm margin-top */
}

.social-buttons {
  display: flex;
  flex-direction: column;
  width: 100%; /* Đảm bảo các nút chiếm hết chiều rộng của container */
}

.btn-google {
  background-color: #db4437; /* Màu nền của nút Google */
}

.btn-facebook {
  background-color: #3b5998; /* Màu nền của nút Facebook */
}

.btn-apple {
  background-color: #000; /* Màu nền của nút Apple */
}

.btn-close {
  font-size: 0.8rem; /* Kích thước font nhỏ hơn */
  width: 1.5rem; /* Đặt chiều rộng */
  height: 1.5rem; /* Đặt chiều cao */
  padding: 0.25rem; /* Padding nhỏ hơn */
  margin: 0; /* Xóa margin */
  opacity: 0.5; /* Đặt độ mờ cho nút đóng */
}

/* Màu xanh biển cho border */
.blue-border {
  border: 2px solid #6fafeb; /* Màu xanh biển */
  background-color: #ffffff; /* Giữ nền trắng */
  color: #06090b; /* Màu text là xanh biển */
}

/* Khi focus vào input */
.blue-border:focus {
  border-color: #1b8df5; /* Xanh biển khi focus */
  box-shadow: 0 0 5px rgba(27, 141, 245, 0.5); /* Hiệu ứng ánh sáng khi focus */
}

/* Màu xanh biển cho label */
.text-blue {
  color: #0f5394; /* Màu xanh biển cho chữ */
}
</style>
