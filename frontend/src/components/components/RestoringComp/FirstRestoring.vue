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
                          @click="goToLogin"
                      ></v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                          class="mx-4 pa-2"
                          append-icon="mdi-chevron-right"
                          color="orange-lighten-2"
                          text="Next"
                          variant="outlined"
                          @click="CheckEmail"
                      >
                      </v-btn>
                  </v-row>
                </v-col>
                <v-row>
                  <v-col class="text-center ma-4">
                    <p class="text-h4" style="font-weight: 100;">Account Restoring</p>
                    <ProgressBar :buffer="buffer" :progress="progress"/>
                  </v-col>
                </v-row>
              </v-row>
            </v-img>
            <v-form>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <p class="main">Enter you email</p>
                    <v-text-field
                      v-model="email"
                      :disabled="isUpdating"
                      color="grey-lighten-2"
                      label="Email"
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
          buffer: 1,
          progress : 0
          
        }
      },
      components : {
        ProgressBar
      },
      watch: {
        isUpdating (val) {
          clearTimeout(this.timeout)
          if (val) {
            this.timeout = setTimeout(() => (this.isUpdating = false), 3000)
          }
        },
      },
  
      methods: {
        async CheckEmail(){
          this.isUpdating = true
          try {               
            const response = await axios.post('/api/auth/restoring',{
              email : this.email
            })
            console.log(response);
            if (response.data) {
              eventBus.emit('show-modal', 'Check you email'); 
              this.isUpdating = false
              this.$emit('goToSecond', this.email)
            }
          } catch (error) {
            console.log(error.response.data);
            
              setTimeout(()=>{
                if (error.response.data.statusCode) {
                  eventBus.emit('show-modal', error.response.data.message); 
                  this.isUpdating = false
                  return
                }
                eventBus.emit('show-modal', 'Error, try later');
                this.isUpdating = false 
              },1000 )
          }
        },
        goToLogin(){
          this.$router.push('/login') 
          window.scrollTo({
            top: 0,
            behavior: 'smooth', // Добавляет анимацию при прокрутке
          });         
          eventBus.emit('show-modal', 'Process password restoring is aborted');
        }
      },
      props : {
        currentEmail : {
          type : String
        }
      },

      async created(){
        console.log(this.currentEmail);
        
        if (this.currentEmail) {
          this.email = this.currentEmail
        }
      }
  }
</script>

<style scoped>
.main{
  font-family: 'Roboto', sans-serif; 
  font-weight: 300;
}
</style>