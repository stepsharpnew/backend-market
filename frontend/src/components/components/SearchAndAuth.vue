<template>
<v-container @click.self="closeCategory">
    <v-row 
        align="center"
        width="fill"
        justify="space-beetween"
        class="d-flex flex-fill ga-2 dlex-wrap width-100" 
    >
        <v-sheet >
            <v-btn
                    class="mx-4 pa-2"
                    append-icon="mdi-chevron-right"
                    color="grey "
                    text="Каталог"
                    variant="outlined"
                    block
                    @click="openCategory=true"
                >
            </v-btn>
        </v-sheet>
        <v-card-text>
            <v-text-field
                class="ma-2"
                :loading="loading"
                append-inner-icon="mdi-magnify"
                density="compact"
                label="Search..."
                variant="solo"
                hide-details
                single-line
                @click:append-inner="onClick"
            ></v-text-field>
        </v-card-text>
        <v-spacer></v-spacer>
        <v-sheet >
            <v-btn
                    lass="mx-4 pa-2"
                    append-icon="mdi-chevron-right"
                    color="red-lighten-2"
                    text="Вход"
                    @click="this.$router.push('/login')"
                    variant="outlined"
                    block
                >
            </v-btn>
        </v-sheet>
        <v-sheet >
            <v-btn
                    class="mx-4 pa-2"
                    append-icon="mdi-chevron-right"
                    color="red-lighten-2"
                    text="Регистрация"
                    @click="this.$router.push('/reg')"
                    variant="outlined"
                    block
                >
            </v-btn>
        </v-sheet>
    </v-row>

    <v-navigation-drawer
        v-model="openCategory"
        app
        temporary
        left
        width="480"
      >
      <v-card
            class="mx-auto"
            max-width="460"
        >
            <v-container class="d-flex justify-start my-6">
                <v-row
                    align="center"
                    justify="space-beetween"
                >
                    <v-col
                    cols="auto"
                    >
                        <p class="text-center">Категории товаров</p>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col>
                        <v-btn
                                class="mr-4 pa-3"
                                append-icon="mdi-chevron-left"
                                color="red-lighten-2"
                                text="Закрыть"
                                variant="outlined"
                                block
                                @click="closeCategory"
                            >
                        </v-btn>
                    </v-col>

                </v-row>
            </v-container>



            <v-container fluid class="pa-3">
                <v-row>
                    <v-col
                    v-for="card in categories"
                    :key="card.category"
                    cols="12"
                    sm="6"
                    md="6"
                    lg="6"
                    >
                        <v-card>
                            <v-img
                            :src="card.image_url"
                            class="align-end cursor-pointer"
                            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                            height="150"
                            contain
                            @click="goToCategory(card.id)"
                            >
                            <v-card-title class="text-white" v-text="card.category"></v-card-title>
                            </v-img>
                            <v-card-actions>
                                <v-btn
                                    color="medium-emphasis"
                                    icon="mdi-heart"
                                    size="small"
                                ></v-btn>

                                <v-btn
                                    color="medium-emphasis"
                                    icon="mdi-bookmark"
                                    size="small"
                                ></v-btn>

                                <v-btn
                                    color="medium-emphasis"
                                    icon="mdi-share-variant"
                                    size="small"
                                ></v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
      </v-navigation-drawer>
</v-container>

</template>

<script>

import axios from 'axios';

export default {
    data(){
        return {
            loaded: false,
            loading: false,
            openCategory : false,
            categories: [],
        }
    },
    props : {
        rail : {
            type : Boolean
        }
    },

    methods : {
        onClick () {
        this.loading = true

        setTimeout(() => {
          this.loading = false
          this.loaded = true
        }, 2000)
      },
      goToCategory(index){

      },

      closeCategory(){
        this.openCategory=false

      }

    },
    async mounted(){
        const categories = await axios.get('/api/products/all_categories')
        console.log(categories);
        this.categories = categories.data
    }
}

</script>


<style>
    p{
        font-family:'Sarpanch', sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
    }
</style>
