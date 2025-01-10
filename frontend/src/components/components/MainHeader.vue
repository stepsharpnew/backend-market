<template>
<v-app-bar>
  <template v-slot:prepend>

  </template>

  <v-app-bar-title @click="this.$router.push('/')" style="cursor: pointer;"><h3>StepMarket</h3></v-app-bar-title>

    <div class="align-center  px-2" >
        <strong>Connected now!</strong> 
        <v-btn
          v-for="icon in icons"
          :key="icon"
          :icon="icon"
          class="mx-2"
          size="small"
          variant="plain"
        ></v-btn>
    </div>
</v-app-bar>
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