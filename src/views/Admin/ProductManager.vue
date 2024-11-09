<template>
  <div>
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
        <select v-model="selectedSubType" @change="filterProducts" class="filter-select">
          <option value="">Tất cả</option>
          <optgroup label="Chó">
            <option value="Alaska">Alaska</option>
            <option value="Husky">Husky</option>
            <option value="Golden">Golden</option>
            <option value="Bull Pháp">Bull Pháp</option>
            <option value="Corgi">Corgi</option>
            <option value="Poodle">Poodle</option>
            <option value="Pug">Pug</option>
            <option value="Samoyed">Samoyed</option>
          </optgroup>
          <optgroup label="Mèo">
            <option value="ALD">Anh lông dài</option>
            <option value="ALN">Anh lông ngắn</option>
            <option value="Ba Tư">Ba Tư</option>
            <option value="Bengal">Bengal</option>
            <option value="Munchkin">Munchkin</option>
            <option value="Scottish">Scottish</option>
            <option value="Xiêm">Xiêm</option>
            <option value="Sphynx">Sphynx</option>
          </optgroup>
          <optgroup label="Thức ăn">
            <option value="FDog">Thức ăn cho chó</option>
            <option value="FCat">Thức ăn cho mèo</option>
          </optgroup>
          <optgroup label="Phụ kiện">
            <option value="Toy">Đồ chơi</option>
            <option value="Bag">Ba lô</option>
            <option value="Cage">Chuồng</option>
          </optgroup>
        </select>
        <button @click="showModal = true" class="add-product-btn">
          <i class="fa-solid fa-plus"></i> Thêm sản phẩm
        </button>
      </div>
    </div>

    <!-- Product Grid -->
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

    <!-- Pagination Controls -->
    <div class="pagination">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
        Trước
      </button>
      <span>Trang {{ currentPage }} / {{ totalPages }}</span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">  
        Sau
      </button>
    </div>

    <!-- Modal thêm sản phẩm -->
    <div v-if="showModal" class="modal">
      <!-- Nội dung modal -->
    </div>
  </div>
</template>

<script>
import axios from "../../api/axiosClient";

export default {
  name: "ProductManager",
  data() {
    return {
      products: [],
      searchQuery: "",
      selectedSubType: "", // Thêm biến để lưu trữ subType đã chọn
      filteredProducts: [],
      showModal: false,
      currentPage: 1,
      productsPerPage: 16,
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
      newImageURL: "",
      availableSubTypes: [],
      imageSource: "",
      subTypeLabels: {
        FDog: "Thức ăn cho chó",
        FCat: "Thức ăn cho mèo",
        Toy: "Đồ chơi",
        Bag: "Ba lô",
        Cage: "Chuồng",
      },
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.productsPerPage);
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.productsPerPage;
      const end = start + this.productsPerPage;
      return this.filteredProducts.slice(start, end);
    },
  },
  async mounted() {
    await this.getProducts();
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
      // Lọc dựa trên từ khóa tìm kiếm và subType
      this.filteredProducts = this.products.filter((product) => {
        const matchesSearchQuery = product.NAME.toLowerCase().includes(
          this.searchQuery.toLowerCase()
        );
        const matchesSubType =
          !this.selectedSubType ||
          product.TYPE.subTypes.includes(this.selectedSubType);
        return matchesSearchQuery && matchesSubType;
      });
      this.currentPage = 1; // Reset về trang đầu sau khi lọc
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    formatPrice(price) {
      return parseFloat(price).toLocaleString("vi-VN");
    },
  },
};
</script>

<style scoped>
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
  gap: 10px;
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
  background-color: #358ece;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.add-product-btn:hover {
  background-color: #2a88a2;
}

.filter-select {
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.product-card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 290px;
  height: 190px;
  border: 1px solid #a6a0a0;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.3s ease;
  position: relative;
}

.product-card:hover {
  box-shadow: 0 8px 15px rgba(6, 72, 105, 0.3);
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
  margin-top: auto;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.product-card:hover .action-buttons {
  opacity: 1;
  transform: translateY(0);
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
</style>
