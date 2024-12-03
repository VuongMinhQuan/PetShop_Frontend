<template>
  <div class="app">
    <div class="d-block w-100">
      <Header />
      <router-view />
      <Footer />
      <button class="chat-floating-button" @click="toggleChat">
        <i class="fa fa-comment-dots"></i>
      </button>
      <div v-if="showChat" class="chat-modal-overlay" @click.self="toggleChat">
        <div class="chat-modal-content">
          <Chat />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Header from "../../components/HeaderUser/HeaderUser.vue";
import Footer from "../../components/FooterUser/FooterUser.vue"
import Chat from "../../components/Chat/Chat.vue"; // Import component chat
import { ref } from 'vue';
// Quản lý trạng thái hiển thị của chat modal
const showChat = ref(false);
const toggleChat = () => {
  showChat.value = !showChat.value;
};
</script>
<style scoped>
/* Layout User */
.app {
  position: relative;
  min-height: 100vh;
}
/* Nút chat tròn */
.chat-floating-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background-color: #0f8bd2;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}
.chat-floating-button:hover {
  background-color: #5a5fc4;
}
/* Modal chat */
.chat-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end; /* Đẩy nội dung sang bên phải */
  align-items: center; /* Căn chỉnh theo chiều dọc */
  z-index: 1001;
}

.chat-modal-content {
  width: 100%;
  max-width: 400px; /* Chiều rộng tối đa của modal */
  height: 100%; /* Đặt chiều cao modal chiếm toàn bộ màn hình */
  background-color: white;
  border-radius: 0; /* Bỏ bo góc */
  box-shadow: -4px 0px 12px rgba(0, 0, 0, 0.3); /* Bóng đổ sang trái */
  padding:  10px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

</style>
