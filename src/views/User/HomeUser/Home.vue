<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <img
          :src="banners[currentIndex].src"
          :alt="banners[currentIndex].alt"
          class="hero-image"
        />
      </div>
    </section>

    <section id="features" class="features">
      <h2>Sản phẩm mới</h2>
      <div class="feature-list">
        <div
          v-for="product in latestProducts"
          :key="product._id"
          class="feature"
        >
          <img
            :src="product.IMAGES[0] || '@/assets/banner.jpg'"
            :alt="product.NAME"
          />
          <h3>{{ product.NAME }}</h3>
          <p>{{ formatPrice(product.PRICE) }} đ</p>
        </div>
      </div>
      <div class="view-more">
        <router-link to="/user/product" class="btn-view-more"
          >Xem thêm</router-link
        >
      </div>
    </section>

    <!-- New Section with Banner and Images -->
    <section class="banner-and-images">
      <div class="banner-left">
        <img src="@/assets/banner-dog.jpg" alt="Dog Banner" />
      </div>
      <div class="grid-container">
        <div class="grid-item">
          <img src="@/assets/Alaska.jpg" alt="Alaska" />
          <p>Alaska</p>
        </div>
        <div class="grid-item">
          <img src="@/assets/Husky.jpg" alt="Husky" />
          <p>Husky</p>
        </div>
        <div class="grid-item">
          <img src="/src/assets/Corgi.jpg" alt="Corgi" />
          <p>Corgi</p>
        </div>
        <div class="grid-item">
          <img src="@/assets/Golden.jpg" alt="Golden" />
          <p>Golden</p>
        </div>

        <div class="grid-item">
          <img src="@/assets/Poodle.jpg" alt="Poodle" />
          <p>Poodle</p>
        </div>
        <div class="grid-item">
          <img src="@/assets/Samoyed.jpg" alt="Samoyed" />
          <p>Samoyed</p>
        </div>
        <div class="grid-item">
          <img src="@/assets/Bull.jpg" alt="Bull Pháp" />
          <p>Bull Pháp</p>
        </div>
        <div class="grid-item">
          <img src="@/assets/Pug.jpg" alt="Pug" />
          <p>Pug</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import banner1 from "@/assets/banner1.jpg";
import banner2 from "@/assets/banner.jpg";
import axios from "../../../api/axiosClient";

export default {
  name: "Home",
  data() {
    return {
      currentIndex: 0,
      banners: [
        { src: banner1, alt: "Banner 1" },
        { src: banner2, alt: "Banner 2" },
      ],
      latestProducts: [], // Dữ liệu sản phẩm mới nhất
    };
  },
  created() {
    this.startSlideshow();
    this.fetchLatestProducts(); // Gọi API khi component được tạo
  },
  methods: {
    startSlideshow() {
      setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.banners.length;
      }, 5000);
    },
    async fetchLatestProducts() {
      try {
        const response = await axios.get("/products/getLatestProducts");
        this.latestProducts = response.data.data;
      } catch (error) {
        console.error("Error fetching latest products:", error);
      }
    },
    formatPrice(price) {
      if (!price) return "0.000";
      const formattedValue = parseFloat(price).toLocaleString("vi-VN");
      return `${formattedValue}.000`;
    },
  },
};
</script>

<style scoped src="./Home.scss"></style>
