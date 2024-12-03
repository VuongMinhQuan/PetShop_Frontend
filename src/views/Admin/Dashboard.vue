<template>
  <div class="dashboard-container">
    <div class="card-container">
      <div class="card card-green">
        <div class="card-icon">
          <i class="fa-solid fa-money-bill"></i>
        </div>
        <div class="card-content">
          <p>Doanh thu so với tháng trước</p>
          <h1>{{ formatPrice(currentMonthRevenue) }}</h1>
          <p v-if="changePercentage > 0" class="percentage positive">
            <i class="fa-solid fa-arrow-up"></i>
            Tăng {{ changePercentage }}%
          </p>
          <p v-else-if="changePercentage < 0" class="percentage negative">
            <i class="fa-solid fa-arrow-down"></i>
            Giảm {{ Math.abs(changePercentage) }}%
          </p>
          <p v-else class="percentage neutral">Không thay đổi</p>
        </div>
      </div>

      <!-- Thẻ Tổng số user đăng ký -->
      <div class="card card-red">
        <div class="card-icon">
          <i class="fa-solid fa-user"></i>
        </div>
        <div class="card-content">
          <p>Tổng số user đăng ký</p>
          <h1>{{ totalUser }}</h1>
        </div>
      </div>

      <!-- Thẻ Tổng số sản phẩm -->
      <div class="card card-blue">
        <div class="card-icon">
          <i class="fa-solid fa-boxes-stacked"></i>
        </div>
        <div class="card-content">
          <p>Tổng số sản phẩm</p>
          <h1>{{ totalProduct }}</h1>
        </div>
      </div>

      <!-- Thẻ Tổng đánh giá của cửa hàng -->
      <div class="card card-yellow">
        <div class="card-content">
          <p>Tổng đánh giá của cửa hàng</p>
          <h1>
            <span
              v-for="star in Math.floor(totalRating)"
              :key="star"
              class="star filled"
              >&#9733;</span
            >
            <span v-if="!Number.isInteger(totalRating)" class="star half"
              >&#9733;</span
            >
            <span
              v-for="star in 5 - Math.ceil(totalRating)"
              :key="star"
              class="star"
              >&#9733;</span
            >
            <span class="rating-value">({{ totalRating.toFixed(1) }})</span>
          </h1>
        </div>
      </div>
      <!-- Thẻ Chi phí nhập hàng tháng này -->
      <div class="card card-warehouse-expense">
        <div class="card-icon">
          <i class="fa-solid fa-coins"></i>
          <!-- Icon tiền xu -->
        </div>
        <div class="card-content">
          <p>Chi phí nhập hàng tháng này</p>
          <h1>{{ formatPrice(totalWarehouseCost) }}</h1>
        </div>
      </div>
    </div>
    <section class="filter-section">
      <div class="filter-group-container">
        <label class="filter-label">Bộ lọc thời gian</label>
        <select
          v-model="timeFrame"
          @change="fetchDataForCharts"
          class="large-select"
        >
          <option value="day">Theo ngày</option>
          <option value="month">Theo tháng</option>
          <option value="year">Theo năm</option>
        </select>
      </div>

      <div v-if="timeFrame === 'day'" class="filter-group-container">
        <label class="filter-label">Chọn ngày</label>
        <div class="filter-group">
          <input
            type="date"
            v-model="selectedDate"
            @change="fetchDataForCharts"
          />
          <button class="refresh-button" @click="resetToDailyData">
            Làm mới
          </button>
        </div>
      </div>

      <div v-if="timeFrame === 'month'" class="filter-group-container">
        <label class="filter-label">Chọn tháng</label>
        <div class="filter-group">
          <input
            type="month"
            v-model="selectedMonth"
            @change="handleMonthChange"
          />
          <button class="refresh-button" @click="resetToMonthlyData">
            Làm mới
          </button>
        </div>
      </div>

      <div v-if="timeFrame === 'year'" class="filter-group-container">
        <label class="filter-label">Chọn năm</label>
        <div class="filter-group">
          <input
            type="number"
            placeholder="Nhập năm"
            v-model="selectedYear"
            @change="fetchDataForCharts"
          />
        </div>
      </div>
    </section>

    <div class="charts-container">
      <section class="chart-section">
        <canvas id="revenueChart"></canvas>
      </section>
      <section class="chart-section">
        <canvas id="bookingStatusChart"></canvas>
      </section>
    </div>
    <section class="chart-section top-selling-chart-section">
      <h2 class="top-selling-chart-section-title">Top 5 sản phẩm bán chạy</h2>
      <div class="chart-wrapper">
        <canvas id="topSellingProductsChart"></canvas>
      </div>
    </section>
  </div>
