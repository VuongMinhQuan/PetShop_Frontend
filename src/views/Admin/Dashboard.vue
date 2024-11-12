<template>
  <div class="dashboard-container">
    <div class="card-container">
      <div class="card card-green">
        <div class="card-icon">
          <i class="fa-solid fa-money-bill"></i>
        </div>
        <div class="card-content">
          <p>Tổng doanh thu {{ currentMonth }}</p>
          <h1>{{ formatPrice(totalRevenue) }}</h1>
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
      <!-- Thẻ Tổng số đơn hàng thành công -->
      <div class="card card-green">
        <div class="card-icon">
          <i class="fa-solid fa-check"></i>
          <!-- Icon dấu kiểm -->
        </div>
        <div class="card-content">
          <p>Tổng đơn hàng thành công</p>
          <h1>{{ totalCompletedOrders }}</h1>
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
  </div>

  <!-- <div class="charts">
    <Chart />
  </div> -->
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
  Filler
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
    };
  },
  mounted() {
    this.fetchActiveUserCount();
    this.fetchMonthlyRevenue();
    this.fetchTotalProductCount();
    this.fetchTotalReviews();
    this.fetchTotalCompletedOrders();
    this.fetchDataForCharts();
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
.charts-container {
  display: flex;
  gap: 20px;
}

.chart-section {
  flex: 1;
  min-width: 300px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.charts-container canvas {
  width: 100% !important; /* Chiếm hết chiều rộng */
  height: 100% !important; /* Chiếm hết chiều cao */
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

.rating-value {
  font-size: 18px;
  color: #333;
  margin-left: 8px;
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

/* Responsive layout */
@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
    align-items: center;
  }
}
</style>
