<template>
  <div class="register-page">
    <div class="register-container">
      <h2>Đăng ký</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="phone">Số điện thoại:</label>
          <input type="tel" id="phone" v-model="phone" required />
        </div>
        <div class="form-group">
          <label for="password">Mật khẩu:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="form-group">
          <label for="confirm-password">Xác nhận mật khẩu:</label>
          <input type="password" id="confirm-password" v-model="confirmPassword" required />
        </div>
        <div class="form-group">
          <label for="address">Địa chỉ:</label>
          <input type="text" id="address" v-model="address" required />
        </div>
        <button type="submit">Đăng ký</button>
        <p class="login-link">
          <a href="/user/login">Quay lại trang đăng nhập</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      address: "",
      gender: ""
    };
  },
  methods: {
    handleRegister() {
      if (this.password !== this.confirmPassword) {
        alert("Mật khẩu và xác nhận mật khẩu không khớp.");
        return;
      }
      console.log("Email:", this.email);
      console.log("Phone:", this.phone);
      console.log("Password:", this.password);
      console.log("Address:", this.address);
      console.log("Gender:", this.gender);
    }
  }
};
</script>

<style scoped>
.register-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("@/assets/background.gif");
  background-size: cover;
  background-position: center;
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
.register-container {
  width: 500px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.1);
  text-align: center;
  animation: fadeInUp 1s ease-out; /* Thêm hiệu ứng animation */
}

.form-group {
  margin-bottom: 15px;
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
  background-color: rgba(189, 221, 231, 0.7);
  border: 1px solid rgba(10, 10, 10, 0.5);
}

/* Hiệu ứng cho các trường nhập liệu khi được chọn */
input:focus {
  outline: none;
  border-color: #1b8df5;
  box-shadow: 0 0 5px rgba(27, 141, 245, 0.5);
}

button {
  width: 100%;
  padding: 12px;
  background-color: rgba(18, 140, 185, 0.8);
  border: none;
  color: white;
  font-size: 1.2em;
  cursor: pointer;
}

button:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(27, 141, 245, 0.5);
}

button:hover {
  background-color: rgba(72, 111, 217, 0.8);
}

</style>
