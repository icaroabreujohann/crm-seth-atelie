/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light', // Defina o tema padrão para 'light' ou 'dark'
    themes: {
      light: {
        // Personalizando a cor de 'surface' no tema claro
        colors: {
          background: '#ffffffff',
          surface: '#ffffffff',
          main: '#471A3C'
        },
      },
      dark: {
        // Personalizando a cor de 'surface' no tema escuro
        colors: {
          surface: '#161616', // Cor para 'surface' no tema escuro
        },
      },
    },
  },
})
