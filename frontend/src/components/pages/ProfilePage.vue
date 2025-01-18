<template>
  <v-container
    class="h-screen d-flex container align-center justify-center"
    fluid
    style="margin: 0; padding: 0; background-image: url('https://storage.yandexcloud.net/alishlo.com/contact-form-background.jpg'); background-size: cover; background-position: center;"
  >
    <!-- Форма регистрации -->
    <v-col
      cols="12"
      md="6"
      sm="8"
      class="pa-5 d-flex flex-column justify-self-center"
    >
      <v-card elevation="10" class="pa-5" rounded :loading="isUpdating">
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
            :active="isActive"
            color="black-lighten-3"
            height="4"
            indeterminate
          ></v-progress-linear>
        </template>
        <div class="d-flex justify-space-between align-center">
          <v-card-title class="text-h5 font-weight-bold text-left">
            {{ email }}
          </v-card-title>
          <v-btn color="red" text class="mb-auto" @click="Logout">
            Logout
          </v-btn>
        </div>

        <v-img
          :src="photoPreview || image_url || 'https://cdn.vuetifyjs.com/images/cards/dark-beach.jpg'"
          cover
          class="elevation-5 mb-4 rounded"
          max-width="100%"
          height="400"
        ></v-img>

        <v-file-input
          class="ma-3 rounded-3"
          :rules="rules"
          accept="image/png, image/jpeg, image/bmp"
          label="Select photo"
          prepend-icon="mdi-camera"
          variant="outlined"
          dense
          v-model="photo"
          @change="previewPhoto"
        >
          <template v-slot:append>
            <v-btn
              class="ml-3"
              prepend-icon="mdi-upload"
              color="primary"
              elevation="2"
              rounded
              :disabled="!photo"
              @click="uploadPhoto"
            >
              Upload Photo
            </v-btn>
          </template>
        </v-file-input>

        <v-btn
          class="text-none font-weight-regular pa-2 mb-3"
          prepend-icon="mdi-lock-reset"
          color="warning"
          rounded
          @click="dialog = true"
        >
          Change Password
        </v-btn>

        <v-dialog v-model="dialog">
          <v-card class="mx-auto" width="350" >
            <v-card-title>Password Changing</v-card-title>
            <v-card-text>
              <v-text-field
                label="Current password*"
                type="password"
                v-model="old_password"
                required
              ></v-text-field>

              <v-text-field
                label="New password*"
                type="password"
                v-model="new_password"
                required
              ></v-text-field>

              <v-text-field
                label="Confirm password*"
                type="password"
                v-model="confirm_password"
                required
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="dialog = false">Close</v-btn>
              <v-btn color="primary" text @click="changePassword">Change</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-spacer></v-spacer>


      </v-card>
    </v-col>
  </v-container>
</template>

<style scoped>
/* Дополнительные отступы для мобильных устройств */
.pa-5 {
  padding: 16px !important;
}
</style>

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
            isUpdating: false,
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
          this.isUpdating = true
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
                this.isUpdating = false
                eventBus.emit('show-modal', 'Success upload photo');
            } catch (error) {
                if (error.response.data.statusCode == 401) {
                    eventBus.emit('show-modal', 'Session ended, login again');
                }
                eventBus.emit('show-modal', 'Error, try later');
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
.text-h5{
  font-family: 'Sarpanch', sans-serif;
}  
</style>

