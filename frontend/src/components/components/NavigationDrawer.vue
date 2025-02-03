<template>
	<v-navigation-drawer
        image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
        theme="dark"
        v-model="drawer"
        :rail="rail"
        style="cursor: pointer"
        v-if="isAuth && openLeft"
        class="h-100"
        permanent
      >
      <v-tooltip :text="email" >
        <template v-slot:activator="{ props }">
          <v-list-item
            :prepend-avatar="image_url"
            :title="email"
            width="100"
            v-bind="props"
			@click="this.$router.push('/profile')"
          >
            <!-- <template v-slot:append>
              <v-btn 
                icon="mdi-chevron-left"
                variant="text"
                color="pink"
                @click.stop="rail = !rail"
              ></v-btn>
            </template> -->
          </v-list-item>
        </template>
      </v-tooltip>
	<v-divider></v-divider>
	<v-list density="compact" nav>
		<!-- <v-tooltip text="My Account">
		<template v-slot:activator="{ props }">
			<v-list-item prepend-icon="mdi-account" title="My Account" value="account" v-bind="props" @click="this.$router.push('/profile')"></v-list-item>
		</template>
		</v-tooltip> -->

		<v-tooltip text="Favorite">
			<template v-slot:activator="{ props }">
			<v-list-item prepend-icon="mdi-heart" title="Favorite" value="Favorite" v-bind="props" @click="goToFavorite"></v-list-item>
		</template>
		</v-tooltip>

		<v-tooltip text="Basket">
		<template v-slot:activator="{ props }">
			<v-list-item prepend-icon="mdi-cart" title="Basket" value="Basket" v-bind="props" @click="goToBasket"></v-list-item>
		</template>
		</v-tooltip>

		<v-tooltip text="Logout">
		<template v-slot:activator="{ props }">
			<v-list-item prepend-icon="mdi-logout" title="Logout" value="Logout" v-bind="props" @click="openLogoutDialog = true"></v-list-item>
		</template>
		</v-tooltip>

		<v-tooltip text="Control panel" v-if="isAdmin">
		<template v-slot:activator="{ props }">
			<v-list-item prepend-icon="mdi-account" title="My Account" v-bind="props" value="account" @click="goToControl"></v-list-item>
		</template>
		</v-tooltip>


	</v-list>
	</v-navigation-drawer>
	<LogoutModal
		:openLogoutModal="openLogoutDialog"
		@update:openLogoutModal="openLogoutDialog = $event"
		@closeLeftPanel="closeLeftPanel"
	/>
</template>


<script>

import { mdiStarMinus } from '@mdi/js';
import LogoutModal from './LogoutModal.vue';

export default {
	data(){
		return {
			openLeft: true,
			drawer: true,
			rail: true,
			openLogoutDialog: false,
		}
	},
	props : {
		isAuth : {
			type : Boolean
		},
		email : {
			type:String
		},
		image_url : {
			type:String
		},
		// isAdmin : {
		// 	default : false,
		// 	type : Boolean
		// }
	},
	mounted(){
		try {
			// this.email =  JSON.parse(localStorage.getItem('user')).email
			// this.image_url =  JSON.parse(localStorage.getItem('user')).image_url
		} catch (error) {
			
		}

	},
	components : {
		LogoutModal
	},

	computed : {
		isAdmin(){
			if (JSON.parse(localStorage.getItem('user')).role === 'admin') {
				return true
			} else {
				false
			}
		}
	},
	methods : {
		closeLeftPanel(){
			this.openLogoutDialog = false
			this.openLeft = false
			this.$router.push('/')
		},
		goToFavorite(){
			this.$router.push('/favorite')
			window.scrollTo({
				top: 0,
				behavior: 'smooth', // Добавляет анимацию при прокрутке
			});
			
		},
		goToBasket(){
			this.$router.push('/basket')
			window.scrollTo({
				top: 0,
				behavior: 'smooth', // Добавляет анимацию при прокрутке
			});
		},
		goToControl(){
			this.$router.push('/admin')
			window.scrollTo({
				top: 0,
				behavior: 'smooth', // Добавляет анимацию при прокрутке
			});
		}

	}
}

</script>