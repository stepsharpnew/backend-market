<template>
	<v-container class="d-flex flex-column flex-md-row pa-4 h-100">
	  <!-- Левая колонка: Карточка товара -->
	  <NavigationDrawer :isAuth="isAuth" :email="email" :image_url="image_url"/>
	  <v-row class="w-100 w-md-50 me-md-4 mb-4 mb-md-0">
		<v-col>
		  <v-card class="pa-4 elevation-3 rounded">
			<v-card-title class="text-h5 font-weight-bold">{{ product.name }}</v-card-title>
			<v-card-subtitle
			  class="text-body-2 text-grey-darken-1 mb-2"
			  @click="goToCategory(product.category.short_name)"
			>
			  Category:
			  <span class="text-decoration-underline cursor-pointer">
				{{ product.category.category }}
			  </span>
			</v-card-subtitle>
			<v-img :src="product.category.image_url" class="mb-4 rounded" cover width="100%"></v-img>
			<v-card-text>
				<p class="text-body-1">{{ product.description }}</p>
				<div v-if="product.sale > 0" class="d-flex align-center">
					<!-- Старая цена -->
						<v-chip
						class="mr-2"
						outlined
						small
						color="grey lighten-2"
						>
						<span class="text-decoration-line-through grey--text">
							{{ product.price }} ₽
						</span>
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
				<div v-else>
					
						<v-chip
							class="mr-2"
							outlined
							small
							color="grey lighten-2"
							>
							<span class="grey--text">
								<p class="text-h5 text-primary font-weight-bold">Price:{{ product.price }} ₽</p>
							</span>
						</v-chip>

				</div>
				</v-card-text>
			<v-card-actions class="d-flex flex-column flex-md-row justify-end">

				<v-btn
				class="mx-0 mx-md-2 pa-2 mb-2 mb-md-0"
				append-icon="mdi-heart"
				color="red"
				variant="outlined"
				@click="addToFavorite(product)"
			  >
				Add to Favorite
			  </v-btn>
			  <v-btn
				class="mx-0 mx-md-2 pa-2 mb-2 mb-md-0"
				append-icon="mdi-cart"
				color="orange"
				variant="outlined"
				@click="addToBasket(product)"
			  >
				Add to Basket
			  </v-btn>
			  <v-btn
				class="mx-0 mx-md-2 pa-2"
				append-icon="mdi-cash"
				color="green"
				variant="outlined"
				@click="buyNow(product)"
			  >
				Buy Now
			  </v-btn>
			</v-card-actions>
		  </v-card>
		</v-col>
	  </v-row>
  
	  <!-- Правая колонка: Список похожих товаров -->
	  <v-row class="w-100 w-md-25 ms-md-4 h-auto">
		<v-col>
		  <v-card class="pa-2 elevation-2 rounded" style="height: auto;">
			<h3 class="text-h4 text-center mb-3">Related Products</h3>
			<v-list
			  dense
			  class="scrollable-list"
			  style="max-height: calc(100vh - 150px); overflow-y: auto;"
			>
			<v-list-item
				v-for="related in relatedProducts"
				:key="related.id"
				@click="GoToProd(related)"
				class="rounded mb-4"
				>
				<v-img
					:src="related.category.image_url"
					class=" rounded"
					height="30vh"
					contain
				></v-img>
				<v-list-item-content class="text-center">
					<v-list-item-title class="text-body-1 font-weight-bold">
					{{ related.name }}
					</v-list-item-title>
					<v-list-item-subtitle class="text-body-2 text-grey-darken-1">
					<div v-if="related.sale > 0" class="d-flex justify-center align-center">
						<!-- Старая цена -->
						<v-chip
						class="mr-2"
						outlined
						small
						color="grey lighten-2"
						>
						<span class="text-decoration-line-through grey--text">
							{{ related.price }} ₽
						</span>
						</v-chip>

						<!-- Новая цена со скидкой -->
						<v-chip
						class="mr-2"
						small
						color="orange lighten-3"
						dark
						>
						{{ (related.price - related.price * related.sale / 100).toFixed(2) }} ₽
						</v-chip>

						<!-- Процент скидки -->
						<v-chip
						small
						color="red lighten-3"
						dark
						>
						-{{ related.sale }}%
						</v-chip>
					</div>
					<div v-else class="d-flex justify-start align-center">
						<v-chip
							class="mr-2"
							outlined
							small
							color="grey lighten-2"
						>
							<span class="">
								{{ related.price }} ₽
							</span>
						</v-chip>
					</div>
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
import NavigationDrawer from '../components/NavigationDrawer.vue'
import eventBus from '../../eventBus';
import apiClient from '../../axiosClient';
  export default {
	data(){
		return {
			product : {category : {}, name : ''},
			relatedProducts : '',
			isAuth : false,
			email : '',
			image_url : ''

		}
	},
	components : {
		NavigationDrawer
	},
	// name: 'ProductDetail',
	methods: {
	   async addToBasket(product) {
		const token = localStorage.getItem('access')
		try {
			const response = await apiClient.post('/basket/create', 
				{
					product_id: product.id,
					count: 1
				}, 
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			// console.log(response.data);
			eventBus.emit('show-modal', "Product added to basket");
		} catch (error) {
			eventBus.emit('show-modal', "For this action required sign in");
			// console.log(error);
		}

		

	  },
	  buyNow(product) {
		// console.log('Покупка товара:', product);

	  },
	  goToCategory(short_name){
		this.$router.push(`/products/category/${short_name}`)
		window.scrollTo({
				top: 0,
				behavior: 'smooth', // Добавляет анимацию при прокрутке
			});
	  },
	  GoToProd(relatedProduct) {
			this.$router.push(`/product/${relatedProduct.slug}`)
			window.scrollTo({
				top: 0,
				behavior: 'smooth', // Добавляет анимацию при прокрутке
			});
		},
	}, 

	created(){
		try {
			this.email =  JSON.parse(localStorage.getItem('user')).email
			this.image_url =  JSON.parse(localStorage.getItem('user')).image_url
			this.isAuth = true
		} catch (error) {
			
		}
	},
	async mounted(){
		if (this.email == '' && this.image_url == '') {
			try {
				const token = localStorage.getItem('access')
				const user = await apiClient.get('/user/me', {
					headers : `Authorization: Bearer ${token}`
				})
				if (user.data) {
					localStorage.setItem('user', JSON.stringify(user.data))
					this.email = user.data.email
					this.image_url = user.data.image_url
					this.isAuth = true
				}
				// console.log(this.isAuth);
				

			} catch (error) {
				
			}
		}
		
		try {
			const slug = this.$route.params.slug
			const response = await axios.get(`/api/products/get/${slug}`)
			// console.log(response.data);
			this.category = response.data.category.short_name
			this.product = response.data

			
			let category_items = await axios.get(`/api/products/category/${this.category}`)
			category_items.data = category_items.data.filter((el) => el.id !== this.product.id);
		


			this.relatedProducts = category_items.data
			// console.log(this.relatedProducts);
			
		} catch (error) {
			// console.log(error);
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
  