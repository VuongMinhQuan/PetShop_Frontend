<template>
  <div class="dashboard-container">
    <div class="card card-red">
      <div class="card-icon bordered-icon">
        <i class="fa-solid fa-user"></i>
      </div>
      <div class="card-content">
        <h1>{{ totalUser }}</h1>
        <p>Tổng số user đăng ký</p>
        <small>Other hand, we denounce</small>
      </div>
    </div>

    <div class="card card-blue">
      <div class="card-icon bordered-icon">
        <i class="fa-solid fa-boxes-stacked"></i>
      </div>
      <div class="card-content">
        <h1>{{ totalProduct }}</h1>
        <p>Tổng số sản phẩm</p>
        <small>Other hand, we denounce</small>
      </div>
    </div>

    <div class="card card-green">
      <div class="card-icon bordered-icon">
        <i class="fa-solid fa-cart-flatbed"></i>
      </div>
      <div class="card-content">
        <h1>{{ totalOrder }}</h1>
        <p>Tổng đơn hàng đã đặt</p>
        <small>Other hand, we denounce</small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      totalUser: 10,
      totalProduct: 120,
      totalOrder: 50,
    };
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 0 40px;
}

.card {
  border: 2px solid #ccc;
  border-radius: 12px;
  width: 250px;
  padding: 30px;
  text-align: center;
  margin: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;
}

.card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
/* Màu nền cho từng card */
.card-red {
  background-color: #e57373; /* Màu đỏ nhạt */
}

.card-blue {
  background-color: #64b5f6; /* Màu xanh biển nhạt */
}

.card-green {
  background-color: #81c784; /* Màu xanh lá nhạt */
}
.card-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.bordered-icon {
  background-color: #ffff;
  border: 2px solid #ccc;
  border-radius: 50%;
  padding: 20px;
  margin-left: 50px;
  display: inline-block;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-content h1 {
  color: #ffff;
  margin: 0;
  font-size: 36px;
}

.card-content p {
  color: #ffff;
  margin: 10px 0 5px;
  font-size: 18px;
}

.card-content small {
  font-size: 12px;
  color: #777;
}

/* Responsive layout */
@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
    align-items: center;
  }
}
</style>
