import { defineStore } from 'pinia'

export const useCart = defineStore('cart', {
	state: () => {
		return {
			cart: { items: [] },
			showCartSlideout: false,
		}
	},
	actions: {
		addItem(product, variants, quantity) {
			let index = null
			index = this.cart.items.findIndex((p) => p.product == product._id)
			if (index !== -1) {
				this.cart.items[index].quantity = this.cart.items[index].quantity + quantity
			} else {
				const item = {
					_id: product._id,
					type: product.type,
					name: product.name,
					slug: product.slug,
					quantity,
				}
				if (product.type === 'simple') {
					item.price = product.price
					item.salePprice = product.salePprice
					item.thumb = {
						_id: product.gallery[1]._id,
						filename: product.gallery[1].filename,
						path: product.gallery[1].path,
					}
				}
				this.cart.items.push(item)
			}
			if (process.client) {
				localStorage.setItem('cart', JSON.stringify(this.cart))
			}
		},

		updateItemQuantity(item, quantity) {
			const index = this.cart.items.findIndex((p) => p._id == item._id)
			if (index !== -1) {
				if (quantity === 0) this.cart.items.splice(index, 1)
				else this.cart.items[index].quantity = quantity
				if (process.client) {
					localStorage.setItem('cart', JSON.stringify(this.cart))
				}
			}
		},

		incrementItemCount(item) {
			const index = this.cart.items.findIndex((p) => p._id == item._id)
			if (index !== -1) this.cart.items[index].quantity++
		},

		decrementItemCount(item) {
			const index = this.cart.items.findIndex((p) => p.product == item.product)
			if (index !== -1 && this.cart.items[index].quantity >= 2) {
				this.cart.items[index].quantity--
			}
		},

		removeItem(item) {
			this.cart.items = this.cart.items.filter((el) => el.product != item.product)
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
			return this.cart && this.cart.items && this.cart.items.length
				? this.cart.items.reduce((accumulator, item) => accumulator + item.quantity, 0)
				: 0
		},
	},
})
