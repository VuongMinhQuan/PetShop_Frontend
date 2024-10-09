<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-logo">
          <a href="/user/home">
            <img src="../../assets/petshop.jpg" alt="Logo" />
          </a>
        </div>
        <div class="footer-links">
          <ul>
            <li><a href="/user/home">Trang chủ</a></li>
            <li><a href="">Giới thiệu</a></li>
            <li><a href="">Sản phẩm</a></li>
            <li><a href="">Chính sách bảo hành</a></li>
            <li><a href="">Liên hệ</a></li>
          </ul>
        </div>
        <div class="footer-contact">
          <div class="contact-item">
            <h3>Liên hệ : </h3>
            <p class="contact-info">+84 899 302 777</p>
          </div>
          <div class="contact-item">
            <h3>Email :</h3>
            <p class="contact-info"> quanpetshop@gmail.com</p>
          </div>
          <div class="social-media">
            <h3>Kết nối với chúng tôi:</h3>
            <div class="social-icons">
              <a href="" target="_blank" class="social-icon">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="" target="_blank" class="social-icon">
                <i class="fab fa-instagram"></i>
              </a>
              <a href="" target="_blank" class="social-icon">
                <i class="fab fa-youtube"></i>
              </a>
              <a href="" target="_blank" class="social-icon">
                <i class="fab fa-telegram"></i> <!-- Zalo sử dụng biểu tượng WeChat -->
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; Thú cưng là những người bạn đồng hành tuyệt vời</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterComponent",
};
</script>

<style lang="scss">
.footer {
  background-color: #a0c4ff;
  color: #ffffff;
  padding: 20px 0;

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start; /* Căn các phần tử lên trên cùng */
      width: 80%;
      margin-bottom: 20px;

      .footer-logo {
        flex: 1; /* Chiếm không gian còn lại */
        display: flex;
        justify-content: flex-start; /* Căn logo sang bên trái */
        margin-top: 50px;
        margin-left: -50px;

        img {
          height: 100px;
        }
      }

      .footer-links {
        flex: 2; /* Chiếm không gian giữa */
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          margin-left: 90px; 
          display: flex;
          flex-direction: column; /* Hiển thị thẻ li theo chiều dọc */
          gap: 10px; /* Khoảng cách giữa các thẻ li */
          li {
            a {
              color: #ffffff;
              text-decoration: none;

              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
      }

      .footer-contact {
        flex: 1; /* Chiếm không gian còn lại */
        display: flex;
        flex-direction: column; /* Hiển thị các thông tin liên hệ theo chiều dọc */
        align-items: stretch; /* Căn chỉnh các phần tử để chiếm toàn bộ chiều rộng của container */
        gap: 10px; /* Khoảng cách giữa số điện thoại và email */

        .contact-item {
          flex: 1; /* Chiếm không gian bằng nhau */
          display: flex;
          justify-content: flex-start; /* Căn chỉnh nội dung sang bên trái */

          h3 {
            margin: 0;
            font-size: 1.2rem; /* Kích thước chữ lớn hơn */
            font-weight: bold; /* Làm chữ đậm */
          }

          .contact-info {
            font-size: 1rem; /* Kích thước chữ thông tin liên hệ */
            font-weight: normal; /* Chữ thông tin liên hệ không đậm */
            margin: 0;
          }
        }

        .social-media {
          margin-top: 15px; /* Khoảng cách giữa phần liên hệ và kết nối với chúng tôi */

          h3 {
            margin: 0;
            font-size: 1.2rem;
            font-weight: bold;
            color: #ffffff; /* Màu chữ trắng cho tiêu đề */
          }

          .social-icons {
            display: flex;
            gap: 15px; /* Khoảng cách giữa các biểu tượng */
            margin-top: 10px;

            .social-icon {
              color: #ffffff; /* Màu trắng cho biểu tượng */
              font-size: 24px; /* Kích thước biểu tượng */
              transition: color 0.3s; /* Hiệu ứng chuyển màu khi hover */
              
              &:hover {
                color: #0f538a; /* Màu khi hover vào biểu tượng */
              }
            }
          }
        }
      }
    }

    .footer-bottom {
      text-align: center;

      p {
        margin: 0;
      }
    }
  }
}
</style>
