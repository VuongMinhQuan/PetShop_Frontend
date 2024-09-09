<template>
  <header>
    <div class="separator"></div>
    <div class="main-menu">
      <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container">
          <a class="navbar-brand logo" href="/user/home">
            <img src="../../assets/logo.png" />
          </a>
          <button
            class="navbar-toggler"
            type="button"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            @click="toggleNavbar"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div
            :class="['collapse', 'navbar-collapse', { show: isNavbarOpen }]"
            id="navbarSupportedContent"
          >
            <ul class="navbar-nav ml-auto">
              <li class="nav-item active">
                <a class="nav-link" href="/user/home">Trang chủ</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="about-us.html">Giới thiệu</a>
              </li>
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  >Sản phẩm</a
                >
                <div class="dropdown-menu">
                  <a class="dropdown-item" href="#">Thức ăn cho chó</a>
                  <a class="dropdown-item" href="#">Thức ăn cho mèo</a>
                  <a class="dropdown-item" href="#">Sữa tắm</a>
                  <a class="dropdown-item" href="#">Balo cho chó, mèo</a>
                  <a class="dropdown-item" href="#">Chuồng</a>
                  <a class="dropdown-item" href="#">Đồ chơi</a>
                </div>
              </li>
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  >Blog</a
                >
                <div class="dropdown-menu">
                  <a class="dropdown-item" href="blog.html">Blog</a>
                  <a class="dropdown-item" href="single-blog.html"
                    >Blog Details</a
                  >
                </div>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="contact.html">Liên hệ</a>
              </li>
            </ul>
            <div class="auth-links">
              <template v-if="isLoggedIn">
                <div class="user-info">
                  <div class="user-icon">{{ userInfo?.FULLNAME.charAt(0) }}</div>
                  <span class="user-name">{{ userInfo?.FULLNAME || 'User' }}</span>
                  <a class="btn auth-btn logout-btn" @click="logout">Đăng xuất</a>
                </div>
              </template>
              <template v-else>
                <a class="btn auth-btn login-btn" href="/user/login">Đăng nhập</a>
                <a class="btn auth-btn register-btn" href="/user/register">Đăng ký</a>
              </template>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>


<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "HeaderComponent",
  data() {
    return {
      isNavbarOpen: false,
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn", "userInfo"]),
  },
  methods: {
    ...mapActions(["logout"]),
    toggleNavbar() {
      this.isNavbarOpen = !this.isNavbarOpen;
    },
  },
  mounted() {
    this.$store.dispatch("checkToken"); // Kiểm tra trạng thái đăng nhập khi component được mount
  },
};
</script>

<style lang="scss">
header {
  background: linear-gradient(
    to right,
    #a0c4ff,
    #3e8ccb
  );
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: background 0.4s ease-in-out;
  display: flex;
  flex-direction: column;

  .separator {
    border-top: 1px solid #d9c7b8;
  }

  .main-menu {
    background-color: transparent;
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
              content: "";
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
          display: none;
          &.show {
            display: block;
          }

          .navbar-nav {
            display: flex;
            align-items: center;
            gap: 15px;

            .nav-link {
              color: #ffffff;
              transition: color 0.3s;

              &:hover {
                color: #0f2cd6;
              }
            }

            .dropdown-menu {
              background-color: #0bbec7;
              border: 1px solid #4290e2;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              .dropdown-item {
                color: #ffffff;
                transition: background-color 0.3s;

                &:hover {
                  background-color: #1577cc;
                }
              }
            }
          }
        }

        .auth-links {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-left: auto;

          .btn {
            display: inline-block;
            padding: 10px 20px;
            font-size: 14px;
            font-weight: bold;
            border-radius: 4px;
            text-align: center;
            transition: background-color 0.3s, border-color 0.3s, color 0.3s;
            border: 2px solid #eef1f4;
            color: #eff3f6;

            &:hover {
              background-color: #007bff;
              color: #ffffff;
              border-color: #007bff;
            }
          }

          .login-btn {
            border-color: #ebeef1;
            color: #dde1e6;
          }

          .register-btn {
            border-color: #eaeef1;
            color: #dfe3e8;
          }

          .register-btn:hover {
            background-color: #043368;
            border-color: #d0deed;
          }
          .login-btn:hover {
            background-color: #043368;
            border-color: #d0deed;
          }
        }
      }
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 10px;

    .user-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3e8ccb;
      font-size: 20px;
      font-weight: bold;
      text-transform: uppercase;
    }

    .user-name {
      margin-right: 10px;
      color: #ffffff;
      font-size: 14px;
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

