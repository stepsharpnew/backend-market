<template>
	<v-container class="d-flex flex-row pa-4 h-100">
	  <!-- Левая часть: Карточка товара -->
	  <v-row class="w-50">
		<v-col>
		  <v-card class="pa-4">
			<v-img :src="product.category.image_url" class="mb-4" cover></v-img>
			<v-card-title>{{ product.name }}</v-card-title>
			<v-card-subtitle class="text-body-2 text-grey-darken-1 mb-2">
			  Категория: {{ product.category.category }}
			</v-card-subtitle>
			<v-card-text>
			  <p>{{ product.description }}</p>
			  <p class="text-h5 text-primary font-weight-bold">
				Цена: {{ product.price }} ₽
			  </p>
			</v-card-text>
			<v-card-actions class="d-flex justify-space-between">
				<v-spacer></v-spacer>
			  <v-btn
					class="mx-4 pa-2"
					append-icon="mdi-chevron-right"
					color="orange-lighten-2"
					text="In Basket"
					variant="outlined"
					@click="addToCart(product)"
				>
				</v-btn>
				<v-btn
					class="mx-4 pa-2"
					append-icon="mdi-chevron-right"
					color="red-lighten-2"
					text="Buy Now"
					variant="outlined"
					@click="buyNow(product)"
				>
				</v-btn>
			</v-card-actions>
		  </v-card>
		</v-col>
	  </v-row>
	  
	  <!-- Правая часть: Список других товаров -->
	  <v-row class="w-25">
		<v-col>
		  <v-card class="pa-2">
			<h3 class="text-h6 text-center mb-3">Похожие товары</h3>
			<v-list dense>
			  <v-list-item
				v-for="related in relatedProducts"
				:key="related.id"
				@click="viewProduct(related)"
			  >
				<v-img :src="related.image_url" class="me-3" height="50" width="50" contain></v-img>
				<v-list-item-content>
				  <v-list-item-title>{{ related.name }}</v-list-item-title>
				  <v-list-item-subtitle class="text-body-2 text-grey-darken-1">
					{{ related.price }} ₽
				  </v-list-item-subtitle>
				</v-list-item-content>
			  </v-list-item>
			</v-list>
		  </v-card>
		</v-col>
	  </v-row>
	</v-container>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
	data(){
		return {
			product : {category : {}, name : ''}
		}
	},
	// name: 'ProductDetail',
	props: {
	  relatedProducts: {
		type: Array,
		default: () => [],
	  },
	},
	methods: {
	  addToCart(product) {
		console.log('Добавлено в корзину:', product);

	  },
	  buyNow(product) {
		console.log('Покупка товара:', product);

	  },
	  viewProduct(relatedProduct) {
		console.log('Переход к товару:', relatedProduct);
 
	  },
	}, 
	async mounted(){
		try {
			const slug = this.$route.params.slug
			console.log(slug);
			const response = await axios.get(`/api/products/get/${slug}`)
			console.log(response.data);
			this.product = response.data
		} catch (error) {
			console.log(error);
			
		}
	}


  };
  </script>
  
  <style scoped>
  .text-h6 {
	font-family: 'Roboto', sans-serif;
	font-weight: 500;
  }
  .text-primary {
	color: #1976d2 !important;
  }
  </style>
  