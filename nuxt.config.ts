import { defineNuxtConfig } from 'nuxt3'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  buildModules: ['@pinia/nuxt'],

  css: ['@/assets/scss/main.scss'],

  // modules: [
  //   // Simple usage
  //   'cookie-universal-nuxt',

  //   // With options
  //   // ['cookie-universal-nuxt', { alias: 'cookiz' }],
  // ],
})
