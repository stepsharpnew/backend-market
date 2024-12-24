<template>
    <v-container>
      <v-snackbar
        v-model="isVisible"
        location="bottom right"
        color="black"
        dark
        :timeout="3000"
        elevation="24"
        class="mb-12"
      >
        <v-icon start color="yellow">mdi-alert-circle</v-icon>
        {{ message }}
      </v-snackbar>
    </v-container>
  </template>
  
  <script>
  import eventBus from "../../eventBus";
  
  export default {
    data() {
      return {
        isVisible: false,
        message: "",
      };
    },
    created() {
      eventBus.on("show-modal", this.showModal);
    },
    methods: {
      showModal(message) {
        this.message = message;
        this.isVisible = true;
      },
    },
    beforeUnmount() {
      eventBus.off("show-modal", this.showModal);
    },
  };
  </script>
  
  <style scoped>
  /* Дополнительные стили можно добавить при необходимости */
  </style>