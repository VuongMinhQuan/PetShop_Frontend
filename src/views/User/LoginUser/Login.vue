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
@import './Login.scss'; /* Import file SCSS mới */
</style>