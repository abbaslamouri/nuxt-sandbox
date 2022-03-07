import { defineStore } from 'pinia'

export const useCart = defineStore('cart', {
  state: () => {
    return {
      // cart: {
      items: [],
      customer: {
        shippingAddresses: [],
        phones: [],
      },
      paymentMethod: 'stripe',
      coupons: [],
      taxes: 0,
      // },
    }
  },
  actions: {
    updateLocalStorage() {
      if (process.client) {
        localStorage.setItem(
          'cart',
          JSON.stringify({
            items: this.items,
            customer: this.customer,
            shippingMethod: this.shippingMethod,
            taxes: this.taxes,
            coupons: this.coupons,
          })
        )
      }
    },

    addItem(item, quantity) {
      console.log('ITEM', item)
      if (isNaN(quantity) || quantity === null) return
      let index = null
      index = this.items.findIndex((p) => p._id == item._id)
      if (index !== -1) {
        this.items[index].quantity = this.items[index].quantity + quantity
      } else {
        const cartItem = {
          product: item._id,
          type: item.type,
          name: item.name,
          slug: item.slug,
          categories: item.categories,
          quantity: quantity * 1,
        }
        if (item.type === 'simple') {
          cartItem.price = item.price
          cartItem.salePrice = item.salePrice
          cartItem.thumb = item.gallery[1]
            ? {
                _id: item.gallery[1]._id,
                filename: item.gallery[1].filename,
                path: item.gallery[1].path,
              }
            : item.gallery[0]
            ? {
                _id: item.gallery[0]._id,
                filename: item.gallery[0].filename,
                path: item.gallery[0].path,
              }
            : null
        }
        this.items.push(cartItem)
      }
      this.updateLocalStorage()
    },

    updateItemQuantity(item, quantity) {
      console.log(item, quantity)
      if (isNaN(quantity) || quantity === null) return
      const index = this.items.findIndex((p) => p.product == item.product)
      if (index !== -1) {
        if (quantity === 0) this.items.splice(index, 1)
        else this.items[index].quantity = quantity * 1
        this.updateLocalStorage()
      }
    },

    updateCartCustomer(customer = {}) {
      this.customer = customer
      this.updateLocalStorage()
    },

    incrementItemCount(item) {
      const index = this.items.findIndex((p) => p._id == item._id)
      if (index !== -1) this.items[index].quantity++
    },

    decrementItemCount(item) {
      const index = this.items.findIndex((p) => p.product == item.product)
      if (index !== -1 && this.items[index].quantity >= 2) {
        this.items[index].quantity--
      }
    },

    removeItem(item) {
      this.items = this.items.filter((el) => el.product != item.product)
      this.cartTotal = this.total
      this.updateLocalStorage()
    },
  },

  getters: {
    hasItems() {
      return this.items && this.items.length ? true : false
    },
    // items() {
    //   return this.items
    // },
    // customer() {
    //   return this.customer
    // },
    total() {
      return this.items.reduce((accumulator, item) => accumulator + item.price * item.quantity * 1, 0)
    },
    numberOfItems() {
      return this && this.items && this.items.length
        ? this.items.reduce((accumulator, item) => accumulator + item.quantity, 0)
        : 0
    },
  },
})
