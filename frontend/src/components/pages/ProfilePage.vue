<template>
    <v-container class="h-screen d-flex align-center justify-center">
      <v-card elevation="10" max-width="700" class="pa-5" round>
        <v-row justify="center" align="center">
          <!-- Контейнер для почты и фото -->
          <v-col
            cols="12" sm="10" md="6" lg="6"
            class="d-flex flex-column flex-md-row align-start justify-center"
          >
            <v-img
              :src="photoPreview || image_url || 'https://cdn.vuetifyjs.com/images/cards/dark-beach.jpg'"
              cover
              width="100%"
              class="elevation-5 ma-3"
              max-width="400"
              max-height="500"
            ></v-img>
            <div class="d-flex flex-column fill-height">
              <v-card-title class="text-h6 font-weight-bold">{{ email }}</v-card-title>
              <v-file-input
                class="ma-2 rounded-3"
                :rules="rules"
                accept="image/png, image/jpeg, image/bmp"
                label="Select photo"
                placeholder="Click to select file"
                prepend-icon="mdi-camera"
                variant="outlined"
                dense
                v-model="photo"
                @change="previewPhoto"
              ></v-file-input>
              <!-- <v-btn
                class="text-none font-weight-regular pa-2"
                append-icon="mdi-upload"
                color="primary"
                elevation="2"
                rounded
                :disabled="!photo"
                @click="uploadPhoto"
              >
                Загрузить
              </v-btn> -->

              <v-btn
                class="text-none font-weight-regular pa-2  btn-equal-width"
                prepend-icon="mdi-lock-reset"
                color="primary"
                elevation="2"                
                text="Upload Photo"
                :disabled="!photo"
                @click="uploadPhoto"
                rounded
              ></v-btn>
                <div class="py-4 text-center align-start d-flex">
                  <v-dialog
                    v-model="dialog"
                  >
                    <template v-slot:activator="{ props: activatorProps }">
                      <v-btn
                        color="warning"
                        align-start
                        class="text-none font-weight-regular pa-2 btn-equal-width"
                        prepend-icon="mdi-lock-reset"
                        text="Change Password"
                        rounded
                        v-bind="activatorProps"
                      ></v-btn>
                    </template>

                    <v-card
                      prepend-icon="mdi-lock-reset"
                      title="Password Changing"
                      class="w-25 ma-auto"
                    >
                      <v-card-text>
                        <v-row>
                          <v-col
                            cols="12"
                          >
                            <v-text-field
                              label="Current password*"
                              type="current_password"
                              v-model="old_password"
                              required
                            ></v-text-field>
                          </v-col>

                          <v-col
                            cols="12"
                          >
                            <v-text-field
                              label="Password*"
                              type="password"
                              v-model="new_password"
                              required
                            ></v-text-field>
                          </v-col>

                          <v-col
                            cols="12"
                          >
                            <v-text-field
                              label="Confirm Password*"
                              type="password"
                              v-model="confirm_password"
                              required
                            ></v-text-field>
                          </v-col>
                        </v-row>

                      </v-card-text>
                      <v-card-actions>

                        <v-btn
                          text="Close"
                          variant="plain"
                          @click="dialog = false"
                        ></v-btn>

                        <v-btn
                          color="primary"
                          text="Change"
                          variant="tonal"
                          @click="changePassword"
                        ></v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>                  
                </div>
                <v-spacer></v-spacer>
                <div class="d-flex flex-column align-end">
                  <v-btn
                    color="red"
                    text="Logout"
                    variant="tonal"
                    @click="Logout"
                  ></v-btn>
                </div>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </template>
<script>
import eventBus from '../../eventBus';
import apiClient from '../../axiosClient';

export default {
    data() {
        return {
            email: '',
            image_url: '',
            photo: null,
            photoPreview: null, // Предварительный просмотр изображения
            rules: [
                value => {
                    // return !value || value.size < 2000000 || 'Размер аватара должен быть меньше 2 MB!';
                },
            ],
            width : '100%',
            dialog : false,
            old_password : '',
            new_password : '',
            confirm_password : ''
        };
    },
    methods: {
        previewPhoto() {
            if (this.photo) {
                this.photoPreview = URL.createObjectURL(this.photo);
                console.log('Предварительный просмотр:', this.photoPreview); // Отладочный лог
            }
        },
        Logout(){
          localStorage.removeItem('access')
          localStorage.removeItem('refresh')
          localStorage.removeItem('user')
          this.$router.push('/')
        },

        async fetchPhoto(){
            try {
            const token = localStorage.getItem('access');
            const user = (await apiClient.get('/user/me', {
                headers: { Authorization: `Bearer ${token}` },
            })).data;
            this.email = user.email;
            this.image_url = user.image_url;
            localStorage.removeItem('user')
            localStorage.setItem('user', JSON.stringify(user))
            console.log(user);
            } catch (error) {
                if (error.response.data.statusCode == 401) {
                    eventBus.emit('show-modal', 'Your credentials is outdated');
                }
            }
        },

        async uploadPhoto() {
            if (!this.photo) {
                console.warn('Нет выбранного файла для загрузки.');
                return;
            }

            console.log(this.photo); // Лог выбранного файла

            const formData = new FormData();
            formData.append('file', this.photo);

            console.log('Форма данных:', formData); // Лог для отладки

            try {
                const token = localStorage.getItem('access');
                if (!token) {
                    eventBus.emit('show-modal', 'Try sign in again');
                    return;
                }

                const response = await apiClient.post('/user/addphoto', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log('Ответ сервера:', response); // Лог успешного ответа
                eventBus.emit('show-modal', 'Success Photo');
            } catch (error) {
                if (error.response.data.statusCode == 401) {
                    eventBus.emit('show-modal', 'Session ended, login again');
                }
                console.error('Ошибка загрузки фото:', error);

            }
        },

        async changePassword(){
          const token = localStorage.getItem('access');
          try {
            const response = await apiClient.post('/auth/change_pass',{
              old_password  : this.old_password,
              new_password : this.new_password,
              confirm_password : this.confirm_password
            },{
              headers: 
                {
                  Authorization: `Bearer ${token}`,
                },
            })
            eventBus.emit('show-modal', 'Password changed is successfull');
            this.dialog = false
            console.log(response.data);
          } catch (error) {
            console.log(error.response.data.message);
            if (Array.isArray(error.response.data.message)) {
              eventBus.emit('show-modal', error.response.data.message[0]); 
              return
            }
            if (error.response.data.message) {
              eventBus.emit('show-modal', error.response.data.message);
              return
            }else{
              eventBus.emit('show-modal', 'Error in Sign in');
              return
            }
          }
          
          
        }
    },
    async mounted() {
        // let user;
        // user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('access');
        console.log(token);
        
        try {
            if (!token) {
                alert('Mistake');
            }
            this.fetchPhoto()

        } catch (error) {
            console.log(error);
        }

    },
};
</script>

<style scoped>
.text-h6{
  font-family: 'Sarpanch', sans-serif;
  font-size:1.5rem;
}  
.v-card {
  width: 100%;
  padding: 20px;
}
.button-container {
  display: flex;
  gap: 16px; /* Расстояние между кнопками */
}
.btn-equal {
  flex: 1; /* Одинаковая ширина для всех кнопок */
  min-width: 150px; /* Минимальная ширина для кнопок */
  text-align: center; /* Центрирование текста внутри кнопки */
}

</style>