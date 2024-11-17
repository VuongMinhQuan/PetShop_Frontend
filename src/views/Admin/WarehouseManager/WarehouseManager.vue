<template>
  <div class="warehouse-manager-container">
    <h1 class="header-title">Quản Lý Phiếu Nhập Kho</h1>

    <!-- Nút thêm phiếu nhập -->
    <div class="action-container">
      <button class="add-entry-button" @click="openAddEntryModal">
        <i class="fa-solid fa-plus"></i>
        Thêm Phiếu Nhập
      </button>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Tìm kiếm theo tên sản phẩm"
        class="search-input"
        @input="handleSearch"
      />
    </div>
    <!-- Bảng hiển thị danh sách phiếu nhập -->
    <table class="warehouse-table">
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên Người Nhập</th>
          <th>Tên Sản Phẩm</th>
          <th>Tổng Giá</th>
          <th>Ghi chú</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in filteredEntries" :key="entry._id">
          <td>{{ index + 1 }}</td>
          <td>{{ entry.USER_ID?.FULLNAME || "N/A" }}</td>
          <td>{{ entry.PRODUCT_ID?.NAME || "N/A" }}</td>
          <td class="bold-text">{{ formatCurrency(entry.TOTAL_VALUE) }}</td>
          <td>{{ entry.NOTE }}</td>
        </tr>
        <tr v-if="filteredEntries.length === 0">
          <td colspan="5" class="no-data">Không có dữ liệu phiếu nhập kho.</td>
        </tr>
      </tbody>
    </table>

    <!-- Phân trang -->
    <pagination
      v-if="totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-changed="fetchWarehouseEntries"
    />

    <!-- Modal thêm phiếu nhập -->
    <transition
      name="slide"
      @before-enter="beforeEnter"
      @after-enter="afterEnter"
      @leave="leave"
    >
      <div v-show="isAddEntryModalOpen" class="modal">
        <div class="modal-content">
          <h2>Thêm Phiếu Nhập</h2>
          <div
            v-for="(entry, index) in entries"
            :key="index"
            class="entry-section"
          >
            <div class="entry-header">
              <h3>Phiếu Nhập {{ index + 1 }}</h3>
              <div class="total-value-display">
                <div class="total-value-box">
                  <label for="totalValue" class="total-value-label"
                    >Tổng Giá:</label
                  >
                  <span class="total-value-text">
                    {{ calculateTotalValue(entry.quantity, entry.unitPrice) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="product">Chọn Sản Phẩm</label>
              <select v-model="entry.productId" required>
                <option
                  v-for="product in products"
                  :value="product._id"
                  :key="product._id"
                >
                  {{ product.NAME }}
                </option>
              </select>
            </div>
            <div class="form-group-row">
              <div class="form-group inline-group">
                <label for="quantity">Số Lượng</label>
                <input
                  type="number"
                  v-model="entry.quantity"
                  placeholder="Nhập số lượng"
                  required
                />
              </div>
              <div class="form-group inline-group">
                <label for="unitPrice">Giá Nhập</label>
                <input
                  type="number"
                  v-model="entry.unitPrice"
                  placeholder="Nhập giá nhập"
                  required
                />
              </div>
            </div>
            <div class="form-group">
              <label for="note">Ghi Chú</label>
              <textarea
                v-model="entry.note"
                placeholder="Nhập ghi chú"
              ></textarea>
            </div>
            <button
              v-if="entries.length > 1"
              class="remove-entry-button"
              @click="removeEntry(index)"
            >
              Xóa Phiếu Nhập {{ index + 1 }}
            </button>
          </div>

          <!-- Nút thêm phiếu nhập -->
          <button class="add-more-entry-button" @click="addEntry">
            + Thêm Phiếu Nhập
          </button>

          <!-- Nút hành động -->
          <div class="form-actions">
            <button
              type="button"
              class="submit-button"
              @click="handleAddWarehouseEntry"
            >
              Thêm Tất Cả
            </button>
            <button
              type="button"
              class="cancel-button"
              @click="closeAddEntryModal"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axiosClient from "../../../api/axiosClient";

export default {
  name: "WareHouseManager",
  data() {
    return {
      warehouseEntries: [], // Danh sách phiếu nhập kho
      products: [], // Danh sách sản phẩm để chọn
      totalPages: 0, // Tổng số trang
      currentPage: 1, // Trang hiện tại
      searchQuery: "",
      filteredEntries: [],
      isAddEntryModalOpen: false, // Trạng thái mở/đóng modal
      entries: [
        {
          productId: "",
          quantity: null,
          unitPrice: null,
          note: "",
        },
      ],
    };
  },
  methods: {
    handleSearch() {
      this.filteredEntries = this.warehouseEntries.filter((entry) =>
        entry.PRODUCT_ID?.NAME?.toLowerCase().includes(
          this.searchQuery.toLowerCase()
        )
      );
    },
    addEntry() {
      this.entries.push({
        productId: "",
        quantity: null,
        unitPrice: null,
        note: "",
      });
    },
    removeEntry(index) {
      this.entries.splice(index, 1);
    },
    async fetchWarehouseEntries(page = 1) {
      try {
        const response = await axiosClient.get("/warehouses/getAllWarehouse", {
          params: {
            page: page,
            limit: 10,
          },
        });
        this.warehouseEntries = response.data.data.entries;
        this.filteredEntries = this.warehouseEntries; // Đặt dữ liệu ban đầu
        this.totalPages = response.data.data.totalPages;
        this.currentPage = page;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phiếu nhập kho:", error);
      }
    },
    async fetchProducts() {
      try {
        const response = await axiosClient.get("/products/getAllProducts");
        this.products = response.data.sort((a, b) =>
          a.NAME.localeCompare(b.NAME)
        );
        this.filteredProducts = this.products;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    async handleAddWarehouseEntry() {
      try {
        for (const entry of this.entries) {
          await axiosClient.post("/warehouses/createWarehouse", entry);
        }
        this.closeAddEntryModal();
        this.fetchWarehouseEntries();
        this.$toast.success("Thêm các phiếu nhập thành công!");
      } catch (error) {
        console.error("Lỗi khi thêm các phiếu nhập:", error);
        this.$toast.error("Có lỗi xảy ra khi thêm các phiếu nhập!");
      }
    },
    beforeEnter(el) {
      el.style.transform = "translateX(100%)"; // Bắt đầu ngoài màn hình bên phải
      el.style.transition = "transform 0.35s ease";
    },
    afterEnter(el) {
      el.style.transform = "translateX(100)"; // Hiển thị modal trên màn hình
    },
    leave(el, done) {
      el.style.transform = "translateX(100%)"; // Trượt ra khỏi màn hình
      el.style.transition = "transform 0.35s ease";
      setTimeout(done, 350); // Chờ hoàn tất hiệu ứng
    },
    openAddEntryModal() {
      this.isAddEntryModalOpen = true;
      this.fetchProducts();
      this.entries = [
        {
          productId: "",
          quantity: null,
          unitPrice: null,
          note: "",
        },
      ];
    },
    closeAddEntryModal() {
      this.isAddEntryModalOpen = false;
    },
    calculateTotalValue(quantity, unitPrice) {
      if (!quantity || !unitPrice) return "0 VND";
      const totalValue = quantity * unitPrice;
      return this.formatCurrency(totalValue);
    },
    formatCurrency(value) {
      // Định dạng giá trị tiền tệ
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
  },
  mounted() {
    this.fetchWarehouseEntries(); // Gọi API khi trang được tải
  },
};
</script>

<style scoped>
.warehouse-manager-container {
  padding: 20px;
  background-color: #f5f5f5;
}

.header-title {
  text-align: center;
  font-size: 2.5rem;
  color: #176ba3;
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  justify-content: flex-end; /* Đẩy nút sang phải */
  margin-bottom: 20px;
}
.action-container {
  display: flex;
  justify-content: space-between; /* Căn đều hai bên */
  align-items: center; /* Căn giữa theo chiều dọc */
  margin-bottom: 20px;
}

.add-entry-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-entry-button:hover {
  background-color: #45a049;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 300px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #176ba3;
  box-shadow: 0 0 5px rgba(23, 107, 163, 0.2);
}


.warehouse-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.warehouse-table th,
.warehouse-table td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
}

.warehouse-table th {
  background-color: #e0e0e0;
  color: #000000;
}

.no-data {
  text-align: center;
  font-style: italic;
  color: #666;
}
.bold-text {
  font-weight: bold;
}

.modal-content {
  padding: 20px;
  overflow-y: auto; /* Cuộn nội dung nếu cần */
  height: 100%;
}
.modal-content h2 {
  font-weight: bold;
  color: #2f8ecd;
  text-align: center;
}
.modal {
  position: fixed;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  background: white;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
  transition: transform 0.35s ease-in-out; /* Hiệu ứng mượt hơn */
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.35s ease-in-out; /* Thêm hiệu ứng chuyển đổi */
}

.slide-enter {
  transform: translateX(100%); /* Bắt đầu từ ngoài màn hình */
}

.slide-leave-to {
  transform: translateX(100%); /* Kết thúc ngoài màn hình */
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.form-group-row {
  display: flex;
  justify-content: space-between;
  gap: 10px; /* Khoảng cách giữa các nhóm */
}

.inline-group {
  flex: 1; /* Chia đều không gian cho các trường */
  min-width: 0; /* Đảm bảo các trường không vượt quá kích thước tối thiểu */
}

.inline-group label {
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
}

.inline-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

.submit-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-button {
  background-color: #e80c0c;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.add-more-entry-button {
  background-color: transparent; /* Nền trong suốt */
  color: #176ba3; /* Màu chữ */
  padding: 10px 15px;
  border: 2px dashed #176ba3; /* Viền gạch đứt */
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  transition: all 0.3s ease; /* Hiệu ứng khi hover */
  margin-bottom: 15px;
}

.add-more-entry-button:hover {
  background-color: rgba(23, 107, 163, 0.1); /* Thêm nền mờ khi hover */
  color: #176ba3; /* Màu chữ không đổi */
}

.remove-entry-button {
  background-color: #e80c0c;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.remove-entry-button:hover {
  background-color: #c73424;
}

.entry-section {
  border-bottom: 1px solid #ccc;
  padding-bottom: 15px;
  margin-bottom: 15px;
}
.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.entry-header h3 {
  color: #2f8ecd;
}
.total-value-display {
  display: flex;
  align-items: center;
  gap: 5px;
}

.total-value-box {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border: 1px solid #ccc; /* Border màu xám */
  border-radius: 5px; /* Bo góc */
  background-color: #f9f9f9; /* Màu nền nhạt */
}

.total-value-label {
  margin-right: 5px;
  font-weight: bold;
  color: #555; /* Màu chữ tối hơn một chút */
}

.total-value-text {
  font-size: 1rem;
  font-weight: bold;
  color: #333; /* Màu chữ đậm */
}

.total-value-input {
  border: none;
  background-color: #f5f5f5;
  color: #333;
  font-weight: bold;
  text-align: right;
  padding: 5px;
  border-radius: 5px;
  width: 150px;
}
</style>
