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

<style>
.text-h3{
  font-family: 'Sarpanch', sans-serif;
}
  
.text-h4{
  font-family: 'Sarpanch', sans-serif;
}  

.text-h6{
  font-family: 'Sarpanch', sans-serif;
}  


</style>