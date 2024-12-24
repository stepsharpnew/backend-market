<script setup>

import GlobalModal from './components/components/GlobalModal.vue';
import MainFooter from './components/components/MainFooter.vue';
import MainHeader from './components/components/MainHeader.vue';
</script>

<template>
  <v-app>
    <MainHeader></MainHeader>
    <v-main>
      <router-view></router-view>
      <GlobalModal/>
      <MainFooter></MainFooter>
      
    </v-main>
  </v-app>

</template>

<style scoped>
  
</style>