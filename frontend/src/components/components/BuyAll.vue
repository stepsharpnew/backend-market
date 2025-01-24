<template>
	<div class="text-center">
	  <v-btn-group
		color="green"
		density="comfortable"
		rounded="pill"
		divided
	  >
		<v-btn
		  class="-2"
		  prepend-icon="mdi-cash"
		  variant="flat"
		>
		  <div class="text-none font-weight-regular">
			Buy 
		  </div>
		  <v-dialog activator="parent" max-width="500">
			<template v-slot:default="{ isActive }">
			  <v-card rounded="lg">
				<v-card-title class="d-flex justify-space-between align-center">
				  <div class="text-h5 text-medium-emphasis ps-2">
					Buy {{  totalCount }} item
				  </div>
  
				  <v-btn
					icon="mdi-close"
					variant="text"
					@click="isActive.value = false"
				  ></v-btn>
				</v-card-title>
  
				<v-divider class="mb-4"></v-divider>
  
				<v-card-text >
				  <div class="text-medium-emphasis mb-4">
					By purchasing a product on our site, you accept the user agreement
				  </div>
				  <v-card elevation="24" v-for="product in products" class="my-5">
						<v-card-title>{{ product.products.name }}</v-card-title>
						<v-card-text>Quantity 
							<v-chip
								class="mr-2"
								large
								color="blue lighten-3"
								
							>
								{{ product.count }}
							</v-chip> 
						</v-card-text>
						<img :src="product.products.category.image_url" class="w-100" height="auto" >
						<div 
							class="mb-2" 
						>
							{{product.price}}

						</div>
						<div class="text-subtitle-1 d-flex align-center justify-space-between pb-3 pl-3">
							<!-- Старая цена -->
							 <div>
								<v-chip 
									class="mr-2" 
									outlined 
									small
									color="grey lighten-2"
								>
									<span class="text-decoration-line-through grey--text">{{ product.products.price }} ₽</span>
								</v-chip>


								<v-chip 
									small 
									color="red lighten-3"
									dark
								>
									-{{ product.products.sale }}%
								</v-chip>
							 </div>

							 <v-chip 
								class="mr-2"
								large
								color="orange lighten-1"
								dark
							>
								<p class="text-large">{{ (product.products.price - product.products.price * product.products.sale / 100).toFixed(2) }} ₽</p>
							</v-chip>
							<!-- Процент скидки -->

							</div>
				  </v-card>
				  <div class="text-overline mb-2"></div>
  
				  <div class="text-medium-emphasis mb-1">
					Warranty for purchased goods is 2 months, we value our customers
				  </div>
  
				  <!-- <v-btn
					class="text-none font-weight-bold ms-n4"
					color="primary"
					text="Retry Premium Free"
					variant="text"
				  ></v-btn> -->
				</v-card-text>
  
				<v-divider class="mt-2"></v-divider>
  
				<v-card-actions class="my-2 d-flex justify-space-between w-100">
					<v-chip  
						color="red lighten-3"
						dark
					>
					<p class="text-large">{{ totalPrice}} ₽</p>
					</v-chip>
					<div>
						<v-btn
							class="text-none"
							rounded="xl"
							text="Cancel"
							@click="isActive.value = false"
						></v-btn>
		
						<v-btn
							class="text-none"
							color="green"
							rounded="xl"
							text="Buy"
							variant="flat"
							@click="Buy(isActive)"
						></v-btn>
					</div>
				  
				</v-card-actions>
			  </v-card>
			</template>
		  </v-dialog>
		</v-btn>
  
		<v-btn
			class="ma-0"
			size="small"
			icon
		>
		  <v-icon icon="mdi-menu-down"></v-icon>
  
		  <v-menu
			activator="parent"
			location="bottom end"
			transition="fade-transition"
		  >
			<v-list
			  density="compact"
			  min-width="250"
			  rounded="lg"
			  slim
			>
			  <v-list-item
				prepend-icon="mdi-link"
				title="Copy link"
				link
				@click="Copy"
			  ></v-list-item>
  
			  <v-divider class="my-2"></v-divider>
  
			  <v-list-item min-height="24">
				<template v-slot:subtitle>
				  <div class="text-caption">
					Shared you buy in networks
				  </div>
				</template>
			  </v-list-item>
			</v-list>
		  </v-menu>
		</v-btn>
	  </v-btn-group>
	</div>
  </template>


<script>
import eventBus from '../../eventBus';
	export default {
		data(){
			return {

			}
		},
		props : {
			products : {
				type : Array
			}
		},
		mounted(){
			console.log(this.products);
			
		},
		methods : {
			async Buy(isActive){
				isActive.value = false
				eventBus.emit('show-modal', "Successfuly, enjoy a new products");
			},
			Copy(){
				try {
					const url = `${window.location.origin}/products/category/${this.products[0].products.category.short_name}`;
					console.log(url);
					navigator.clipboard
					.writeText(url)
					eventBus.emit('show-modal', "Copied");
					
				} catch (error) {
					console.log(error);
					
				}
			}
		},
		computed : {
			totalPrice() {
				let sum = 0
				this.products.forEach((elem)=>{

					
					if (elem.products.saleBool) {
						sum += elem.count*(elem.products.price - elem.products.price*elem.products.sale/100)
					}
					else{
						sum += elem.count*elem.products.price + sum
					}
					console.log(sum);
				})
				return sum.toFixed(2)
			},
			totalCount(){
				let count = 0
				this.products.forEach((elem)=>{
					count += elem.count
					console.log(count);
				})
				return count
			}
		}


	} 

</script>