<template>
  <div class="header">
    <h2>Danh sách sản phẩm</h2>
    <div class="header-actions">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Tìm kiếm sản phẩm..."
        @keyup.enter="filterProducts"
        class="search-input"
      />
      <select
        v-model="selectedSubType"
        @change="filterProducts"
        class="filter-select"
      >
        <option value="">Tất cả</option>
        <option value="Chó">Chó</option>
        <option value="Mèo">Mèo</option>
        <option value="FDog">Thức ăn cho chó</option>
        <option value="FCat">Thức ăn cho mèo</option>
        <option value="Toy">Đồ chơi</option>
        <option value="Bag">Ba lô</option>
        <option value="Cage">Chuồng</option>
      </select>
      <button @click="showModal = true" class="add-product-btn">
        <i class="fa-solid fa-plus"></i> Thêm sản phẩm
      </button>
    </div>
  </div>

  <!-- Modal thêm sản phẩm -->
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <h3>{{ isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới" }}</h3>
      <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
      <form @submit.prevent="isEditing ? updateProduct() : createProduct()">
        <div class="form-group">
          <label for="product-name">Tên sản phẩm:</label>
          <input v-model="newProduct.NAME" id="product-name" required />
        </div>
        <div class="form-group price-quantity-group">
          <div>
            <label for="product-price">Giá:</label>
            <input
              v-model="newProduct.PRICE"
              id="product-price"
              type="number"
              required
            />
          </div>
          <div>
            <label for="product-quantity">Số lượng:</label>
            <input
              v-model="newProduct.QUANTITY"
              id="product-quantity"
              type="number"
              required
            />
          </div>
        </div>
        <div class="form-group">
          <label for="product-description">Mô tả:</label>
          <textarea
            v-model="newProduct.DESCRIPTION"
            id="product-description"
            required
          ></textarea>
        </div>
        <div class="form-group">
          <label for="image-source">Chọn nguồn hình ảnh:</label>
          <select
            v-model="imageSource"
            id="image-source"
            @change="resetImageFields"
            required
          >
            <option value="" disabled>Chọn nguồn hình ảnh</option>
            <option value="file">Tải lên từ file</option>
            <option value="url">Nhập từ URL</option>
          </select>
        </div>

        <div v-if="imageSource === 'file'" class="form-group">
          <label for="product-images">Hình ảnh từ file:</label>
          <input
            type="file"
            id="product-images"
            @change="handleFileUpload"
            multiple
            accept="image/*"
          />
        </div>

        <div v-if="imageSource === 'url'" class="form-group">
          <label for="image-url">Hình ảnh từ URL:</label>
          <input
            v-model="newImageURLs"
            id="image-url"
            placeholder="Nhập URL hình ảnh"
            @input="addImageURL"
          />
        </div>
        <div class="form-group">
          <label for="product-type">Loại sản phẩm:</label>
          <select
            v-model="newProduct.TYPE.mainType"
            @change="updateSubTypes"
            class="modal-select"
            required
          >
            <option value="" disabled>Chọn loại sản phẩm</option>
            <option value="Animals">Thú cưng</option>
            <option value="Foods">Thức ăn</option>
            <option value="Products">Phụ kiện</option>
          </select>
        </div>
        <div class="form-group">
          <label for="product-subtype">Phân loại sản phẩm:</label>
          <select
            v-model="newProduct.TYPE.subTypes[0]"
            class="modal-select"
            required
          >
            <option value="" disabled>Chọn phân loại</option>
            <option
              v-for="(subType, index) in availableSubTypes"
              :key="index"
              :value="subType"
            >
              {{ subTypeLabels[subType] || subType }}
            </option>
          </select>
        </div>
        <div class="form-group buttons">
          <button type="submit" class="save-button">
            {{ isEditing ? "Cập nhật" : "Lưu" }}
          </button>
        </div>
        <div class="form-group buttons">
          <button type="button" @click="closeModal" class="cancel-button">
            Hủy
          </button>
        </div>
      </form>
    </div>
  </div>

  <div class="product-grid">
    <div
      v-for="(product, index) in paginatedProducts"
      :key="product._id"
      class="product-card"
    >
      <div class="product-image">
        <img :src="product.IMAGES[0]" alt="Product Image" />
      </div>
      <div class="product-info">
        <h3>{{ product.NAME }}</h3>
        <p>Giá: {{ formatPrice(product.PRICE) }} VND</p>
        <p>Số lượng: {{ product.QUANTITY }}</p>
        <div class="action-buttons">
          <button class="edit-btn" @click="openEditProductModal(product)">
            Chỉnh sửa
          </button>
          <button class="delete-btn" @click="deleteProduct(product._id)">
            Xóa
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="pagination">
    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
      Trang trước
    </button>
    <span>Trang {{ currentPage }} / {{ totalPages }}</span>
    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
    >
      Trang sau
    </button>
  </div>
</template>

<script>
import axios from "../../api/axiosClient";
export default {
  name: "ProductManager",
  data() {
    return {
      products: [],
      currentPage: 1,
      productsPerPage: 20,
      searchQuery: "", // Biến lưu trữ từ khóa tìm kiếm
      selectedSubType: "",
      filteredProducts: [],
      showModal: false,
      isEditing: false,
      editProductId: null,
      newProduct: {
        NAME: "",
        PRICE: null,
        QUANTITY: null,
        DESCRIPTION: "",
        TYPE: {
          mainType: "",
          subTypes: [""],
        },
        IMAGES: [],
      },
      newImageURL: "", // Thêm biến để lưu URL hình ảnh
      availableSubTypes: [], // Danh sách subTypes khả dụng
      imageSource: "", // Thêm biến để theo dõi nguồn hình ảnh
      subTypeLabels: {
        FDog: "Thức ăn cho chó",
        FCat: "Thức ăn cho mèo",
        Toy: "Đồ chơi",
        Bag: "Ba lô",
        Cage: "Chuồng",
      },
      errorMessage: "",
    };
  },
  async mounted() {
    await this.getProducts();
  },
  computed: {
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.productsPerPage;
      const end = start + this.productsPerPage;
      return this.filteredProducts.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.productsPerPage);
    },
  },
  methods: {
    async getProducts() {
      try {
        const response = await axios.get("/products/getAllProducts");
        this.products = response.data.sort((a, b) =>
          a.NAME.localeCompare(b.NAME)
        );
        this.filteredProducts = this.products;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    filterProducts() {
      let filtered = this.products;

      // Lọc theo từ khóa tìm kiếm
      if (this.searchQuery.trim() !== "") {
        filtered = filtered.filter((product) =>
          product.NAME.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      // Lọc theo subType đã chọn
      if (this.selectedSubType) {
        const subTypeMapping = {
          Chó: [
            "Alaska",
            "Husky",
            "Golden",
            "Bull Pháp",
            "Corgi",
            "Poodle",
            "Pug",
            "Samoyed",
          ],
          Mèo: [
            "ALD",
            "ALN",
            "Ba Tư",
            "Bengal",
            "Munchkin",
            "Scottish",
            "Xiêm",
            "Sphynx",
          ],
          "Thức ăn cho chó": ["FDog"],
          "Thức ăn cho mèo": ["FCat"],
          "Đồ chơi": ["Toy"],
          "Ba lô": ["Bag"],
          Chuồng: ["Cage"],
        };
        const subTypesToFilter = subTypeMapping[this.selectedSubType] || [
          this.selectedSubType,
        ];
        filtered = filtered.filter((product) =>
          product.TYPE.subTypes.some((subType) =>
            subTypesToFilter.includes(subType)
          )
        );
      }

      this.filteredProducts = filtered;
    },
    handleFileUpload(event) {
      const files = event.target.files; // Lấy danh sách file đã chọn
      this.newProduct.IMAGES = []; // Reset trước khi thêm file mới
      // Lặp qua danh sách file và thêm vào mảng
      for (let i = 0; i < files.length; i++) {
        this.newProduct.IMAGES.push(files[i]); // Lưu file vào mảng
      }
    },
    resetImageFields() {
      if (this.imageSource === "file") {
        // Nếu chọn nguồn file, chỉ reset trường URL
        this.newImageURLs = "";
      } else if (this.imageSource === "url") {
        // Nếu chọn nguồn URL, giữ lại các URL hiện có trong newImageURLs
        const urlImages = this.newProduct.IMAGES.filter(
          (img) => typeof img === "string" && img.startsWith("http")
        );
        this.newImageURLs = urlImages.join(", "); // Hiển thị các URL ảnh hiện có
      }
    },
    addImageURL() {
      // Tách chuỗi URL thành mảng bằng dấu phẩy
      const urls = this.newImageURLs
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url !== ""); // Loại bỏ khoảng trắng và các URL rỗng
      this.newProduct.IMAGES = this.newProduct.IMAGES.filter(
        (img) => typeof img !== "string" || !img.startsWith("http")
      );
      // Lặp qua từng URL và kiểm tra tính hợp lệ
      urls.forEach((url) => {
        const image = new Image();
        image.src = url;
        image.onload = () => {
          if (!this.newProduct.IMAGES.includes(url)) {
            this.newProduct.IMAGES.push(url); // Thêm URL vào mảng IMAGES
          }
        };
        image.onerror = () => {
          alert(`URL không hợp lệ hoặc không phải là hình ảnh: ${url}`); // Thông báo nếu không hợp lệ
        };
      });
    },
    openEditProductModal(product) {
      this.isEditing = true;
      this.editProductId = product._id;
      this.newProduct = { ...product };
      this.availableSubTypes = this.getSubTypes(product.TYPE.mainType);
      // Lấy danh sách các URL ảnh từ IMAGES của sản phẩm và nối thành chuỗi
      const urlImages = this.newProduct.IMAGES.filter(
        (img) => typeof img === "string" && img.startsWith("http")
      );
      this.newImageURLs = urlImages.join(", ");
      this.showModal = true;
    },
    async createProduct() {
      try {
        const formData = new FormData();
        formData.append("NAME", this.newProduct.NAME);
        formData.append("TYPE[mainType]", this.newProduct.TYPE.mainType); // Gửi mainType riêng
        this.newProduct.TYPE.subTypes.forEach((subType) => {
          formData.append("TYPE[subTypes][]", subType); // Gửi subTypes như một mảng
        });
        formData.append("PRICE", this.newProduct.PRICE);
        formData.append("QUANTITY", this.newProduct.QUANTITY);
        formData.append("DESCRIPTION", this.newProduct.DESCRIPTION);
        // Thêm ảnh vào FormData
        this.newProduct.IMAGES.forEach((image) => {
          formData.append("IMAGES[]", image); // Sử dụng IMAGES[] để khớp với cấu hình Multer
        });
        await axios.post("/products/createProduct", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Thiết lập loại nội dung
          },
        });
        this.showModal = false;
        this.errorMessage = "";
        await this.getProducts();
      } catch (error) {
        if (error.response && error.response.data.message) {
          this.errorMessage = error.response.data.message; // Lưu thông báo lỗi từ backend
        } else {
          console.error("Error creating product:", error);
          this.errorMessage = "Đã xảy ra lỗi, vui lòng thử lại."; // Thông báo lỗi mặc định
        }
      }
    },
    async updateProduct() {
      try {
        const formData = new FormData();
        formData.append("NAME", this.newProduct.NAME);
        formData.append("TYPE[mainType]", this.newProduct.TYPE.mainType); // Gửi mainType
        this.newProduct.TYPE.subTypes.forEach((subType) => {
          formData.append("TYPE[subTypes][]", subType); // Gửi subTypes như một mảng
        });
        formData.append("PRICE", this.newProduct.PRICE);
        formData.append("QUANTITY", this.newProduct.QUANTITY);
        formData.append("DESCRIPTION", this.newProduct.DESCRIPTION);
        if (this.imageSource === "url" && this.newImageURLs) {
          const urls = this.newImageURLs
            .split(",")
            .map((url) => url.trim())
            .filter((url) => url !== ""); // Loại bỏ các URL rỗng
          this.newProduct.IMAGES = this.newProduct.IMAGES.filter(
            (img) => typeof img !== "string" || !img.startsWith("http")
          );
          // Giữ ảnh cũ và thêm ảnh mới từ URL
          this.newProduct.IMAGES = [...this.newProduct.IMAGES, ...urls];
        }
        // Thêm tất cả ảnh (bao gồm cả ảnh cũ và mới) vào FormData
        this.newProduct.IMAGES.forEach((image) => {
          if (typeof image === "string" && image.startsWith("http")) {
            // Nếu là URL
            formData.append("IMAGES[]", image);
          } else {
            // Nếu là file
            formData.append("IMAGES[]", image);
          }
        });
        const response = await axios.put(
          `/products/updateProduct/${this.editProductId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Đảm bảo dùng multipart/form-data
            },
          }
        );
        if (response.status === 200) {
          this.showModal = false;
          this.getProducts(); // Cập nhật danh sách sản phẩm
        } else {
          console.error("Lỗi khi cập nhật sản phẩm:", response.data);
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
      }
    },
    async deleteProduct(productId) {
      try {
        await axios.delete(`/products/deleteProduct/${productId}`);
        await this.getProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    },
    closeModal() {
      this.showModal = false;
      this.resetNewProduct();
    },
    resetNewProduct() {
      this.newProduct = {
        NAME: "",
        PRICE: null,
        QUANTITY: null,
        DESCRIPTION: "",
        TYPE: {
          mainType: "",
          subTypes: [""],
        },
        IMAGES: [],
      };
      this.newImageURL = ""; // Reset trường nhập URL
      this.availableSubTypes = [];
    },
    updateSubTypes() {
      // Cập nhật danh sách subTypes dựa trên mainType
      this.availableSubTypes = this.getSubTypes(this.newProduct.TYPE.mainType);
      this.newProduct.TYPE.subTypes[0] = ""; // Reset subType khi đổi mainType
    },
    getSubTypes(mainType) {
      // Trả về subTypes tương ứng với mainType
      switch (mainType) {
        case "Animals":
          return [
            "Alaska",
            "Husky",
            "Golden",
            "Bull Pháp",
            "Corgi",
            "Poodle",
            "Pug",
            "Samoyed",
            "ALD",
            "ALN",
            "Ba Tư",
            "Bengal",
            "Munchkin",
            "Scottish",
            "Xiêm",
            "Sphynx",
          ];
        case "Foods":
          return ["FDog", "FCat"];
        case "Products":
          return ["Toy", "Bag", "Cage"];
        default:
          return [];
      }
    },
    formatPrice(price) {
      return parseFloat(price).toLocaleString("vi-VN"); // Định dạng thành chuỗi theo chuẩn VN
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-height: 80%; /* Giới hạn chiều cao tối đa của modal */
  width: 500px; /* Kích thước modal */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease;
  overflow-y: auto; /* Cho phép cuộn nếu nội dung quá dài */
}
.modal-content h3 {
  display: flex;
  justify-content: center;
}
.form-group {
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin-bottom: 5px;
}
.form-group input,
.form-group textarea,
.form-group select {
  width: 100%; /* Chiều rộng 100% để đồng nhất */
  height: 40px; /* Chiều cao cho các trường nhập */
  padding: 8px; /* Padding để tạo không gian bên trong */
  border: 1px solid #ccc; /* Viền cho các trường */
  border-radius: 4px; /* Bo tròn các góc */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ cho các trường */
}
.price-quantity-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
.save-button {
  background-color: #4caf50; /* Màu xanh lá */
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  width: 80px;
}
.save-button:hover {
  background-color: #45a049; /* Màu xanh lá đậm khi hover */
}
.cancel-button {
  background-color: #d81313; /* Màu đỏ */
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  width: 80px;
}
.cancel-button:hover {
  background-color: #c12c2c; /* Màu đỏ đậm khi hover */
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
}
.header h2 {
  margin: 0;
  font-size: 2.8rem;
  color: #176ba3;
}
.header-actions {
  display: flex;
  gap: 10px; /* Khoảng cách giữa thanh tìm kiếm và nút */
}
.filter-select {
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  width: 200px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.search-input {
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  width: 250px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.search-input:focus {
  border-color: #3dafd5;
  box-shadow: 0 0 8px #25809f;
}
.add-product-btn {
  background-color: #358ece; /* Màu xanh biển */
  color: #ffffff; /* Chữ trắng */
  border: none; /* Loại bỏ viền */
  padding: 10px 20px; /* Khoảng cách padding */
  border-radius: 5px; /* Bo góc nhẹ */
  cursor: pointer; /* Con trỏ chuột */
  font-weight: bold; /* Chữ đậm */
  font-size: 1rem; /* Kích thước chữ */
  transition: background-color 0.3s ease; /* Hiệu ứng chuyển màu */
}
.add-product-btn:hover {
  background-color: #2a88a2; /* Màu xanh đậm hơn khi hover */
}
.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.product-card {
  display: flex;
  flex-direction: row;
  justify-content: space-between; /* Giữ khoảng cách đồng đều giữa các phần tử */
  width: 290px; /* Chiều rộng cố định */
  height: 190px;
  border: 1px solid #a6a0a0;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}
.product-card:hover {
  box-shadow: 0 8px 15px rgba(6, 72, 105, 0.3); /* Đổ bóng đậm hơn khi hover */
}
.product-image img {
  margin-top: 8px;
  width: 100px;
  height: 120px;
  object-fit: cover;
  margin-right: 10px;
}
.product-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 0;
}
.product-info h3 {
  font-weight: bold;
  font-size: 1.2rem;
  margin: 0;
  color: #333;
}
.product-info p {
  margin: 5px 0;
}
.action-buttons {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  margin-top: auto; /* Đẩy các nút xuống đáy thẻ */
  opacity: 0; /* Ẩn nút ban đầu */
  transform: translateY(20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.product-card:hover .action-buttons {
  opacity: 1; /* Hiển thị nút khi hover */
  transform: translateY(0); /* Trượt nút lên vị trí bình thường */
}
.edit-btn {
  background-color: #358ece;
  color: #ececec;
  border: 1px solid #a6a0a0;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}
.delete-btn {
  background-color: #d81313;
  color: #ececec;
  border: 1px solid #a6a0a0;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}
.edit-btn:hover {
  background-color: #1386d8;
}
.delete-btn:hover {
  background-color: #d81313;
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
  z-index: 10; /* Đặt z-index cao hơn để phần phân trang xuất hiện phía trên */
  position: relative; /* Đảm bảo rằng z-index hoạt động */
}

.pagination button {
  background-color: #3ba8cd;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.pagination button:hover {
  background-color: #2a88a2;
  transform: translateY(-2px);
}

.pagination button:disabled {
  background-color: #a3d4e4;
  cursor: not-allowed;
}

.pagination span {
  font-size: 16px;
  color: #3ba8cd;
  font-weight: bold;
}
.error-message {
  color: red;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

</style>
