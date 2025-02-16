<template>
<v-app-bar>
  <template v-slot:prepend>

  </template>

  <v-app-bar-title @click="goToMain" style="cursor: pointer;"><h3>StepMarket</h3></v-app-bar-title>

    <div class="align-center  px-2" >
        <strong>Connected now!</strong> 
        <v-btn
          v-for="icon in icons"
          :key="icon"
          :icon="icon"
          class="mx-2"
          size="small"
          variant="plain"
          @click="openTelegramBot"
        ></v-btn>
    </div>
</v-app-bar>
</template>

<script>
export default {
  data: () => ({
    icons: [
      'mdi-bell-ring',
    ],
    telegramBotUrl: 'https://t.me/market_notify_step_bot'
  }),
  methods : {
    goToMain(){
      this.$router.push('/')
      window.scrollTo({
				top: 0,
				behavior: 'smooth', // Добавляет анимацию при прокрутке
			});
    },
    openTelegramBot() {
      window.open(this.telegramBotUrl, '_blank');
    }
  }
}
</script>