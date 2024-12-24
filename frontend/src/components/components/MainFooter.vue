<template>
    <v-footer class="d-flex flex-column w-100 pa-0" 
    image="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
    order="1"
    >
      <div class="d-flex w-100 align-center px-4 position-absolute"
      >
        <strong class="text-white">Get connected with us on social networks!</strong>
  
        <v-spacer></v-spacer>
        <v-btn
          
          v-for="icon in icons"
          :key="icon"
          :icon="icon"
          
          class="mx-4 text-white"
          size="small"
          variant="plain"
        ></v-btn>
      </div>
  
      <div class="px-4 py-2 bg-black text-center w-100 text-white">
        {{ new Date().getFullYear() }} — <strong>StepMarket</strong>
      </div>
    </v-footer>
  </template>
  <script>
    export default {
      data: () => ({
        icons: [
          'mdi-facebook',
          'mdi-twitter',
          'mdi-linkedin',
          'mdi-instagram',
        ],
      }),
    }
  </script>

  <!-- <style>
footer{
  z-index: 1000;
}
</style> -->