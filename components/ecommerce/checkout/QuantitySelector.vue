<script setup>
	const props = defineProps({
		minVal: {
			type: Number,
			required: true,
		},
		maxVal: {
			type: Number,
			required: true,
		},
		stepVal: {
			type: Number,
			required: true,
		},
		btnText: {
			type: [String, Number],
		},
		showSelectQty: {
			type: Boolean,
		},
		parentComponent: {
			type: String,
		},
	})

	const emit = defineEmits(['okBtnClicked'])

	const quantity = ref(null)
	const showQuantitySelector = ref(false)
	const quantitySelectorPosition = ref(null)
	const quantityArr = ref([])
	const quantitySelectorOffset = ref(null)

	let i = props.minVal
	while (i <= props.maxVal) {
		quantityArr.value.push(i)
		i += props.stepVal
	}
	if (quantityArr.value.length <= 5) {
		quantitySelectorOffset.value = `-110px`
	} else if (quantityArr.value.length > 5 && quantityArr.value.length <= 10) {
		quantitySelectorOffset.value = `-150px`
	} else if (quantityArr.value.length > 10 && quantityArr.value.length <= 15) {
		quantitySelectorOffset.value = `-190px`
	} else if (quantityArr.value.length > 15 && quantityArr.value.length <= 20) {
		quantitySelectorOffset.value = `-230px`
	} else if (quantityArr.value.length > 20 && quantityArr.value.length <= 25) {
		quantitySelectorOffset.value = `-270px`
	} else if (quantityArr.value.length > 25 && quantityArr.value.length <= 30) {
		quantitySelectorOffset.value = `-310px`
	} else {
		quantitySelectorOffset.value = `-350px`
	}

	const setQuantitySelectorPosition = (event) => {
		const position = event.target.getBoundingClientRect().y
		console.log(position)
		if (position < 320) quantitySelectorPosition.value = 'below'
		else quantitySelectorPosition.value = null
		showQuantitySelector.value = true
		emit('okBtnClicked', { status: !props.showSelectQty, quantity: null })
	}

	const handleQuantityBtnClick = (qty) => {
		emit('okBtnClicked', { status: false, quantity: qty })
		quantity.value = null
	}
</script>

<template>
	<div class="quantity-selector" :class="{ cart: parentComponent === 'cart' }">
		<button class="btn btn secondary" @click="setQuantitySelectorPosition">
			<div class="btn-text" v-if="btnText">{{ btnText }}</div>
			<IconsPlus v-else />
		</button>
		<div class="selector" v-if="showSelectQty" :class="quantitySelectorPosition">
			<ul>
				<li v-for="n in quantityArr" :key="`predefined-quantity-${n}`" @click="handleQuantityBtnClick(n)">
					<span>
						{{ n }}
					</span>
				</li>
			</ul>
			<div class="cart-quantity">
				<input
					type="text"
					v-model="quantity"
					placeholder="Add custom quantity"
					@change="handleQuantityBtnClick(quantity)"
				/>
				<button class="btn btn-secondary" @click="handleQuantityBtnClick(quantity)">OK</button>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@import '@/assets/scss/variables';
	.quantity-selector {
		position: relative;
		.btn {
			background-color: $green-700;
			padding: 1rem;
			border-radius: 3px;
			width: 4rem;
			height: 4rem;
			.btn-text {
				color: $slate-50;
				font-size: 1.2rem;
			}

			svg {
				fill: $slate-50;
			}
		}
		.selector {
			position: absolute;
			top: v-bind(quantitySelectorOffset);
			left: 50%;
			width: 215px;
			// height: 200px;
			// border: 1px solid green;
			transform: translateX(-50%);
			background-color: $stone-200;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding: 1rem;
			border-radius: 3px;
			z-index: 9;

			&.below {
				top: 130%;

				&::before {
					top: -20px;
					border-color: transparent transparent $stone-200 transparent;
				}
			}

			&::before {
				content: '';
				position: absolute;
				top: 100%;
				left: 50%;
				transform: translateX(-50%);
				border-width: 10px;
				border-style: solid;
				border-color: $stone-200 transparent transparent transparent;
			}
			// padding: 2rem;
			// display: flex;
			// justify-content: center;
			// align-content: flex-start;
			ul {
				width: 100%;
				display: flex;
				// justify-content: center;
				align-items: flex-start;
				flex-wrap: wrap;
				// border: 1px solid red;

				// gap:1rem;

				li {
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 1.2rem;
					width: 40px;
					height: 40px;
					margin-left: -1px;
					margin-top: -1px;
					cursor: pointer;
					border-right: 1px solid $stone-400;
					span {
						padding: 0.5rem;
						border-radius: 3px;
						width: 30px;
						height: 30px;
						text-align: center;
					}

					&:hover {
						span {
							border: 1px solid $stone-400;
						}
					}

					&:nth-of-type(5n) {
						border-right: none;
					}
					// }
				}
			}

			.cart-quantity {
				width: 100%;
				display: flex;
				align-items: stretch;
				input {
					flex: 1;
					height: 100%;
					border: $stone-400;
					padding: 0 1rem;
					font-size: 1.2rem;
					height: 4rem;
				}

				.btn {
					color: $slate-50;
				}
			}
		}

		&.cart {
			.selector {
				top: -60px;
				left: -115px;

				&::before {
					content: '';
					position: absolute;
					top: 50%;
					left: 210px;
					transform: translateY(-50%);
					border-width: 10px;
					border-style: solid;
					border-color: transparent transparent transparent $stone-200;
				}
			}
		}
	}
</style>
