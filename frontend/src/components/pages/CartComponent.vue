<template>
	<v-container class="d-flex flex-column pa-5 h-100" fluid>
	  <!-- Навигация -->
	  <NavigationDrawer :isAuth="isAuth" :email="email" :image_url="image_url" />

	  <!-- Основной контент -->
	   
	  <v-row>
		<!-- Колонка корзины -->
		<v-col cols="12" md="7">
			<v-row v-if="cartItems.length > 0" class="my-8">
				<v-col cols="12" >
					<v-card class="pa-4 elevation-3 rounded">
					<!-- Заголовок с общей суммой -->
					<v-card-title class="d-flex flex-wrap justify-space-between align-center">
						<span class="text-h5 font-weight-bold">Total: {{ totalPrice }} ₽</span>
						<v-chip color="blue lighten-4" outlined class="mt-2 mt-md-0">
						<v-icon left color="blue darken-2">mdi-cart</v-icon>
						{{ totalQuantity }} items
						</v-chip>
					</v-card-title>

					<!-- Действия -->
					<v-card-actions class="d-flex flex-column flex-sm-row justify-center align-start">
						<v-chip color="green lighten-4" outlined class="mb-4 mb-md-0 ">
							<v-icon left color="green darken-2">mdi-check-circle</v-icon>
							Ready to Checkout
						</v-chip>
						<v-spacer></v-spacer>
						<div class="d-flex flex-sm-row align-center justify-start ">
							<BuyAll :products="cartItems" class=""/>
							<v-btn color="red darken-2" small outlined @click="clearBasket">
								Clear Basket
							</v-btn>
						</div>
					</v-card-actions>
					</v-card>
				</v-col>
				</v-row>
		  <!-- Проверка на наличие товаров в корзине -->
		  <h1 class="text-h4 font-weight-bold text-center">Your basket</h1>
		  <v-divider></v-divider>
		  <br>
		  <v-row v-if="empty">
			<v-col>
			  <v-card class="pa-4 elevation-2 text-center">
				<v-card-text class="text-h5 text-grey">Empty...</v-card-text>
			  </v-card>
			</v-col>
		  </v-row>
  
		  <!-- Список товаров в корзине -->
		  <v-row v-else>
			<v-col
				v-for="item in cartItems"
				:key="item.id"
				cols="12"
				sm="6"
				md="6"
				lg="4"
			>
				<v-card class="pa-2 elevation-2 rounded mb-4">
				<v-img :src="item.products.category.image_url" class="mb-3 rounded" cover height="150"></v-img>
				<v-card-title class="text-h6 font-weight-bold">{{ item.products.name }}</v-card-title>
				<div class="text-subtitle-1 d-flex align-center" v-if="!item.products.saleBool">
              <v-chip 
                class="mr-2" 
                outlined 
                small
                color="grey lighten-2"
              >
                <span class="grey--text">{{ item.products.price }} ₽</span>
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
                <span class="text-decoration-line-through grey--text">{{ item.products.price }} ₽</span>
              </v-chip>

              <!-- Новая цена со скидкой -->
              <v-chip 
                class="mr-2"
                small
                color="orange lighten-3"
                dark
              >
                {{ (item.products.price - item.products.price * item.products.sale / 100).toFixed(2) }} ₽
              </v-chip>

              <!-- Процент скидки -->
              <v-chip 
                small 
                color="red lighten-3"
                dark
              >
                -{{ item.products.sale }}%
              </v-chip>
            </div>
				<div class="d-flex justify-space-between align-center">
					<v-card-text>
						Count: {{ item.count }}
					</v-card-text>
					<v-btn
						class="mx-1"
						prepend-icon="mdi-delete"
						color="error"
						@click="removeFromCart(item)"
					>
						Remove
					</v-btn>
				</div>

				<v-card-actions>
					<v-chip
					small
					outlined
					color="red lighten-4"
					@click="decreaseQuantity(item)"
					class="d-flex align-center px-0 w-100"
					>
						<v-icon left small color="red darken-2">mdi-minus</v-icon>
					</v-chip>
					<v-chip
					small
					outlined
					color="green lighten-4"
					@click="increaseQuantity(item)"
					class="d-flex align-center px-0 w-100"
					>
					<v-icon left small color="green darken-2">mdi-plus</v-icon>
					</v-chip>
					<!-- <v-btn
						class="mx-1"
						prepend-icon="mdi-cash"
						color="green"
						@click="Buy(item)"
						variant="outlined"
					>
						Buy
					</v-btn> -->
					<BuyComponent :product="item"/>
				</v-card-actions>
				</v-card>
			</v-col>
			</v-row>
		</v-col>
		
		<!-- Колонка товаров со скидками -->
		<v-col cols="12" md="5">
		  <h2 class="text-h6 font-weight-bold mb-4 text-center">Product Sales</h2>
		  <v-row>
			<v-col v-for="product in discountedProducts" :key="product.id" cols="12">
			  <v-card class="pa-3 elevation-1 rounded mb-3 d-flex justify-start">
				<v-row>
				  <v-col  lg="3" md="5" sm="3" >
					<v-img :src="product.category.image_url" cover height="100" width="100" class="rounded"></v-img>
				  </v-col>
				  <v-col  lg="9" md="7" sm="9" class="d-flex flex-column justify-start  align-start">
					<div class="text-body-1 font-weight-bold">{{ product.name }}</div>
					<div class="d-flex align-center">
					  <v-chip small outlined class="mr-2 grey--text">
						<span class="text-decoration-line-through">{{ product.price }}</span>
					  </v-chip>

					  <v-chip small color="red lighten-3" dark class="mt-1">-{{ product.sale }}%</v-chip>
					</div>
					<v-chip small color="orange lighten-3" dark style="width: fit-content;font-size: large;">
						{{ (product.price - product.price * product.sale / 100).toFixed(2) }}
					  </v-chip>
					<div class="d-flex">
						<v-tooltip text="Add to basket"location="bottom" class="cursor-pointer">
							<template v-slot:activator="{ props }">
								<v-list-item prepend-icon="mdi-cart" value="Add to basket" v-bind="props" @click="addToBasket(product)"></v-list-item>
							</template>
						</v-tooltip>
						<v-tooltip text="Add to favorite" location="bottom" class="cursor-pointer">
							<template v-slot:activator="{ props }">
								<v-list-item prepend-icon="mdi-heart" value="Add to favorite" v-bind="props"  @click="addToFavorite(product)"></v-list-item>
							</template>
						</v-tooltip>
					</div>
				  </v-col>
				</v-row>
			  </v-card>
			</v-col>
		  </v-row>
		</v-col>
	  </v-row>	 
	</v-container>
  </template>
  
  
  <script>
