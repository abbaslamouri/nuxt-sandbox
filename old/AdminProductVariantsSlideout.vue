<script setup>
import { useMessage } from '~/store/useMessage'
import { useStore } from '~/store/useStore'

const emit = defineEmits(['slideoutEventEmitted'])

const { state, fetchVariants, fetchAttributes } = useProduct()
const saveProduct = inject('saveProduct')

const store = useStore()
const appMessage = useMessage()
const variantsActionSelect = ref('')
const showDeleteVariantAlerts = ref([])
const showActions = ref([])
const regularPrice = ref(null)
const showRegularPriceInput = ref(false)
const salePrice = ref(null)
const showSalePriceInput = ref(false)
const current = ref(null)
let response = null

const variantActions = computed(() => [
  { key: 'create-all', name: 'Create variations form all attribute', disabled: false },
  { key: 'add-variant', name: 'Add Variation', disabled: false },
  {
    key: 'delete-all',
    name: 'Delete all variants',
    disabled: false,
    disabledIf: store.variants.length ? false : true,
  },
  { key: 'disabled-action', name: 'Status', disabled: true },
  {
    key: 'toggle-enabled',
    name: 'Toggle Enabled',
    disabled: false,
    disabledIf: store.variants.length ? false : true,
  },
  { key: 'disabled-action', name: 'Pricing', disabled: true },
  {
    key: 'set-regular-prices',
    name: 'Set Regular Prices',
    disabled: false,
    disabledIf: store.variants.length ? false : true,
  },
  {
    key: 'set-sale-prices',
    name: 'Set Sale Prices',
    disabled: false,
    disabledIf: store.variants.length ? false : true,
  },
])

// Fetch all attributes
response = await fetchAttributes()
if (state.errorMsg) {
  appMessage.errorMsg = state.errorMsg
  store.attributes = []
} else {
  store.attributes = response.docs
}

// Fetch variants
response = await fetchVariants(store.product._id)
if (state.errorMsg) {
  appMessage.errorMsg = state.errorMsg
  store.variants = []
} else {
  store.variants = response.docs
}
current.value = JSON.stringify(store.variants)

for (const prop in store.variants) {
  showDeleteVariantAlerts.value[prop] = false
  showActions.value[prop] = false
}

const variantBase = (terms = []) => {
  return {
    product: store.product._id,
    attrTerms: terms,
    enabled: true,
    shipping: {
      dimensions: {},
    },
    stockQty: 0,
    price: store.product.price,
    salePrice: store.product.salePrice,
    sku: '',
    gallery: [],
  }
}

const getVariantAttribute = (term, j) => {
  if (Object.values(term).length) {
    return store.attributes.find((a) => a._id == term.parent._id)
  } else {
    return store.product.attributes[j].attribute
  }
}

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

const preBulkVariants = () => {
  if (store.variants.length) {
    appMessage.alertHeading = 'Are you sure you want to recreate all variants?'
    appMessage.alertParagraph = 'This action will overwrite all existing variants'
    appMessage.alertAction = 'recreateAllVariants'
    return (appMessage.showAlert = true)
  } else bulkAddVariants()
}

const bulkAddVariants = () => {
  let terms = []
  if (!store.product.attributes.length)
    return (appMessage.errorMsg = 'I do not know how you got here but you need to create attributes first')
  for (const prop in store.product.attributes) {
    if (!store.product.attributes[prop].terms.length)
      return (appMessage.errorMsg = `All attributes must contain terms.  Attribute ${store.product.attributes[prop].attribute.name} does not contain any terms.  Please delete this attribute or add terms`)
  }
  terms = store.product.attributes.map((el) => [...el.terms])
  if (getCombinations(terms)[0].length)
    store.variants = [...getCombinations(terms)].map((el) => {
      return variantBase([...el])
    })
  console.log(store.variants)
}

const addSingleVariant = () => {
  const maxVariantCount = store.product.attributes
    .map((a) => {
      return a.terms.length
    })
    .reduce((a, b) => a * b, 1)

  if (store.variants.length === maxVariantCount)
    return (appMessage.errorMsg = 'You have created all possible variantions.  Please edit an existing one.')

  const terms = []
  for (const prop in store.product.attributes) {
    terms[prop] = {}
  }
  store.variants.unshift(variantBase([...terms]))
}

