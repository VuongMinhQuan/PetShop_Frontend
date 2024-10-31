<template>
  <div class="dashboard-container">
    <!-- Dashboard Cards -->
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
      totalUser: 0,
      totalProduct: 0,
      totalOrder: 0,
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
}

.card-red {
  background-color: #e57373;
}

.card-blue {
  background-color: #64b5f6;
}

.card-green {
  background-color: #81c784;
}

.bordered-icon {
  background-color: #ffff;
  border: 2px solid #ccc;
  border-radius: 50%;
  margin-left: 55px;
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
