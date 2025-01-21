<template>
    <v-footer class="d-flex flex-column w-100 pa-0" 
    image="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
    order="1"
    >
      <div class="px-4 py-2 d-flex w-100 align-center px-4 position-absolute justify-start"
      >
        <!-- <strong class="text-white">Connected on networks!</strong> -->
  
        <!-- <v-btn
          
          v-for="icon in icons"
          :key="icon"
          :icon="icon"
          class="mx-4 text-white"
          size="small"
          variant="plain"
        ></v-btn> -->
      </div>
  
      <div class="px-4 py-2 bg-black text-end w-100 text-white">
        {{ new Date().getFullYear() }} — <strong>StepMarket</strong>
      </div>
    </v-footer>
  </template>
  <script>
    export default {
      data: () => ({
        icons: [
          'mdi-send',
        ],
      }),
    }
  </script>

<style>
  /* @media (min-width : 630px) {
    .text-end{
      text-align: center;
    }
  } */
</style>