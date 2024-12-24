<template>
<v-app-bar>
  <template v-slot:prepend>
    <!-- <v-app-bar-nav-icon ></v-app-bar-nav-icon> -->
  </template>

  <v-app-bar-title @click="this.$router.push('/')" style="cursor: pointer;"><h3>StepMarket</h3></v-app-bar-title>

    <div class="align-center  px-2" >
        <strong>Connected with us on networks!</strong>
  
        <v-spacer></v-spacer>
        <v-btn
          v-for="icon in icons"
          :key="icon"
          :icon="icon"
          class="mx-2"
          size="small"
          variant="plain"
        ></v-btn>
    </div>
    <!-- <v-btn icon="mdi-magnify" class="ma-6"></v-btn> -->
    <!-- <v-spacer></v-spacer> -->

    <!-- <v-btn icon="mdi-dots-vertical"></v-btn> -->
  <!-- </template> -->
</v-app-bar>
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