const updateVariants = async () => {
  console.log('Save', store.variants)
  let errorMsg = ''
  for (const vprop in store.variants) {
    for (const prop in store.variants[vprop].attrTerms) {
      if (!Object.keys(store.variants[vprop].attrTerms[prop]).length)
        errorMsg += `Terms missing for attribute ${
          getVariantAttribute(store.variants[vprop].attrTerms[prop], prop).name
        }<br>`
    }
  }
  if (errorMsg) return (appMessage.errorMsg = `Attribute terms are required<br> ${errorMsg}`)
  for (const prop1 in store.variants) {
    for (const prop2 in store.variants[prop1].gallery) {
      const i = store.product.gallery.findIndex((m) => m._id == store.variants[prop1].gallery[prop2]._id)
      if (i === -1) store.product.gallery.push(store.variants[prop1].gallery[prop2])
    }
  }
  saveProduct(store.product)
  current.value = JSON.stringify(store.variants)

  emit('slideoutEventEmitted', false)
}

const deleteAllVariants = async () => {
  store.variants = []
}

const toggleEnabled = () => {
  for (const prop in store.variants) {
    store.variants[prop].enabled = !store.variants[prop].enabled
  }
  appMessage.successMsg = `Status updated for all variants`
}

const setRegularPrices = () => {
  for (const prop in store.variants) {
    store.variants[prop].price = regularPrice.value
  }
  appMessage.successMsg = `Regular prices updated for all variants`
  showRegularPriceInput.value = false
}

const setSalePrices = () => {
  for (const prop in store.variants) {
    store.variants[prop].salePrice = salePrice.value
  }
  appMessage.successMsg = `Sale  prices updated for all variants`
  showSalePriceInput.value = false
}

const closeSlideout = () => {
  if (current.value !== JSON.stringify(store.variants)) {
    appMessage.alertHeading = 'You have unsaved changes'
    appMessage.alertParagraph =
      'Please save your changes before closing this window or click cancel to exit without saving'
    appMessage.showAlertCancelBtn = false
    return (appMessage.showAlert = true)
  }
  emit('slideoutEventEmitted', false)
}

const cancelVariants = () => {
  store.variants = JSON.parse(current.value)
  emit('slideoutEventEmitted', false)
}

