import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Подключение стилей Vuetify
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { router } from './router';
import './assets/font.css';

// import { mdiSvg } from 'vuetify/lib/iconsets/mdi-svg.mjs';

const vuetify = createVuetify({
    components,
    directives,
  });

const app = createApp(App);
app.use(vuetify);
app.use(router)
app.mount('#app');
