<template>
    <v-container class="h-screen">
        <v-row style="height: 80vh;">
            <v-col cols="12">
                <v-card class="d-flex ma-auto">
                    <v-card
                    class="ma-3"
                    >
                        <v-img
                            src="https://cdn.vuetifyjs.com/images/cards/dark-beach.jpg"
                            cover
                            class="rounded-circle ma-3"
                            width="250"
                            height="250"
                        >
                        </v-img>
                        <v-file-input
                            class="ma-3 rounded-3"
                            :rules="rules"
                            accept="image/png, image/jpeg, image/bmp"
                            label="Avatar"
                            placeholder="Pick an avatar"
                            prepend-icon="mdi-camera"
                            variant="outlined"
                        >
                        </v-file-input>
                        <v-btn
                                class="mx-4 mb-4 pa-3 width-50 float-right"
                                append-icon="mdi-chevron-right"
                                color="red-lighten-2"
                                text="Загрузить"
                                variant="outlined"
                                @click="closeCategory"
                            >
                        </v-btn>
                    </v-card>
                    <v-spacer></v-spacer>
                        <v-card-title align-start>
                            shalkin02@inbox.ru
                        </v-card-title>
                    
                    <div class="d-inline-flex ma-2">
                        <v-btn
                            class="ma-2"
                            color="medium-emphasis"
                            icon="mdi-heart"
                            size="small"
                        ></v-btn>

                        <v-btn
                            class="ma-2"
                            color="medium-emphasis"
                            icon="mdi-bookmark"
                            size="small"
                        ></v-btn>

                        <v-btn
                            class="ma-2"
                            color="medium-emphasis"
                            icon="mdi-share-variant"
                            size="small"
                        ></v-btn>
                    </div>
                    <v-card>
                        asd
                    </v-card>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
export default {
    data(){
        return {
            email : '',
            role : '',
            description : '',
            rules: [
                value => {
                return !value || !value.length || value[0].size < 2000000 || 'Avatar size should be less than 2 MB!'
                },
            ],

        }
    }
}
</script>
<style>
    
</style>