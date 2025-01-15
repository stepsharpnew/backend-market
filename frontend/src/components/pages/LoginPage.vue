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
                          @click="this.$router.push('/')"
                      ></v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                          class="mx-4 pa-2"
                          append-icon="mdi-chevron-right"
                          color="orange-lighten-2"
                          text="Sign In"
                          variant="outlined"
                          @click="Login"
                      >
                      </v-btn>
                  </v-row>
                </v-col>
                    
                <v-row>
                  <v-col class="text-center ma-4">
                    <p class="text-h4" style="font-weight: 200;">Account Login</p>
                    <span class="text-grey-lighten-1 cursor-pointer" @click="this.$router.push('/reg')">You didn't have account?</span><br>
                    <div style="width: 100%; height: 10px;"></div>
                    <span class="text-grey-lighten-1 cursor-pointer" @click="this.$router.push('/restore')">You forgot password?</span>
                  </v-col>
                </v-row>
              </v-row>
            </v-img>
  
            <v-form>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="email"
                      :disabled="isUpdating"
                      color="grey-lighten-2"
                      label="Email"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      type="password"
                      v-model="password"
                      :disabled="isUpdating"
                      color="grey-lighten-2"
                      label="Password"
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
import eventBus from '../../eventBus';
    export default {
      data () {
        return {
          autoUpdate: true,
          isUpdating: false,
          name: 'Account Login',
          email: '',
          password : '',
          timeout: null,
        }
      },
  
      watch: {
        isUpdating (val) {
          clearTimeout(this.timeout)
          if (val) {
            this.timeout = setTimeout(() => (this.isUpdating = false), 1500)
          }
        },
      },
  
      methods: {
        remove (item) {
          const index = this.friends.indexOf(item.name)
          if (index >= 0) this.friends.splice(index, 1)
        },

        async Login(){
          this.isUpdating = true
          console.log('asdasd');
          
          try {      
            console.log('asd');
            const token = await axios.post('/api/auth/signin',{
              email : this.email, 
              password : this.password
            })
            console.log(token.data);
            console.log('asdasdasdasdasdada');          
              eventBus.emit('show-modal', 'Login is success'); 
              localStorage.setItem('access', token.data.accessToken)
              localStorage.setItem('refresh', token.data.refreshToken)
              this.$router.push('/')
              this.isUpdating = false


          } catch (error) {
            console.log(error);
            setTimeout(()=>{
                this.isUpdating = false
                console.log(error.response.data.message);
                if (Array.isArray(error.response.data.message)) {
                  eventBus.emit('show-modal', error.response.data.message[0]); 
                  return
                }
                if (error.response.data.message) {
                  eventBus.emit('show-modal', error.response.data.message);
                  return
                }else{
                  eventBus.emit('show-modal', 'Error in Sign in');
                  return
                }
                
            },1000 )
          }
        }
      },

    async mounted(){

      }
    }
  </script>
<style scoped>

</style>