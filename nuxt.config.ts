import { defineNuxtConfig } from 'nuxt3'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  buildModules: ['@pinia/nuxt'],

  css: ['@/assets/scss/main.scss'],

  publicRuntimeConfig: {
    BASE_URL: process.env.BASE_URL,

    API_BASE: process.env.API_BASE,
  },

  privateRuntimeConfig: {
    DB_URL: process.env.DB_URL,
    COOKIE_EXPIRE: process.env.JWT_COOKIE_EXPIRE,
    BASE_URL: process.env.BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
})
