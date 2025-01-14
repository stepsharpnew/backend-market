<template>
<v-container @click.self="closeCategory">
    <v-row 
        align="center"
        width="fill"
        justify="space-between"
        class="d-flex flex-fill ga-2 dlex-wrap width-100" 
    > 
        <v-sheet >
            <v-btn
                    class="mx-4 pa-2"
                    append-icon="mdi-chevron-right"
                    color="grey "
                    text="Catalog"
                    variant="outlined"
                    @click="openCategory=true"
                >
            </v-btn>
        </v-sheet>
        <v-card-text>
            <v-text-field
                class="my-2"
                :loading="loading"
                append-inner-icon="mdi-magnify"
                density="compact"
                label="Search..."
                variant="solo"
                hide-details
                single-line
                block
                @click:append-inner="onClick"
            ></v-text-field>
        </v-card-text>
        <v-spacer></v-spacer>
        <v-sheet>
            <v-btn
                    class="mx-4 my-2 pa-2"
                    append-icon="mdi-chevron-right"
                    color="red-lighten-2"
                    text="Sign In"
                    @click="this.$router.push('/login')"
                    variant="outlined"
                   
                >
            </v-btn>
        </v-sheet>
        <v-sheet>
            <v-btn
                    class="mx-4 my-2 pa-2"
                    append-icon="mdi-chevron-right"
                    color="red-lighten-2"
                    text="Sign Up"
                    @click="this.$router.push('/reg')"
                    variant="outlined"
                    
                >
            </v-btn>
        </v-sheet>  
    </v-row>

    <v-navigation-drawer
        v-model="openCategory"
        app
        temporary
        left
        width="420"
        class="mx-auto"
      >
      <v-card
            class="mx-auto"
            max-width="400"
        >
            <v-container class="d-flex justify-start my-6">
                <v-row
                    align="center"
                    justify="space-between"
                >
                    <v-col
                    cols="auto"
                    >
                        <p class="text-center">Categories</p>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col>
                        <v-btn
                                class="mr-2"
                                append-icon="mdi-chevron-left"
                                color="red-lighten-2"
                                text="Close"
                                variant="outlined"
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
        try {
            const response = await axios.get('/api/products/all_categories');
            this.categories = response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
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
