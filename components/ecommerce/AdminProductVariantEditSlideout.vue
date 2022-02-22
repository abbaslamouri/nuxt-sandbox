<script setup>
	import { useMessage } from '~/store/useMessage'

	const props = defineProps({
		// product: {
		// 	type: Object,
		// },
		productVariant: {
			type: Object,
		},
		productAttributes: {
			type: Array,
		},
		// index: {
		// 	type: Number,
		// 	required: true,
		// },
		// productId: {
		// 	type: String,
		// },
		showVariantEditSlideout: {
			type: Boolean,
		},
	})

	const emit = defineEmits([
		// 'saveVariants',
		// 'slideoutEventEmitted',
		// 'slideoutVariantsUpdated',
		// 'deleteAllVariantsEventEmitted',
	])

	const appMessage = useMessage()
	const attributes = ref([])
	const attributeTerms = ref([])
	const showAlert = ref(false)
	const showDeleteAllVariantsAlert = ref(false)
	const slideoutVariants = ref([])
	const variantsActionSelect = ref('')
	const regularPrices = ref(null)
	const showRegularPricesInput = ref(false)
	const salePrices = ref(null)
	const showSalePricesInput = ref(false)
	const editdVariant = ref({})
	// const editdVariantAttribute = ref({})
	const showMediaSelector = ref(false) // media selector toggler

	const showActions = ref(false)
	const galleryIntro = ref(
		'This image gallery contains all images associated with this product including its variants.'
	)

	editdVariant.value = { ...props.productVariant }

	const getAttributeByVariantTermParent = (parentId) => {
		return props.productAttributes
			.find((a) => a.attribute._id == parentId)
			.terms.map((t) => {
				return { key: t._id, name: t.name }
			})
		// .find((t) => t._id == termId).parent)
	}

	// Set category gallery
	const selectMedia = async (event) => {
		console.log(event)
		showMediaSelector.value = false
		for (const prop in event) {
			const index = editdVariant.value.gallery.findIndex((m) => m._id === event[prop]._id)
			if (index === -1) {
				editdVariant.value.gallery.push(event[prop])
			}
		}
	}

	// for (const prop in props.productVariants) {
	// 	slideoutVariants.value.push(props.productVariants[prop])
	// }
	// const currentVariants = JSON.stringify(slideoutVariants.value)

	// console.log('COMPARE', currentVariants === JSON.stringify(slideoutVariants.value))

	const closeSlideout = () => {
		// console.log('Before', JSON.parse(currentVariants))
		// console.log('COMPARE', currentVariants === JSON.stringify(slideoutVariants.value))
		// if (currentVariants !== JSON.stringify(slideoutVariants.value)) return (showAlert.value = true)
		emit('editSlideoutEventEmitted', false)
		// const newAttributes = []
		// for (const prop in props.productVariants) {
		//   if (Object.values(props.productVariants[prop].attribute).length)
		//     newAttributes.push(props.productVariants[prop])
		// }
		// props.productVariants = newAttributes
		// console.log('After', props.productVariants)
	}

	const updateVariant = async () => {
		// emit('slideoutVariantsUpdated', slideoutVariants.value)
		// emit('slideoutEventEmitted', false)
		// showVariantsSlideout.value = false
		// emit('productVariantsUpdated', newAttributes)
	}

	const cancelVariant = () => {
		// slideoutVariants.value = JSON.parse(currentVariants)
		// emit('slideoutEventEmitted', false)
	}
</script>

<template>
	<section class="slideout">
		<div class="overlay"></div>
		<div class="slideout__wrapper" @click.self="closeSlideout">
			<transition name="slideout">
				<div class="slideout__content" v-show="showVariantEditSlideout">
					<section class="variants">
						<div class="header shadow-md">
							<div class="title">
								<span> Edit Variant: </span>
								<span v-for="term in editdVariant.attrTerms" :key="term._id"
									>{{ term.parent.name }}: {{ term.name }},
								</span>
							</div>
							<button class="btn close"><IconsClose @click.prevent="closeSlideout" /></button>
						</div>
						<div class="main">
							<pre style="font-size: 1rem">VVV{{ productVariant }}</pre>
							<h3>Select options for your variant</h3>
							<div class="attribute-terms">
								<div class="term" v-for="(term, j) in editdVariant.attrTerms" :key="term._id">
									<FormsBaseSelect
										v-model="editdVariant.attrTerms[j]._id"
										:label="term.parent.name"
										:options="getAttributeByVariantTermParent(term.parent._id)"
									/>
								</div>
								<h3>Variant Details</h3>
								<EcommerceAdminCategoryGallery
									:gallery="editdVariant.gallery"
									:galleryIntro="galleryIntro"
									galleryType="product"
									@mediaSelectorClicked="showMediaSelector = true"
								/>
								<div class="sku-stock">
									<div class="sku">
										<FormsBaseInput label="SKU" placeholder="SKU" v-model="editdVariant.sku" />
									</div>
									<div class="stock">
										<FormsBaseInput label="Stck Qty" placeholder="Stock Qty" v-model="editdVariant.stockQty" />
									</div>
								</div>
								<div class="price">
									<FormsBaseInput label="Price" placeholder="Price" currency v-model="editdVariant.price" />
								</div>
								<div class="description">
									<FormsBaseInput label="Description" placeholder="Description" v-model="editdVariant.description" />
								</div>
							</div>
						</div>
						<div class="footer actions shadow-md">
							<button class="btn btn-secondary cancel" @click.prevent="cancelVariant">Cancel</button>
							<button class="btn btn-primary save" @click.prevent="updateVariant">Save Changes</button>
						</div>
					</section>
				</div>
			</transition>
		</div>
		<div class="media-selector" v-if="showMediaSelector">
			<LazyMediaUploader
				@mediaSelected="selectMedia"
				@mediaSelectCancel="showMediaSelector = false"
				v-if="showMediaSelector"
			/>
		</div>
		<!-- <Alert v-if="showAlert" @ok="showAlert = false" @cancel="showAlert = false">
			<h3>You have unsaved changes</h3>
			<p>Please save your changes before closing this window or click cancel to exit without saving</p>
		</Alert>
		<Alert v-if="showDeleteAllVariantsAlert" @ok="deleteAllVariants" @cancel="showDeleteAllVariantsAlert = false">
			<h3>Are you sure?</h3>
			<p>All variants associated with this product will be deleted</p>
		</Alert> -->
	</section>
</template>

<style lang="scss" scoped>
	@import '@/assets/scss/variables';

	.variants {
		width: 100%;
		height: 100vh;
		background-color: $slate-100;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 2rem;
			background-color: $slate-300;

			.btn {
				border: none;
				svg {
					width: 2rem;
					height: 2rem;
				}
			}
		}

		.main {
			height: 100%;
			// border: 1px solid red;
			overflow: scroll;
			padding: 2rem;
			header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 2rem;
				background-color: $slate-300;

				.actions {
					display: flex;
					align-items: center;
					gap: 2rem;
					.base-select {
						width: 30rem;
					}
				}
			}

			main {
				form {
					display: flex;
					flex-direction: column;
					gap: 1rem;

					.btn {
						align-self: flex-end;
						margin-top: 1rem;
					}
				}
			}

			.variants-table {
				display: flex;
				flex-direction: column;
				gap: 2rem;

				header {
					display: flex;
					align-items: center;
					justify-content: space-between;
				}
			}
		}
		.footer {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: 2rem;
			padding: 2rem;
			background-color: $slate-300;
		}
	}
</style>
