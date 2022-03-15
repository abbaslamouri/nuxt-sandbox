<script setup>
	import isEqual from 'lodash.isequal'
	// import { useMessage } from '~/store/useMessage'
	// import { useStore } from '~/store/useStore'

	const emit = defineEmits(['saveVariants', 'closeSlideout'])

	// const store = inject('store')
	const { product, variants } = useStore()
	const { alert, errorMsg } = useFactory()

	// const { state, fetchVariants, fetchAttributes } = useProduct()
	// const saveProduct = inject('saveProduct')

	// const store = useStore()
	// const appMessage = useMessage()
	const variantToDelteIndex = ref(null)
	const variantsActionSelect = ref('')
	const showDeleteVariantAlerts = ref([])
	const showActions = ref([])
	// const regularPrice = ref(null)
	const showRegularPriceInput = ref(false)
	// const salePrice = ref(null)
	const showSalePriceInput = ref(false)
	const current = ref(null)
	// let response = null

	const variantActions = computed(() => [
		{ key: 'create-all', name: 'Create variations form all attribute', disabled: false },
		{ key: 'add-variant', name: 'Add Variation', disabled: false },
		{
			key: 'delete-all',
			name: 'Remove all variants',
			disabled: false,
			disabledIf: variants.value.length ? false : true,
		},
		{ key: 'disabled-action', name: 'Status', disabled: true },
		{
			key: 'toggle-enabled',
			name: 'Toggle Enabled',
			disabled: false,
			disabledIf: variants.value.length ? false : true,
		},
		{ key: 'disabled-action', name: 'Pricing', disabled: true },
		{
			key: 'set-regular-prices',
			name: 'Set Regular Prices',
			disabled: false,
			disabledIf: variants.value.length ? false : true,
		},
		{
			key: 'set-sale-prices',
			name: 'Set Sale Prices',
			disabled: false,
			disabledIf: variants.value.length ? false : true,
		},
	])

	const allAttributes = (await $fetch(`/api/v1/attributes`, { fields: 'name, slug' })).docs
	const allAttributeTerms = (await $fetch(`/api/v1/attributeterms`, { fields: 'name, slug, parent' })).docs
	provide('allAttributes', allAttributes)
	provide('allAttributeTerms', allAttributeTerms)

	current.value = JSON.stringify(variants.value)

	// Fetch all attributes
	// response = await fetchAttributes()
	// if (state.errorMsg) {
	//   appMessage.errorMsg = state.errorMsg
	//   allAttributes = []
	// } else {
	//   allAttributes = response.docs
	// }

	// Fetch variants
	// response = await fetchVariants(product.value._id)
	// if (state.errorMsg) {
	//   appMessage.errorMsg = state.errorMsg
	//   store.variants = []
	// } else {
	//   store.variants = response.docs
	// }

	// for (const prop in store.variants) {
	//   showDeleteVariantAlerts.value[prop] = false
	//   showActions.value[prop] = false
	// }

	const variantBase = (terms = []) => {
		return {
			product: product.value._id,
			attrTerms: terms,
			enabled: true,
			shipping: {
				dimensions: {},
			},
			stockQty: 0,
			price: product.value.price,
			salePrice: product.value.salePrice,
			sku: '',
			gallery: [],
		}
	}

	const getVariantAttribute = (term, j) => {
		if (Object.values(term).length) {
			return allAttributes.find((a) => a._id == term.parent._id)
		} else {
			return product.value.attributes[j].attribute
		}
	}

	// const getVariantAttribute = (term, j) => {
	//   if (Object.values(term).length) {
	//     return allAttributes.find((a) => a._id == term.parent._id)
	//   } else {
	//     return product.value.attributes[j].attribute
	//   }
	// }

	const getCombinations = (options) => {
		let combinations = [[]]
		for (let count = 0; count < options.length; count++) {
			const tmp = []
			combinations.forEach((v1) => {
				options[count].forEach((v2) => {
					tmp.push(v1.concat([v2]))
				})
				combinations = tmp
			})
		}
		return combinations
	}

	const checkMissingVariantTerms = () => {
		let errorMessage = ''
		for (const i in variants.value) {
			for (const j in variants.value[i].attrTerms) {
				if (!Object.keys(variants.value[i].attrTerms[j]).length)
					errorMessage += `Term missing for variant ${i * 1 + 1} attribute ${
						getVariantAttribute(variants.value[i].attrTerms[j], j).name
					}<br>`
			}
		}
		if (!errorMessage) return true
		errorMsg.value = `Attribute terms are required<br> ${errorMessage}`
		return false
	}

	const checkDuplicateVariants = () => {
		for (const i in variants.value) {
			for (const j in variants.value) {
				if (
					j * 1 !== i * 1 &&
					isEqual(
						variants.value[j].attrTerms.map((t) => t._id),
						variants.value[i].attrTerms.map((t) => t._id)
					)
				) {
					errorMsg.value = `Duplicate variants not allowed.  Variant ${
						j * 1 + 1
					} uses the same attributes and terms as ${i * 1 + 1}`
					return
				}
			}
		}
		return true
	}

	const preBulkVariants = () => {
		if (variants.value.length)
			showAlert(
				'Are you sure you want to recreate all variants?',
				'This action will overwrite all existing variants',
				'bulkVariants',
				true
			)
		// appMessage.alertHeading = ''
		// appMessage.alertParagraph = ''
		// appMessage.alertAction = 'recreateAllVariants'
		// return (appMessage.showAlert = true)
		else bulkAddVariants()
	}

	const bulkAddVariants = () => {
		console.log('ALERT', alert.value)
		let terms = []
		if (!product.value.attributes.length)
			return (appMessage.errorMsg = 'I do not know how you got here but you need to create attributes first')
		for (const prop in product.value.attributes) {
			if (!product.value.attributes[prop].terms.length)
				return (appMessage.errorMsg = `All attributes must contain terms.  Attribute ${product.value.attributes[prop].attribute.name} does not contain any terms.  Please delete this attribute or add terms`)
		}
		terms = product.value.attributes.map((el) => [...el.terms])
		if (getCombinations(terms)[0].length)
			variants.value = [...getCombinations(terms)].map((el) => {
				return variantBase([...el])
			})
		console.log(variants.value)
	}

	const addSingleVariant = () => {
		const maxVariantCount = product.value.attributes
			.map((a) => {
				return a.terms.length
			})
			.reduce((a, b) => a * b, 1)

		if (variants.value.length >= maxVariantCount)
			return (errorMsg.value = 'You have created all possible variantions.  Please edit an existing one.')

		const terms = []
		for (const prop in product.value.attributes) {
			terms[prop] = {}
		}
		variants.value.unshift(variantBase([...terms]))
	}

	// const updateVariant = () => {
	//   //  Check for duplicate variants
	//   for (const prop in variants.value) {
	//     if (
	//       prop * 1 !== props.index * 1 &&
	//       isEqual(
	//         variants.value[prop].attrTerms.map((t) => t._id),
	//         variants.value[props.index].attrTerms.map((t) => t._id)
	//       )
	//     ) {
	//       errorMsg.value = `Duplicate variants not allowed.  You new variant uses the same attributes and attribute terms as ${
	//         prop * 1 + 1
	//       } variant`
	//       return
	//     }
	//   }

	//   let errorMessage = ''
	//   for (const prop in variants.value[props.index].attrTerms) {
	//     if (!Object.keys(variants.value[props.index].attrTerms[prop]).length)
	//       errorMessage += `Terms missing for attribute ${
	//         getVariantAttribute(variants.value[props.index].attrTerms[prop], prop).name
	//       }<br>`
	//   }
	//   if (errorMessage) errorMsg.value = `Attribute terms are required<br> ${errorMessage}`
	//   else emit('closeSlideout', false)
	// }

	const updateVariants = async () => {
		if (!checkMissingVariantTerms() || !checkDuplicateVariants()) return
		for (const i in variants.value) {
			for (const j in variants.value[i].gallery) {
				const index = product.value.gallery.findIndex((m) => m._id == variants.value[i].gallery[j]._id)
				if (index === -1) product.value.gallery.push(variants.value[i].gallery[j])
			}
		}
		current.value = null

		emit('closeSlideout', false)
		emit('saveVariants', false)
	}

	const toggleEnabled = () => {
		for (const prop in variants.value) {
			variants.value[prop].enabled = !variants.value[prop].enabled
		}
	}

	const setRegularPrices = (price) => {
		for (const prop in variants.value) {
			variants.value[prop].price = price
		}
		// appMessage.successMsg = `Regular prices updated for all variants`
		showRegularPriceInput.value = false
	}

	const setSalePrices = (price) => {
		for (const prop in variants.value) {
			variants.value[prop].salePrice = price
		}
		// appMessage.successMsg = `Sale  prices updated for all variants`
		showSalePriceInput.value = false
	}

	const closeSlideout = () => {
		if (current.value !== JSON.stringify(variants.value)) {
			showAlert(
				'You have unsaved changes',
				'Please save your changes before closing this window or click cancel to exit without saving',
				'closeSlideout',
				false
			)
		} else {
			emit('closeSlideout', false)
		}
	}

	const cancelVariants = () => {
		variants.value = JSON.parse(current.value)
		emit('closeSlideout', false)
	}

	const handleVariantsAction = () => {
		if (!variantsActionSelect.value) return (errorMsg.value = 'Please select an action')
		switch (variantsActionSelect.value) {
			case 'create-all':
				preBulkVariants()
				break
			case 'add-variant':
				addSingleVariant()
				break
			case 'delete-all':
				showAlert(
					'Are you sure?',
					'All variants associated with this product will be deleted',
					'removeAllVariants',
					true
				)
				break
			case 'toggle-enabled':
				toggleEnabled()
				break
			case 'set-regular-prices':
				showRegularPriceInput.value = true
				break
			case 'set-sale-prices':
				showSalePriceInput.value = true
				break
		}
		setTimeout(() => {
			variantsActionSelect.value = ''
		}, 10)
	}

	const handleShowDeleteVariantAlert = (i, value) => {
		console.log(i, value)
		for (const prop in store.variants) {
			showDeleteVariantAlerts.value[prop] = false
		}
		showDeleteVariantAlerts.value[i] = value
	}

	const handleShowActions = (i, value) => {
		console.log(i, value)
		for (const prop in store.variants) {
			showActions.value[prop] = false
		}
		showActions.value[i] = value
	}

	// watch(
	//   () => alert.value,
	//   (currentVal) => {
	//     if (currentVal !== 'ok') return
	//     // appMessage.alertHeading = ''
	//     // appMessage.alertParagraph = ''
	//     // if (appMessage.alertAction === 'recreateAllVariants') bulkAddVariants()
	//     // if (appMessage.alertAction === 'deleteAllVariants') deleteAllVariants()
	//     // appMessage.showAlert = false
	//   },
	//   { deep: true }
	// )

	const showRemoveVariantAlert = (variantIndex) => {
		variantToDelteIndex.value = variantIndex * 1
		showAlert('Are you sure you want to delete this product variant?', '', 'removeVariant', true)
	}

	const removeVariant = () => {
		variants.value.splice(variantToDelteIndex.value, 1)
		alert.value.show = false
	}

	const removeAllVariants = async () => {
		variants.value = []
		alert.value.show = false
	}

	const showAlert = (heading, paragraph, action, showCancelBtn) => {
		alert.value.heading = heading
		alert.value.paragraph = paragraph
		alert.value.action = action
		alert.value.showCancelBtn = showCancelBtn
		alert.value.show = true
	}

	watch(
		() => alert.value,
		(currentVal) => {
			console.log('W', currentVal)
			if (currentVal.show === 'ok' && currentVal.action === 'removeVariant') removeVariant()
			if (currentVal.show === 'ok' && currentVal.action === 'removeAllVariants') removeAllVariants()
			if (currentVal.show === 'ok' && currentVal.action === 'closeSlideout') alert.value.show = false
		},
		{ deep: true }
	)
