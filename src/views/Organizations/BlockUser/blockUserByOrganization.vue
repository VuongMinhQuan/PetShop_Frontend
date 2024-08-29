<template>
  <div id="app">
    <h1>Chức năng Block/Unblock Người dùng</h1>
    <BlockUser></BlockUser>
  </div>
</template>

<script>
import BlockUser from '../../../components/Organization/BlockUser.vue';

export default {
  name: 'App',
  components: {
    BlockUser
  }
};
</script>
