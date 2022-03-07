<script setup>
	import { useCart } from '~/store/useCart'
	const cart = useCart()

	const showSelectQtys = ref([])

	for (const prop in cart.items) {
		showSelectQtys.value[prop] = false
	}

	const handleOkBtnClicked = (event, index) => {
		for (const prop in showSelectQtys.value) {
			showSelectQtys.value[prop] = false
		}
		showSelectQtys.value[index] = event.status
		cart.updateItemQuantity(cart.items[index], event.quantity)
	}
</script>

<template>
	<div class="cart-items">
		<div v-if="cart.items.length" class="flex-col">
			<div
				class="cart-items__item flex-row gap2 items-center justify-between py1 mt-1"
				v-for="(item, index) in cart.items"
				:key="`cart-item-${index}`"
			>
				<div class="flex-row gap2 items-center">
					<div class="w5 h5"><img class="wfull contain" :src="item.thumb.path" v-if="item.thumb" /></div>
					<div class="flex-col text-sm">
						<div class="font-bold">{{ item.name }}</div>
						<div class="text-yellow-700">${{ item.price }}</div>
					</div>
				</div>
				<EcommerceCheckoutQuantitySelector
					parentComponent="cart"
					:minVal="0"
					:maxVal="140"
					:stepVal="10"
					:item="item"
					:showSelectQty="showSelectQtys[index]"
					:btnText="item.quantity"
					@okBtnClicked="handleOkBtnClicked($event, index)"
				/>
			</div>
		</div>
		<div v-else class="empty-cart">
			<p>You have no items in your bag</p>
			<NuxtLink
				class="link btn btn-primary"
				:to="{ name: 'original-coffee-pods' }"
				@click="appMessage.showCartSlideout = false"
			>
				<span>Start Shopping</span>
			</NuxtLink>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@import '@/assets/scss/variables';

	.cart-items {
		&__item {
			border-top: 1px solid $stone-300;
			border-bottom: 1px solid $stone-300;
		}

		// 		.left {
		// 			display: flex;
		// 			align-items: center;
		// 			gap: 2rem;

		// 			.thumb {
		// 				width: 5rem;
		// 				height: 5rem;

		// 				img {
		// 					max-width: 100%;
		// 					object-fit: contain;
		// 				}
		// 			}

		// 			.name-price {
		// 				font-size: 1.2rem;

		// 				.name {
		// 					font-weight: 500;
		// 				}

		// 				.price {
		// 					color: $yellow-700;
		// 				}
		// 			}
		// 		}

		// 		.quantity {
		// 			background-color: $green-700;
		// 			color: $slate-50;
		// 			padding: 1.5rem;
		// 			border-radius: 5px;
		// 		}
		// 	}
		// }

		// .empty-cart {
		// 	display: flex;
		// 	flex-direction: column;
		// 	align-items: center;
		// 	gap: 1rem;

		// 	.link {
		// 		align-self: stretch;
		// 		border-radius: 5px;
		// 		padding: 1rem;
		// 		background-color: $green-700;
		// 		font-size: 1.4rem;
		// 	}
	}
</style>