const handleVariantsAction = () => {
  if (!variantsActionSelect.value) return (appMessage.errorMsg = 'Please select an action')
  switch (variantsActionSelect.value) {
    case 'create-all':
      preBulkVariants()
      break
    case 'add-variant':
      addSingleVariant()
      break
    case 'delete-all':
      appMessage.alertHeading = 'Are you sure?'
      appMessage.alertParagraph = 'All variants associated with this product will be deleted'
      appMessage.alertAction = 'deleteAllVariants'
      appMessage.showAlert = true
      // showDeleteAllVariantsAlert.value = true
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

watch(
  () => appMessage.showAlert,
  (currentVal) => {
    if (currentVal !== 'ok') return
    appMessage.alertHeading = ''
    appMessage.alertParagraph = ''
    if (appMessage.alertAction === 'recreateAllVariants') bulkAddVariants()
    if (appMessage.alertAction === 'deleteAllVariants') deleteAllVariants()
    appMessage.showAlert = false
  },
  { deep: true }
)
</script>

<template>
  <Slideout @closeSlideout="closeSlideout" class="variants">
    <template v-slot:header>
      <h3 class="title">Edit Variants</h3>
    </template>
    <template v-slot:default>
      <!-- <pre style="font-size: 1rem">{{ store.variants }}</pre> -->
      <div v-if="store.product._id" class="variants-details">
        <header>
          <h2>Variants</h2>
          <div class="variants-actions">
            <FormsBaseSelect
              v-model="variantsActionSelect"
              nullOption="Select Action"
              :options="variantActions"
              @update:modelValue="handleVariantsAction"
            />
            <div class="price-actions">
              <form v-if="showRegularPriceInput" @submit.prevent="setRegularPrices">
                <div class="regular-price">
                  <div class="base-input">
                    <label>Regular Price</label>
                    <input type="text" class="bg-gray-300" v-model="regularPrice" />
                  </div>
                  <button class="btn btn-secondary">submit</button>
                </div>
              </form>
              <form v-if="showSalePriceInput" @submit.prevent="setSalePrices">
                <div class="sale-price">
                  <div class="base-input">
                    <label>Sale Price</label>
                    <input type="text" class="bg-gray-300" v-model="salePrice" />
                  </div>
                  <button class="btn btn-secondary">submit</button>
                </div>
              </form>
            </div>
            <button class="btn btn-primary" @click="preBulkVariants">Bulk Add</button>
          </div>
        </header>
        <main>
          <div class="table admin-product-variants" v-if="store.variants.length">
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
            <div class="table__body" v-show="store.variants.length">
              <EcommerceAdminProductVariantCard
                v-if="store.variants.length"
                v-for="(variant, index) in store.variants"
                :index="index"
                :showDeleteVariantAlert="showDeleteVariantAlerts[index]"
                :showActions="showActions[index]"
                @showDeleteVariantAlertEmitted="handleShowDeleteVariantAlert(index, $event)"
                @showActionsEmitted="handleShowActions(index, $event)"
              />
            </div>
          </div>
        </main>
      </div>
      <div v-else>
        <EcommerceAdminProductEmptyAttributesMsg
          :productId="store.product._id"
          @slideoutEventEmitted="$emit('slideoutEventEmitted', $event)"
        />
      </div>
      <!-- </div> -->
    </template>
    <template v-slot:footer>
      <div class="actions">
        <button class="btn btn-secondary" @click.prevent="cancelVariants">Cancel</button>
        <button
          class="btn btn-primary"
          @click.prevent="updateVariants"
          :disabled="current == JSON.stringify(store.variants)"
        >
          Save Changes
        </button>
      </div>
    </template>
  </Slideout>
  <!-- 
	<section class="slideout">
		<div class="overlay"></div>
		<div class="slideout__wrapper" @click.self="closeSlideout">
			<transition name="slideout">
				<div class="slideout__content" v-if="store.showVariantsSlideout">
					<section class="variants">
						<div class="header shadow-md">
							<h3 class="title">Edit Variants</h3>
							<button class="btn close"><IconsClose @click.prevent="closeSlideout" /></button>
						</div>
						<div class="main">
							<div v-if="!store.product._id">
								<EcommerceAdminProductEmptyAttributesMsg
									:productId="store.product._id"
									@slideoutEventEmitted="$emit('slideoutEventEmitted', $event)"
								/>
							</div>
							<div v-else class="variants-table">
								<header>
									<h2>Variants</h2>
									<div class="actions">
										<FormsBaseSelect
											v-model="variantsActionSelect"
											nullOption="Select Action"
											:options="variantActions"
											@update:modelValue="handleVariantsAction"
										/>
										<div class="price-actions">
											<form v-if="showRegularPriceInput" @submit.prevent="setRegularPrices">
												<div class="regular-price">
													<div class="base-input">
														<label>Regular Price</label>
														<input type="text" class="bg-gray-300" v-model="regularPrice" />
													</div>
													<button class="btn btn-secondary">submit</button>
												</div>
											</form>
											<form v-if="showSalePriceInput" @submit.prevent="setSalePrices">
												<div class="sale-price">
													<div class="base-input">
														<label>Sale Price</label>
														<input type="text" class="bg-gray-300" v-model="salePrice" />
													</div>
													<button class="btn btn-secondary">submit</button>
												</div>
											</form>
										</div>
										<button class="btn btn-primary" @click="preBulkVariants">Bulk Add</button>
									</div>
								</header>
								<main>
									<div class="table admin-product-variants" v-if="store.variants.length">
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
										<div class="table__body" v-show="store.variants.length">
											<EcommerceAdminProductVariantCard v-for="(variant, index) in store.variants" :index="index" />
										</div>
									</div>
								</main>
							</div>
						</div>
						<div class="footer actions shadow-md">
							<button class="btn btn-secondary cancel" @click.prevent="cancelVariants">Cancel</button>
							<button
								class="btn btn-primary save"
								@click.prevent="updateVariants"
								:disabled="current == JSON.stringify(store.variants)"
							>
								Save Changes
							</button>
						</div>
					</section>
				</div>
			</transition>
		</div>
		<Alert v-if="showAlert" @ok="showAlert = false" @cancel="showAlert = false" :showCancelBtn="false">
			<h3>You have unsaved changes</h3>
			<p>Please save your changes before closing this window or click cancel to exit without saving</p>
		</Alert>
		<Alert v-if="showDeleteAllVariantsAlert" @ok="deleteAllVariants" @cancel="showDeleteAllVariantsAlert = false">
			<h3>Are you sure?</h3>
			<p>All variants associated with this product will be deleted</p>
		</Alert>
		<Alert v-if="showBulkVariantsAlert" @ok="bulkAddVariants" @cancel="showBulkVariantsAlert = false">
			<h3>Are you sure you want to recreate all variants?</h3>
			<p>This action will overwrite all existing variants</p>
		</Alert>
	</section> -->
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.variants {
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
