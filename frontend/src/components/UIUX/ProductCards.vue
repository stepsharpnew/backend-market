<template>
  <v-row>
    <v-col
      cols="12"
      sm="6"
      md="4"
      lg="3"
      v-for="(product, index) in products"
      :key="index"
    >
        <v-card class="mx-auto" max-width="320">
          <v-img
            height="200px"
            :src="product.category.image_url"
            contain
            class="align-end"
          >

          </v-img>
          <div 
            class="d-flex flex-column pa-3"
            style="height: 80px;"
          >
            <div 
              class="text-subtitle-3 text-start" 
              style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
            >
              {{ product.name }}
            </div>
            <div class="text-subtitle-1 d-flex align-center" v-if="!product.saleBool">
              <v-chip 
                class="mr-2" 
                outlined 
                small
                color="grey lighten-2"
              >
                <span class="grey--text">{{ product.price }} ₽</span>
              </v-chip>
            </div>
            <div class="text-subtitle-1 d-flex align-center" v-else>
              <!-- Старая цена -->
              <v-chip 
                class="mr-2" 
                outlined 
                small
                color="grey lighten-2"
              >
                <span class="text-decoration-line-through grey--text">{{ product.price }} ₽</span>
              </v-chip>

              <!-- Новая цена со скидкой -->
              <v-chip 
                class="mr-2"
                small
                color="orange lighten-3"
                dark
              >
                {{ (product.price - product.price * product.sale / 100).toFixed(2) }} ₽
              </v-chip>

              <!-- Процент скидки -->
              <v-chip 
                small 
                color="red lighten-3"
                dark
              >
                -{{ product.sale }}%
              </v-chip>
            </div>
          </div>
          <v-card-actions>
            
            <v-tooltip text="More info">
              <template v-slot:activator="{ props }">
                <v-btn color="orange-lighten-2" @click="GoToProd(product)" v-bind="props">Подробнее</v-btn>
              </template>
            </v-tooltip>       
            <v-spacer></v-spacer>

            <v-tooltip text="Add to favorites">
              <template v-slot:activator="{ props }">
                <v-btn :icon="'mdi-heart'" color="grey" prepend class="ma-0 pa-0" v-bind="props" @click="AddToFavorite(product)"></v-btn>
              </template>
            </v-tooltip> 
          </v-card-actions>
        </v-card>
    </v-col>
  </v-row>
</template>

<script>
import eventBus from '../../eventBus';
import apiClient from '../../axiosClient';
export default {
  props: {

    products: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      show: [],
    };
  },
  mounted() {
    this.show = new Array(this.products.length).fill(false);
    console.log(this.products);
    
  },
  methods: {
    toggleShow(index) {
      this.show[index]=!this.show[index]
    },
    GoToProd(product){
      this.$router.push(`/product/${product.slug}`)
      window.scrollTo({
				top: 0,
				behavior: 'smooth', // Добавляет анимацию при прокрутке
			});
    },
    async AddToFavorite(product) {
      try {
        const token = localStorage.getItem('access')
        const response = await apiClient.post('/favorite/like', 
					{
						product_id: product.id,
					}, 
					{
						headers: {
							Authorization: `Bearer ${token}`
						}
					}
				);
        console.log(response);
        
      } catch (error) {
        console.log(error);
        
        eventBus.emit('show-modal', "You need registration");
      }
    }
  },

};
</script>

<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.8;
  position: absolute;
  width: 100%;
  font-family: 'Sarpanch', sans-serif;
}

</style>
