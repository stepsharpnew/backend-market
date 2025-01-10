<template>
  <v-container class="d-flex flex-column pa-0 w-80 " >
    <!-- Навигационное меню -->

      <v-navigation-drawer
        image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
        theme="dark"
        v-model="drawer"
        :rail="rail"
        @click="rail = false"
        style="cursor: pointer"
        v-if="isAuth"
        class="h-100"
      >
      <v-tooltip :text="email">
        <template v-slot:activator="{ props }">
          <v-list-item
            :prepend-avatar="image_url"
            :title="email"
            nav
            v-bind="props"
          >
            <template v-slot:append>
              <v-btn 
                icon="mdi-chevron-left"
                variant="text"
                color="pink"
                @click.stop="rail = !rail"
              ></v-btn>
            </template>
          </v-list-item>
        </template>
      </v-tooltip>

        <v-divider></v-divider>

        <v-list density="compact" nav>

          <v-tooltip text="My Account">
            <template v-slot:activator="{ props }">
              <v-list-item prepend-icon="mdi-account" title="My Account" value="account" v-bind="props" @click="this.$router.push('/profile')"></v-list-item>
            </template>
          </v-tooltip>

          <v-tooltip text="Favorite">
            <template v-slot:activator="{ props }">
              <v-list-item prepend-icon="mdi-heart" title="Favorite" value="Favorite" v-bind="props"></v-list-item>
            </template>
          </v-tooltip>

          <v-tooltip text="Basket">
            <template v-slot:activator="{ props }">
              <v-list-item prepend-icon="mdi-delete" title="Basket" value="Basket" v-bind="props"></v-list-item>
            </template>
          </v-tooltip>

          <v-tooltip text="Logout">
            <template v-slot:activator="{ props }">
              <v-list-item prepend-icon="mdi-logout" title="Logout" value="Logout" v-bind="props" @click="openLogoutDialog = true"></v-list-item>
            </template>
          </v-tooltip>
        </v-list>
      </v-navigation-drawer>
      
      <v-main class="pa-4 ma-5 w-80 align-center">
        <SearchAndAuth :rail="rail" />
        <v-row >
          <v-col>
            <h2 class="text-h3 text-center">Current sales</h2>
          </v-col>
        </v-row>

        <!-- Список товаров -->
        <SaleSlider
        class="mb-5"
        v-if="saleProducts.length" 
        :saleProducts="saleProducts"
        />
        <v-row class="d-flex flex-wrap">
          <ProductCard :products="products" />
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
            <!-- <PrivacyPolicy v-model="policyStatus"@closePolicy="closePolicy"/> -->
            <LogoutModal :openLogoutModal="openLogoutDialog" @update:openLogoutModal="openLogoutDialog = $event" @closeLeftPanel="closeLeftPanel"/>
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
import PrivacyPolicy from '../components/PrivacyPolicy.vue';
import SaleSlider from '../components/SaleSlider.vue';
import SearchAndAuth from '../components/SearchAndAuth.vue';
import ProductCard from '../UIUX/ProductCard.vue';
import axios from 'axios';

export default {
  name: 'List',
  components: {
    ProductCard,
    // NavigationDrawer,
    SaleSlider,
    MainFooter,
    SearchAndAuth,
    PrivacyPolicy,
    LogoutModal
  },
  data() {
    return {
      products: [], 
      drawer: true,
      rail: true,
      saleProducts : [],
      openCategory : false,
      email : '',
      isAuth : true,
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
      console.log(error);
      // if (token) {
      //   user = await apiClient.get('/user/me', {
      //     headers : `Authorization: Bearer ${token}`
      //   })
      // }
      // if (user.data) {
      //   localStorage.setItem('user', JSON.stringify(user.data))
      //   this.email = user.data.email
      //   this.image_url = user.data.image_url
      //   this.isAuth = true
      // }

    }
    try {    
      const response = await axios.get(`/api/products?offset=${this.offset * this.limit}&limit=${this.limit}`);
      this.products = response.data; 

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
      this.offset = (this.page-1)*this.limit
      const response = await axios.get(`/api/products?offset=${this.offset}&limit=${this.limit}`);
      this.products = response.data; 
    },


  }

};
</script>

<style scoped>
.text-h3{
  font-family: 'Sarpanch', sans-serif;
}
</style>