</template>

<script>
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarController,
  BarElement,
} from "chart.js";
import axios from "../../api/axiosClient";
// import Chart from "./Chart/Chart.vue";
ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarController,
  BarElement
);

export default {
  name: "Dashboard",
  data() {
    return {
      timeFrame: "month",
      selectedDate: "",
      selectedMonth: "",
      selectedYear: new Date().getFullYear(),
      revenueData: [],
      bookingStatusData: [],
      revenueChart: null,
      bookingStatusChart: null,
      totalUser: 0,
      totalProduct: 0,
      totalRating: 0,
      totalRevenue: 0,
      totalCompletedOrders: 0,
      currentYear: new Date().getFullYear(),
      currentMonthRevenue: 0,
      lastMonthRevenue: 0,
      changePercentage: 0,
      topSellingProducts: [], // Dữ liệu sản phẩm bán chạy
      topSellingProductsChart: null,
      totalWarehouseCost: 0,
    };
  },
  mounted() {
    this.fetchActiveUserCount();
    this.fetchMonthlyRevenue();
    this.fetchTotalProductCount();
    this.fetchTotalReviews();
    this.fetchWarehouseCost();
    this.fetchDataForCharts();
    this.fetchRevenueComparison();
    this.fetchTopSellingProducts();
  },
  computed: {
    currentMonth() {
      const date = new Date();
      const monthNames = [
        "tháng 1",
        "tháng 2",
        "tháng 3",
        "tháng 4",
        "tháng 5",
        "tháng 6",
        "tháng 7",
        "tháng 8",
        "tháng 9",
        "tháng 10",
        "tháng 11",
        "tháng 12",
      ];
      return monthNames[date.getMonth()];
    },
  },
  methods: {
    async fetchTopSellingProducts() {
      try {
        const response = await axios.get(
          "http://localhost:3000/bookings/topselling"
        );
        this.topSellingProducts = response.data.data; // Giả sử API trả về mảng sản phẩm
        this.updateTopSellingProductsChart();
      } catch (error) {
        console.error("Error fetching top-selling products:", error);
      }
    },
    handleMonthChange() {
      if (this.selectedMonth) {
        const [year, month] = this.selectedMonth.split("-");
        this.selectedMonth = `${year}-${month}`;
        this.fetchDataForCharts(); // Gọi lại hàm để lấy dữ liệu khi tháng thay đổi
      }
    },
    handleDayChange() {
      // Giữ nguyên giá trị của selectedDate để đúng định dạng yyyy-MM-dd
      this.fetchDataForCharts();
    },
    resetToDailyData() {
      this.selectedDate = ""; // Đặt lại ngày đã chọn để lấy dữ liệu cho tất cả các ngày
      this.fetchDataForCharts();
    },
    resetToMonthlyData() {
      this.selectedMonth = ""; // Đặt lại tháng
      this.selectedYear = new Date().getFullYear(); // Đặt lại năm về năm hiện tại
      this.timeFrame = "month"; // Đặt lại thời gian về theo tháng
      this.fetchDataForCharts(); // Gọi lại hàm để lấy dữ liệu cho 12 tháng
    },
    async fetchDataForCharts() {
      await this.fetchRevenueData();
      await this.fetchBookingStatusData();
    },
    async fetchRevenueData() {
      try {
        let params = {
          timeFrame: this.timeFrame,
          selectedYear: this.selectedYear,
        };

        if (this.timeFrame === "day" && this.selectedDate) {
          const [year, month, day] = this.selectedDate.split("-");
          params = {
            ...params,
            selectedYear: year,
            selectedMonth: month,
            selectedDate: day,
          };
        } else if (this.timeFrame === "month" && this.selectedMonth) {
          const [year, month] = this.selectedMonth.split("-");
          params.selectedYear = year;
          params.selectedMonth = month;
        }

        const response = await axios.get(
          "http://localhost:3000/bookings/revenue",
          { params }
        );
        this.revenueData = response.data.data.revenueData;
        this.updateRevenueChart();
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    },
    async fetchBookingStatusData() {
      try {
        let params = {
          timeFrame: this.timeFrame,
          selectedYear: this.selectedYear,
        };

        if (this.timeFrame === "day" && this.selectedDate) {
          const [year, month, day] = this.selectedDate.split("-");
          params = {
            ...params,
            selectedYear: year,
            selectedMonth: month,
            selectedDate: day,
          };
        } else if (this.timeFrame === "month" && this.selectedMonth) {
          const [year, month] = this.selectedMonth.split("-");
          params = {
            ...params,
            selectedYear: year,
            selectedMonth: month,
          };
        }

        const response = await axios.get("/bookings/bookingstatus", { params });
        this.bookingStatusData = response.data.data.bookingStatusData;
        this.updateBookingStatusChart();
      } catch (error) {
        console.error("Error fetching booking status data:", error);
      }
    },
    updateTopSellingProductsChart() {
      if (this.topSellingProductsChart) this.topSellingProductsChart.destroy();

      const ctx = document
        .getElementById("topSellingProductsChart")
        .getContext("2d");

      // Đảm bảo cả hai mảng `quantities` và `revenues` có cùng độ dài
      const labels = this.topSellingProducts.map(
        (product) => product.productName || "Không xác định"
      );
      const quantities = this.topSellingProducts.map(
        (product) => product.totalQuantity || 0 // Giá trị mặc định là 0
      );
      const revenues = this.topSellingProducts.map(
        (product) => product.totalRevenue || 0 // Giá trị mặc định là 0
      );

      // Nếu không có dữ liệu, sử dụng dữ liệu mẫu
      if (labels.length === 0) {
        labels.push("Không có dữ liệu");
        quantities.push(0);
        revenues.push(0);
      }

      this.topSellingProductsChart = new ChartJS(ctx, {
        type: "bar",
        data: {
          labels, // Tên các sản phẩm
          datasets: [
            {
              label: "Số lượng đã bán",
              data: quantities, // Dữ liệu số lượng đã bán
              backgroundColor: "rgba(114, 116, 255, 0.6)", // Màu xanh dương
              borderColor: "#7274FF",
              borderWidth: 1,
              yAxisID: "y1", // Gán trục y riêng
            },
            {
              label: "Doanh thu (VND)",
              data: revenues, // Dữ liệu doanh thu
              backgroundColor: "rgba(76, 175, 80, 0.6)", // Màu xanh lá
              borderColor: "#4CAF50",
              borderWidth: 1,
              yAxisID: "y2", // Gán trục y riêng
            },
          ],
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "bottom",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Tên sản phẩm",
              },
            },
            y1: {
              position: "left", // Trục y cho số lượng đã bán
              title: {
                display: true,
                text: "Số lượng",
              },
              beginAtZero: true, // Bắt đầu từ 0
              ticks: {
                stepSize: 1, // Khoảng cách giữa các giá trị
              },
            },
            y2: {
              position: "right", // Trục y cho doanh thu
              title: {
                display: true,
                text: "Doanh thu (VND)",
              },
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  // Format giá trị thành số tiền
                  return value.toLocaleString("vi-VN") + "đ";
                },
              },
              grid: {
                drawOnChartArea: false, // Không hiển thị lưới từ trục y2
              },
            },
          },
        },
      });
    },

    updateRevenueChart() {
      if (this.revenueChart) this.revenueChart.destroy();
      const ctx = document.getElementById("revenueChart").getContext("2d");
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, "rgba(114, 116, 255, 1)"); // Màu đậm ở trên
      gradient.addColorStop(1, "rgba(114, 116, 255, 0.1)"); // Màu nhạt ở dưới
      let labels = this.revenueData.map((entry) => entry.date);
      let dataPoints = this.revenueData.map((entry) => entry.revenue);

      this.revenueChart = new ChartJS(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Doanh thu (VND)",
              data: dataPoints,
              borderColor: "#7274FF",
              backgroundColor: gradient,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: "bottom" },
          },
          scales: {
            y: {
              title: { display: true, text: "Doanh thu (VND)" },
              beginAtZero: true,
            },
          },
        },
      });
    },
    updateBookingStatusChart() {
      if (this.bookingStatusChart) this.bookingStatusChart.destroy();
      const ctx = document
        .getElementById("bookingStatusChart")
        .getContext("2d");

      this.bookingStatusChart = new ChartJS(ctx, {
        type: "line",
        data: {
          labels: this.bookingStatusData.map((entry) => entry.date),
          datasets: [
            {
              label: "Đơn hàng thành công",
              data: this.bookingStatusData.map(
                (entry) => entry.successfulCount
              ),
              borderColor: "#4CAF50",
              backgroundColor: "rgba(76, 175, 80, 0.3)",
              fill: true,
            },
            {
              label: "Đơn hàng bị hủy",
              data: this.bookingStatusData.map((entry) => entry.canceledCount),
              borderColor: "#FF5252",
              backgroundColor: "rgba(255, 82, 82, 0.3)",
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "bottom",
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "Số lượng",
              },
              beginAtZero: true,
            },
          },
        },
      });
    },
    async fetchWarehouseCost() {
      try {
        const response = await axios.get(
          "http://localhost:3000/warehouses/value-currentmonth"
        );
        this.totalWarehouseCost = response.data.data.totalValue;
      } catch (error) {
        console.error("Error fetching warehouse cost:", error.message);
      }
    },
    async fetchActiveUserCount() {
      try {
        const response = await axios.get("/users/activeUserCount");
        this.totalUser = response.data.count;
      } catch (error) {
        console.error("Error fetching active user count:", error);
      }
    },
    async fetchMonthlyRevenue() {
      try {
        // Thay đổi giá trị `year` và `month` nếu cần
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;

        const response = await axios.get(
          `http://localhost:3000/bookings/monthly`,
          {
            params: { year, month },
          }
        );
        this.totalRevenue = response.data.data.revenue;
      } catch (error) {
        console.error("Error fetching monthly revenue:", error);
      }
    },
    async fetchTotalProductCount() {
      try {
        const response = await axios.get(
          "http://localhost:3000/products/totalCount"
        );
        this.totalProduct = response.data.totalProductCount;
      } catch (error) {
        console.error("Error fetching total product count:", error);
      }
    },
    async fetchTotalReviews() {
      try {
        const response = await axios.get(
          "http://localhost:3000/reviews/totalReviews"
        );
        this.totalRating = response.data.data.totalAverageRating; // Giả sử `totalAverageRating` trả về từ API
      } catch (error) {
        console.error("Error fetching total reviews:", error);
      }
    },
    async fetchTotalCompletedOrders() {
      try {
        const response = await axios.get(
          "http://localhost:3000/bookings/complete"
        );
        this.totalCompletedOrders = response.data.data.completeBookingsCount;
      } catch (error) {
        console.error("Error fetching completed orders count:", error);
      }
    },
    async fetchRevenueComparison() {
      try {
        const year = new Date().getFullYear(); // Lấy năm hiện tại
        const month = new Date().getMonth() + 1; // Lấy tháng hiện tại (0-based nên cần +1)

        const response = await axios.get(
          `http://localhost:3000/bookings/comparison`,
          {
            params: {
              year, // Truyền năm
              month, // Truyền tháng
            },
          }
        );

        const data = response.data.data;

        this.currentMonthRevenue = data.currentMonthRevenue; // Doanh thu tháng hiện tại
        this.lastMonthRevenue = data.lastMonthRevenue; // Doanh thu tháng trước
        this.changePercentage = data.changePercentage; // Phần trăm thay đổi
      } catch (error) {
        console.error("Error fetching revenue comparison:", error.message);
      }
    },

    formatPrice(value) {
      return value.toLocaleString("vi-VN") + "đ";
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.card-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap; /* Để đảm bảo các thẻ không tràn ra ngoài trên màn hình nhỏ */
}

