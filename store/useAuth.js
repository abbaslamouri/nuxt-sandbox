import { defineStore } from 'pinia'
// import { useCart } from '~/pinia/useCart'
// import { useError } from '~/pinia/useError'

// import axios from 'axios'
// const cart = useCart()
// const appError = useError()

// import Cookies from 'js-cookie'

// import { useMainStore } from '~/pinia/useMain'
// console.log('TOKEN', useCookie('token'))

// const http = axios.create({
//   baseURL: 'http://localhost:3000/api',
// })

export const useAuth = defineStore('auth', {
  state: () => {
    return {
      apiURL: useRuntimeConfig().API_BASE, // 'api/v1/',
      user: useCookie('auth').value && useCookie('auth').value.user ? useCookie('auth').value.user : {},
      token: useCookie('auth').value && useCookie('auth').value.token ? useCookie('auth').value.token : null,
      message: '',
      errorMsg: '',
    }
  },
  actions: {
    async signup(user) {
      this.errorMsg = ''
      try {
        const response = await $fetch('auth/signup', { baseURL: this.apiURL, method: 'POST', body: user })
        // this.user = response.user
        // this.token = response.token
        this.message = response.message
        console.log(response)
      } catch (err) {
        console.log('MyERROR', err.data)
        this.errorMsg = err.data
      }
    },

    async login(user) {
      this.errorMsg = ''
      try {
        const response = await $fetch('auth/login', { baseURL: this.apiURL, method: 'POST', body: user })
        this.user = response.user
        this.token = response.token
        console.log(response)
      } catch (err) {
        console.log('MyERROR', err.data)
        this.errorMsg = err.data
      }
    },

    async logout() {
      this.errorMsg = ''
      try {
        await $fetch('auth/logout', { baseURL: this.apiURL })
        this.user = {}
        this.token = null
      } catch (err) {
        console.log('MyERROR', err.data)
        this.errorMsg = err.data
      }
    },

    async signupComplete(payload) {
      this.errorMsg = ''
      try {
        const response = await $fetch('auth/signup-complete', { baseURL: this.apiURL, method: 'PATCH', body: payload })
        this.user = response.user
        this.token = response.token
        this.message = response.message
        console.log(response)
      } catch (err) {
        console.log('MyERROR', err.data)
        this.errorMsg = err.data
      }
      // // const mainStore = useMainStore()
      // this.errorMsg = ''
      // try {
      //   const response = await http.patch(`v1/auth/complete-registration/${payload.token}`, payload.user)
      //   // console.log(response)
      //   this.user = response.data.user
      //   this.token = response.data.token
      // } catch (err) {
      //   console.log('MyERROR', err.response)
      //   this.errorMsg = err.response.data.message || err.response.data.statusMessage
      //   // mainStore.setSnackbar({
      //   //   show: true,
      //   //   snackbarType: 'error',
      //   //   message: this.errorMsg,
      //   //   duration: 5,
      //   // })
      // }
    },

    async updateCurrentUserAvatar(payload) {
      // const mainStore = useMainStore()
      // this.errorMsg = ''
      // try {
      //   const user = {
      //     name: this.user.name,
      //     email: this.user.email,
      //     avatar: payload._id,
      //   }
      //   const response = await http.patch('v1/auth/update-current-user', user)
      //   // console.log(response)
      //   this.user = response.data.user
      // } catch (err) {
      //   console.log('MyERROR', err)
      //   this.errorMsg = err.response.data.message || err.response.data.statusMessage
      //   // mainStore.setSnackbar({
      //   //   show: true,
      //   //   snackbarType: 'error',
      //   //   message: this.errorMsg,
      //   //   duration: 5,
      //   // })
      // }
    },

    async updateCurrentUserInfo() {
      // // const mainStore = useMainStore()
      // this.errorMsg = ''
      // try {
      //   const response = await http.patch('v1/auth/update-current-user', {
      //     name: this.user.name,
      //     email: this.user.email,
      //   })
      //   // console.log(response)
      //   // this.user = response.data.user
      //   // this.token = response.data.token
      // } catch (err) {
      //   console.log('MyERROR', err)
      //   this.errorMsg = err.response.data.message || err.response.data.statusMessage
      //   // mainStore.setSnackbar({
      //   //   show: true,
      //   //   snackbarType: 'error',
      //   //   message: this.errorMsg,
      //   //   duration: 5,
      //   // })
      // }
    },

    async updateCurrentUserPassword(currentPassword, password) {
      // // const mainStore = useMainStore()
      // this.errorMsg = ''
      // try {
      //   const response = await http.patch('v1/auth/update-current-user-password', {
      //     currentPassword,
      //     password,
      //   })
      //   // console.log(response)
      //   // this.user = response.data.user
      //   // this.token = response.data.token
      // } catch (err) {
      //   console.log('MyERROR', err.response)
      //   this.errorMsg = err.response.data.message || err.response.data.statusMessage
      //   // mainStore.setSnackbar({
      //   //   show: true,
      //   //   snackbarType: 'error',
      //   //   message: this.errorMsg,
      //   //   duration: 5,
      //   // })
      // }
    },

    // async fetchCurrentUser(payload) {
    //   const mainStore = useMainStore()
    //   const authStore = useAuth()
    //   this.errorMsg = ''
    //   try {
    //     const response = await http.get('v1/auth/current-user', payload)
    //     console.log('PPPPPP', response)
    //     return response.data.user
    //     // mainStore.setSnackbar({
    //     //   show: true,
    //     //   snackbarType: 'success',
    //     //   message: response.data.message,
    //     //   duration: 10,
    //     // })
    //   } catch (err) {
    //     console.log('MyERROR', err)
    //     this.errorMsg = err.response.data.message || err.response.data.statusMessage
    //     mainStore.setSnackbar({
    //       show: true,
    //       snackbarType: 'error',
    //       message: this.errorMsg,
    //       duration: 5,
    //     })
    //   }
    // },
  },

  getters: {
    authenticated() {
      return this.token ? true : false
    },
    isAdmin() {
      return this.user.role === 'admin' ? true : false
    },
  },
})
