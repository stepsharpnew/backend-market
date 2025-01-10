<template>
  <v-container class="d-flex flex-column pa-0 w-100 h-screen">
  <v-row class="align-center justify-center">
    <v-col 
      cols="12"
      sm="10"
      md="8"
      lg="6"
      xl="4"
      class="pa-4"
    >
      <v-card
        :loading="isUpdating"
        class="mx-auto rounded-xl"
        color="grey-darken-2"
      >
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
            :active="isActive"
            color="black-lighten-3"
            height="4"
            indeterminate
          ></v-progress-linear>
        </template>

        <v-img
          height="200"
          src="https://cdn.vuetifyjs.com/images/cards/dark-beach.jpg"
          cover
        >
          <v-row class="pa-3">
            <v-col cols="12">
              <v-row class="pa-1 ma-1" >
                  <v-btn
                      density="comfortable"
                      icon="mdi-chevron-left"
                      variant="tonal"
                      @click="goToSecond"
                  ></v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                      class="mx-4 pa-2"
                      append-icon="mdi-chevron-right"
                      color="orange-lighten-2"
                      text="Restore"
                      variant="outlined"
                      @click="Restore"
                  >
                  </v-btn>
              </v-row>
            </v-col>
                
            <v-row>
              <v-col class="text-center ma-4">
                <p class="text-h4" style="font-weight: 200;">Account Restoring</p>
                <ProgressBar :buffer="buffer" :progress="progress"/>
              </v-col>
            </v-row>
          </v-row>
        </v-img>
        <v-form>
          <v-container>
            <v-row>
              <v-col cols="12">
                <!-- <p style="font-family: 'Roboto', sans-serif; font-weight: 200;">Enter you email</p> -->
                <v-text-field
                  v-model="password"
                  :disabled="isUpdating"
                  type="password"
                  color="grey-lighten-2"
                  label="New password"
                ></v-text-field>
                <v-text-field
                  v-model="confirm_password"
                  :disabled="isUpdating"
                  type="password"
                  color="grey-lighten-2"
                  label="Verify new password"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <v-divider></v-divider>
      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>

<script>

import axios from 'axios';
import eventBus from '../../../eventBus';
import ProgressBar from '../../UIUX/ProgressBar.vue';
export default {
  data () {
    return {
      autoUpdate: true,
      isUpdating: false,
      email: '',
      timeout: null,
      confirm_password : '',
      password : '',
      buffer : 3,
      progress : 2
    }
  },

  watch: {
    isUpdating (val) {
      clearTimeout(this.timeout)
      if (val) {
        this.timeout = setTimeout(() => (this.isUpdating = false), 3000)
      }
    },
  },
  props : {
    currentCode : {
      type : String
    },
    currentEmail : {
      type : String
    }
  },
  components : {
    ProgressBar
  },

  methods: {
    async Restore(){
      this.isUpdating = true
      if (this.password !== this.confirm_password) {
        eventBus.emit('show-modal', 'Passwords not equal');
        this.isUpdating = false
        return
      }
      try {         
        const response = await axios.post('/api/auth/restore_new_password',{
          old_password : '1',
          new_password : this.password,
          confirm_password : this.confirm_password,
          email : this.currentEmail,
          code : this.currentCode
        })     
        setTimeout(()=>{
          if (response.data) {
            eventBus.emit('show-modal', 'Password restoring is successfull');
            this.isUpdating = false 
            this.$router.push('/login')
          }
        },1000)
      } catch (error) {        
          setTimeout(()=>{
            if (Array.isArray(error.response.data.message)) {
              eventBus.emit('show-modal', error.response.data.message[0]); 
              return
            }
            if (error.response.data.message) {
              eventBus.emit('show-modal', error.response.data.message);
              this.isUpdating = false 
              return
            }
            eventBus.emit('show-modal', 'Error, try later');
            this.isUpdating = false 
          },1000 )
      }
    },
    goToSecond(){
        this.$emit('goToSecond', true)
    }
  },

async mounted(){

  }
}
</script>