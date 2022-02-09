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
			// auth: useCookie('auth').value ? useCookie('auth').value : null,
			user: useCookie('auth').value && useCookie('auth').value.user ? useCookie('auth').value.user : {},
			token: useCookie('auth').value && useCookie('auth').value.token ? useCookie('auth').value.token : null,
			errorMsg: '',
		}
	},
	actions: {
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
			// // const appError = useError()
			// // const mainStore = useMainStore()
			// this.errorMsg = ''
			// try {
			//   const response = await http.post('v1/auth/register', user)
			//   // console.log(response)
			//   // appError.setSnackbar(true, 'Please check your email', 'success')
			// } catch (err) {
			//   console.log('MyERROR', err.response)
			//   this.errorMsg = err.response.data.message || err.response.data.statusMessage
			//   console.error('MyERROR', err.response)
			//   // appError.setSnackbar(true, this.errorMsg)
			// }
		},

		async completeRegistration(payload) {
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

		async login(payload) {
			// // const appError = useError()
			// this.errorMsg = ''
			// try {
			//   const response = await http.post('v1/auth/login', payload)
			//   // console.log(response.data)
			//   // this.auth = response.data
			//   this.user = response.data.user
			//   this.token = response.data.token
			// } catch (err) {
			//   console.log('MyERROR', err.response)
			//   this.errorMsg = err.response.data.message || err.response.data.statusMessage
			//   // appError.setSnackbar(true, this.errorMsg)
			// }
		},

		async logout() {
			// // const cart = useCart()
			// // const mainStore = useMainStore()
			// this.errorMsg = ''
			// try {
			//   const response = await http.get('v1/auth/logout')
			//   // console.log(response.data)
			//   // this.auth = null
			//   this.user = {}
			//   this.token = null
			//   // Cookies.remove('cartItems')
			//   // Cookies.remove('jwt')
			//   // this.user = null
			//   // this.token = null
			//   // cart.customer._id = null
			//   // Cookies.set('cartCustomer', JSON.stringify(cart.customer))
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
