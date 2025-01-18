<template>
	<v-container class="d-flex flex-column pa-4 h-100">
	  <!-- Заголовок корзины -->
	  <v-row>
		<v-col>
		  <h1 class="text-h4 font-weight-bold text-center">Your Cart</h1>
		</v-col>
	  </v-row>
  
	  <!-- Проверка на наличие товаров в корзине -->
	  <v-row v-if="cartItems.length === 0">
		<v-col>
		  <v-card class="pa-4 elevation-2 text-center">
			<v-card-text class="text-h5 text-grey">Your cart is empty</v-card-text>
		  </v-card>
		</v-col>
	  </v-row>
  
	  <!-- Список товаров в корзине -->
	  <v-row v-else>
		<v-col v-for="item in cartItems" :key="item.id" cols="12" md="6">
		  <v-card class="pa-4 elevation-2 rounded mb-4">
			<v-img :src="item.products.category.image_url" class="mb-3 rounded" cover height="250"></v-img>
			<v-card-title class="text-h6 font-weight-bold">{{ item.products.name }}</v-card-title>
			<v-card-subtitle class="text-body-2 text-grey">Price: {{ item.products.price }} ₽</v-card-subtitle>
			<v-card-text>
			  Quantity: {{ item.count }}
			</v-card-text>
			<v-card-actions>
			  <v-btn 
				class="mx-1"
				prepend-icon="mdi-minus"
				color="red"
				@click="decreaseQuantity(item)"
			  >
				Decrease
			  </v-btn>
			  <v-btn 
				class="mx-1"
				prepend-icon="mdi-plus"
				color="green"
				@click="increaseQuantity(item)"
			  >
				Increase
			  </v-btn>
			  <v-btn 
				class="mx-1"
				prepend-icon="mdi-delete"
				color="error"
				@click="removeFromCart(item)"
			  >
				Remove
			  </v-btn>
			</v-card-actions>
		  </v-card>
		</v-col>
	  </v-row>
  
	  <!-- Итоговая информация -->
	  <v-row v-if="cartItems.length > 0">
		<v-col>
		  <v-card class="pa-4 elevation-3 rounded">
			<v-card-title class="text-h5 font-weight-bold">Total: {{ totalPrice }} ₽</v-card-title>
			<v-card-actions>
			  <v-btn color="blue" large @click="checkout">Proceed to Checkout</v-btn>
			</v-card-actions>
		  </v-card>
		</v-col>
	  </v-row>
	</v-container>
  </template>
  
  <script>
  import axios from 'axios';
import apiClient from '../../axiosClient';
  export default {
	data() {
	  return {
		cartItems: [],
	  };
	},

	async mounted(){
		const token = localStorage.getItem('access')
		try {
			const response = await apiClient.get('/basket',{
          		headers : `Authorization: Bearer ${token}`
        	})
			console.log(response.data);
			this.cartItems = response.data
		} catch (error) {
			console.log(error);
		}
		try{
			const response = await apiClient.get('basket/count',{
          		headers : `Authorization: Bearer ${token}`
        	})
			console.log(response.data);
			
		}
		catch(error){

		}

		
	},
	computed: {
	  totalPrice() {
		let sum = 0
		this.cartItems.forEach((elem)=>{
			sum = elem.count*elem.products.price + sum
		})
		return sum
	  },
	},
	methods: {
	  async decreaseQuantity(item) {
		const token = localStorage.getItem('access')
		console.log(item);
		
		if (item.count > 1) {
		  item.count -= 1;
		} else {
		  this.removeFromCart(item);
		}
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
	  removeFromCart(item) {
		this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
	  },
	  checkout() {
		console.log('Proceeding to checkout with items:', this.cartItems);
		// Logic for checkout
	  },
	},
	created() {
	  // Fetch or initialize cart items here
	//   this.cartItems = JSON.parse(localStorage.getItem('cart')) || [];
	},
	// watch: {
	//   cartItems: {
	// 	handler(newValue) {
	// 	//   localStorage.setItem('cart', JSON.stringify(newValue));
	// 	},
	// 	deep: true,
	//   },
	// },
  };
  </script>
  
  <style scoped>
  .text-h4 {
	font-family: 'Roboto', sans-serif;
	font-weight: 700;
  }
  </style>
  