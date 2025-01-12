<template>
  <div class="text-center pa-4">
    <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card
        text="Are you sure you want to log out of your account?"
        title="Logout?"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn @click="closeDialog"
            class="mx-4 my-2 pa-2"
            color="grey"
            text="Cancel"
            variant="outlined"
          >
          </v-btn>

          <v-btn
            class="mx-4 my-2 pa-2"
            color="red-lighten-2"
            text="Logout"
            @click="logoutAndClose"
            variant="outlined"
          >
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    openLogoutModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: this.openLogoutModal
    };
  },
  watch: {
    openLogoutModal(newValue) {
      this.dialog = newValue;
    },
    dialog(newValue) {
      this.$emit('update:openLogoutModal', newValue);
    }
  },
  methods: {
    logoutAndClose() {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('user');
      this.$emit('closeLeftPanel');
      this.dialog = false;
      this.$emit('update:openLogoutModal', false);
    },
    closeDialog() {
      this.dialog = false;
      this.$emit('update:openLogoutModal', false);
    }
  }
};
</script>
