<template>
  <div class="cart-page">
    <h1>
      Giỏ hàng của bạn
      <span v-if="cart.PRODUCTS && cart.PRODUCTS.length > 0">
        ({{ cart.PRODUCTS.length }} sản phẩm)
      </span>
    </h1>

    <div v-if="loading">Giỏ hàng của bạn đang trống</div>

    <div v-if="!loading && cart.PRODUCTS && cart.PRODUCTS.length === 0">
      Giỏ hàng của bạn đang trống.
    </div>

    <div v-if="!loading && cart.PRODUCTS && cart.PRODUCTS.length > 0">
      <table class="cart-table">
        <thead>
          <tr>
            <th>Chọn</th>
            <th>Hình ảnh</th>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Tổng giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in cart.PRODUCTS" :key="product.PRODUCT_ID._id">
            <!-- Checkbox để chọn sản phẩm -->
            <td>
              <input type="checkbox" v-model="product.isSelected" />
            </td>
            <td>
              <img
                :src="product.IMAGES[0]"
                alt="Hình ảnh sản phẩm"
                class="product-image"
              />
            </td>
            <td>{{ product.NAME || "Tên sản phẩm" }}</td>
            <td>
              <button
                @click="
                  updateQuantity(product.PRODUCT_ID, product.QUANTITY - 1)
                "
              >
                -
              </button>
              {{ product.QUANTITY }}
              <button
                @click="
                  updateQuantity(product.PRODUCT_ID, product.QUANTITY + 1)
                "
              >
                +
              </button>
            </td>
            <td>{{ formatCurrency(product?.PRICE) }}</td>
            <td>{{ formatCurrency(product.TOTAL_PRICE_FOR_PRODUCT) }}</td>
            <td>
              <button @click="confirmRemoveProduct(product.PRODUCT_ID)">
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="cart-footer">
        <div class="total-payment">
          <span>Tổng thanh toán:</span>
          <span class="total-price">{{
            formatCurrency(totalSelectedPrice)
          }}</span>
        </div>
        <button
          class="checkout-button"
          @click="checkoutSelectedProducts"
          :disabled="totalSelectedPrice === 0"
        >
          Mua hàng đã chọn
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axiosClient from "../../../api/axiosClient"; // Đảm bảo bạn đã import axiosClient đúng cách
import Swal from "sweetalert2"; // Import thư viện sweetalert2

