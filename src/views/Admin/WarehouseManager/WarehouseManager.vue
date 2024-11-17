<template>
  <div class="warehouse-manager-container">
    <h1 class="header-title">Quản Lý Phiếu Nhập Kho</h1>

    <!-- Nút thêm phiếu nhập -->
    <div class="action-container">
      <button class="add-entry-button" @click="openAddEntryModal">
        <i class="fa-solid fa-plus"></i>
        Thêm Phiếu Nhập
      </button>
      <div class="search-container">
        <input
          type="text"
          v-model="searchQueryUser"
          placeholder="Tìm kiếm theo tên người nhập"
          class="search-input"
          @keyup.enter="handleSearch"
        />
      </div>
    </div>
    <!-- Bảng hiển thị danh sách phiếu nhập -->
    <table class="warehouse-table">
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên Người Nhập</th>
          <th>Ngày Nhập Hàng</th>
          <th>Tổng Giá</th>
          <th>Ghi chú</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in getPaginatedEntries()" :key="entry._id">
          <td>{{ index + 1 + (currentPage - 1) * entriesPerPage }}</td>
          <td>{{ entry.USER_ID?.FULLNAME || "N/A" }}</td>
          <td>{{ formatDate(entry.createdAt) }}</td>
          <td class="bold-text">{{ formatCurrency(entry.TOTAL_VALUE) }}</td>
          <td>{{ entry.NOTE }}</td>
          <td>
            <button class="action-button" @click="openDetailModal(entry._id)">
              <i class="fa-solid fa-eye action-icon"></i>
            </button>
          </td>
        </tr>
        <tr v-if="getPaginatedEntries().length === 0">
          <td colspan="5" class="no-data">Không có dữ liệu phiếu nhập kho.</td>
        </tr>
      </tbody>
    </table>

    <!-- Phân trang -->
    <div class="pagination">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        Trước
      </button>
      <span>Trang {{ currentPage }} / {{ totalPages }}</span>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        Sau
      </button>
    </div>

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

          <!-- Danh sách sản phẩm -->
          <div
            v-for="(entry, index) in entries"
            :key="index"
            class="entry-section"
          >
            <div class="entry-header">
              <h3>Sản Phẩm {{ index + 1 }}</h3>
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
            <button
              v-if="entries.length > 1"
              class="remove-entry-button"
              @click="removeEntry(index)"
            >
              Xóa Sản Phẩm {{ index + 1 }}
            </button>
          </div>

          <!-- Tổng giá -->
          <div class="total-value-display">
            <div class="total-value-box">
              <label for="totalValue" class="total-value-label"
                >Tổng Giá:</label
              >
              <span class="total-value-text">
                {{ calculateTotalValueAll() }}
              </span>
            </div>
          </div>

          <!-- Ghi chú -->
          <div class="form-group">
            <label for="note">Ghi Chú</label>
            <textarea
              v-model="note"
              placeholder="Nhập ghi chú cho phiếu nhập"
            ></textarea>
          </div>

          <!-- Nút thêm sản phẩm -->
          <button class="add-more-entry-button" @click="addEntry">
            + Thêm Sản Phẩm
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

    <transition
      name="slide-fade"
      @before-enter="beforeEnter"
      @after-enter="afterEnter"
      @leave="leave"
    >
      <div v-show="isDetailModalOpen" class="modal">
        <div class="modal-content">
          <button class="close-button" @click="closeDetailModal">
            <i class="fa-solid fa-xmark"></i>
          </button>
          <h2>Chi Tiết Phiếu Nhập</h2>

          <!-- Hiển thị thông tin người nhập -->
          <div class="inline-text">
            <span><b>Người nhập phiếu:</b></span>
            <span class="name">{{ detailEntry.USER_NAME }}</span>
          </div>
          <div
            v-for="(product, index) in detailEntry.PRODUCTS"
            :key="index"
            class="entry-section"
          >
            <h3>Sản Phẩm {{ index + 1 }}</h3>
            <p>
              <b>Tên sản phẩm: </b>
              <span class="name_product">{{ product.PRODUCT_NAME }}</span>
            </p>
            <p><b>Số lượng nhập:</b> {{ product.QUANTITY }}</p>
            <p><b>Giá nhập:</b> {{ formatCurrency(product.UNIT_PRICE) }}</p>
            <p><b>Thành tiền:</b> {{ formatCurrency(product.TOTAL_VALUE) }}</p>
          </div>
          <div class="info-row">
            <span><b>Ghi chú:</b></span>
            <span class="note">{{
              detailEntry.NOTE || "Không có ghi chú"
            }}</span>
          </div>
          <div class="total-value-display">
            <h3 class="total-value-header">
              Tổng Giá: {{ formatCurrency(detailEntry.TOTAL_VALUE) }}
            </h3>
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
      entriesPerPage: 10, // Số phiếu nhập mỗi trang
      searchQueryUser: "",
      filteredEntries: [],
      isAddEntryModalOpen: false, // Trạng thái mở/đóng modal
      detailEntry: {},
      note: "",
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
  mounted() {
    this.fetchWarehouseEntries(); // Gọi API khi trang được tải
  },
  methods: {
    handleSearch() {
      if (this.searchQueryUser.trim() === "") {
        this.filteredEntries = [...this.warehouseEntries];
      } else {
        this.filteredEntries = this.warehouseEntries.filter((entry) =>
          entry.USER_ID?.FULLNAME?.toLowerCase().includes(
            this.searchQueryUser.toLowerCase()
          )
        );
      }
      this.calculateTotalPages(); // Tính lại tổng số trang khi tìm kiếm
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
    calculateTotalValueAll() {
      // Tính tổng giá trị của toàn bộ phiếu nhập
      const totalValue = this.entries.reduce((total, entry) => {
        if (entry.quantity && entry.unitPrice) {
          return total + entry.quantity * entry.unitPrice;
        }
        return total;
      }, 0);
      return this.formatCurrency(totalValue);
    },
    async fetchWarehouseEntries() {
      try {
        const response = await axiosClient.get("/warehouses/getAllWarehouse");
        this.warehouseEntries = response.data.data.entries;
        this.filteredEntries = [...this.warehouseEntries];
        this.calculateTotalPages(); // Tính lại tổng số trang
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
        // Kiểm tra các trường bắt buộc
        for (const entry of this.entries) {
          if (!entry.productId || !entry.quantity || !entry.unitPrice) {
            this.$toast.error("Vui lòng điền đầy đủ thông tin sản phẩm!");
            return;
          }
        }

        // Tạo payload
        const payload = {
          PRODUCTS: this.entries.map((entry) => ({
            PRODUCT_ID: entry.productId,
            QUANTITY: entry.quantity,
            UNIT_PRICE: entry.unitPrice,
          })),
          NOTE: this.note, // Gửi ghi chú
        };

        // Gửi payload
        await axiosClient.post("/warehouses/createWarehouse", payload);

        // Đóng modal và làm mới dữ liệu
        this.closeAddEntryModal();
        this.fetchWarehouseEntries();
        this.$toast.success("Thêm phiếu nhập kho thành công!");
      } catch (error) {
        console.error("Lỗi khi thêm phiếu nhập:", error);
        this.$toast.error("Có lỗi xảy ra khi thêm phiếu nhập!");
      }
    },
    beforeEnter(el) {
      el.style.opacity = 0; // Modal bắt đầu mờ
      el.style.transform = "translateX(100%)"; // Bắt đầu từ ngoài màn hình
    },
    afterEnter(el) {
      el.style.opacity = 1; // Hiển thị rõ ràng
      el.style.transform = "translateX(100)"; // Modal dừng tại vị trí giữa
    },
    leave(el, done) {
      el.style.opacity = 0; // Modal mờ dần khi đóng
      el.style.transform = "translateX(100%)"; // Modal trượt ra ngoài màn hình
      setTimeout(done, 350); // Chờ hiệu ứng hoàn tất
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
    async openDetailModal(entryId) {
      try {
        // Gọi API lấy chi tiết phiếu nhập
        const response = await axiosClient.get(
          `/warehouses/getWarehouseById/${entryId}`
        );
        this.detailEntry = response.data.data; // Lưu dữ liệu chi tiết
        this.isDetailModalOpen = true; // Mở modal
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết phiếu nhập:", error);
        this.$toast.error("Không thể lấy chi tiết phiếu nhập!");
      }
    },
    closeDetailModal() {
      this.isDetailModalOpen = false; // Đóng modal
      this.detailEntry = {}; // Xóa dữ liệu chi tiết
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
    formatDate(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
    calculateTotalPages() {
      this.totalPages = Math.ceil(
        this.filteredEntries.length / this.entriesPerPage
      );
    },
    getPaginatedEntries() {
      const start = (this.currentPage - 1) * this.entriesPerPage;
      const end = this.currentPage * this.entriesPerPage;
      return this.filteredEntries.slice(start, end);
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
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
  width: 50%; /* Chiều rộng modal */
  height: 100%; /* Chiều cao full */
  background: white;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
  transform: translateX(100%); /* Đảm bảo modal bắt đầu từ bên phải */
  opacity: 0; /* Ẩn modal lúc bắt đầu */
  transition: transform 0.35s ease, opacity 0.35s ease; /* Thêm hiệu ứng */
}
.modal.show {
  transform: translateX(0); /* Dừng ở giữa màn hình */
  opacity: 1; /* Hiển thị rõ ràng */
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
.info-row {
  display: flex;
  align-items: center; /* Căn giữa nội dung theo chiều dọc */
  gap: 5px; /* Khoảng cách giữa các phần tử */
  flex: 1; /* Chia đều không gian */
  min-width: 45%; /* Đảm bảo các mục không quá nhỏ */
}

.info-row span {
  font-size: 16px;
}

.inline-text {
  display: flex; /* Sử dụng flexbox để hiển thị nội dung trên cùng một dòng */
  align-items: center; /* Căn giữa theo chiều dọc */
  gap: 5px; /* Khoảng cách giữa các phần tử */
  white-space: nowrap; /* Ngăn xuống dòng */
  padding-bottom: 10px;
  font-weight: bold;
  font-size: 130%;
}

.inline-text .name {
  color: #176ba3;
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
.entry-section .name_product {
  color: #176ba3;
  display: inline; /* Hiển thị cùng dòng với phần tử trước */
  white-space: nowrap;
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

.total-value-header {
  font-size: 2rem; /* Tăng kích thước font */
  font-weight: bold; /* In đậm */
  color: #176ba3; /* Màu xanh cho nổi bật */
  text-align: center; /* Canh giữa nội dung */
  margin: 20px 0; /* Thêm khoảng cách trên dưới */
}

.total-value-box {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border: 1px solid #ccc; /* Border màu xám */
  border-radius: 5px; /* Bo góc */
  background-color: #f9f9f9; /* Màu nền nhạt */
  margin-bottom: 15px;
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
.close-button {
  position: absolute; /* Định vị tuyệt đối so với modal-content */
  top: 10px; /* Khoảng cách từ trên xuống */
  right: 10px; /* Khoảng cách từ bên phải */
  background-color: #e80c0c; /* Màu đỏ */
  color: #fff; /* Màu trắng cho icon */
  border: none;
  border-radius: 50%; /* Hình tròn */
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem; /* Kích thước icon */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Đổ bóng nhẹ */
  transition: transform 0.2s ease, background-color 0.2s ease;
  z-index: 10; /* Đảm bảo nút nằm trên các phần tử khác */
}

.close-button:hover {
  background-color: #c73424; /* Màu đỏ đậm hơn khi hover */
  transform: scale(1.1); /* Phóng to nhẹ khi hover */
}

.close-button i {
  pointer-events: none; /* Ngăn không cho click vào icon */
}

.warehouse-table td {
  vertical-align: middle; /* Căn giữa theo chiều dọc */
}

.warehouse-table td:last-child {
  text-align: center; /* Căn giữa theo chiều ngang */
  vertical-align: middle; /* Căn giữa theo chiều dọc */
}
.action-button {
  display: flex; /* Dùng Flexbox */
  align-items: center; /* Căn giữa theo chiều dọc */
  justify-content: center; /* Căn giữa theo chiều ngang */
  width: 100%; /* Đảm bảo nút chiếm toàn bộ chiều rộng */
  height: 100%; /* Đảm bảo nút chiếm toàn bộ chiều cao */
  background-color: transparent; /* Nền trong suốt */
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
}

.action-icon {
  color: #399de0; /* Màu xanh cho biểu tượng */
  font-size: 1.5rem; /* Tăng kích thước biểu tượng nếu cần */
  transition: color 0.2s ease; /* Hiệu ứng khi hover */
}

.action-button:hover .action-icon {
  color: #004a77; /* Màu xanh đậm hơn khi hover */
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.35s ease, opacity 0.35s ease;
}

.slide-fade-enter {
  transform: translateX(0%); /* Bắt đầu ngoài màn hình */
  opacity: 0; /* Mờ dần */
}

.slide-fade-enter-to {
  transform: translateX(100); /* Dừng lại ở giữa màn hình */
  opacity: 1; /* Hiển thị rõ ràng */
}

.slide-fade-leave {
  transform: translateX(0); /* Bắt đầu từ vị trí giữa */
  opacity: 1;
}

.slide-fade-leave-to {
  transform: translateX(100%); /* Trượt ra khỏi màn hình */
  opacity: 0; /* Mờ dần */
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

</style>
