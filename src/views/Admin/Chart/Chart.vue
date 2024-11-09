<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "vue-chartjs";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default {
  name: "App",
  components: {
    Line,
  },
  data() {
    return {
      chartData: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            label: "Monthly Revenue",
            backgroundColor: "#f87979",
            data: Array(12).fill(0), // Initialize with 12 zeros for each month
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  async mounted() {
    await this.fetchRevenueData();
  },
  methods: {
    async fetchRevenueData() {
      try {
        const response = await axios.get(
          "http://localhost:3000/bookings/revenue?year=2024"
        );
        const revenueData = response.data?.data?.monthlyRevenue || [];
        const updatedData = Array(12).fill(0);

        revenueData.forEach((e) => {
          updatedData[e._id.month - 1] = e.totalRevenue;
        });

        this.chartData = {
          ...this.chartData,
          datasets: [
            {
              ...this.chartData.datasets[0],
              data: updatedData,
            },
          ],
        };
        console.log(this.chartData.datasets[0]);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    },
  },
};
</script>
