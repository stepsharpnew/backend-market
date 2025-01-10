<template>
  <v-overlay
    v-model="showModal"
    :opacity="0"
  >
      <v-sheet
      class="pa-6 text-black position-absolute mx-auto"
      color="#FFFFFF"
      max-width="400"
      elevation="10"
      style="top: 20px; left: 50%; transform: translateX(-50%);"
    >
      <v-slide-y-transition>
        <div>
          <h4 class="text-h5 font-weight-bold mb-4">Your Privacy</h4>
          <p class="mb-4">
            This business determines the use of personal data collected on our media properties and across the internet. We may collect data that you submit to us directly or data that we collect automatically including from cookies.
          </p>

          <v-btn
            class="text-none text-black mb-4"
            color="red-accent-2"
            size="large"
            variant="flat"
            block
            @click="acceptPolicy"
          >
            Accept
          </v-btn>

          <v-btn
            class="text-none text-black"
            color="red-accent-2"
            size="large"
            variant="outlined"
            block
            @click="acceptPolicy"
          >
            Later
          </v-btn>
        </div>
      </v-slide-y-transition>
    </v-sheet>
  </v-overlay>
</template>


<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    showModal: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  methods: {
    acceptPolicy() {
      localStorage.setItem("privacy", true);
      this.showModal = false; // Закрыть окно
    },
  },
};
</script>

<style scoped>
.v-sheet {
  border-radius: 12px;
  position: absolute;
  top: 10%; /* Расстояние от верхней части экрана */
  left: 50%; /* Центровка по горизонтали */
  transform: translateX(-50%); /* Центровка по горизонтали */
}
</style>

