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
            <!-- Placeholder for image -->
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
            <v-btn color="orange-lighten-2" @click="GoToProd(product)">Подробнее</v-btn>
            <v-spacer></v-spacer>
            <v-btn :icon="'mdi-heart'" color="grey" prepend class="ma-0 pa-0"></v-btn>
          </v-card-actions>

          <v-expand-transition>
            <div v-show="show[index]">
              <v-divider></v-divider>
              <v-card-text>
                {{ product.description }}
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    // Принимает список продуктов от родителя
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