export default {
  name: "CartPage",
  data() {
    return {
      cart: {}, // Dữ liệu giỏ hàng
      loading: true, // Trạng thái đang tải
    };
  },
  async created() {
    await this.fetchCart();
  },
  methods: {
    formatCurrency(value) {
      if (!value) return "0 đ";
      const formattedValue = value;
      return formattedValue.toLocaleString("vi-VN") + " đ";
    },
    async fetchCart() {
      try {
        this.loading = true;
        const response = await axiosClient.post("/carts/getCartById");
        // console.log(response.data.data.PRODUCTS.length);
        const totalProducts = response.data.data.PRODUCTS.length;
        localStorage.setItem("cartItemCount", totalProducts);
        if (response.data && response.data.data) {
          // Thêm isSelected vào từng sản phẩm
          this.cart = {
            ...response.data.data,
            PRODUCTS: response.data.data.PRODUCTS.map((product) => ({
              ...product,
              isSelected: false, // Mặc định chưa chọn
            })),
          };
        } else {
          this.cart = {
            PRODUCTS: [],
            TOTAL_PRICE_FOR_PRODUCT: 0,
          };
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        this.cart = {
          PRODUCTS: [],
          TOTAL_PRICE_FOR_PRODUCT: 0,
        };
      } finally {
        this.loading = false;
      }
    },

    async updateQuantity(productId, newQuantity) {
      try {
        // Truy vấn sản phẩm từ MongoDB để lấy số lượng sẵn có (QUANTITY)
        const productFromDB = await axiosClient.get(
          `/products/getProduct/${productId}`
        );
        const availableQuantity = productFromDB.data.data.QUANTITY;

        // Kiểm tra nếu số lượng mới vượt quá số lượng sẵn có
        if (newQuantity > availableQuantity) {
          this.$toast.warning("Số lượng yêu cầu vượt quá số lượng có sẵn.", {
            position: "top-right",
            duration: 3000,
          });
          return; // Ngăn không cho cập nhật số lượng
        }

        if (newQuantity <= 0) {
          alert("Số lượng phải lớn hơn 0.");
          return;
        }

        const token = localStorage.getItem("accessToken");
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const userId = decoded.userId;

        // Gửi yêu cầu cập nhật số lượng sản phẩm trong giỏ hàng
        const response = await axiosClient.put("/carts/updateCart", {
          userId,
          productId,
          newQuantity,
        });

        if (response.data.success) {
          // Cập nhật lại giỏ hàng trong giao diện
          const product = this.cart.PRODUCTS.find(
            (item) => item.PRODUCT_ID === productId
          );
          if (product) {
            product.QUANTITY = newQuantity;
            product.TOTAL_PRICE_FOR_PRODUCT = product.QUANTITY * product.PRICE;
            this.cart.TOTAL_CART_PRICE = this.cart.PRODUCTS.reduce(
              (total, item) => total + item.TOTAL_PRICE_FOR_PRODUCT,
              0
            );
          }
        } else {
          alert("Cập nhật số lượng thất bại.");
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    },

    confirmRemoveProduct(productId) {
      // Sử dụng SweetAlert2 để hiển thị thông báo xác nhận
      Swal.fire({
        title: "Xóa sản phẩm",
        text: "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          // Nếu người dùng xác nhận xóa sản phẩm
          this.removeProduct(productId);
        }
      });
    },

    async removeProduct(productId) {
      try {
        await axiosClient.post("/carts/removeProduct", { productId });
        this.fetchCart(); // Lấy lại thông tin giỏ hàng sau khi xóa
      } catch (error) {
        console.error("Error removing product:", error);
      }
    },

    async checkoutSelectedProducts() {
      // Lọc ra các sản phẩm được chọn từ giỏ hàng
      const selectedProducts = this.cart.PRODUCTS.filter(
        (product) => product.isSelected
      );

      // Nếu không có sản phẩm nào được chọn, hiển thị thông báo
      if (selectedProducts.length === 0) {
        Swal.fire("Thông báo", "Bạn chưa chọn sản phẩm nào.", "warning");
        return;
      }
      this.$store.commit("SET_SELECTEDPRODUCTS_CART", selectedProducts);
      this.$router.push({ name: "PaymentPage" });
    },
  },
  computed: {
    totalSelectedPrice() {
      return this.cart.PRODUCTS.reduce((total, product) => {
        if (product.isSelected) {
          return total + product.TOTAL_PRICE_FOR_PRODUCT;
        }
        return total;
      }, 0);
    },
  },
};
</script>

<style scoped>
.cart-page {
  max-width: 1600px;
  min-height: 60vh; 
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff; /* Màu nền trắng */
  border-radius: 8px; /* Bo góc cho toàn bộ trang */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Tạo bóng cho trang */
}

.cart-page h1 {
  text-align: center; /* Canh giữa tiêu đề */
  font-size: 24px; /* Kích thước chữ lớn */
  margin-bottom: 20px; /* Khoảng cách dưới */
  color: #141212; /* Màu chữ */
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  background-color: #f9f9f9; /* Màu nền cho bảng */
  border-radius: 8px; /* Bo góc cho bảng */
  overflow: hidden; /* Ẩn phần dư thừa khi bo góc */
}

.cart-table th,
.cart-table td {
  padding: 15px; /* Khoảng cách bên trong ô */
  border: 1px solid #ddd; /* Đường viền ô */
  text-align: center; /* Canh giữa chữ */
  font-size: 16px; /* Kích thước chữ */
}

.cart-table th {
  background-color: #e0e0e0; /* Màu nền cho tiêu đề bảng */
  font-weight: bold; /* Chữ đậm */
}

.cart-table td {
  background-color: #ffffff; /* Màu nền cho ô bảng */
}

.product-image {
  width: 120px; /* Chiều rộng của hình ảnh */
  height: 100px; /* Chiều cao của hình ảnh */
  object-fit: cover; /* Đảm bảo hình ảnh không bị méo */
  border-radius: 8px; /* Tạo góc bo cho hình ảnh */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Tạo bóng cho hình ảnh */
}

.cart-footer {
  display: flex; /* Sử dụng flexbox */
  justify-content: flex-end; /* Canh đều 2 đầu */
  align-items: center; /* Canh giữa theo chiều dọc */
  padding: 15px 0; /* Khoảng cách trên dưới */
  border-top: 1px solid #ddd; /* Đường viền trên */
  background-color: #f5f5f5; /* Màu nền nhạt cho footer */
  gap: 20px;
}

.total-payment {
  font-size: 18px; /* Kích thước chữ */
  font-weight: bold; /* Chữ đậm */
  color: #141212; /* Màu chữ */
}

.total-price {
  font-size: 20px; /* Kích thước chữ lớn hơn cho giá */
  color: #5ca3ee; /* Màu xanh biển */
  margin-left: 10px; /* Khoảng cách bên trái */
}

.checkout-button {
  padding: 15px 30px; /* Khoảng cách bên trong nút */
  font-size: 18px; /* Kích thước chữ */
  background-color: #5ca3ee; /* Màu nền xanh biển */
  color: #fff; /* Màu chữ */
  border: none; /* Bỏ đường viền */
  cursor: pointer; /* Hiển thị con trỏ tay */
  border-radius: 8px; /* Bo góc cho nút */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Tạo bóng cho nút */
  transition: background-color 0.3s ease; /* Hiệu ứng chuyển màu */
}

.checkout-button:hover {
  background-color: #4a92da; /* Màu khi hover xanh đậm hơn */
}

button {
  padding: 8px 12px; /* Khoảng cách bên trong nút */
  font-size: 14px; /* Kích thước chữ */
  cursor: pointer; /* Hiển thị con trỏ tay */
  border: none; /* Bỏ đường viền */
  border-radius: 4px; /* Bo góc cho nút */
  background-color: #f44336; /* Màu nền đỏ */
  color: #fff; /* Màu chữ trắng */
  transition: background-color 0.3s ease; /* Hiệu ứng chuyển màu */
}

button:hover {
  background-color: #d32f2f; /* Màu khi hover */
}

button:disabled {
  background-color: #e0e0e0; /* Màu nền khi bị vô hiệu hóa */
  cursor: not-allowed; /* Con trỏ chuột không cho phép */
}

.loading {
  text-align: center; /* Canh giữa */
  font-size: 18px; /* Kích thước chữ */
  color: #757575; /* Màu chữ */
}

.error {
  text-align: center; /* Canh giữa */
  font-size: 18px; /* Kích thước chữ */
  color: #f44336; /* Màu chữ */
  margin: 20px 0; /* Khoảng cách trên và dưới */
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Nền tối mờ */
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #ffffff; /* Màu nền trắng */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Tạo bóng cho modal */
  width: 400px; /* Chiều rộng modal */
  text-align: center;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modal-actions button {
  width: 100px; /* Chiều rộng nút trong modal */
}
</style>
