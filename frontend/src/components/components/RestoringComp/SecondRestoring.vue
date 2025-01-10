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
                      @click="goBack"
                  ></v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                      class="mx-4 pa-2"
                      append-icon="mdi-chevron-right"
                      color="orange-lighten-2"
                      text="Next"
                      variant="outlined"
                      @click="CheckCode"
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
                <p style="font-family: 'Roboto', sans-serif; font-weight: 200;">Enter you auth code</p>
                <v-otp-input
                    :disabled="isUpdating"
                    model-value="221"
                    v-model="code"
                    :error="errorStatus"
                ></v-otp-input>
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
      code : '',
      buffer: 2,
      progress : 1,
      errorStatus : false
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
  components : {
    ProgressBar
  },

  methods: {
    async CheckCode(){
      this.isUpdating = true
      try {     
        const response = await axios.post('/api/auth/confirm_code',{
            email : this.currentEmail,
            code : this.code
          })

        setTimeout(()=>{
          switch (response.data) {
            case true:
              eventBus.emit('show-modal', 'Authentification code correct'); 
              this.$emit('goToThird', this.code)
              break;

            case 404:
              eventBus.emit('show-modal', 'Validity period has ended, you can try again'); 
              this.errorStatus = true
              setTimeout(()=>{this.errorStatus = false},3000)
              break;

            case 401:
              eventBus.emit('show-modal', 'Authentification code bad, you can try again'); 
              this.errorStatus = true
              setTimeout(()=>{this.errorStatus = false},3000)
              break;
          }
          this.isUpdating = false
          
        },1000)
      } catch (error) {
          setTimeout(()=>{
            eventBus.emit('show-modal', error.response.data.message);
            this.errorStatus = true
            setTimeout(()=>{this.errorStatus = false},3000)
            this.isUpdating = false 
          },1000 )
      }
    },
    goBack(){
        try {               
            this.$emit('goToFirst', true)
        } catch (error) {
            setTimeout(()=>{
                eventBus.emit('show-modal', 'Error, try later');
                this.isUpdating = false 
            },1000 )
        }
    }
  },
  props : {
    currentEmail : {
      type : String
    },
    currentCode : {
      type : String
    }
  },

  async created(){
    console.log(this.currentEmail);
    
    if (this.currentCode) {
      this.code = this.currentCode
    }
  },

  async mounted(){

    }
}
</script>