<template>
  <FirstRestoring @goToSecond="goToSecond" v-if="first" :currentEmail="currentEmail"/>
  <SecondRestoring @goToFirst="goToFirst" @goToThird="goToThird" v-if="second" :currentEmail="currentEmail" :currentCode="currentCode"/>
  <ThirdRestoring @goToSecond="goToSecond" v-if="third" :currentEmail="currentEmail" :currentCode="currentCode"/>
</template>

<script>

import FirstRestoring from '../components/RestoringComp/FirstRestoring.vue';
import SecondRestoring from '../components/RestoringComp/SecondRestoring.vue';
import ThirdRestoring from '../components/RestoringComp/ThirdRestoring.vue';
    export default {
      data () {
        return {
          first : true,
          second : false,
          third : false,
          currentEmail : '',
          currentCode : ''
        }
      },
      components : {
        FirstRestoring,
        SecondRestoring,
        ThirdRestoring
      },
      methods : {
        goToFirst(){
          this.first = true
          this.second = false
          this.third = false

          //Продумать это
          // this.currentCode = false
        },
        goToSecond(email){
          if (email != true) {
            this.currentEmail = email
          }
          this.first = false
          this.second = true
          this.third = false
        },
        goToThird(code){
          this.currentCode = code
          this.currentCode = code
          this.first = false
          this.second = false
          this.third = true
        },

      }
  }
</script>
