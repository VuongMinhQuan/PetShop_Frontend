<template>
  <header>
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
                <a class="nav-link" href="">Giới thiệu</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/user/product">Sản phẩm</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="">Blog</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="">Liên hệ</a>
              </li>
            </ul>
            <div class="auth-links">
              <template v-if="isLoggedIn">
                <div class="user-info" @click="toggleUserMenu">
                  <div class="user-icon">
                    {{ userInfo?.FULLNAME.charAt(0) }}
                  </div>
                  <span class="user-name">{{
                    userInfo?.FULLNAME || "User"
                  }}</span>
                  <div v-if="isUserMenuOpen" class="user-menu">
                    <a class="user-menu-item" href="">
                      <i class="fas fa-cart-plus"></i> Giỏ hàng
                    </a>
                    <a class="user-menu-item" @click="logout">
                      <i class="fas fa-right-from-bracket"></i> Đăng xuất
                    </a>
                  </div>
                </div>
              </template>
              <template v-else>
                <a class="btn auth-btn login-btn" href="/user/login"
                  >Đăng nhập</a
                >
                <a class="btn auth-btn register-btn" href="/user/register"
                  >Đăng ký</a
                >
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
      isUserMenuOpen: false,
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
    toggleUserMenu() {
      this.isUserMenuOpen = !this.isUserMenuOpen;
    },
    async logout() {
      try {
        await this.$store.dispatch("logout"); // Xử lý đăng xuất trong Vuex
        this.$router.push("/user/login"); // Chuyển hướng đến trang đăng nhập
      } catch (error) {
        console.error("Logout error:", error);
      }
    },
  },
  mounted() {
    this.$store.dispatch("checkToken"); // Kiểm tra trạng thái đăng nhập khi component được mount
  },
};
</script>

<style lang="scss">
header {
  background: linear-gradient(to right, #a0c4ff, #3e8ccb);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: background 0.4s ease-in-out;
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 5rem;

  .separator {
    border-top: 1px solid #d9c7b8;
  }

  .main-menu {
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

          .register-btn:hover,
          .login-btn:hover {
            background-color: #0b1419;
            border-color: #d0deed;
          }
        }
      }
    }
  }

  .user-info {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;

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
      color: #ffffff;
      font-size: 14px;
    }

    .user-menu {
      position: absolute;
      top: 50px;
      right: 0;
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      transition: opacity 0.3s ease;
      z-index: 2000; /* Đảm bảo menu xuất hiện trên các phần tử khác */

      .user-menu-item {
        padding: 10px 20px;
        color: #333;
        text-decoration: none;
        font-size: 14px;
        transition: background-color 0.3s;

        &:hover {
          background-color: #0f538a; /* Màu xanh biển khi hover */
          color: #ffffff;
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
