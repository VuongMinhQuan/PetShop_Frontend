<template>
    <div class="app">
      <div class="d-block w-100">
        <Header />
        <router-view />
        <Footer/>
      </div>
    </div>
  </template>
  
  <script setup>
    import Header from '../../components/HeaderUser/HeaderUser.vue'
    import Footer from '../../components/FooterUser/FooterUser.vue'
  </script>
  