import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { mdi } from 'vuetify/iconsets/mdi-svg';
export default createVuetify({
  
  icons: {
    defaultSet: 'mdi', 
    sets: { mdi }, 
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {},
      },
    },
  },
  typography: {
    font: {
      family: 'Sarpanch, sans-serif',
    },
  },
});