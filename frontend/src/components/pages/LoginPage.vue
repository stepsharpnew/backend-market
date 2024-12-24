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
            color="blue-grey-darken-1"
          >
            <template v-slot:loader="{ isActive }">
              <v-progress-linear
                :active="isActive"
                color="green-lighten-3"
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
                    <h3 class="text-h4">{{ name }}</h3>
                    <span class="text-grey-lighten-1 cursor-pointer" @click="this.$router.push('/reg')">{{ title }}</span><br>
                    <span class="text-grey-lighten-1 cursor-pointer">{{ title2 }}</span>
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
                      color="blue-grey-lighten-2"
                      label="Email"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      type="password"
                      v-model="password"
                      :disabled="isUpdating"
                      color="blue-grey-lighten-2"
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
        const srcs = {
          1: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          2: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          3: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          4: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
          5: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
        }
  
        return {
          autoUpdate: true,
          isUpdating: false,
          name: 'Account Login',
          title: 'You didn\'t have account?',
          title2: 'You forgot password?',
          email: '',
          password : '',
          timeout: null,
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
  
      methods: {
        remove (item) {
          const index = this.friends.indexOf(item.name)
          if (index >= 0) this.friends.splice(index, 1)
        },

        async Login(){
          this.isUpdating = true
          try {               
            const token = await axios.post('/api/auth/signin',{
              email : this.email, 
              password : this.password
            }, {
              withCredentials : true
            })
            console.log(token.data.accessToken);

            setTimeout(()=>{
              eventBus.emit('show-modal', 'Login is success'); 
              localStorage.setItem('access', token.data.accessToken)
              this.isUpdating = false
            },1000)

          } catch (error) {
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