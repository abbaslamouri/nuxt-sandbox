import { defineStore } from 'pinia'
// import Cookies from 'js-cookie'
// import axios from 'axios'
// import { useAuth } from '~/pinia/useAuth'

// import { useMainStore } from '~/pinia/useMain'
// import { useError } from '~/pinia/useError'
// const appError = useError()

// const http = axios.create({
//   baseURL: 'http://localhost:3000/api',
// })

// if (process.client) {
//   console.log('EEEEEEE', JSON.parse(localStorage.getItem('cart')))
// }

export const useCart = defineStore('cart', {
  state: () => {
    return {
      cart: {
        // items: [],
        // customer: { shippingAddress: {} },
        // paymentMethod: 'stripe',
        // coupons: [],
      },
    }
  },
  actions: {
    addItem(product, quantity) {
      let index = null
      index = this.cart.items.findIndex((p) => p.product == product._id)
      if (index !== -1) {
        this.cart.items[index].quantity = this.cart.items[index].quantity + quantity
       
      } else {
        const item = {
          product: product._id,
          type: product.type,
          name: product.name,
          slug: product.slug,
          // customSlug: product.customSlug,
          price: product.type === 'simple' ? product.price : null,
          featuredImage: product.featuredImage
            ? {
                _id: product.featuredImage._id,
                name: product.featuredImage.name,
                path: product.featuredImage.path,
              }
            : null,
          attributes: product.attributes.map((a) => {
            return {
              attribute: { _id: a.item._id, name: a.item.name },
              trems: a.terms.map((t) => {
                return {
                  _id: t._id,
                  name: t.name,
                }
              }),
            }
          }),
          quantity,
        }

        if (product.type === 'variable') {
          const attributes = product.variant.attrTerms.map((t) => {
            return {
              attribute: {
                _id: product.attributes.find((a) => t.parent == a.item._id).item._id,
                name: product.attributes.find((a) => t.parent == a.item._id).item.name,
              },
              term: {
                _id: t._id,
                name: t.name,
              },
            }
          })
          // item.attributes = attributes
          item.variant = {
            _id: product.variant._id,
            price: product.variant.price,
            salePrice: product.variant.salePrice,
            attributes,
          }
        }
        this.cart.items.push(item)
        // console.log(item)

        // appError.setSnackbar(true, `${product.name} added to cart`, 'success', 5)
        // console.log(this.cart)
      }
      // Cookies.set('cart', JSON.stringify(this.cart))
      if (process.client) {
        localStorage.setItem('cart', JSON.stringify(this.cart))
      }
    },

    incrementItemCount(item) {
      // console.log(item)
      const index = this.cart.items.findIndex((p) => p.product == item.product)
      if (index !== -1) this.cart.items[index].quantity++
      // Cookies.set('cart', JSON.stringify(this.cart))
    },

    decrementItemCount(item) {
      // console.log(item)
      const index = this.cart.items.findIndex((p) => p.product == item.product)
      if (index !== -1 && this.cart.items[index].quantity >= 2) {
        this.cart.items[index].quantity--
        // Cookies.set('cart', JSON.stringify(this.cart.items))
      }
    },

    removeItem(item) {
      this.cart.items = this.cart.items.filter((el) => el.product != item.product)
      // const index = this.cart.items.findIndex((p) => p.product == item.product)
      // if (index !== -1) {
      //   this.cart.items.splice(index, 1)
      // Cookies.set('cart', JSON.stringify(this.cart))
      // }
    },

    async saveCart() {
      const appError = useError()

      // try {
      //   if (!this.cart.customer.email) return
      //   const response = await http.post('v1/cart', this.cart)
      //   // console.log(response.data)
      //   // this.cart = response.data
      //   return true
      // } catch (err) {
      //   console.error('MyERROR', err.response)
      //   // appError.setSnackbar(
      //   //   true,
      //   //   (state.errorMsg = err.response.data.message || err.response.data.statusMessage),
      //   //   'success',
      //   //   0
      //   // )
      //   return false
      // }
    },

    updateCustomerInfo() {
      // const auth = useAuth()

      // if (auth.authenticated) this.cart.customer = auth.user

      // Cookies.set('cart', JSON.stringify(this.cart))
    },

    updatePaymentMethod() {
      // Cookies.set('cartPaymentMethod', JSON.stringify(this.paymentMethod))
    },

    async placeOrder(order) {
      // try {
      //   this.errorMsg = ''
      //   const response = await http.post('v1/orders', order)
      //   // console.log(response.data)
      //   // this.user = response.data.data.user
      //   // this.token = response.data.data.token
      // } catch (err) {
      //   console.log('MyERROR', err)
      //   this.errorMsg = err.response.data.message || err.response.data.statusMessage
      //   console.log('MyERROR Message', this.errorMsg)
      // }
    },
  },

  getters: {
    hasItems() {
      return this.cart.items && this.cart.items.length ? true : false
    },
    items() {
      return this.cart.items
    },
    customer() {
      return this.cart.customer
    },
    total() {
      return this.cart.items.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0)
    },
    numberOfItems() {
      return this.cart.items && this.cart.items.length
        ? this.cart.items.reduce((accumulator, item) => accumulator + item.quantity, 0)
        : 0
    },
  },
})