.filter-section {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-group-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
}

.filter-label {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 5px; /* Khoảng cách giữa label và input */
}

.large-select {
  width: 120px; /* Điều chỉnh chiều rộng */
  height: 34px; /* Điều chỉnh chiều cao */
  font-size: 16px; /* Tăng kích thước chữ */
  padding: 5px; /* Tạo thêm khoảng trống bên trong */
}

.filter-group {
  display: flex;
  gap: 10px; /* Khoảng cách giữa input và nút */
}
#revenueChart,
#bookingStatusChart,
#topSellingProductsChart {
  width: 600px; /* Chiều rộng cố định */
  height: 400px; /* Chiều cao cố định */
  max-width: 600px; /* Giới hạn chiều rộng tối đa */
  max-height: 400px; /* Giới hạn chiều cao tối đa */
  display: block;
  margin: 0 auto; /* Căn giữa biểu đồ */
}

.charts-container {
  display: flex;
  gap: 20px;
  width: 1200px !important; /* Đặt chiều rộng cố định */
  height: 400px !important;
}

.chart-section {
  flex: 1;
  min-width: 400px; /* Đảm bảo không nhỏ hơn kích thước này */
  min-height: 300px;
}

.charts-container canvas {
  width: 600px !important; /* Đặt chiều rộng cố định */
  height: 400px !important; /* Đặt chiều cao cố định */
}
.card {
  position: relative;
  display: flex;
  border-radius: 12px;
  width: 220px;
  padding: 20px;
  background-color: #ffffff;
  text-align: left;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card-icon {
  position: absolute;
  bottom: 20px;
  right: 10px;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #ffffff;
}

.card-content h1 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.card-content p {
  margin: 5px 0 0;
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}

.card-content .star {
  font-size: 24px;
  color: #ccc; /* Màu ngôi sao khi chưa được đánh giá */
}

.card-content .star.filled {
  color: #ff9800; /* Màu ngôi sao khi được đánh giá */
}

.card-content .star.half {
  color: #ff9800;
  position: relative;
  clip-path: inset(0 50% 0 0); /* Chỉ hiển thị nửa trái của ngôi sao */
}

/* Màu nền cho từng thẻ */
.card-green {
  background-color: #e6f4ea; /* Màu xanh lá nhạt */
}

.card-red {
  background-color: #e3f2fd; /* Màu xanh da trời nhạt */
}

.card-blue {
  background-color: #e0f7fa; /* Màu xanh cyan nhạt */
}

.card-yellow {
  background-color: #fff3e0; /* Màu cam nhạt */
}

/* Màu cho biểu tượng trong từng thẻ */
.card-green .card-icon {
  background-color: #4caf50;
}

.card-red .card-icon {
  background-color: #2196f3;
}

.card-blue .card-icon {
  background-color: #00bcd4;
}

.card-yellow .card-icon {
  background-color: #ff9800;
}
.card-green .card-content h1 {
  color: #4caf50;
}
.card-red .card-content h1 {
  color: #2196f3;
}
.card-blue .card-content h1 {
  color: #00bcd4;
}
.card-yellow .card-content h1 {
  color: #ff9800;
}
.card-content .star {
  font-size: 24px;
  color: #ccc; /* Màu ngôi sao khi chưa được đánh giá */
}

.card-content .star.filled {
  color: #ff9800; /* Màu ngôi sao khi được đánh giá */
}
.card-warehouse-expense {
  background-color: #fdecea; /* Nền đỏ nhạt */
  border: 1px solid #f44336; /* Viền đỏ */
}

.card-warehouse-expense .card-icon {
  background-color: #f44336; /* Nền icon đỏ */
  color: #ffffff; /* Màu icon trắng */
}

.card-warehouse-expense .card-content h1 {
  color: #f44336; /* Màu chữ đỏ */
}

.card-warehouse-expense .card-content p {
  color: #b71c1c; /* Màu chữ đỏ đậm */
}

.rating-value {
  font-size: 18px;
  color: #333;
  margin-left: 8px;
}
.percentage {
  font-size: 16px;
  margin-top: 10px;
  font-weight: bold;
}

.percentage.positive {
  color: #4caf50; /* Màu xanh lá cho tăng */
}

.percentage.negative {
  color: #f44336; /* Màu đỏ cho giảm */
}

.percentage.neutral {
  color: #9e9e9e; /* Màu xám nếu không thay đổi */
}

.charts {
  margin-top: 20px;
}

.refresh-button {
  background-color: #4caf50; /* Màu nền xanh lá */
  color: #ffffff; /* Màu chữ trắng */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
  height: 32px; /* Chiều cao cố định */
  width: 80px; /* Chiều rộng cố định */
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-button:hover {
  background-color: #388e3c; /* Màu xanh lá đậm hơn khi hover */
}

.top-selling-chart-section {
  display: flex;
  flex-direction: column; /* Đặt các phần tử con theo cột */
  align-items: center; /* Căn giữa nội dung theo chiều ngang */
  justify-content: center; /* Căn giữa nội dung theo chiều dọc */
  width: 100%; /* Đảm bảo phần tử chiếm hết chiều rộng */
  padding: 20px;
  background-color: #ffffff; /* Nền trắng */
  border-radius: 12px; /* Góc bo tròn */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ */
}

/* Canvas biểu đồ */
#topSellingProductsChart {
  width: 100% !important;
  height: 100% !important;
  max-width: 1000px; /* Đặt giới hạn chiều rộng */
  max-height: 1000px; /* Đặt giới hạn chiều cao */
  margin-right: 80px;
}

/* Tiêu đề và nhãn biểu đồ */
.top-selling-chart-section-title {
  font-size: 20px; /* Kích thước chữ lớn */
  font-weight: bold; /* Chữ in đậm */
  text-align: center; /* Canh giữa tiêu đề */
  margin-bottom: 10px; /* Khoảng cách giữa tiêu đề và biểu đồ */
  color: #333; /* Màu chữ xám đậm */
}
.chart-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
/* Hiệu ứng hover cho biểu đồ */
.chart-bar:hover {
  opacity: 0.8; /* Giảm độ rõ khi hover */
}

/* Responsive layout */
@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
    align-items: center;
  }
}
</style>
