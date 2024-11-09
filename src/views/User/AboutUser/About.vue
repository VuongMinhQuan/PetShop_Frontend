<template>
  <div class="about-page">
    <div class="header">
      <div class="highlight-overlay">
        <h1>Chào mừng đến với Q-PetShop</h1>
        <p>Nơi thú cưng và phụ kiện chất lượng gặp nhau!</p>
      </div>
    </div>
    <section class="content">
      <h2>Giới thiệu về chúng tôi</h2>
      <p>
        Chào mừng bạn đến với Q-PetShop – nền tảng mua bán thú cưng và phụ kiện
        chất lượng, đáp ứng mọi nhu cầu chăm sóc thú cưng của bạn. Q-PetShop
        không chỉ là nơi giúp bạn tìm kiếm những người bạn nhỏ đáng yêu mà còn
        là nơi cung cấp các sản phẩm phụ kiện, thức ăn và dịch vụ hỗ trợ chăm
        sóc toàn diện, giúp bạn và thú cưng luôn gắn bó hạnh phúc.
      </p>

      <h2>Tại sao chọn Q-PetShop?</h2>
      <ul>
        <li>
          <span class="checkmark">✔</span> Đa dạng các loại thú cưng và sản phẩm
          phụ kiện chất lượng.
        </li>
        <li>
          <span class="checkmark">✔</span> Giao diện thân thiện, dễ sử dụng.
        </li>
        <li>
          <span class="checkmark">✔</span> Dịch vụ tư vấn, hỗ trợ tận tâm từ đội
          ngũ chuyên nghiệp.
        </li>
        <li><span class="checkmark">✔</span> Miễn phí vận chuyển toàn quốc</li>
      </ul>

      <h2>Tầm nhìn và sứ mệnh</h2>
      <p>
        Sứ mệnh của chúng tôi là "Mang niềm vui đến cho thú cưng và gia đình
        bạn". Q-PetShop cam kết trở thành người bạn đồng hành đáng tin cậy, mang
        lại trải nghiệm mua sắm tốt nhất cho bạn và thú cưng.
      </p>
    </section>
    <h2>Liên hệ với chúng tôi</h2>
  <div class="contact-cards">
    <div class="card">
      <div class="icon">📧</div>
      <h3>Liên hệ để đặt hàng</h3>
      <p>Nói chuyện với đội ngũ thân thiện của chúng tôi.</p>
      <a href="mailto:fcthevan123@gmail.com">quanpetshop@gmail.com</a>
    </div>
    <div class="card">
      <div class="icon">🛒</div>
      <h3>Mua hàng trực tuyến</h3>
      <p>Chúng tôi luôn sẵn sàng để phục vụ bạn.</p>
      <a href="/user/product">Bắt đầu ngay</a>
    </div>
    <div class="card">
      <div class="icon">📍</div>
      <h3>Tới với chúng tôi</h3>
      <p>Hãy đến thăm trụ sở văn phòng của chúng tôi.</p>
      <address>123 đường ABC, Quận Ninh Kiều, Thành phố Cần Thơ</address>
    </div>
    <div class="card">
      <div class="icon">📞</div>
      <h3>Gọi cho chúng tôi</h3>
      <p>Thứ Hai - Thứ Sáu từ 8 đến 21 giờ.</p>
      <a href="tel:0899302777">0899302777</a>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: "About",
};
</script>

<style scoped>
.about-page {
  padding: 20px;
  color: #333;
  background-color: #f9f9f9;
}

.header {
  position: relative;
  background-image: url("@/assets/banner3.png"); /* Đường dẫn tới hình ảnh */
  background-size: cover;
  background-position: center;
  padding: 40px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #ffffff;
  filter: brightness(0.7); /* Làm mờ hình nền */
}

.highlight-overlay {
  background-color: rgba(0, 0, 0, 0.6); /* Màu overlay mờ */
  padding: 20px;
  border-radius: 10px;
  display: inline-block;
  text-align: center;
}

.header h1 {
  font-size: 3rem;
  margin: 0;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 1); /* Đổ bóng nhẹ */
}

.header p {
  font-size: 1.5rem;
  margin-top: 10px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 1); /* Đổ bóng nhẹ */
}

.content {
  margin-top: 30px;
  color: #333;
}

.content h2 {
  color: #0077b6;
}

h2 {
  justify-content: center;
  align-items: center;
  color: #0077b6;
}

ul {
  list-style-type: none;
  margin-left: 20px;
}

li {
  display: flex;
  align-items: center;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 10px;
}

.checkmark {
  color: #ffffff;
  background-color: #0077b6; /* Nền màu xanh biển */
  padding: 5px;
  border-radius: 100%;
  margin-right: 10px;
  font-size: 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.contact-cards {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  gap: 10px;
}

.card {
  background-color: #f0f8ff; /* Màu xanh nhạt */
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 20px;
  text-align: center;
  width: 200px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.icon {
  font-size: 2rem;
  color: #0077b6; /* Màu xanh biển */
  margin-bottom: 10px;
}

.card h3 {
  font-size: 1.2rem;
  color: #333;
  margin: 10px 0 5px;
}

.card p {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
}

.card a {
  color: #0077b6;
  text-decoration: none;
  font-weight: bold;
}

.card address {
  color: #0077b6;
  font-style: normal;
  font-weight: bold;
}
</style>
