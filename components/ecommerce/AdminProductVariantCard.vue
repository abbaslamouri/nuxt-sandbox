<script setup>
	const props = defineProps({
		productVariant: {
			type: Object,
			required: true,
		},
		productAttributes: {
			type: Array,
			required: true,
		},
		index: {
			type: Number,
			required: true,
		},
		attributes: {
			type: Array,
		},
		attributeTerms: {
			type: Array,
		},
	})

	defineEmits(['mediaSelectorClicked', 'showVariantSlideout'])

	// const props = defineProps({
	//   // variant: Object,
	//   index: Number,
	// })
	const cardVariant = ref({})

	const showActions = ref(false)
	const showVariantSlideout = ref(false)
	const showRemoveVariantAlert = ref(false)
	const showVariantEditSlideout = ref(false)

	cardVariant.value = { ...props.productVariant }

	const getAttribute = (attributeId) => {
		// return prodState.selectedItem.attributes.filter((el) => el.item._id == attributeId)[0].item
	}

	const getTerms = (attributeId) => {
		// const terms = prodState.selectedItem.attributes.filter((el) => el.item._id == attributeId)[0].terms
		// return terms
	}

	const removeProductVariant = () => {
		// if (!confirm('Are you sure?')) return
		// prodState.selectedItem.variants.splice(props.i, 1)
	}

	const updateVariant = (attribute, termId) => {
		// console.log('AT', attribute)
		// console.log(value)
		// const term = attribute.terms.find((t) => t._id == termId)
		// console.log('T', term)
		// if (!prodState.selectedItem.variants[props.i].attrTerms.length) {
		// prodState.selectedItem.variants[props.i].attrTerms.push(term)
		// }
	}
</script>

<!-- &&
      prodState.selectedItem.variants[i].attrTerms &&
      prodState.selectedItem.variants[i].attrTerms.length -->

<template>
	<div class="admin-product-variant row">
		<!-- {{ cardVariant }} -->
		<div class="thumb td" @click="$emit('showVariantSlideout')">
			<img v-if="cardVariant.gallery[0]" :src="cardVariant.gallery[0].path" alt="Variant Image" />
			<img v-else src="/placeholder.png" alt="Variant Image" />
		</div>
		<div class="option td" @click="$emit('showVariantSlideout')">
			<div v-for="term in cardVariant.attrTerms" :key="term" class="attribute-term">
				<div class="attribute">
					{{ attributes.find((a) => a._id == term.parent._id).name }}
				</div>
				<div class="term">
					{{ attributeTerms.find((t) => t._id == term._id).name }}
				</div>
			</div>
		</div>
		<div class="stock-qty td">
			<div v-if="!cardVariant.manageInventory">&infin;</div>
			<div v-else>{{ cardVariant.stockQty }}</div>
		</div>
		<div class="price td">{{ cardVariant.price }}</div>
		<div class="sku td">{{ cardVariant.sku }}</div>
		<div class="actions td">
			<button class="btn" @click.prevent="showActions = !showActions"><IconsMoreHoriz /></button>
			<div class="menu shadow-md" v-show="showActions">
				<a href="#" class="link" @click.prevent="showVariantEditSlideout = true">
					<div class="edit">Edit</div>
				</a>
				<a href="#" class="link" @click.prevent="showRemoveVariantAlert = true">
					<div class="cancel">Delete</div>
				</a>
			</div>
		</div>
		<Alert v-if="showRemoveVariantAlert" @ok="removeProductVariant = false" @cancel="showRemoveVariantAlert = false">
			<h3>You have unsaved changes</h3>
			<p>Please save your changes before closing this window or click cancel to exit without saving</p>
		</Alert>
		<EcommerceAdminProductVariantEditSlideout
			v-if="showVariantEditSlideout"
			:product-attributes="productAttributes"
			:productVariant="productVariant"
			:showVariantEditSlideout="showVariantEditSlideout"
			@editSlideoutEventEmitted="showVariantEditSlideout = $event"
		/>
	</div>
</template>

<style lang="scss" scoped>
	@import '@/assets/scss/variables';

	.admin-product-variant {
		cursor: pointer;

		.td {
			display: flex;
			align-items: center;
		}

		.thumb {
			width: 5rem;
			height: 5rem;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}

		.option {
			display: flex;
			.attribute-term {
				display: flex;
				align-items: center;
				// cursor: pointer;

				.attribute {
					background-color: $slate-400;
					color: white;
					padding: 0.25rem 0.5rem 0.3rem;
					border-radius: 2rem 0 0 2rem;
				}

				.term {
					background-color: $slate-200;
					padding: 0.25rem 0.5rem 0.3rem;
					border-radius: 0 2rem 2rem 0;
				}
			}
		}

		.actions {
			display: flex;
			justify-content: flex-end;
		}
	}
</style>
