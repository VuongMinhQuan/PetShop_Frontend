<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <img :src="banners[currentIndex].src" :alt="banners[currentIndex].alt" class="hero-image"/>
      </div>
    </section>

    <section id="features" class="features">
      <h2>Features</h2>
      <div class="feature-list">
        <div class="feature">
          <img src="@/assets/feature1.jpg" alt="Feature 1" />
          <h3>Feature 1</h3>
          <p>Description of feature 1.</p>
        </div>
        <div class="feature">
          <img src="@/assets/feature2.jpg" alt="Feature 2" />
          <h3>Feature 2</h3>
          <p>Description of feature 2.</p>
        </div>
        <div class="feature">
          <img src="@/assets/feature3.jpg" alt="Feature 3" />
          <h3>Feature 3</h3>
          <p>Description of feature 3.</p>
        </div>
      </div>
    </section>

    <section class="cta">
      <h2>Ready to Get Started?</h2>
      <a href="#contact" class="btn">Contact Us</a>
    </section>
  </div>
</template>

<script>
import banner1 from '@/assets/banner1.jpg';
import banner2 from '@/assets/banner.jpg';

export default {
  name: 'Home',
  data() {
    return {
      currentIndex: 0,
      banners: [
        { src: banner1, alt: 'Banner 1' },
        { src: banner2, alt: 'Banner 2' }
      ]
    };
  },
  created() {
    this.startSlideshow();
  },
  methods: {
    startSlideshow() {
      setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.banners.length;
      }, 5000);
    }
  }
};
</script>

<style scoped>
.home {
  font-family: Arial, sans-serif;
  color: #333;
  margin: 0;
  padding: 0;
}

.hero {
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  text-align: center;
  padding: 0 20px;
}

.hero-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.features {
  padding: 50px 20px;
  text-align: center;
}

.feature-list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.feature {
  width: 30%;
  margin: 20px 0;
}

.feature img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}

.feature h3 {
  margin: 10px 0;
}

.cta {
  background-color: #f39c12;
  color: #fff;
  padding: 50px 20px;
  text-align: center;
}

.cta h2 {
  margin: 0 0 20px 0;
}

.cta .btn {
  background-color: #fff;
  color: #333;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1.2rem;
}
</style>
