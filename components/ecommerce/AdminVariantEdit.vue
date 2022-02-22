<script setup>
	const props = defineProps({
		prodVariantEdit: {
			type: Object,
			required: true,
		},
		editIndex: {
			type: Number,
			required: true,
		},

		showVariantSlideout: {
			type: Boolean,
		},
	})

	defineEmits(['closeVariantSlideout'])

	const prodState = inject('prodState')
	const attState = inject('attState')
	const attTermsState = inject('attTermsState')
	const handleMediaSelectorClick = inject('handleMediaSelectorClick')
	const processSelectedMedia = inject('processSelectedMedia')

	const getAttributeByVariantTermId = (termId) => {
		return attState.items.find((a) => a._id == attTermsState.items.find((t) => t._id == termId).parent)
	}

	// defineEmits(['mediaSelectorClicked', 'showVariantSlideout'])
</script>

<template>
	<div class="variant-edit">
		<Slideout :showSlideout="showVariantSlideout">
			<template v-slot:header>
				<div class="header shadow-md">
					<h3 class="title">Edit Variants</h3>
					<!-- <div class="options td">
            <div v-for="(attribute, j) in prodState.selectedItem.attributes" :key="attribute.attribute._id" class="attribute">
              <span class="attribute">
                {{ attState.items.find((a) => a._id == attTermsState.items.find((t) => t._id == term).parent).name }}:
              </span>
              <span class="term">
                {{ attTermsState.items.find((t) => t._id == term).name }}
              </span>
            </div>
          </div> -->
					<button class="btn close"><IconsClose @click.prevent="$emit('closeVariantSlideout')" /></button>
				</div>
			</template>
			<div class="main">
				<!-- <pre style="font-size: 1rem">{{ prodState.selectedItem }}</pre> -->

				<h3>Select options for your variant</h3>
				<div class="attributes" v-if="prodState.selectedItem.attributes">
					<div class="attribute" v-for="(term, j) in prodVariantEdit.attrTerms" :key="term._id">
						<FormsBaseSelect
							v-model="prodState.selectedItem.variants[editIndex].attrTerms[j]._id"
							:label="getAttributeByVariantTermId(term._id).name"
							:options="
								attTermsState.items
									.filter((t) => t.parent == getAttributeByVariantTermId(term._id)._id)
									.map((el) => {
										return { key: el._id, name: el.name }
									})
							"
						/>
						<!-- <select v-model="prodState.selectedItem.variants[editIndex].attrTerms[j]">
              <option
                v-for="id in prodState.selectedItem.attributes.find(
                  (a) => a.attribute == getAttributeByVariantTermId(termId)._id
                ).terms"
                :key="id"
                :value="id"
              >
                {{ attTermsState.items.find((t) => t._id == id).name }}
              </option>
            </select>  -->
						<!-- <div class="attribute"> -->
						<!-- <FormsBaseSelect
              v-model="prodState.selectedItem.variants[editIndex].attrTerms[j]"
              :label="getAttributeByVariantTermId(termId).name"
              :options="
                prodState.selectedItem.attributes
                  .find((a) => a.attribute == getAttributeByVariantTermId(termId)._id)
                  .terms.map((el) => {
                    return { key: el, name: attTermsState.items.find((t) => t._id == el).name }
                  })
              "
            /> -->
					</div>
				</div>
				<!-- </div> -->
				<h3>Variant Details</h3>
				<!-- <div class="image"> -->
				<ProductsAdminVariantImageGallery :editIndex="editIndex" />

				<!-- @click.prevent="handleMediaSelectorClick({ image: 'variant', index })" -->
				<!-- </div> -->
				<div class="sku-stock">
					<div class="sku">
						<FormsBaseInput label="SKU" placeholder="SKU" v-model="prodState.selectedItem.variants[editIndex].sku" />
					</div>
					<div class="stock">
						<FormsBaseInput
							label="Stck Qty"
							placeholder="Stock Qty"
							v-model="prodState.selectedItem.variants[editIndex].stockQty"
						/>
					</div>
				</div>
				<div class="price">
					<FormsBaseInput
						label="Price"
						placeholder="Price"
						currency
						v-model="prodState.selectedItem.variants[editIndex].price"
					/>
				</div>
				<div class="description">
					<FormsBaseInput
						label="Description"
						placeholder="Description"
						v-model="prodState.selectedItem.variants[editIndex].description"
					/>
				</div>
				<div class="sku-stock">
					<div class="sku">
						<FormsBaseInput label="SKU" placeholder="SKU" v-model="prodState.selectedItem.variants[editIndex].sku" />
					</div>
					<div class="stock">
						<FormsBaseInput
							label="Stck Qty"
							placeholder="Stock Qty"
							v-model="prodState.selectedItem.variants[editIndex].stockQty"
						/>
					</div>
				</div>
				<div class="price">
					<FormsBaseInput
						label="Price"
						placeholder="Price"
						currency
						v-model="prodState.selectedItem.variants[editIndex].price"
					/>
				</div>
				<div class="description">
					<FormsBaseInput
						label="Description"
						placeholder="Description"
						v-model="prodState.selectedItem.variants[editIndex].description"
					/>
				</div>
			</div>
			<template v-slot:footer>
				<div class="footer shadow-md">
					<div class="actions">
						<button class="btn btn-secondary cancel" @click="saveAttributes">Cancel</button>
						<button class="btn btn-primary save" @click="$emit('closeVariantSlideout')">Save Changes</button>
					</div>
				</div>
			</template>
		</Slideout>
	</div>
</template>

<style lang="scss" scoped>
	@import '@/assets/scss/variables';

	.variant-edit {
		.header {
			gap: 2rem;
			.options {
				flex: 1;
				// border:1px solid red;
				display: flex;
				align-items: center;
				gap: 3rem;
				font-weight: 500;

				.attribute-term {
					// display: flex;
					// align-items: center;
					// gap:3rem;
				}
			}
		}

		.main {
			display: flex;
			flex-direction: column;
			gap: 2rem;
			padding: 2rem;

			.attributes {
				display: flex;
				align-items: center;
				justify-content: space-evenly;
				gap: 1rem;

				.attribute {
					flex: 1;
				}

				// select {
				//   width: 100%;
				//   border: 1px solid red;
				// }
			}

			.sku-stock {
				display: flex;
				align-items: center;
				gap: 2rem;
				.sku,
				.stock {
					flex: 1;
				}
			}
		}
	}
</style>
