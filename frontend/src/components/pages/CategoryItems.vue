<template>
	<v-container class="d-flex flex-column flex-md-row pa-4 h-100 w-fill">
	  <!-- Левая колонка: Список товаров категории -->
	  <v-row class="w-100">
		<v-col cols="12" md="8" class="mb-4 mb-md-0">
		  <v-card class="pa-4 elevation-3 rounded">
			<h3 class="text-h5 font-weight-bold mb-3">
			  {{ currentCategory }}
			</h3>
			<v-img
			  :src="products[0]?.category.image_url"
			  class="mb-3 rounded shadow"
			  height="60vh"
			  style="object-fit: cover;"
			></v-img>
			<h3 class="text-h5 font-weight-bold mb-3 text-primary">
			  Products in {{ currentCategory }}
			</h3>
  
			<ProductCards :products="products" />
		  </v-card>
		</v-col>
  
		<!-- Правая колонка: Список других категорий -->
		<v-col cols="12" md="4">
		  <v-card class="pa-2 elevation-2 rounded">
			<h3 class="text-h5 text-center mb-3 text-secondary">
			  Other Categories
			</h3>
			<v-row
			  dense
			  class="scrollable-list"
			  style="max-height: calc(100vh - 150px); overflow-y: auto;"
			>
			  <v-col
				v-for="category in otherCategories"
				:key="category.id"
				cols="6"
				class="mb-4"
			  >
				<v-list-item @click="goToCategory(category)" class="rounded cursor-pointer">
				  <v-img
					:src="category.image_url"
					class="mb-2 rounded"
					height="150"
					contain
				  ></v-img>
				  <v-list-item-content class="text-center">
					<v-list-item-title class="text-body-1 font-weight-bold">
					  {{ category.category }}
					</v-list-item-title>
				  </v-list-item-content>
				</v-list-item>
			  </v-col>
			</v-row>
		  </v-card>
		</v-col>
	  </v-row>
	</v-container>
  </template>
  
  
  <script>
  	import eventBus from '../../eventBus';
	import axios from 'axios'
	import ProductCards from '../UIUX/ProductCards.vue';
  export default {
	data(){
		return {
			products : '',
			currentCategory : '',
			otherCategories : ''
		}
	},
	components : {
		ProductCards
	},
	methods: {
		// goToProduct(product) {
		// 	this.$router.push(`/product/${product.slug}`)
		// 	window.scrollTo({
		// 		top: 0,
		// 		behavior: 'smooth', // Добавляет анимацию при прокрутке
		// 	});
		// },
		goToCategory(category) {
			this.$router.push(`/products/category/${category.short_name}`);
			window.scrollTo({
				top: 0,
				behavior: 'smooth', // Добавляет анимацию при прокрутке
			});
		}
	},
	async mounted(){
		try {
			const slug = this.$route.params.short_name
			const response = await axios.get(`/api/products/category/${slug}`)
			console.log(response.data[0].category.category);
			
			this.currentCategory = response.data[0].category.category
			this.products = response.data
			let otherCategories = await axios.get('/api/products/all_categories')
			this.otherCategories = otherCategories.data.filter((el) => el.id !== response.data[0].category.id);
		} catch (error) {
			console.log(error);
			eventBus.emit('show-modal', "Category is unreacheble");
			// this.$router.push('/')
		}



	}
  };
  </script>
  
  <style scoped>
  .scrollable-list {
	overflow-y: auto;
  }
  .cursor-pointer {
	cursor: pointer;
  }
  .text-h5{
  font-family: 'Sarpanch', sans-serif;
}  

  </style>
  