</script>

<template>
	<Slideout class="variants" @closeSlideout="closeSlideout">
		<template v-slot:header>
			<h3>Edit Variants</h3>
		</template>
		<template v-slot:default>
			<div class="flex-col gap2 p2">
				<!-- <pre style="font-size: 1rem">{{ product._id }}</pre> -->
				<template v-if="product.attributes">
					<header class="flex-row items-center justify-between bg-slate-200 p2">
						<h2>Variants</h2>
						<div class="flex-row align-center gap2">
							<FormsBaseSelect
								v-model="variantsActionSelect"
								nullOption="Select Action"
								:options="variantActions"
								@update:modelValue="handleVariantsAction"
							/>
							<EcommerceAdminProductsVariantsPriceForm
								:showRegularPriceInput="showRegularPriceInput"
								:showSalePriceInput="showSalePriceInput"
								@setRegularPrices="setRegularPrices"
								@setSalePrices="setSalePrices"
							/>
							<!-- <div class="price-actions">
                <form class="flex-row items-center" v-if="showRegularPriceInput" @submit.prevent="setRegularPrices">
                  <div class="minw16">
                    <FormsBaseInput v-model="regularPrice" label="Set Regular Price" placeholde="Set Regular Price" />
                  </div>
                  <button class="btn btn__secondary px2 py1">Submit</button>
                </form>
                <form class="flex-row items-center" v-if="showSalePriceInput" @submit.prevent="setSalePrices">
                  <div class="minw16">
                    <FormsBaseInput v-model="salePrice" label="Set Sale Price" placeholde="Set Sale Price" />
                  </div>
                  <button class="btn btn__secondary px2 py1">submit</button>
                </form>
              </div> -->
							<button class="btn btn__primary minw12" @click="preBulkVariants">Bulk Add</button>
						</div>
					</header>
					<main>
						<EcommerceAdminProductsVariantsEmptyMsg
							v-if="!variants.length"
							@slideoutEventEmitted="$emit('closeSlideout', $event)"
						/>
						<EcommerceAdminProductsVariantsList v-else @removeVariant="showRemoveVariantAlert" />
					</main>
				</template>
			</div>
		</template>
		<template v-slot:footer>
			<EcommerceAdminSlideoutFooter
				:disableSaveBtn="current == JSON.stringify(variants)"
				@ok="updateVariants"
				@cancel="cancelVariants"
			/>
			<!-- <div class="flex-row items-center justify-end gap2">
        <button class="btn btn_secondary py05 px3" @click.prevent="cancelVariants">Cancel</button>
        <button
          class="btn btn__primary py05 px3"
          @click.prevent="updateVariants"
          :disabled="current == JSON.stringify(variants)"
        >
          Save Changes
        </button>
      </div> -->
		</template>
	</Slideout>
</template>

<style lang="scss" scoped>
	@import '@/assets/scss/variables';

	.variantss {
		.variants-details {
			display: flex;
			flex-direction: column;
			gap: 2rem;
			overflow: auto;
			padding: 2rem;

			header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 1rem;
				background-color: $slate-300;

				.variants-actions {
					display: flex;
					align-items: center;
					gap: 4rem;

					.base-select {
						width: 30rem;
						height: 4rem;
					}

					.price-actions {
						.regular-price,
						.sale-price {
							display: flex;
							align-items: center;
							gap: 1rem;
						}
					}
				}
			}
		}

		.actions {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: 2rem;

			.btn {
				&:disabled {
					background-color: $slate-400;
					cursor: not-allowed;
				}
			}
		}
	}
</style>
