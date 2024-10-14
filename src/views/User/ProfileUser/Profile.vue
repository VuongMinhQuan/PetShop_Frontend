<template>
  <div class="profile-page">
    <h2>Thông tin cá nhân</h2>
    <div v-if="user">
      <div class="profile-info">
        <p><strong>Họ và tên:</strong> {{ user.FULLNAME }}</p>
        <p><strong>Email:</strong> {{ user.EMAIL }}</p>
        <p><strong>Số điện thoại:</strong> {{ user.PHONE_NUMBER }}</p>
        <p><strong>Địa chỉ:</strong> {{ user.ADDRESS }}</p>
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
    };
  },
  async created() {
    await this.fetchUserProfile();
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
    editProfile() {
      this.$router.push("/user/edit-profile"); // Điều hướng đến trang chỉnh sửa thông tin
    },
  },
};
</script>

<style scoped>
.profile-page {
  padding: 20px;
  font-family: Arial, sans-serif;
}

h2 {
  text-align: center;
  font-size: 2rem;
  color: #3ba8cd;
  margin-bottom: 20px;
}

.profile-info {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.profile-info p {
  font-size: 1.2rem;
  margin: 10px 0;
}

.profile-actions {
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 10px 20px;
  background-color: #3ba8cd;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background-color: #007bff;
}
</style>
