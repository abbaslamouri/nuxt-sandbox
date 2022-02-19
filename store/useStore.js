import { defineStore } from 'pinia'
// import { useError } from '~/pinia/useError'

import axios from 'axios'

const baseURL = 'http://localhost:3000/api'

const http = axios.create({
  baseURL,
})

export const useStore = defineStore('store', {
  state: () => {
    return {
      products: [],
      count: null,
      product: {},
      errorMsg: '',
    }
  },

  actions: {
    async fetchAll(params) {
      // const appError = useError()
      this.errorMsg = ''
      const { data, error } = await useFetch(`/v1/products/`, {
        baseURL,
        method: 'get',
        params,
      })
      if (error.value) {
        this.errorMsg = 'Error while fetching docs'
        // appError.setSnackbar(true, this.errorMsg)
      } else {
        this.products = data.value
      }
    },

    async fetchCount(params) {
      // const appError = useError()
      this.errorMsg = ''
      const { data, error } = await useFetch(`/v1/products/count`, {
        baseURL,
        method: 'get',
        params,
      })
      if (error.value) {
        this.errorMsg = 'Error while fetching docs count'
        // appError.setSnackbar(true, this.errorMsg)
      } else {
        this.count = data.value
      }
    },

    async deleteById(id) {
      // const appError = useError()
      this.errorMsg = ''
      try {
        await http.delete(`v1/products/${id}`)
        const index = this.products.findIndex((el) => el._id == id)
        if (index !== -1) this.products.splice(index, 1)
      } catch (err) {
        console.log('MyERROR', err.response)
        this.errorMsg = err.response.data.message || err.response.data.statusMessage
        // appError.setSnackbar(true, this.errorMsg)
      }
    },

    // async register() {
    //   try {
    //     const response = await http.post(`v1/${collection}/register`, state.selectedItem)
    //     console.log(response)
    //     appError.setSnackbar(true, 'Please check your email', 'success')
    //   } catch (err) {
    //     console.error('MyERROR', err.response)
    //     const errorMsg = err.response.data.message || err.response.data.statusMessage
    //     appError.setSnackbar(true, errorMsg)
    //   }
    // },

    async register(user) {
      // const appError = useError()
      // const mainStore = useMainStore()
      this.errorMsg = ''
      try {
        const response = await http.post('v1/auth/register', user)
        // console.log(response)
        appError.setSnackbar(true, 'Please check your email', 'success')
      } catch (err) {
        console.log('MyERROR', err.response)
        this.errorMsg = err.response.data.message || err.response.data.statusMessage
        console.error('MyERROR', err.response)
        // appError.setSnackbar(true, this.errorMsg)
      }
    },

    async completeRegistration(payload) {
      // const mainStore = useMainStore()
      this.errorMsg = ''
      try {
        const response = await http.patch(`v1/auth/complete-registration/${payload.token}`, payload.user)
        // console.log(response)
        this.user = response.data.user
        this.token = response.data.token
      } catch (err) {
        console.log('MyERROR', err.response)
        this.errorMsg = err.response.data.message || err.response.data.statusMessage
        // mainStore.setSnackbar({
        //   show: true,
        //   snackbarType: 'error',
        //   message: this.errorMsg,
        //   duration: 5,
        // })
      }
    },

    async updateCurrentUserAvatar(payload) {
      // const mainStore = useMainStore()
      this.errorMsg = ''
      try {
        const user = {
          name: this.user.name,
          email: this.user.email,
          avatar: payload._id,
        }
        const response = await http.patch('v1/auth/update-current-user', user)
        // console.log(response)
        this.user = response.data.user
      } catch (err) {
        console.log('MyERROR', err)
        this.errorMsg = err.response.data.message || err.response.data.statusMessage
        // mainStore.setSnackbar({
        //   show: true,
        //   snackbarType: 'error',
        //   message: this.errorMsg,
        //   duration: 5,
        // })
      }
    },

    async updateCurrentUserInfo() {
      // const mainStore = useMainStore()
      this.errorMsg = ''
      try {
        const response = await http.patch('v1/auth/update-current-user', {
          name: this.user.name,
          email: this.user.email,
        })
        // console.log(response)
        // this.user = response.data.user
        // this.token = response.data.token
      } catch (err) {
        console.log('MyERROR', err)
        this.errorMsg = err.response.data.message || err.response.data.statusMessage
        // mainStore.setSnackbar({
        //   show: true,
        //   snackbarType: 'error',
        //   message: this.errorMsg,
        //   duration: 5,
        // })
      }
    },

    async updateCurrentUserPassword(currentPassword, password) {
      // const mainStore = useMainStore()
      this.errorMsg = ''
      try {
        const response = await http.patch('v1/auth/update-current-user-password', {
          currentPassword,
          password,
        })
        // console.log(response)
        // this.user = response.data.user
        // this.token = response.data.token
      } catch (err) {
        console.log('MyERROR', err.response)
        this.errorMsg = err.response.data.message || err.response.data.statusMessage
        // mainStore.setSnackbar({
        //   show: true,
        //   snackbarType: 'error',
        //   message: this.errorMsg,
        //   duration: 5,
        // })
      }
    },

    async login(payload) {
      this.errorMsg = ''
      try {
        const response = await http.post('v1/auth/login', payload)
        // console.log(response.data)
        // this.auth = response.data
        this.user = response.data.user
        this.token = response.data.token
      } catch (err) {
        console.log('MyERROR', err.response)
        this.errorMsg = err.response.data.message || err.response.data.statusMessage
        appError.setSnackbar(true, this.errorMsg)
      }
    },

    async logout() {
      // const cart = useCart()

      // const mainStore = useMainStore()
      this.errorMsg = ''
      try {
        const response = await http.get('v1/auth/logout')
        // console.log(response.data)
        // this.auth = null
        this.user = {}
        this.token = null
        // Cookies.remove('cartItems')
        // Cookies.remove('jwt')
        // this.user = null
        // this.token = null
        // cart.customer._id = null
        // Cookies.set('cartCustomer', JSON.stringify(cart.customer))
      } catch (err) {
        console.log('MyERROR', err.response)
        this.errorMsg = err.response.data.message || err.response.data.statusMessage
        // mainStore.setSnackbar({
        //   show: true,
        //   snackbarType: 'error',
        //   message: this.errorMsg,
        //   duration: 5,
        // })
      }
    },

    // async fetchCurrentUser(payload) {
    //   const mainStore = useMainStore()
    //   const authStore = useStore()
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
