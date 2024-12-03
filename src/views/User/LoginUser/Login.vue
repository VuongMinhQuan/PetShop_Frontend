<template>
  <div class="login-page">
    <div class="login-container">
      <h2>Chào mừng bạn đến với Q-PetShop</h2>
      <form
        v-if="!showForgotPasswordForm && !showResetPasswordForm"
        @submit.prevent="handleLogin"
      >
        <div class="form-floating mb-2">
          <input
            type="text"
            id="login-identifier"
            v-model="identifier"
            class="form-control form-control-lg blue-border"
            placeholder=""
          />
          <label for="login-identifier" class="text-blue"
            >Nhập Email/Số điện thoại</label
          >
          <p v-if="errors.identifier" class="text-danger">
            {{ errors.identifier }}
          </p>
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
          <p v-if="errors.password" class="text-danger">
            {{ errors.password }}
          </p>
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
      <!-- Form Quên mật khẩu -->
      <form
        v-if="showForgotPasswordForm"
        @submit.prevent="sendForgotPassword"
        class="forgot-password-form"
      >
        <h3>Quên mật khẩu</h3>
        <p>Vui lòng nhập email để nhận mã OTP khôi phục mật khẩu</p>
        <div class="form-floating mb-2">
          <input
            type="email"
            v-model="forgotEmail"
            class="form-control form-control-lg blue-border"
            placeholder=" "
            required
          />
          <label for="forgot-email" class="text-blue">Nhập Email</label>
        </div>
        <button type="submit">Gửi yêu cầu</button>
        <p style="margin-top: 20px">
          <a href="#" @click.prevent="cancelForgotPassword"
            >Quay lại đăng nhập</a
          >
        </p>
      </form>
      <!-- Form Đặt lại mật khẩu -->
      <form
        v-if="showResetPasswordForm"
        @submit.prevent="resetPassword"
        class="reset-password-form"
      >
        <h3>Đặt lại mật khẩu</h3>
        <div class="form-floating mb-2">
          <input
            type="text"
            v-model="otpCode"
            class="form-control form-control-lg blue-border"
            placeholder=" "
            required
          />
          <label for="otp-code" class="text-blue">Nhập mã OTP</label>
        </div>
        <div class="form-floating mb-2">
          <input
            type="password"
            v-model="newPassword"
            class="form-control form-control-lg blue-border"
            placeholder=" "
            required
          />
          <label for="new-password" class="text-blue">Nhập mật khẩu mới</label>
        </div>
        <div class="form-floating mb-2">
          <input
            type="password"
            v-model="confirmNewPassword"
            class="form-control form-control-lg blue-border"
            placeholder=" "
            required
          />
          <label for="confirm-password" class="text-blue"
            >Xác nhận mật khẩu mới</label
          >
        </div>
        <button type="submit">Đặt lại mật khẩu</button>
      </form>
    </div>
  </div>
</template>

<script>
import axiosClient from "../../../api/axiosClient";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      identifier: "",
      password: "",
      showForgotPasswordForm: false,
      showResetPasswordForm: false,
      forgotEmail: "",
      otpCode: "",
      newPassword: "",
      confirmNewPassword: "",
      errors: {
        identifier: "",
        password: "",
      },
    };
  },
  methods: {
    ...mapActions(["login"]),
    async handleLogin() {
      // Reset lỗi
      this.errors.identifier = "";
      this.errors.password = "";

      // Kiểm tra trường nhập
      if (!this.identifier) {
        this.errors.identifier = "Vui lòng nhập email hoặc số điện thoại!";
      }
      if (!this.password) {
        this.errors.password = "Vui lòng nhập mật khẩu!";
      }

      // Nếu có lỗi, không tiếp tục xử lý
      if (this.errors.identifier || this.errors.password) {
        return;
      }

      const isEmail = this.identifier.includes("@");
      const payload = {
        [isEmail ? "EMAIL" : "PHONE_NUMBER"]: this.identifier,
        PASSWORD: this.password,
      };
      try {
        await this.login(payload);
      } catch (error) {
        this.$message.error(
          error.response?.data?.message || "Đăng nhập thất bại!"
        );
      }
    },
    showForgotPasswordModal() {
      this.showForgotPasswordForm = true;
      this.showResetPasswordForm = false;
    },
    cancelForgotPassword() {
      this.showForgotPasswordForm = false;
      this.forgotEmail = ""; // Xóa email đã nhập
    },
    async sendForgotPassword() {
      try {
        const response = await axiosClient.post("/users/forgotPassword", {
          email: this.forgotEmail,
        });
        if (response.data.success) {
          this.$message.success(
            "Yêu cầu đã được gửi. Vui lòng kiểm tra email để nhận mã OTP."
          );
          this.showForgotPasswordForm = false;
          this.showResetPasswordForm = true;
        } else {
          this.$message.error("Không thể gửi yêu cầu quên mật khẩu.");
        }
      } catch (error) {
        this.$message.error("Đã xảy ra lỗi khi gửi yêu cầu quên mật khẩu!");
      }
    },
    async resetPassword() {
      if (this.newPassword !== this.confirmNewPassword) {
        this.$message.error("Mật khẩu không khớp!");
        return;
      }

      try {
        const response = await axiosClient.post("/users/resetPassword", {
          email: this.forgotEmail,
          otp: this.otpCode,
          newPassword: this.newPassword,
        });
        if (response.data.success) {
          this.$message.success("Đặt lại mật khẩu thành công!");
          this.showResetPasswordForm = false;
          this.showForgotPasswordForm = false;
        } else {
          this.$message.error("Không thể đặt lại mật khẩu.");
        }
      } catch (error) {
        this.$message.error("Đã xảy ra lỗi khi đặt lại mật khẩu!");
      }
    },
  },
};
</script>

<style scoped>
@import "./Login.scss"; /* Import file SCSS mới */
</style>
