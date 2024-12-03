<template>
  <div class="register-page">
    <div class="register-container">
      <form
        @submit.prevent="handleSubmit"
        v-if="!showOtpForm"
        class="signup-form"
      >
        <h2>Đăng ký</h2>
        <div class="form-group">
          <label for="FULLNAME">Họ và tên:</label>
          <input type="text" id="FULLNAME" v-model="FULLNAME" />
          <span v-if="errors.FULLNAME" class="error">{{
            errors.FULLNAME
          }}</span>
        </div>
        <div class="form-group">
          <label for="EMAIL">Email:</label>
          <input type="email" id="EMAIL" v-model="EMAIL" />
          <span v-if="errors.EMAIL" class="error">{{ errors.EMAIL }}</span>
        </div>
        <div class="form-group">
          <label for="PHONE_NUMBER">Số điện thoại:</label>
          <input type="tel" id="PHONE_NUMBER" v-model="PHONE_NUMBER" />
          <span v-if="errors.PHONE_NUMBER" class="error">{{
            errors.PHONE_NUMBER
          }}</span>
        </div>
        <div class="form-group">
          <label for="PASSWORD">Mật khẩu:</label>
          <div class="password-container">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="PASSWORD"
              v-model="PASSWORD"
            />
            <span
              @click="togglePasswordVisibility('PASSWORD')"
              class="eye-icon"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </span>
            <span v-if="errors.PASSWORD" class="error">{{
              errors.PASSWORD
            }}</span>
          </div>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Xác nhận mật khẩu:</label>
          <div class="password-container">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              v-model="confirmPassword"
            />
            <span
              @click="togglePasswordVisibility('showConfirmPassword')"
              class="eye-icon"
            >
              <i
                :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
              ></i>
            </span>
            <span v-if="errors.confirmPassword" class="error">{{
              errors.confirmPassword
            }}</span>
          </div>
        </div>
        <div class="form-group">
          <label for="ADDRESS">Địa chỉ:</label>
          <input type="text" id="ADDRESS" v-model="ADDRESS" />
          <span v-if="errors.ADDRESS" class="error">{{ errors.ADDRESS }}</span>
        </div>
        <button type="submit">Đăng ký</button>
        <p class="login-link">
          <a href="/login">Quay lại trang đăng nhập</a>
        </p>
      </form>
      <div v-if="showOtpForm" class="otp-form">
        <h2>Đăng ký thành công</h2>
        <p>
          Mã OTP đã được gửi đến địa chỉ email {{ EMAIL }}. Vui lòng kiểm tra
          email để xác thực.
        </p>
        <div class="form-group">
          <label for="otp">Nhập mã OTP</label>
          <input
            type="text"
            id="otp"
            v-model="otp"
            placeholder="Nhập mã OTP"
            required
          />
          <span v-if="otpErrors.otp" class="error">{{ otpErrors.otp }}</span>
        </div>
        <button @click.prevent="verifyOtp" class="otp-button">Xác thực</button>
      </div>
    </div>
  </div>
</template>

<script>
import axiosClient from "../../../api/axiosClient";
export default {
  data() {
    return {
      FULLNAME: "",
      EMAIL: "",
      PHONE_NUMBER: "",
      PASSWORD: "",
      ADDRESS: "",
      confirmPassword: "",
      agreedToTerms: false,
      errors: {}, // Đối tượng lưu lỗi
      showPassword: false, // Hiển thị mật khẩu
      showConfirmPassword: false, // Hiển thị xác nhận mật khẩu
      showOtpForm: false, // Hiển thị form nhập OTP sau khi đăng ký thành công
      otp: "", // Biến lưu mã OTP nhập từ người dùng
      otpErrors: {}, // Đối tượng lưu lỗi cho OTP
    };
  },
  methods: {
    async handleSubmit() {
      this.errors = {}; // Reset lỗi trước khi kiểm tra

      // Kiểm tra từng trường
      if (!this.FULLNAME) {
        this.errors.FULLNAME = "Vui lòng nhập họ và tên!";
      }
      if (!this.EMAIL) {
        this.errors.EMAIL = "Vui lòng nhập email!";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.EMAIL)) {
        this.errors.EMAIL = "Email không hợp lệ!";
      }
      if (!this.PHONE_NUMBER) {
        this.errors.PHONE_NUMBER = "Vui lòng nhập số điện thoại!";
      }
      if (!this.PASSWORD) {
        this.errors.PASSWORD = "Vui lòng nhập mật khẩu!";
      }
      if (!this.confirmPassword) {
        this.errors.confirmPassword = "Vui lòng nhập xác nhận mật khẩu!";
      } else if (this.PASSWORD !== this.confirmPassword) {
        this.errors.confirmPassword = "Mật khẩu không khớp!";
      }
      if (!this.ADDRESS) {
        this.errors.ADDRESS = "Vui lòng nhập địa chỉ!";
      }

      // Nếu có lỗi, không gửi yêu cầu đăng ký
      if (Object.keys(this.errors).length > 0) {
        return;
      }

      // Tiếp tục gửi yêu cầu đăng ký
      try {
        const response = await axiosClient.post("/users/registerUser", {
          FULLNAME: this.FULLNAME,
          EMAIL: this.EMAIL,
          PHONE_NUMBER: this.PHONE_NUMBER,
          PASSWORD: this.PASSWORD,
          ADDRESS: this.ADDRESS,
        });
        if (response.data.success) {
          alert("Đăng ký người dùng thành công!");
          this.showOtpForm = true; // Hiển thị form nhập OTP
        } else if (response.data.errors) {
          this.errors = response.data.errors; // Gán lỗi từ backend vào đối tượng errors
        }
      } catch (error) {
        if (error.response && error.response.data.errors) {
          this.errors = error.response.data.errors; // Cập nhật lỗi cho từng trường
        } else {
          console.error("Error registering user:", error);
          alert("Đã xảy ra lỗi khi đăng ký!");
        }
      }
    },
    async verifyOtp() {
      this.otpErrors = {}; // Reset lỗi trước khi gửi yêu cầu
      try {
        const response = await axiosClient.post(
          "/users/verifyOTPAndActivateUser",
          {
            email: this.EMAIL,
            otp: this.otp,
          }
        );
        if (response.data.success) {
          alert("Xác thực thành công!");
          this.$router.push("/user/login");
        } else if (response.data.errors) {
          this.otpErrors = response.data.errors; // Gán lỗi từ backend vào đối tượng otpErrors
        }
      } catch (error) {
        if (error.response && error.response.data.errors) {
          this.otpErrors = error.response.data.errors; // Cập nhật lỗi cho từng trường
        } else {
          console.error("Error verifying OTP:", error);
          alert("Đã xảy ra lỗi khi xác thực mã OTP!");
        }
      }
    },
    togglePasswordVisibility(field) {
      if (field === "PASSWORD") {
        this.showPassword = !this.showPassword;
      } else if (field === "showConfirmPassword") {
        this.showConfirmPassword = !this.showConfirmPassword;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./Register.scss";
</style>
