<template>
  <header>
    <!-- <div class="top-header">
      <div class="container">
        <!-- <div class="float-left">
          <ul class="header-social">
            <li><a href="#">Contact Us +44 (012) 5689 3264</a></li>
          </ul>
        </div> -->
        <!-- <div class="float-right">
          <div class="nice-select-wrapper">
            <select class="currency-selector" style="display: none;">
              <option value="1">USD</option>
            </select>
            <div class="nice-select currency-select" tabindex="0">
              <span class="current">USD</span>
            </div>
          </div>
          <div class="nice-select-wrapper">
            <select class="language-selector" style="display: none;">
              <option value="1">ENG</option>
              <option value="1">FRA</option>
              <option value="1">BAN</option>
            </select>
            <div class="nice-select language-select" tabindex="0">
              <span class="current">ENG</span>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="separator"></div>
    <div class="main-menu">
      <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container">
          <a class="navbar-brand logo" href="/trangchu">
            <img src="../../assets/logo.png" />
          </a>
          <button class="navbar-toggler" type="button" aria-controls="navbarSupportedContent" aria-expanded="false"
          aria-label="Toggle navigation" @click="toggleNavbar">
          <span class="navbar-toggler-icon"></span>
          </button>
          <div :class="['collapse', 'navbar-collapse', { show: isNavbarOpen }]" id="navbarSupportedContent">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item active"><a class="nav-link" href="/user/home">Trang chủ</a></li>
              <li class="nav-item"><a class="nav-link" href="about-us.html">Giới thiệu</a></li>
              <!-- <li class="nav-item"><a class="nav-link" href="gallery.html">Sản phẩm</a></li> -->
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Sản phẩm</a>
                <div class="dropdown-menu">
                  <a class="dropdown-item" href="elements.html">Elements</a>
                  <a class="dropdown-item" href="rooms.html">Rooms</a>
                </div>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Blog</a>
                <div class="dropdown-menu">
                  <a class="dropdown-item" href="blog.html">Blog</a>
                  <a class="dropdown-item" href="single-blog.html">Blog Details</a>
                </div>
              </li><li class="nav-item"><a class="nav-link" href="contact.html">Liên hệ</a></li>
            </ul>
            <div class="auth-links">
              <a class="btn auth-btn login-btn" href="/user/login">Đăng nhập</a>
              <a class="btn auth-btn register-btn" href="/user/register">Đăng ký</a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent',
  data() {
    return {
      isNavbarOpen: false
    };
  },
  methods: {
    toggleNavbar() {
      this.isNavbarOpen = !this.isNavbarOpen;
    },
    handleScroll() {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const header = this.$el.querySelector('.top-header');
      
      if (currentScrollTop > this.lastScrollTop) {
        // Scrolling down
        header.classList.add('hidden');
      } else {
        // Scrolling up
        header.classList.remove('hidden');
      }
      this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }
};
</script>

<style lang="scss">
header {
  background: linear-gradient(to right, #a0c4ff, #3e8ccb); /* Gradient xanh từ trái qua phải */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: background 0.4s ease-in-out;
  display: flex;
  flex-direction: column;
  
  .top-header.hidden {
    opacity: 0;
    transform: translateY(-100%);
  }

  .top-header {
    transition: opacity 0.3s ease, transform 0.3s ease;
    background-color: #d9c7b8; // Nâu trung bình cho phần top-header
    padding: 10px 20px;
    .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding-right: 15px;
      padding-left: 15px;
      margin-right: auto;
      margin-left: auto;
    }
    .float-left {
      .header-social {
        list-style: none;
        margin: 0;
        padding: 0;
        li {
          a {
            color: #03080b; // Màu nâu đậm hơn cho text
            text-decoration: none;
          }
        }
      }
    }

    .float-right {
      display: flex;
      .nice-select-wrapper {
        margin-left: 20px;
      }
    }
  }

  .separator {
    border-top: 1px solid #d9c7b8; // Nâu trung bình cho đường phân cách
  }

  .main-menu {
    background-color: transparent; // Nâu đậm cho nền navbar
    transition: margin-top 0.3s ease;
    .navbar {
      .container {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .logo img {
          height: 40px;
        }

        .navbar-toggler {
          border: none;
          background: transparent;
          .navbar-toggler-icon {
            display: block;
            width: 30px;
            height: 3px;
            background-color: #ffffff; 
            position: relative;
            &:before,
            &:after {
              content: '';
              display: block;
              width: 30px;
              height: 3px;
              background-color: #ffffff; 
              position: absolute;
              left: 0;
              transition: transform 0.3s ease;
            }
            &:before {
              top: -8px;
            }
            &:after {
              top: 8px;
            }
          }
        }

        .navbar-collapse {
          display: none; /* Ẩn menu mặc định */
          &.show {
            display: block; /* Hiển thị menu khi lớp 'show' được thêm */
          }

          .navbar-nav {
            display: flex;
            align-items: center;
            gap: 15px;

            .nav-link {
              color: #ffffff; // Màu trắng cho text link
              transition: color 0.3s;

              &:hover {
                color: #0f2cd6; // Màu xanh biển khi hover
              }
            }

            .dropdown-menu {
              background-color: #0bbec7; // Xanh biển cho nền dropdown
              border: 1px solid #4290e2; // Xanh biển cho viền dropdown
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              .dropdown-item {
                color: #ffffff; // Màu trắng cho text dropdown
                transition: background-color 0.3s;

                &:hover {
                  background-color: #1577cc; // Xanh biển khi hover
                }
              }
            }
          }
        }

        .auth-links {
          display: flex;
          align-items: center;
          gap: 10px; /* Khoảng cách giữa các nút */
          margin-left: auto; /* Đưa auth-links sang bên phải */

          .btn {
            display: inline-block;
            padding: 10px 20px;
            font-size: 14px;
            font-weight: bold;
            border-radius: 4px;
            text-align: center;
            transition: background-color 0.3s, border-color 0.3s, color 0.3s;
            border: 2px solid #eef1f4; // Xanh biển cho viền nút
            color: #eff3f6; // Xanh biển cho text nút
            
            &:hover {
              background-color: #007bff; // Xanh biển khi hover
              color: #ffffff; // Màu trắng cho text khi hover
              border-color: #007bff; // Xanh biển cho viền khi hover
            }
          }

          .login-btn {
            border-color: #ebeef1; // Xanh biển cho viền nút đăng nhập
            color: #dde1e6; // Xanh biển cho text nút đăng nhập
          }

          .register-btn {
            border-color: #eaeef1; // Xanh biển cho viền nút đăng ký
            color: #dfe3e8; // Xanh biển cho text nút đăng ký
          }

          .register-btn:hover {
            background-color: #043368; // Xanh biển cho nền nút đăng ký khi hover
            border-color: #d0deed; // Xanh biển cho viền nút đăng ký khi hover
          }
          .login-btn:hover{
             background-color: #043368; //Đăng nhập
            border-color: #d0deed; 
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    .main-menu {
      .navbar-collapse {
        .navbar-nav {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    }
  }
}
</style>