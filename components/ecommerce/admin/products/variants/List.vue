<script setup>
	const emit = defineEmits(['removeVariant', 'saveVariants', 'closeSlideout'])

	const allAttributes = inject('allAttributes')

	const showVariantEditSlideoutKeys = ref([])

	const { product, variants } = useStore()
	const showActionKeys = ref([])

	const resetActions = () => {
		for (const prop in variants.value) {
			showActionKeys.value[prop] = false
		}
	}

	const setActions = (payload) => {
		resetActions()
		showActionKeys.value[payload.index] = payload.action
	}

	const handleRemoveVariant = (variantIndex) => {
		resetActions()
		emit('removeVariant', variantIndex)
	}

	const getVariantAttribute = (term, j) => {
		if (Object.values(term).length) {
			return allAttributes.find((a) => a._id == term.parent._id)
		} else {
			return product.value.attributes[j].attribute
		}
	}

	const openVariantEditSlideout = (i) => {
		showVariantEditSlideoutKeys.value[i] = true
		resetActions()
	}
</script>

<template>
	<table class="text-xs shadow-md">
		<thead>
			<tr class="bg-slate-200">
				<th>ID</th>
				<th class="">Image</th>
				<th>Variation</th>
				<th>Enabled</th>
				<th>Stock Qty.</th>
				<th>Price</th>
				<th>Sale Price</th>
				<th>SKU</th>
				<th class="text-right minw12">Actions</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(variant, index) in variants" :key="`variant-${index}`">
				<td>
					<div class="bg-slate-200 p1 br3">{{ index + 1 }}</div>
				</td>
				<td class="w5 h5">
					<!-- <div class="w5 h5"> -->
					<img
						class="wfull hfull contain"
						v-if="variant.gallery[0]"
						:src="variant.gallery[0].path"
						alt="Variant Image"
					/>
					<img class="wfull hfull contain" v-else src="/placeholder.png" alt="Variant Image" />
					<!-- </div> -->
				</td>
				<td class="">
					<div class="flex-row" v-for="(term, j) in variants[index].attrTerms" :key="term">
						<div class="attribute">
							{{ getVariantAttribute(term, j).name }}
						</div>
						<div class="term">
							{{ term.name }}
						</div>
					</div>
				</td>
				<td class="">{{ variant.enabled ? 'Enabled' : 'Disabled' }}</td>
				<td>
					<div v-if="!product.manageInventory">&infin;</div>
					<div v-else>{{ variants[index].stockQty }}</div>
				</td>
				<td>{{ variants[index].price }}</td>
				<td class="">{{ variants[index].salePrice }}</td>
				<td class="">{{ variants[index].sku }}</td>
				<td>
					<EcommerceAdminActions
						:showAction="showActionKeys[index]"
						:showEdit="true"
						@moreHoriz="setActions({ index: index, action: !showActionKeys[index] })"
						@deleteAction="handleRemoveVariant(index)"
						@editAction="openVariantEditSlideout(index)"
					/>
					<EcommerceAdminProductsVariantsEditSlideout
						v-if="showVariantEditSlideoutKeys[index]"
						:index="index"
						@closeSlideout="showVariantEditSlideoutKeys[index] = false"
					/>
				</td>
			</tr>
		</tbody>
	</table>
	<!-- <div class="table admin-product-variants" v-if="variants.length">
		<div class="table__header">
			<div class="row">
				<div class="th">ID</div>
				<div class="th">Image</div>
				<div class="th">Variation</div>
				<div class="th">Enabled</div>
				<div class="th">Stock Qty.</div>
				<div class="th">Price</div>
				<div class="th">Sale Price</div>
				<div class="th">SKU</div>
				<div class="th">Actions</div>
			</div>
		</div>
		<div class="table__body" v-show="variants.length">
			<EcommerceAdminProductsVariantsCard
				v-if="variants.length"
				v-for="(variant, index) in variants"
				:index="index"
				:showAction="showActionKeys[index]"
				@setActions="setActions"
				@resetActions="resetActions"
				@removeVariant="handleRemoveVariant"
			/>
		</div>
	</div> -->
</template>

<style lang="scss" scoped>
	// @import '@/assets/scss/variables';

	// .variantss {
	// 	.variants-details {
	// 		display: flex;
	// 		flex-direction: column;
	// 		gap: 2rem;
	// 		overflow: auto;
	// 		padding: 2rem;

	// 		header {
	// 			display: flex;
	// 			align-items: center;
	// 			justify-content: space-between;
	// 			padding: 1rem;
	// 			background-color: $slate-300;

	// 			.variants-actions {
	// 				display: flex;
	// 				align-items: center;
	// 				gap: 4rem;

	// 				.base-select {
	// 					width: 30rem;
	// 					height: 4rem;
	// 				}

	// 				.price-actions {
	// 					.regular-price,
	// 					.sale-price {
	// 						display: flex;
	// 						align-items: center;
	// 						gap: 1rem;
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}

	// 	.actions {
	// 		display: flex;
	// 		align-items: center;
	// 		justify-content: flex-end;
	// 		gap: 2rem;

	// 		.btn {
	// 			&:disabled {
	// 				background-color: $slate-400;
	// 				cursor: not-allowed;
	// 			}
	// 		}
	// 	}
	// }
</style>
