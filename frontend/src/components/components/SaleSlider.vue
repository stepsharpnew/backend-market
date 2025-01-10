<template>
    <v-carousel
      height="400"
      hide-delimiters
      color="red"
    >
      <v-carousel-item
        v-for="(slide, i) in saleProducts"
        :key="i"
        :src="slide.category.image_url"
        contain
      >
      <div
        class="position-absolute left-0 bottom-0 right-0 text-center pa-4"
        style="background: rgba(0, 0, 0, 0.2  ); color: white;"
      >
        <div style="font-size: 1rem;">{{ slide.name }}</div>
      </div>
    </v-carousel-item>
    </v-carousel>
  </template>
  <script>
    export default {
      // data () {
      //   return {
      //   }
      // },
      props : {
        saleProducts : {
            type : Array
        }
      },
      name : 'SaleSlider',
      methods : {

      },
    }
  </script>