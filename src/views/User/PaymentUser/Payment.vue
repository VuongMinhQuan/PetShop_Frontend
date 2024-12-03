<template>
  <div class="booking-page">
    <h1>Thông tin Đặt hàng</h1>
    <div v-if="loading">Đang tải thông tin đặt hàng...</div>
    <div v-if="!loading && selectedProducts.length > 0" class="booking-content">
      <!-- Bên trái: Danh sách sản phẩm -->
      <div class="product-list-container">
        <h2 class="section-header">Danh sách sản phẩm</h2>
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
      </div>

      <div class="payment-info-container">
        <div class="combined-info">
          <div class="address-info">
            <h2 class="address-header">
              <i class="fas fa-location-dot location-icon"></i>
              Địa chỉ nhận hàng
            </h2>
            <div class="address-row">
              <div class="address-column">
                <p>
                  <i class="fa-solid fa-user"></i> Họ tên:
                  <input
                    type="text"
                    v-model="customerName"
                    :placeholder="userInfo?.FULLNAME"
                    class="input-field"
                  />
                </p>
              </div>
              <div class="address-column">
                <p>
                  <i class="fa-solid fa-phone"></i> Số điện thoại:
                  <input
                    type="text"
                    v-model="customerPhone"
                    :placeholder="userInfo?.PHONE_NUMBER"
                    class="input-field"
                  />
                </p>
              </div>
            </div>
            <div class="address-column">
              <p>
                <i class="fas fa-location-dot"></i>
                Tên đường:
                <input
                  type="text"
                  v-model="customerAddress"
                  placeholder="Vui lòng nhập tên đường"
                  class="input-field"
                  required
                />
              </p>
            </div>
            <!-- Select cho tỉnh -->
            <div class="address-column">
              <label for="province">Tỉnh/Thành phố:</label>
              <select v-model="selectedProvince" @change="handleProvinceChange">
                <option value="" disabled selected>Chọn tỉnh</option>
                <option
                  v-for="province in provinces"
                  :key="province.ProvinceID"
                  :value="province.ProvinceID"
                >
                  {{ province.ProvinceName }}
                </option>
              </select>
            </div>

            <!-- Select cho huyện -->
            <div class="address-column">
              <label for="district">Quận/Huyện:</label>
              <select
                v-model="selectedDistrict"
                @change="handleDistrictChange"
                :disabled="!selectedProvince"
              >
                <option value="" disabled selected>Chọn huyện</option>
                <option
                  v-for="district in districts"
                  :key="district.DistrictID"
                  :value="district.DistrictID"
                >
                  {{ district.DistrictName }}
                </option>
              </select>
            </div>

            <!-- Select cho xã -->
            <div class="address-column">
              <label for="ward">Phường/Xã:</label>
              <select v-model="selectedWard" :disabled="!selectedDistrict">
                <option value="" disabled selected>Chọn xã</option>
                <option
                  v-for="ward in wards"
                  :key="ward.WardCode"
                  :value="ward.WardCode"
                >
                  {{ ward.WardName }}
                </option>
              </select>
            </div>
          </div>

          <!-- Phần phương thức thanh toán -->
          <div class="payment-method-total">
            <div class="payment-method">
              <h2>Phương thức thanh toán:</h2>
              <div class="checkbox-group">
                <label>
                  <input
                    type="radio"
                    value="COD"
                    v-model="paymentMethod"
                    name="paymentMethod"
                  />
                  Thanh toán khi nhận hàng (COD)
                </label>
                <label>
                  <input
                    type="radio"
                    value="VNPay"
                    v-model="paymentMethod"
                    name="paymentMethod"
                  />
                  Thanh toán bằng VNPay
                </label>
              </div>
              <hr class="separator-line" />
            </div>

            <!-- Căn chỉnh tổng thanh toán và nút thanh toán trên cùng một hàng -->
            <div class="total-payment-row">
              <div class="total-payment">
                <h2>Tổng thanh toán:</h2>
                <h2 class="total-payment-price">
                  {{ formatCurrency(totalPrice) }}
                </h2>
              </div>

              <div class="payment-btn">
                <button @click="handlePayment" class="confirm-booking-btn">
                  Xác nhận thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
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
      paymentMethod: "",
      customerName: this.userInfo?.FULLNAME || "",
      customerPhone: this.userInfo?.PHONE_NUMBER || "",
      customerAddress: "",
      provinces: [], // Danh sách tỉnh
      selectedProvince: null, // Province ID đã chọn
      districts: [], // Danh sách huyện
      selectedDistrict: null, // District ID đã chọn
      wards: [], // Danh sách xã
      selectedWard: null, // Ward Code đã chọn
    };
  },
  computed: {
    ...mapGetters(["userInfo"]), // Lấy thông tin người dùng từ Vuex store
    selectedProducts() {
      return this.$store.getters.getSelectedProductsCart;
    },
  },
  created() {
    this.customerName = this.userInfo?.FULLNAME || "";
    this.customerPhone = this.userInfo?.PHONE_NUMBER || "";
    this.customerAddress = "";
    this.selectedProducts = this.$store.getters.getSelectedProductsCart;
    this.getProvinces();
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
    async getProvinces() {
      try {
        const response = await axiosClient.get(
          "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
          { headers: { token: "8dbe2a0f-8ec3-11ef-8e53-0a00184fe694" } }
        );
        this.provinces = response.data.data; // Lưu danh sách tỉnh
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    },
    async getDistricts(provinceId) {
      try {
        const response = await axiosClient.get(
          `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`,
          {
            headers: {
              token: "8dbe2a0f-8ec3-11ef-8e53-0a00184fe694",
              "Content-Type": "application/json",
            },
          }
        );
        this.districts = response.data.data; // Lưu danh sách huyện
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    },
    async getWards(districtId) {
      try {
        const response = await axiosClient.post(
          "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward",
          {
            district_id: districtId,
          },
          {
            headers: {
              token: "8dbe2a0f-8ec3-11ef-8e53-0a00184fe694",
              "Content-Type": "application/json",
            },
          }
        );
        this.wards = response.data.data; // Lưu danh sách xã
      } catch (error) {
        console.error("Error fetching wards:", error);
      }
    },
    handleProvinceChange() {
      this.selectedDistrict = null; // Reset quận khi chọn tỉnh mới
      this.wards = []; // Reset xã khi chọn tỉnh mới
      if (this.selectedProvince) {
        this.getDistricts(this.selectedProvince); // Gọi API để lấy huyện
      }
    },
    handleDistrictChange() {
      this.selectedWard = null; // Reset xã khi chọn huyện mới
      if (this.selectedDistrict) {
        this.getWards(this.selectedDistrict); // Gọi API để lấy xã
      }
    },
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
    async getProvince() {
      const province = await axiosClient.get(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
        { headers: "Token: 8dbe2a0f-8ec3-11ef-8e53-0a00184fe694" }
      );
      console.log(province.data);
    },
    async getDistrict(provinceId) {
      try {
        const response = await axiosClient.get(
          "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district",
          {
            headers: {
              token: "8dbe2a0f-8ec3-11ef-8e53-0a00184fe694", // Cập nhật token
              "Content-Type": "application/json",
            },
            data: {
              province_id: provinceId, // Truyền province_id vào body
            },
          }
        );
        console.log(response.data);
        return response.data; // Nếu bạn muốn trả về dữ liệu
      } catch (error) {
        console.error("Error fetching district data:", error);
        throw error; // Có thể ném lỗi để xử lý bên ngoài
      }
    },
    async getWard(districtId) {
      try {
        const response = await axiosClient.post(
          "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward",
          {
            district_id: districtId, // Truyền district_id vào body
          },
          {
            headers: {
              token: "8dbe2a0f-8ec3-11ef-8e53-0a00184fe694", // Cập nhật token
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
        return response.data; // Nếu bạn muốn trả về dữ liệu
      } catch (error) {
        console.error("Error fetching ward data:", error);
        throw error; // Có thể ném lỗi để xử lý bên ngoài
      }
    },
    async handlePayment() {
      try {
        if (
          !this.customerName ||
          !this.customerPhone ||
          !this.customerAddress ||
          !this.selectedProvince ||
          !this.selectedDistrict ||
          !this.selectedWard
        ) {
          this.$toast.error("Vui lòng nhập đầy đủ thông tin giao hàng", {
            position: "top-right", // Hiển thị thông báo ở góc trên phải
            timeout: 3000, // Thời gian hiển thị (ms)
            closeOnClick: true, // Cho phép đóng thông báo khi click
            pauseOnHover: true, // Tạm dừng khi di chuột qua
          });
          return; // Dừng thực hiện nếu thông tin không hợp lệ
        }
        const productsDetails = this.selectedProducts.map((product) => ({
          PRODUCT_ID: product.PRODUCT_ID,
          QUANTITY: product.QUANTITY,
          CUSTOMER_PHONE: this.customerPhone || this.userInfo.PHONE_NUMBER,
          CUSTOMER_NAME: this.customerName || this.userInfo.FULLNAME,
          CUSTOMER_ADDRESS: this.customerAddress || this.userInfo.ADDRESS,
          ProvinceID: this.selectedProvince, // Lấy ID tỉnh từ select
          ProvinceName: this.provinces.find(
            (p) => p.ProvinceID === this.selectedProvince
          )?.ProvinceName,
          DistrictID: this.selectedDistrict, // Lấy ID huyện từ select
          DistrictName: this.districts.find(
            (d) => d.DistrictID === this.selectedDistrict
          )?.DistrictName, // Tìm tên huyện
          WardCode: this.selectedWard, // Lấy mã xã từ select
          WardName: this.wards.find((w) => w.WardCode === this.selectedWard)
            ?.WardName, // Tìm tên xã
        }));
        console.log("Dữ liệu gửi lên server:", productsDetails);

        // Gọi API bookProductNows để tạo booking
        const bookingResponse = await axiosClient.post(
          "/bookings/bookProductNows",
          {
            productsDetails,
            paymentMethod: this.paymentMethod,
          }
        );

        if (bookingResponse.data.success) {
          // Kiểm tra phương thức thanh toán
          if (this.paymentMethod === "COD") {
            // Nếu chọn COD, không cần gọi API VNPay, chỉ tạo booking
            this.$toast.success(
              "Đặt hàng thành công! Phương thức thanh toán COD."
            );
            setTimeout(() => {
              this.$router.push({ name: "History" });
            }, 1000);
          } else if (this.paymentMethod === "VNPay") {
            // Nếu chọn VNPay, tiếp tục tạo liên kết thanh toán VNPay
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

.booking-content {
  display: flex; /* Đặt layout flexbox */
  gap: 20px; /* Khoảng cách giữa các cột */
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

.product-list-container {
  flex: 1; /* Chiếm đầy đủ không gian bên trái */
}

.product-list-container h2 {
  color: #3ba8cd;
}

.payment-info-container {
  flex: 1; /* Chiếm đầy đủ không gian bên phải */
  display: flex;
  flex-direction: column;
  gap: 20px; /* Khoảng cách giữa các phần tử */
}

.address-info,
.payment-total-row {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
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

.hidden {
  display: none;
}
.product-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  border: 1px solid #a49d9d; /* 2px là độ dày của viền, bạn có thể tăng lên */
  box-shadow: 2px 2px 2px 4px rgba(0, 0, 0, 0.2);
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

.combined-info {
  background-color: #f5f5f5;
  border: 2px solid #a49d9d; /* Viền chung cho cả phần */
  border-radius: 8px; /* Bo tròn góc */
  box-shadow: 2px 2px 2px 4px rgba(0, 0, 0, 0.1); /* Bóng đổ nhẹ */
  display: flex;
  flex-direction: column; /* Căn dọc các phần tử bên trong */
}

.payment-total-row {
  display: flex;
  justify-content: space-between; /* Để canh đều các cột */
  align-items: center; /* Đảm bảo các phần tử cùng hàng */
  margin-top: 30px;
}

.total-payment-row {
  display: flex;
  align-items: center; /* Căn giữa theo chiều dọc */
  justify-content: space-between; /* Căn đều 2 bên */
  margin-top: 20px;
}
.total-payment {
  font-size: 20px;
  font-weight: bold;
  text-align: right;
}

.total-payment h2 {
  font-weight: bold;
}

.total-payment-price {
  color: #0a6f90;
  display: flex;
  justify-content: center;
}

.payment-method {
  text-align: left; /* Canh lề trái */
  padding-left: 20px; /* Khoảng cách từ lề trái */
}

.payment-method-total {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  flex-direction: column; /* Sắp xếp theo chiều dọc */
  gap: 20px;
}

.checkbox-group {
  display: flex;
  flex-direction: column; /* Sắp xếp theo cột */
  gap: 10px;
  margin-top: 10px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  font-size: 16px;
}

.checkbox-group input[type="radio"] {
  margin-right: 8px;
}

.payment-btn {
  text-align: center;
  margin-top: 20px;
}

.input-field {
  width: 100%;
  padding: 8px;
  margin-top: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.confirm-booking-btn {
  background-color: #1181a6;
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

.separator-line {
  border: 0;
  height: 1px;
  background-color: #1d67a4; /* Màu xanh biển */
  margin: 20px 0; /* Khoảng cách trên và dưới */
}

.address-column select {
  width: 100%;
  padding: 8px;
  margin-top: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.address-column label {
  display: block;
  margin-top: 10px;
  font-weight: bold;
}

.address-column select:focus {
  outline: none;
  border-color: #1181a6; /* Màu viền khi select được focus */
  box-shadow: 0 0 5px rgba(17, 129, 166, 0.5); /* Bóng đổ nhẹ khi focus */
}
</style>
