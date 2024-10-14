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
          <div class="product-image-wrapper">
            <img
              :src="product.IMAGES[0] || '@/assets/banner.jpg'"
              :alt="product.NAME"
            />
            <!-- Thêm icon "New Product" -->
            <span class="new-product-icon">New</span>
          </div>
          <h3 @click="goToProductDetail(product._id)" class="product-name-link">
            {{ product.NAME }}
          </h3>
          <p>{{ formatPrice(product.PRICE) }} đ</p>
        </div>
      </div>
      <div class="view-more">
        <router-link to="/user/product" class="btn-view-more"
          >Xem thêm</router-link
        >
      </div>
    </section>

    <section class="title-dog">
      <h2 class="dog-breeds-title">
        <span class="icon-bone">🦴</span>
        <span class="icon-bone">🦴</span>
        <span class="icon-bone">🦴</span>
        Các giống cún tại shop
        <span class="icon-bone">🦴</span>
        <span class="icon-bone">🦴</span>
        <span class="icon-bone">🦴</span>
      </h2>
    </section>

    <!-- New Section with Banner and Images -->
    <section class="banner-and-images">
      <div class="banner-left">
        <img src="@/assets/banner-dog.jpg" alt="Dog Banner" />
      </div>
      <div class="grid-container">
        <div class="grid-item" @click="goToFilteredProducts('Alaska')">
          <img src="@/assets/Alaska.jpg" alt="Alaska" />
          <p>Alaska</p>
        </div>
        <div class="grid-item" @click="goToFilteredProducts('Husky')">
          <img src="@/assets/Husky.jpg" alt="Husky" />
          <p>Husky</p>
        </div>
        <div class="grid-item" @click="goToFilteredProducts('Corgi')">
          <img src="/src/assets/Corgi.jpg" alt="Corgi" />
          <p>Corgi</p>
        </div>
        <div class="grid-item" @click="goToFilteredProducts('Golden')">
          <img src="@/assets/Golden.jpg" alt="Golden" />
          <p>Golden</p>
        </div>

        <div class="grid-item" @click="goToFilteredProducts('Poodle')">
          <img src="@/assets/Poodle.jpg" alt="Poodle" />
          <p>Poodle</p>
        </div>
        <div class="grid-item" @click="goToFilteredProducts('Samoyed')">
          <img src="@/assets/Samoyed.jpg" alt="Samoyed" />
          <p>Samoyed</p>
        </div>
        <div class="grid-item" @click="goToFilteredProducts('Bull Pháp')">
          <img src="@/assets/Bull.jpg" alt="Bull Pháp" />
          <p>Bull Pháp</p>
        </div>
        <div class="grid-item" @click="goToFilteredProducts('Pug')">
          <img src="@/assets/Pug.jpg" alt="Pug" />
          <p>Pug</p>
        </div>
      </div>
    </section>
    <!-- Phần hiển thị Các giống mèo tại shop -->
    <section class="title-cat">
      <h2 class="cat-breeds-title">
        <span class="icon-paw">🐾</span>
        <span class="icon-paw">🐾</span>
        <span class="icon-paw">🐾</span>
        Các giống mèo tại shop
        <span class="icon-paw">🐾</span>
        <span class="icon-paw">🐾</span>
        <span class="icon-paw">🐾</span>
      </h2>
    </section>

    <!-- New Section with Banner and Images for Cats -->
    <section class="banner-and-images">
      <div class="banner-left">
        <img src="@/assets/banner-cat.jpg" alt="Cat Banner" />
      </div>
      <div class="grid-container">
        <div class="grid-item" @click="goToFilteredProducts('ALD')">
          <img src="/src/assets/ALD.jpg" alt="ALD" />
          <p>Anh Lông Dài</p>
        </div>
        <div class="grid-item" @click="goToFilteredProducts('ALN')">
          <img src="/src/assets/ALN.jpg" alt="ALN" />
          <p>Anh Lông Ngắn</p>
        </div>
        <div class="grid-item" @click="goToFilteredProducts('Ba Tư')">
          <img src="/src/assets/Ba Tư.jpg" alt="Ba Tư" />
          <p>Ba Tư</p>
        </div>
        <div class="grid-item" @click="goToFilteredProducts('Bengal')">
          <img src="/src/assets/Bengal.jpg" alt="Bengal" />
          <p>Bengal</p>
        </div>
        <div class="grid-item" @click="goToFilteredProducts('Munchkin')">
          <img src="/src/assets/Munchkin.jpg" alt="Munchkin" />
          <p>Munchkin</p>
        </div>
        <div class="grid-item" @click="goToFilteredProducts('Scottish')">
          <img src="/src/assets/Scottish.jpg" alt="Scottish" />
          <p>Scottish</p>
        </div>
        <div class="grid-item" @click="goToFilteredProducts('Xiêm')">
          <img src="/src/assets/Xiem.jpg" alt="Xiêm" />
          <p>Xiêm</p>
        </div>
        <div class="grid-item" @click="goToFilteredProducts('Sphynx')">
          <img src="/src/assets/Sphynx.jpg" alt="Sphynx" />
          <p>Sphynx</p>
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
      const formattedValue = parseFloat(price).toLocaleString("vi-VN");
      return `${formattedValue}`;
    },
    goToFilteredProducts(subType) {
      this.$router.push({
        path: "/user/product",
        query: { subType }, // Truyền subType vào query
      });
    },
    goToProductDetail(productId) {
      this.$router.push(`/user/products/${productId}`);
    },
  },
};
</script>
<style scoped src="./Home.scss"></style>
