<template>
    <div>
      <h1>Organization List</h1>
      <OrganizationsList></OrganizationsList>
    </div>
  </template>
  
  <script>
  import OrganizationsList from '../../../components/Organization/OrganizationsList.vue';
  
  export default {
    name: 'Organization List',
    components: {
      OrganizationsList
    }
  };
  </script>
  
  <style scoped>
  /* Add some styling if needed */
  </style>
  