<template>
	<div class="pa-4 text-center">
	  <v-dialog v-model="dialog" max-width="600">
		<template v-slot:default>
		  <v-card>
			<v-card-title class="text-h6 font-weight-bold text-center">
			  Telegram Notification
			</v-card-title>

			<v-divider></v-divider>

			<v-card-text class="mt-4 mb-1">
			  <div class="text-subtitle-1 font-weight-medium mb-1">
				Enable notifications to stay updated with the latest information directly in your Telegram.
			  </div>
			  <v-chip color="blue lighten-4" outlined>
				<v-icon left color="blue darken-2">mdi-information-outline</v-icon>
				Follow the instructions to connect:
			  </v-chip>
			</v-card-text>
			<div class="w-100 d-flex justify-center">
				<img src="https://storage.yandexcloud.net/step2002sharp/tg_qr.png" class="justify-self-center" height="400" width="400">
			</div>
			<v-card-text class="pa-4">
			  <ol class="text-body-1 pl-4">
				<li>Open Telegram and search with QR-code.</li>
				<li>Open link <a href="https://t.me/market_notify_step_bot" target="_blank">https://t.me/market_notify_step_bot</a></li>
				<li>Click "Start" to activate notifications.</li>
			  </ol>
			</v-card-text>

			<v-card-actions>
			  <v-spacer></v-spacer>

			  <v-btn
				text="Cancel"
				variant="outlined"
				color="blue"
				class="font-weight-medium"
				@click="dialog = false"
			  >
				<v-icon left>mdi-close-circle</v-icon> Cancel
			  </v-btn>

			  <v-btn
				color="blue"
				text="Connect"
				variant="contained"
				class="font-weight-medium"
				@click="Connect"
			  >
				<v-icon left>mdi-telegram</v-icon> Connect
			  </v-btn>
			</v-card-actions>
		  </v-card>
		</template>
	  </v-dialog>

	  <!-- Trigger Button -->
	  <!-- <v-btn color="blue darken-2" dark @click="dialog = true">
		Open Dialog
	  </v-btn> -->
	</div>
</template>

<script>
export default {
  data() {
    return {
      dialog: false, // Управление состоянием диалога
    };
  },
  methods: {
    openDialog() {
      this.dialog = true; // Активируем диалог
    },
	Connect(){
		const telegramLink = "https://t.me/market_notify_step_bot";
		window.open(telegramLink, "_blank");
		this.dialog = false
	}
  },
};
</script>
