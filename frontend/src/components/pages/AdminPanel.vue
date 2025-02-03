<template>
	<v-container class="d-flex flex-column pa-5 h-100" fluid>

	  <NavigationDrawer :isAuth="isAuth" :email="email" :image_url="image_url" />
	   
	  <v-row>
		<v-col cols="12" md="7">
			<v-row class="my-8">
				<!-- Заголовок -->
				<h1 class="text-h4 font-weight-bold text-center">Items Manage</h1>
			</v-row>

			<!-- Блок с кнопками -->
			<v-row class="mb-6 justify-center">
				<v-btn
				color="primary"
				class="me-4"
				@click="openCreateProductModal"
				>
				Created item
				</v-btn>
				<v-btn
				color="primary"
				class="me-4"
				@click="openCreateCategoryModal"
				>
				Created category
				</v-btn>
			</v-row>
			  <!-- Модалка для создания товара -->
			  <v-dialog v-model="isProductModalOpen" max-width="600px">
				<v-card>
					<v-card-title>Create Item</v-card-title>
					<v-card-text>
						<v-form>
							<v-text-field
								label="Название товара"
								v-model="newProduct.name"
								required
							/>
							<v-file-input
								label="Добавить фото"
								v-model="newProduct.image"
								accept="image/*"
								required
								@change="previewImage('product')"
							/>
							<!-- Предварительный просмотр изображения товара -->
							<v-img
								v-if="newProduct.preview"
								:src="newProduct.preview"
								class="my-4"
								max-height="200"
								contain
							/>
							<v-textarea
								label="Описание товара"
								v-model="newProduct.description"
								rows="3"
							/>
							<v-text-field
								label="Цена товара"
								v-model="newProduct.price"
								type="number"
								required
							/>
							<v-select
								v-model="selectedCategory"
								:items="categories"
								label="Выберите категорию"
								item-text="name" 
								item-value="id"
								return-object
								required
							></v-select>
						</v-form>
						</v-card-text>
						<v-card-actions>
							<v-btn color="primary" @click="AddProduct">Создать</v-btn>
							<v-btn text @click="closeProductModal">Отмена </v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>

				<!-- Модалка для создания категории -->
				<v-dialog v-model="isCategoryModalOpen" max-width="400px">
				<v-card>
					<v-card-title>Создать категорию</v-card-title>
					<v-card-text>
					<v-form>
						<v-text-field
							label="Название категории"
							v-model="newCategory.name"
							required
						/>
						<v-file-input
							label="Добавить фото"
							v-model="newCategory.image"
							accept="image/*"
							required
							@change="previewImage('category')"
						/>
						<!-- Предварительный просмотр изображения категории -->
						<v-img
							v-if="newCategory.preview"
							:src="newCategory.preview"
							class="my-4"
							max-height="200"
							contain
						/>
					</v-form>
					</v-card-text>
					<v-card-actions>
						<v-btn color="primary" @click="AddCategory">Создать</v-btn>
						<v-btn text @click="closeCategoryModal">Отмена</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-col>
		<v-col cols="12" md="5">
		<h2 class="text-h6 font-weight-bold mb-4 text-center">Users Manage</h2>
			<v-row>
				<v-col
				v-for="user in allUsers"
				:key="user.id"
				cols="12"
				class="mb-3"
				>
				<v-card class="pa-4 elevation-2 rounded d-flex align-center">
					<!-- Фото пользователя -->
					<v-img
					:src="user.image_url"
					alt="User photo"
					class="rounded-circle me-4"
					width="80"
					height="80"
					></v-img>

					<!-- Информация о пользователе -->
					<v-card-text class="flex-grow-1">
					<h3 class="text-h6 font-weight-bold mb-2">
						{{ user.email }}
					</h3>
					<p class="text-body-2">
						Subscription: 
						<span :class="user.telegram ? 'text-success' : 'text-error'">
						{{ user.telegram ? 'Enable' : 'Disable' }}
						</span>
					</p>
					</v-card-text>

					<!-- Кнопка для бана -->
					<v-btn
					color="error"
					text
					@click="delete(user.id)"
					>
					delete
					</v-btn>
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

  export default {
	data() {
	  return {
		categories: [], // Здесь хранятся категории из БД
		selectedCategory: null,
		isAuth : false,
		email : '',
		image_url : '',
		allUsers : [],
		isProductModalOpen: false,
		isCategoryModalOpen: false,
		newProduct: {
			name: "",
			image: null,
			preview: null, // Для превью изображения
			description: "",
			price: null,
			category : ''
		},
		newCategory: {
			name: "",
			image: null,
			preview: null, // Для превью изображения
		},
	  };
	},
	components : {
		NavigationDrawer,

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
		this.fetchCategories()
	},


	computed: {
	},
	methods: {
		async fetchData(token){
			try {
				await apiClient.get('/user/me',{
					headers : `Authorization: Bearer ${token}`
				})
			} catch (error) {
				console.log(error);
			}
			try {
				const allUsers = await apiClient.get('/user/get_all',{
					headers : `Authorization: Bearer ${token}`
				})
				this.allUsers = allUsers.data
				console.log(allUsers);
			} catch (error) {
				console.log(error);
				
			}
		},
		openCreateProductModal() {
			this.isProductModalOpen = true;
		},
		closeProductModal() {
			this.isProductModalOpen = false;
		},
		openCreateCategoryModal() {
			this.isCategoryModalOpen = true;
		},
		closeCategoryModal() {
			this.isCategoryModalOpen = false;
		},
		previewImage(type) {
			const file = type === "product" ? this.newProduct.image : this.newCategory.image;
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
				if (type === "product") {
					this.newProduct.preview = e.target.result;
				} else {
					this.newCategory.preview = e.target.result;
				}
				};
				reader.readAsDataURL(file);
			}
		},
		resetProductForm() {
			this.newProduct = {
				name: "",
				image: null,
				preview: null,
				description: "",
				price: null,
			};
		},
		resetCategoryForm() {
			this.newCategory = {
				name: "",
				image: null,
				preview: null,
			};
		},

		async AddProductPhoto(slug,token){
			try {
				const formData = new FormData();
				formData.append('file', this.newProduct.image);
				const response = await apiClient.post(`/products/addphoto/${slug}`, 
						formData,
						{
							headers: {
								'Content-Type': 'multipart/form-data',
								Authorization: `Bearer ${token}`
							}
						}
					)
				console.log(response);	
			} catch (error) {
				console.log(error);
				if (error.response.data.statusCode == 422) {
					eventBus.emit('show-modal', "Product already exist");
				}
				eventBus.emit('show-modal', "Failed created");
			}	
		},


		async AddProduct(){
			const token = localStorage.getItem('access')
			try {
				const response = await apiClient.post('/products/create', 
				{
					name : this.newProduct.name,
					price : this.newProduct.price,
					description : this.newProduct.description,
					category : this.selectedCategory,
				}, 
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			)
			if (response.data) {
				this.AddProductPhoto(response.data.slug, token)
				this.closeProductModal()
				}
			} catch (error) {
				if (error.response.data.statusCode == 422) {
					eventBus.emit('show-modal', "Product already exist");
					return
				}
				eventBus.emit('show-modal', "Failed created");
				console.log(error);
				
			}
			
			
		},

		async AddCategory(){
			const token = localStorage.getItem('access')
			try {
				const response = await apiClient.post('/products/category', 
				{
					image_url : 'https://storage.yandexcloud.net/step2002sharp/telefony.jpg',
					category : this.newCategory.name,
				}, 
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			)
			console.log(response.data);
			if (response.data) {
				this.closeCategoryModal()
				}
			} catch (error) {
				console.log(error);
				
				if (error.response.data.statusCode == 400) {
					eventBus.emit('show-modal', "Category already exist");
					return
				}
				eventBus.emit('show-modal', "Failed created");
				console.log(error);
				
			}
			
			
		},


		async fetchCategories() {
			try {
				const response = await axios.get("/api/products/all_categories"); // URL вашего API
				this.categories = response.data.map((categ)=>categ.category); // Предполагается, что API возвращает массив объектов
			} catch (error) {
				console.error("Ошибка при загрузке категорий:", error);
			}
		},
	},

	created(){
		this.email =  JSON.parse(localStorage.getItem('user')).email
		this.image_url =  JSON.parse(localStorage.getItem('user')).image_url
		this.isAuth = true
	},
  };
  </script>
  
  <style scoped>
  .text-h4 {
	font-family: 'Sarpanch', sans-serif;
	font-weight: 700;
  	}

  .text-success {
	color: green;
	}

	.text-error {
	color: red;
	}
  </style>
  