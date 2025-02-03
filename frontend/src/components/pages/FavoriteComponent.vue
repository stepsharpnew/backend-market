<template>
	<v-container class="d-flex flex-column pa-5 h-100" fluid>
	  <!-- Навигация -->
	  <NavigationDrawer :isAuth="isAuth" :email="email" :image_url="image_url" />
	   
	  <v-row>
		<!-- Колонка корзины -->
		<v-col cols="12" md="7">
			<v-row class="my-8">
				<v-col cols="12" >
					<v-card class="pa-4 elevation-3 rounded">
						<v-card-title class="d-flex flex-wrap align-center justify-start">
							<v-chip color="blue lighten-4" outlined class="mr-4">
							<v-icon left color="blue darken-2">mdi-cart</v-icon>
							{{ totalQuantity }} item
							</v-chip>
							<h2 class="text-h4 text-center">Your Favorite</h2>
							<v-spacer></v-spacer>
							<!-- Кнопка уведомлений -->
							 
							<v-btn
								class="notification-button enabled"
								small
								v-if="tgNotify"
							>
								<v-icon left v-if="tgNotify" color="green darken-2">mdi-check-circle</v-icon>
								<v-icon left v-else color="blue darken-2">mdi-alert-circle</v-icon>
								{{ tgNotify ? 'Notification enabled' : 'Notification disabled' }}
							</v-btn>
							
							<v-btn
								class="notification-button disabled"
								small
								v-else
								@click="openChildDialog"
							>
								<v-icon left v-if="tgNotify" color="green darken-2">mdi-check-circle</v-icon>
								<v-icon left v-else color="blue darken-2">mdi-alert-circle</v-icon>
								{{ tgNotify ? 'Notification enabled' : 'Notification disabled' }}
							</v-btn>
							<ModalNoify ref="ModalNoify"/>
						</v-card-title>
					</v-card>
				</v-col>
			</v-row>
		  <!-- Проверка на наличие товаров в корзине -->
		  
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
				<v-img :src="item.category.image_url" class="mb-3 rounded" cover height="150"></v-img>
				<v-card-title class="text-h6 font-weight-bold">{{ item.name }}</v-card-title>
				<div class="text-subtitle-1 d-flex align-center" v-if="!item.saleBool">
              <v-chip 
                class="mr-2" 
                outlined 
                small
                color="grey lighten-2"
              >
                <span class="grey--text">{{ item.price }} ₽</span>
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
                <span class="text-decoration-line-through grey--text">{{ item.price }} ₽</span>
              </v-chip>

              <!-- Новая цена со скидкой -->
              <v-chip 
                class="mr-2"
                small
                color="orange lighten-3"
                dark
              >
                {{ (item.price - item.price * item.sale / 100).toFixed(2) }} ₽
              </v-chip>

              <!-- Процент скидки -->
              <v-chip 
                small 
                color="red lighten-3"
                dark
              >
                -{{ item.sale }}%
              </v-chip>
            </div>
				<div class="d-flex justify-space-between align-center">

					<v-btn
						class="mx-1"
						prepend-icon="mdi-delete"
						color="error"
						@click="removeFromCart(item)"
					>
						Remove
					</v-btn>
				</div>



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
								<v-list-item prepend-icon="mdi-heart" value="Add to favorite" v-bind="props" @click="addToFavorite(product)"></v-list-item>
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
import ModalNoify from '../UIUX/ModalNoify.vue';

  export default {
	data() {
	  return {
		cartItems: [],
		isAuth : false,
		email : '',
		image_url : '',
		empty : true,
		discountedProducts : [],
		tgNotify : false
	  };
	},
	components : {
		NavigationDrawer,
		ModalNoify
	},
	beforeRouteEnter(to, from, next) {
      if (!isAuthenticated()) {
        next({ name: 'LoginPage' }); // Перенаправление на страницу входа
      } else {
        next();
      }
    },

	async mounted(){

			try {
				const token = localStorage.getItem('access')
				const user = await apiClient.get('/user/me', {
					headers : `Authorization: Bearer ${token}`
				})

					localStorage.setItem('user', JSON.stringify(user.data))
					this.email = user.data.email
					this.image_url = user.data.image_url
					this.isAuth = true
					this.tgNotify = user.data.telegram? true : false
					console.log(this.tgNotify);
					
				// }
			} catch (error) {
				console.log(error);
				
			}
			const token = localStorage.getItem('access')
			this.fetchData(token)
		// }



		
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
			return this.cartItems.length
		}
	},
	methods: {
		openChildDialog() {
			this.$refs.ModalNoify.openDialog(); // Вызываем метод открытия диалога
		},
		async fetchData(token){
			try {
				const response = await apiClient.get('/favorite',{
					headers : `Authorization: Bearer ${token}`
				})
				this.cartItems = response.data
				console.log(response.data);
				
				if (response.data.status === 422) {
					this.empty = true
				}
				else{
					this.empty = false
				}
				console.log(response.data);
				
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


	async removeFromCart(item) {
		const token = localStorage.getItem('access');
		this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
		try {
			await apiClient.delete('/favorite', {
				params: {
					product_id: item.id,
				},
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			eventBus.emit('show-modal', "Product removed from favorites");
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
			eventBus.emit('show-modal', "Product added to basket");
		} catch (error) {
			console.log(error);
		}
	  },
	  async addToFavorite(product){
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
			this.fetchData(token)
			eventBus.emit('show-modal', "Product added to favorite");
		} catch (error) {
			console.log(error);
			if (error.response.data.statusCode==400) {
				eventBus.emit('show-modal', "Product already added");
			}
		}
	  },
	  	
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
	.notification-button {
		border-radius: 20px;
		transition: all 0.3s ease;
	}
	.notification-button.enabled {
		background-color: #e8f5e9; /* Светло-зелёный */
		color: #1b5e20; /* Тёмно-зелёный */
	}
	.notification-button.disabled {
		background-color: #e3f2fd; /* Светло-синий */
		color: #0d47a1; /* Тёмно-синий */
		animation: blink 3s infinite; /* Мигание */
	}

	@keyframes blink {
	0%, 100% {
		background-color: #e3f2fd;
	}
	50% {
		background-color: #bbdefb;
	}
	}
  </style>
  