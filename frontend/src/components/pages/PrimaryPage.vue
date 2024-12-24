<template>
  <v-container class="d-flex flex-column pa-0 w-80 " >
    <!-- Навигационное меню -->

      <v-navigation-drawer
        image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
        theme="dark"
        v-model="drawer"
        :rail="rail"
        permanent
        @click="rail = false"
        style="cursor: pointer"
        v-if="isAuth"
        class="h-100"
      >
      <v-tooltip :text="email">
        <template v-slot:activator="{ props }">
          <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
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
              <v-list-item prepend-icon="mdi-account" title="My Account" value="account" v-bind="props"></v-list-item>
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

        </v-list>
        <div class="h-50"></div>
        <v-list density="compact" nav>
          <v-tooltip text="Logout">
            <template v-slot:activator="{ props }">
              <v-list-item prepend-icon="mdi-logout" title="Logout" value="Logout" v-bind="props"></v-list-item>
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
      </v-col>
    </v-row>
      </v-main >

    <!-- Заголовок страницы -->
  </v-container>
</template>

<script>
// import NavigationDrawer from '../components/NavigationDrawer.vue';
import MainFooter from '../components/MainFooter.vue';
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
    SearchAndAuth
  },
  data() {
    return {
      products: [], 
      drawer: true,
      rail: true,
      saleProducts : [],
      openCategory : false,
      email : '',
      isAuth : false,
      page : 1,
      limit : 15,
      offset : 0,
      pagin_lenght : 2
    };
  },
  async mounted() {
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.isAuth = !!user.email;
    console.log('auth',this.isAuth);
    
    try {
      if (this.isAuth) {
        this.email = JSON.parse(localStorage.getItem('user')).email
      }else{
        const token = localStorage.getItem('access')
        let user
        if (token) {
          user = await axios.get('/api/user/me', {
            headers : `Authorization: Bearer ${token}`
        })

        }
        localStorage.setItem('user', JSON.stringify(user.data))
        this.email = JSON.parse(localStorage.getItem('user')).email
        this.isAuth = true
      }
      
    } catch (error) {
      console.log('Ошибка загрузки пользователя:', error);
    }
    try {    
      const response = await axios.get(`/api/products?offset=${this.offset * this.limit}&limit=${this.limit}`);
      this.products = response.data; 
      console.log(response.data.map((el)=>el.id));
      
      // console.log('products',this.products);
      const sales = await axios.get(`/api/products/sales`);
      this.saleProducts = sales.data

      const all_products = await axios.get(`/api/products`);
      this.pagin_lenght = Math.ceil(all_products.data.length/this.limit)
      console.log();
      

      console.log('SAles',this.saleProducts);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    }
  },
  methods : {
    async paginationParams(){
      this.offset = (this.page-1)*this.limit
      console.log(this.limit, this.offset);
      const response = await axios.get(`/api/products?offset=${this.offset}&limit=${this.limit}`);
      this.products = response.data; 
      console.log(response.data.map((el)=>el.id));
    }
  }

};
</script>

<style scoped>
/* Добавьте стили, если нужно */
</style>
