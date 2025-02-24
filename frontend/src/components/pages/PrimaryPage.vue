<template>
  <v-container class="d-flex flex-column pa-0 w-80 " >
    <!-- Навигационное меню -->

      <NavigationDrawer :isAuth="isAuth" :email="email" :image_url="image_url"/>
      
      <v-main class="pa-4 ma-5 w-80 align-center">
        <SearchAndAuth :isAuth="isAuth"/>
        <v-row >
          <v-col>
            <h2 class="text-h3 text-center" style="width: 100%;" v-if="saleProducts.length" >Current sales</h2>
          </v-col>
        </v-row>

        <!-- Список товаров -->
        <SaleSlider
          class="mb-5"
          v-if="saleProducts.length" 
          :saleProducts="saleProducts"
        />
        <v-divider></v-divider>
        <v-row class="d-flex flex-wrap my-5">
          <h2 class="text-h3 text-center">Products</h2>
          <ProductCards :products="products" />
        </v-row>
        <v-row>
          <v-col>
            <div class="text-center" @click="paginationParams">
              <v-pagination
                v-model="page"
                :length="pagin_lenght"
                next-icon="mdi-menu-right"
                prev-icon="mdi-menu-left"
              ></v-pagination>
            </div>
            <v-card 
            :loading="isUpdating" elevation="0">
              <template v-slot:loader="{ isActive }">
                <v-progress-linear
                  :active="isActive"
                  color="black-lighten-3"
                  height="4"
                  indeterminate
                ></v-progress-linear>
              </template>
              <v-divider></v-divider>
            </v-card>

            <!-- <PrivacyPolicy v-model="policyStatus"@closePolicy="closePolicy"/> -->
            
          </v-col>
        </v-row>
      </v-main >
    <!-- Заголовок страницы -->
  </v-container>
</template>

<script>
// import NavigationDrawer from '../components/NavigationDrawer.vue';
import apiClient from '../../axiosClient';
import LogoutModal from '../components/LogoutModal.vue';
import MainFooter from '../components/MainFooter.vue';
import NavigationDrawer from '../components/NavigationDrawer.vue';
import PrivacyPolicy from '../components/PrivacyPolicy.vue';
import SaleSlider from '../components/SaleSlider.vue';
import SearchAndAuth from '../components/SearchAndAuth.vue';
import ProductCards from '../UIUX/ProductCards.vue';
import axios from 'axios';

export default {
  name: 'List',
  components: {
    ProductCards,
    // NavigationDrawer,
    SaleSlider,
    MainFooter,
    SearchAndAuth,
    PrivacyPolicy,
    LogoutModal,
    NavigationDrawer
  },
  data() {
    return {
      products: [], 
      isUpdating : false,
      saleProducts : [],
      openCategory : false,
      email : '',
      isAuth : false,
      page : 1,
      limit : 15,
      offset : 0,
      pagin_lenght : 2,
      policyStatus : false,
      openLogoutDialog: false,
      image_url : 'https://storage.yandexcloud.net/step2002sharp/none-profile.png'
    };
  },
  created(){
    setTimeout(() => {
      if (!localStorage.getItem('privacy')) {
        this.policyStatus = true
      }
    }, 3000);
  },
  watch: {
        isUpdating (val) {
          clearTimeout(this.timeout)
          if (val) {
            this.timeout = setTimeout(() => (this.isUpdating = false), 800)
          }
        },
      },
  async mounted() {    
    const token = localStorage.getItem('access')
    let user
    try {
      if (token) {
        user = await apiClient.get('/user/me', {
          headers : `Authorization: Bearer ${token}`
        })
      }
      if (user.data) {
        localStorage.setItem('user', JSON.stringify(user.data))
        this.email = user.data.email
        this.image_url = user.data.image_url
        this.isAuth = true
      }
    }
    catch(error){
      // console.log(error);
      if (token) {
        user = await apiClient.get('/user/me', {
          headers : `Authorization: Bearer ${token}`
        })
      }
      if (user?.data) {
        localStorage.setItem('user', JSON.stringify(user.data))
        this.email = user.data.email
        this.image_url = user.data.image_url
        this.isAuth = true
      }

    }
    try {    
      const response = await axios.get(`/api/products?offset=${this.offset * this.limit}&limit=${this.limit}`);
      this.products = response.data; 
      // console.log(this.products);
      
      const sales = await axios.get(`/api/products/sales`);
      this.saleProducts = sales.data

      const all_products = await axios.get(`/api/products`);
      this.pagin_lenght = Math.ceil(all_products.data.length/this.limit)
      

    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    }
  },
  methods : {
    async paginationParams(){
      this.isUpdating = true
      try {
        this.offset = (this.page-1)*this.limit
        const response = await axios.get(`/api/products?offset=${this.offset}&limit=${this.limit}`);
        setTimeout(()=>{
          this.products = response.data; 
          window.scrollTo({
            bottom: 0,
            behavior: 'smooth', // Добавляет анимацию при прокрутке
          });
        },500)
      } catch (error) {
        // console.log(error);
        
      }

    },


  }

};
</script>

<style scoped>
.text-h3{
  font-family: 'Sarpanch', sans-serif;
}
</style>
