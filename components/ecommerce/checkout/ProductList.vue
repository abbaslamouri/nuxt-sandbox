<script setup>
	import { useCart } from '~/store/useCart'
	import { useAuth } from '~/store/useAuth'
	// import { useMessage } from '~/store/useMessage'

	defineProps({
		// item: {
		// 	type: Object,
		// 	required: true,
		// },
		// index: {
		// 	type: Number,
		// 	required: true,
		// },
	})

	useMeta({
		title: 'Checkout | YRL',
	})
	definePageMeta({
		layout: 'checkout',
	})

	// const { state, fetchAll } = useProduct()
	const route = useRoute()
	const cart = useCart()
	// const auth = useAuth()
	// const appMessage = useMessage()
	const showSelectQtys = ref([])
	// const promoCode = ref(null)
	// const coupon = ref('')

	// const freeSamples = ref([])

	// onMounted(async () => {
	//   const response = await fetchAll()
	//   if (state.errorMsg) {
	//     appMessage.errorMsg = state.errorMsg
	//   } else {
	//     for (const prop in response.docs) {
	//       if (response.docs[prop].categories.map((g) => g.slug).includes('free-samples'))
	//         freeSamples.value.push(response.docs[prop])
	//     }
	//   }
	//   // console.log(freeSamples.value)
	// })

	// if (auth.authenticated) cart.cart.customer = auth.user

	// const response = await fetchAll()
	// if (state.errorMsg) {
	//   appMessage.errorMsg = state.errorMsg
	// } else {
	//   for (const prop in response.docs) {
	//     if (response.docs[prop].categories.map((g) => g.slug).includes('free-samples'))
	//       freeSamples.value.push(response.docs[prop])
	//   }
	// }
	// console.log(freeSamples.value)
	// // products.value = response.docs
	// for (const prop in products.value) {
	//   showSelectQtys.value[prop] = false
	// }

	// console.log(products.value)

	const handleOkBtnClicked = (event, index) => {
		for (const prop in showSelectQtys.value) {
			showSelectQtys.value[prop] = false
		}
		showSelectQtys.value[index] = event.status
		cart.updateItemQuantity(cart.items[index], event.quantity)
	}

	// const handleCheckout = async () => {
	//   if (auth.authenticated) {
	//     // console.log(auth.user)
	//     // cart.updateCustomerInfo(auth.user)
	//     await cart.saveCart()
	//     router.push({ name: 'shipping' })
	//   } else {
	//     router.push('/secure?redirect=/shipping')
	//   }
	// }

	// const applyCoupon = () => {
	//   coupon.value = ''
	// }
</script>

<template>
	<div class="table checkout-product-list">
		<div class="table__header bg-stone-300 py2 px2">
			<div class="row">
				<div class="th">Item</div>
				<div class="th">Unit Price</div>
				<div class="th">Quantity</div>
				<div class="th">Total</div>
				<div class="th"></div>
			</div>
		</div>
		<div class="table__body py2 px2">
			<div class="row" v-for="(item, index) in cart.items" :key="item.product" :item="item" :index="index">
				<div class="td py1">
					<div class="w4 h4">
						<img
							class="wfull hfull contain"
							:src="item.thumb ? item.thumb.path : '/placeholder.png'"
							:alt="` ${item.name} Photo`"
						/>
					</div>
					<h4 class="name">{{ item.name }}</h4>
				</div>
				<div class="price td">${{ item.price.toFixed(2) }}</div>
				<div class="quantity td" v-if="!item.categories.map((g) => g.slug).includes('free-samples')">
					<EcommerceCheckoutQuantitySelector
						class="cart"
						:item="item"
						:minVal="0"
						:maxVal="140"
						:stepVal="10"
						:showSelectQty="showSelectQtys[index]"
						:btnText="item.quantity"
						@okBtnClicked="handleOkBtnClicked($event, index)"
					/>
				</div>
				<div class="quantity td" v-else>
					<EcommerceCheckoutQuantitySelector
						v-if="item.slug === 'recycling-bag'"
						class="cart"
						:item="item"
						:minVal="0"
						:maxVal="4"
						:stepVal="1"
						:showSelectQty="showSelectQtys[index]"
						:btnText="item.quantity"
						@okBtnClicked="handleOkBtnClicked($event, index)"
					/>
					<button v-else class="btn btn-secondary free-sample-single">{{ item.quantity }}</button>
				</div>
				<div class="line-item-total td">${{ (item.quantity * item.price).toFixed(2) }}</div>
				<div class="trash td" @click="cart.removeItem(item)"><IconsClose /></div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@import '@/assets/scss/variables';

	.checkout-product-list {
		.table__body {
			.row {
				border-bottom: 1px solid $stone-200;
			}
		}

		.row {
			// border-bottom: 1px solid $stone-200;

			.quantity {
				.free-sample-single {
					// background-color: $green-700;
					border-radius: 3px;
					padding: 1.5rem;
					// color: $slate-50;
					cursor: not-allowed;

					svg {
						fill: $slate-50;
						width: 1.5rem;
						height: 1.5rem;
					}
				}
			}

			.trash {
				cursor: pointer;
				svg {
					width: 1.5rem;
					height: 1.5rem;
					fill: $slate-600;
				}
			}
		}
	}
</style>