import { isAuthenticated } from '../../router/auth'
import eventBus from '../../eventBus';
import axios from 'axios';
import apiClient from '../../axiosClient';
import NavigationDrawer from '../components/NavigationDrawer.vue';
import BuyComponent from '../components/BuyComponent.vue';
import BuyAll from '../components/BuyAll.vue';
  export default {
	data() {
	  return {
		cartItems: [],
		isAuth : false,
		email : '',
		image_url : '',
		empty : true,
		discountedProducts : []
	  };
	},
	components : {
		NavigationDrawer,
		BuyComponent,
		BuyAll
	},
	// beforeRouteEnter(to, from, next) {
    //   if (!isAuthenticated()) {
    //     next({ name: 'LoginPage' }); // Перенаправление на страницу входа
    //   } else {
    //     next();
    //   }
    // },

	async mounted(){
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
		} catch (error) {
			
		}
		const token = localStorage.getItem('access')
		this.fetchData(token)
	},


	computed: {
		totalPrice() {
			let sum = 0
			this.cartItems.forEach((elem)=>{
				if (elem.products.saleBool) {
					sum = elem.count*(elem.products.price - elem.products.price*elem.products.sale/100)
				}
				else{
					sum = elem.count*elem.products.price + sum
				}
			})
			return sum.toFixed(2)
		},
	  	totalQuantity() {
			return this.cartItems.reduce((total, item) => total + item.count, 0);
		}
	},
	methods: {
		async fetchData(token){
			try {
				const response = await apiClient.get('/basket',{
					headers : `Authorization: Bearer ${token}`
				})
				if (response.data.status === 422) {
					this.empty = true
				}
				else{
					this.empty = false
					this.cartItems = response.data
				}
			} catch (error) {
				console.log(error);
			}
			try {
				const response = await axios.get('/api/products/sales')
				this.discountedProducts = response.data
			} catch (error) {
				console.log(error);
				
			}
		},

		async addToFavorite(product){
			console.log(product);
			
			const token = localStorage.getItem('access')
			try {
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
				eventBus.emit('show-modal', "Product added to favorites");
			} catch (error) {
				if (error.response.data.statusCode == 400) {
					eventBus.emit('show-modal', "Product has already been added to favorites");
				}
				console.log(error);
			}
		},
		async decreaseQuantity(item) {
			const token = localStorage.getItem('access')
			if (item.count > 1) {
			item.count -= 1;
			await apiClient.post('basket/count_change', 
				{
					count: item.count+1,
					type: false
				}, 
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			} else {
			this.removeFromCart(item);
			}
		
		
		},
		async increaseQuantity(item) {
			const token = localStorage.getItem('access')
			item.count += 1;
			await apiClient.post('basket/count_change', 
				{
					count: item.count-1,
					type: true
				}, 
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
		},
		async removeFromCart(item) {
			const token = localStorage.getItem('access');
			this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
			try {
				await apiClient.delete('basket/delete-item', {
					params: {
						product_id: item.products.id,
					},
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				eventBus.emit('show-modal', "Product removed from basket");
			} catch (error) {
				
			}


		},

		async addToBasket(product){
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
				this.fetchData(token)
				eventBus.emit('show-modal', "Product added to basket");
			} catch (error) {
				console.log(error);
			}
		},

		async clearBasket(){
			const token = localStorage.getItem('access')
			try {
				await apiClient.delete('/basket/delete', 
					{
						headers: {
							Authorization: `Bearer ${token}`
						}
					}
				);
				this.cartItems = []
				eventBus.emit('show-modal', "Basket cleared");
			} catch (error) {
				console.log(error);
			}
		}
	},

	created(){
		this.email =  JSON.parse(localStorage.getItem('user')).email
		this.image_url =  JSON.parse(localStorage.getItem('user')).image_url
		this.isAuth = true
	},
	watch: {
	  cartItems: {
		handler() {
			if (!this.cartItems.length) {
				this.empty = true
			}
		},
		deep: true,
	  },
	},
  };
  </script>
  
  <style scoped>
  .text-h4 {
	font-family: 'Roboto', sans-serif;
	font-weight: 700;
  }
  </style>
  