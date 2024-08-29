<template>
  <div class="login-page">
    <div class="login-container">
      <h2>Chào mừng bạn đến với PetMart</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Nhập Email/Số điện thoại:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="password">Mật khẩu:</label>
          <input type="password" id="password" v-model="password" required />
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
            <a href="/user/register">Chưa có tài khoản?</a>
          </p>
          <p style="margin: 0">
            <a href="/forgot-password">Quên mật khẩu?</a>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    handleLogin() {
      console.log("Email:", this.email);
      console.log("Password:", this.password);
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
  width: 500px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3); /* Đường viền mờ */
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  background-color: rgba(241, 240, 244, 0.6);
  text-align: center;
  animation: fadeInUp 1s ease-out; /* Thêm hiệu ứng animation */
}


.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 10px;
  font-size: 1.2em;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 1.1em;
  box-sizing: border-box;
  background-color: #ffff;
  border: 1px solid rgba(10, 10, 10, 0.5); /* Đường viền input trong suốt */
}

button {
  width: 100%;
  padding: 12px;
  background-color: rgba(18, 140, 185, 0.8); /* Nút trong suốt */
  border: none;
  color: white;
  font-size: 1.2em;
  cursor: pointer;
}

button:hover {
  background-color: rgba(72, 111, 217, 0.8);
}

.text-center {
  text-align: center;
}

.mb-4 {
  margin-top: 5%;
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
</style>
