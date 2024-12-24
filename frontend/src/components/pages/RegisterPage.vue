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
                            text="Sign Up"
                            variant="outlined"
                            @click="Register"
                        >
                        </v-btn>
                    </v-row>
                </v-col>
                    
                <v-row align="space-beetween">
                  <v-col class="text-center">
                    <h3 class="text-h4">{{ name }}</h3>
                    <span class="text-grey-lighten-1 cursor-pointer" @click="this.$router.push('/login')">{{ title }}</span>
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
                      v-model="password"
                      type="password"
                      :disabled="isUpdating"
                      color="blue-grey-lighten-2"
                      label="Password"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="confirm_password"
                      type="password"
                      :disabled="isUpdating"
                      color="blue-grey-lighten-2"
                      label="Confirm password"
                    ></v-text-field>
                  </v-col>
  
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="friends"
                      :disabled="isUpdating"
                      :items="people"
                      color="blue-grey-lighten-2"
                      item-title="name"
                      item-value="name"
                      label="Select most interesting categories"
                      chips
                      closable-chips
                      multiple
                    ></v-autocomplete>
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
          friends: ['Sandra Adams', 'Britta Holt'],
          isUpdating: false,
          name: 'Account Create',
          people: [
            // TODO: https://github.com/vuetifyjs/vuetify/issues/15721
            // { header: 'Group 1' },
            { name: 'Sandra Adams', group: 'Group 1', avatar: srcs[1] },
            { name: 'Ali Connors', group: 'Group 1', avatar: srcs[2] },
            { name: 'Trevor Hansen', group: 'Group 1', avatar: srcs[3] },
            { name: 'Tucker Smith', group: 'Group 1', avatar: srcs[2] },
            // { divider: true },
            // { header: 'Group 2' },
            { name: 'Britta Holt', group: 'Group 2', avatar: srcs[4] },
            { name: 'Jane Smith ', group: 'Group 2', avatar: srcs[5] },
            { name: 'John Smith', group: 'Group 2', avatar: srcs[1] },
            { name: 'Sandra Williams', group: 'Group 2', avatar: srcs[3] },
          ],
          title: 'You Have account?',
          email: '',
          password : '',
          confirm_password : '',
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

        async Register(){
          if (this.password !== this.confirm_password) {
            eventBus.emit('show-modal', "Пароли не совпадают"); 
            return
          }
          try {     
            this.isUpdating = true          
            const token = await axios.post('/api/auth/signup',{
              email : this.email, 
              password : this.password
            }, {
              withCredentials : true
            })

            eventBus.emit('show-modal', "Sign up is successfull");
            localStorage.setItem('access', token.data.accessToken)
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