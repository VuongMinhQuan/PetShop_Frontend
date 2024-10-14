<template>
  <div class="booking-page">
    <h1>Thông tin Đặt hàng</h1>
    <div v-if="loading">Đang tải thông tin đặt hàng...</div>
    <div v-if="!loading && selectedProducts.length > 0">
      <div class="address-info">
        <h2 class="address-header">
          <i class="fas fa-location-dot location-icon"></i>
          Địa chỉ nhận hàng
        </h2>
        <div class="address-row">
          <div class="address-column">
            <p>
              Địa chỉ: <span class="bold-text">{{ userInfo.ADDRESS }}</span>
            </p>
          </div>
          <div class="address-column">
            <p>
              <i class="fa-solid fa-user"></i> Họ tên:
              <span class="bold-text">{{ userInfo.FULLNAME }}</span>
            </p>
          </div>
          <div class="address-column">
            <p>
              <i class="fa-solid fa-phone"></i> Số điện thoại:
              <span class="bold-text">(+84) {{ userInfo.PHONE_NUMBER }}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="product-list">
        <div
          v-for="product in selectedProducts"
          :key="product.PRODUCT_ID._id"
          class="product-card"
        >
          <img
            :src="getImage(product)"
            alt="Hình ảnh sản phẩm"
            class="product-image"
          />
          <div class="product-details">
            <div class="product-row">
              <div class="product-column name-column">
                <h3>{{ getProductName(product) }}</h3>
              </div>
              <div class="product-column quantity-column">
                <p>Số lượng:</p>
                <p class="quantity-value">{{ product.QUANTITY }}</p>
              </div>
              <div class="product-column price-column">
                <p>Đơn giá:</p>
                <p>{{ formatCurrency(product.PRICE) }}</p>
              </div>
              <div class="product-column total-column">
                <p class="product-total">
                  Thành tiền:
                  {{ formatCurrency(product.TOTAL_PRICE_FOR_PRODUCT) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="total-payment">
        <h2>Tổng thanh toán:</h2>
        <h2 class="total-payment-price">{{ formatCurrency(totalPrice) }}</h2>
      </div>

      <!-- Nút Thanh Toán -->
      <div class="payment-btn">
        <button @click="handlePayment" class="confirm-booking-btn">
          Xác nhận thanh toán
        </button>
      </div>
    </div>
    <div v-if="!loading && selectedProducts.length === 0">
      <p>Giỏ hàng của bạn đang trống.</p>
    </div>
  </div>
</template>

<script>
import axiosClient from "../../../api/axiosClient"; // Đảm bảo bạn đã import đúng axiosClient
import { mapGetters } from "vuex";

export default {
  name: "PaymentPage",
  data() {
    return {
      selectedProducts: [], // Các sản phẩm đã chọn từ giỏ hàng
      totalPrice: 0, // Tổng giá tiền
      loading: true, // Trạng thái tải dữ liệu
      isEditing: false, // Trạng thái để hiển thị form chỉnh sửa
    };
  },
  computed: {
    ...mapGetters(["userInfo"]), // Lấy thông tin người dùng từ Vuex store
    selectedProducts() {
      return this.$store.getters.getSelectedProductsCart;
    },
  },
  created() {
    this.selectedProducts = this.$store.getters.getSelectedProductsCart;
    console.log("Sản phẩm đã chọn trong BookingPage:", this.selectedProducts);
    if (!this.selectedProducts || this.selectedProducts.length === 0) {
      this.$toast.error(
        "Không có sản phẩm nào được chọn. Vui lòng quay lại và chọn phòng."
      );
      this.$router.push({ name: "CartPage" });
    } else {
      // Tính tổng giá các sản phẩm
      this.totalPrice = this.selectedProducts.reduce(
        (total, product) => total + product.TOTAL_PRICE_FOR_PRODUCT,
        0
      );
    }
    this.loading = false;
  },
  // async created() {
  //   this.fetchSelectedProducts();
  // },
  methods: {
    getProductName(product) {
      return product.NAME || "Tên sản phẩm";
    },
    getImage(product) {
      return product.IMAGES?.[0] || "default_image_url"; // Hiển thị ảnh mặc định nếu không có ảnh
    },
    formatCurrency(value) {
      if (!value) return "0 đ";
      return value.toLocaleString("vi-VN") + " đ"; // Định dạng tiền tệ Việt Nam
    },
    fetchSelectedProducts() {
      try {
        this.loading = true;
        const products = this.$route.query.products;
        if (products) {
          this.selectedProducts = JSON.parse(products);
          // Tính tổng giá của các sản phẩm đã chọn
          this.totalPrice = this.selectedProducts.reduce(
            (total, product) => total + product.TOTAL_PRICE_FOR_PRODUCT,
            0
          );
        }
      } catch (error) {
        console.error("Error fetching selected products:", error);
      } finally {
        this.loading = false;
      }
    },
    async handlePayment() {
      try {
        const productsDetails = this.selectedProducts.map((product) => ({
          PRODUCT_ID: product.PRODUCT_ID,
          QUANTITY: product.QUANTITY,
          CUSTOMER_PHONE: this.userInfo.PHONE_NUMBER,
          CUSTOMER_NAME: this.userInfo.FULLNAME,
          CUSTOMER_ADDRESS: this.userInfo.ADDRESS,
        }));
        console.log("Dữ liệu gửi lên server:", productsDetails);
        // Gọi API bookProductNows để tạo booking
        const bookingResponse = await axiosClient.post(
          "/bookings/bookProductNows",
          {
            productsDetails,
          }
        );

        if (bookingResponse.data.success) {
          // Nếu booking thành công, tiếp tục tạo liên kết thanh toán VNPay
          const paymentResponse = await axiosClient.post(
            "/payments/create_payment_url",
            {
              id: bookingResponse.data.data._id,
              totalPrice: this.totalPrice,
            }
          );

          if (paymentResponse.data.statusCode === 200) {
            // Redirect tới URL của VNPay để thanh toán
            window.location.href = paymentResponse.data.data.url;
          } else {
            console.error(
              "Tạo liên kết thanh toán thất bại:",
              paymentResponse.data.msg
            );
          }
        }
      } catch (error) {
        console.error("Lỗi khi thực hiện thanh toán:", error);
      }
    },
  },
};
</script>

<style scoped>
.booking-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Căn giữa tiêu đề */
h1 {
  text-align: center; /* Canh giữa */
}

.address-info {
  margin-bottom: 20px;
}

.address-row {
  display: flex; /* Sử dụng flexbox để hiển thị theo hàng ngang */
  justify-content: space-between; /* Canh đều các cột */
}

.address-row p {
  margin-right: 20px; /* Khoảng cách giữa các thông tin */
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 20px; /* Khoảng cách giữa các sản phẩm */
}

.address-header {
  display: flex;
  align-items: center; /* Căn giữa icon và chữ */
  color: #3ba8cd; /* Màu xanh biển */
}

.location-icon {
  margin-right: 8px; /* Khoảng cách giữa icon và chữ */
  color: #3ba8cd; /* Màu xanh biển cho icon */
}

.bold-text {
  font-weight: bold; /* Làm cho chữ trong userInfo đậm hơn */
}

.product-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}

.product-row {
  display: grid;
  grid-template-columns: 6fr 2fr 2fr 2fr; /* 6 phần cho tên và 2 phần cho số lượng, đơn giá và thành tiền */
  gap: 20px;
  width: 100%;
}

.product-image {
  width: 100px;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
}

.product-column {
  padding: 10px;
}

.product-column h3 {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.product-total {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-align: center;
}
.quantity-value {
  padding: 0 30px;
}
.total-payment {
  margin-top: 30px;
  font-size: 20px;
  font-weight: bold;
  text-align: right;
}

.total-payment h2 {
  font-weight: bold;
}

.total-payment-price {
  color: #0a6f90;
  padding-right: 20px;
}
.payment-btn {
  text-align: center;
  margin-top: 20px;
}

.confirm-booking-btn {
  background-color: #a06e5c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.confirm-booking-btn:hover {
  background-color: #8c5c4b;
}
</style>
