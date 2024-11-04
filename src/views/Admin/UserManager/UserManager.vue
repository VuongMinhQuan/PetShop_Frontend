<template>
  <div class="user-management-container">
    <h1 class="header-title">Quản Lý Người Dùng</h1>
    <div class="search-filter-container">
      <div class="filter-container">
        <select
          v-model="selectedUserStatus"
          @change="fetchUsers(selectedUserStatus)"
        >
          <option value="1">Chưa kích hoạt</option>
          <option value="2">Đã kích hoạt</option>
          <option value="3">Bị chặn</option>
          <option value="4">Tất cả</option>
        </select>
      </div>
      <div class="search-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm theo họ tên, email hoặc số điện thoại"
          @input="handleSearch"
          class="search-input"
        />
      </div>
    </div>
    <table class="user-table">
      <thead>
        <tr>
          <th>Họ Tên</th>
          <th>Email</th>
          <th>Số Điện Thoại</th>
          <th>Trạng Thái</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user._id">
          <td>{{ user.FULLNAME }}</td>
          <td>{{ user.EMAIL }}</td>
          <td>{{ user.PHONE_NUMBER }}</td>
          <td :class="{ 'active-status': user.IS_ACTIVATED }">
            {{ user.IS_ACTIVATED ? "Đã kích hoạt" : "Chưa kích hoạt" }}
          </td>
          <td>
            <button class="edit-button" @click="toggleBlockUser(user)">
              {{ user.IS_BLOCKED?.CHECK ? "Bỏ chặn" : "Chặn" }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <pagination
      v-if="totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-changed="fetchUsers(selectedUserStatus)"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import axiosClient from "../../../api/axiosClient";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      selectedUserStatus: "4",
      searchQuery: "",
      users: [],
      totalPages: 0,
      currentPage: 1,
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter((user) => {
        const query = this.searchQuery.toLowerCase();
        return (
          user.FULLNAME.toLowerCase().includes(query) ||
          user.EMAIL.toLowerCase().includes(query) ||
          user.PHONE_NUMBER.toLowerCase().includes(query)
        );
      });
    },
  },
  methods: {
    ...mapActions(["fetchUsers"]),
    handleSearch() {
      this.fetchUsers(this.selectedUserStatus);
    },
    async fetchUsers(status) {
      try {
        const response = await axiosClient.get("/users/getUsers", {
          params: {
            tabStatus: status,
            page: this.currentPage,
            limit: 10,
          },
        });
        this.users = response.data.data;
        this.totalPages = response.data.totalPages;
      } catch (error) {
        console.error("Lỗi khi lấy người dùng:", error);
      }
    },
    async toggleBlockUser(user) {
      const isBlocked = !user.IS_BLOCKED?.CHECK;
      const result = await Swal.fire({
        title: isBlocked
          ? "Bạn có chắc chắn muốn chặn người dùng này không?"
          : "Bạn có chắc chắn muốn bỏ chặn người dùng này không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: isBlocked ? "Chặn" : "Bỏ chặn",
        cancelButtonText: "Hủy",
        confirmButtonColor: isBlocked ? "#d33" : "#4CAF50",
      });
      if (result.isConfirmed) {
        try {
          await axiosClient.post("/users/blockUser", {
            IS_BLOCKED: isBlocked,
            userId: user._id,
          });
          await this.fetchUsers(this.selectedUserStatus);
          this.$message.success(
            `Đã ${isBlocked ? "chặn" : "bỏ chặn"} người dùng thành công!`
          );
        } catch (error) {
          console.error("Lỗi khi chặn/bỏ chặn người dùng:", error);
          this.$message.error("Có lỗi xảy ra, không thể thực hiện hành động!");
        }
      }
    },
  },
  mounted() {
    this.fetchUsers(this.selectedUserStatus);
  },
};
</script>

<style scoped>
.user-management-container {
  padding: 20px;
  background-color: #f5f5f5;
}
.header-title {
  text-align: center;
  font-size: 2.8rem;
  color: #176ba3;
  margin-bottom: 20px;
}
.search-filter-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.search-container {
  display: flex;
  flex-grow: 1; /* Chỉ thêm nếu cần mở rộng thanh tìm kiếm */
}
.search-input {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;
  max-width: 500px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.search-input:focus {
  border-color: #7274ff;
  box-shadow: 0 0 8px rgba(114, 116, 255, 0.5);
}
.filter-container select {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}
.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.user-table th,
.user-table td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
}
.user-table th {
  background-color: #e0e0e0;
  color: #000000;
}
.active-status {
  color: #008000;
  font-weight: bold;
}
.edit-button {
  background-color: #e80c0c;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.edit-button:hover {
  background-color: #c73424;
}
</style>
