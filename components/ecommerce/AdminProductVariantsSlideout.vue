<script setup>
import { createReturnStatement } from '@vue/compiler-core'
import { useMessage } from '~/store/useMessage'
import { useStore } from '~/store/useStore'

const emit = defineEmits(['slideoutEventEmitted'])

const { state, save, fetchVariants, saveVariants, deleteVariants } = useProduct()
const saveProduct = inject('saveProduct')

const store = useStore()
const appMessage = useMessage()
const showAlert = ref(false)
const showDeleteAllVariantsAlert = ref(false)
const showBulkVariantsAlert = ref(false)
const variantsActionSelect = ref('')
const regularPrice = ref(null)
const showRegularPriceInput = ref(false)
const salePrice = ref(null)
const showSalePriceInput = ref(false)
const current = ref(null)

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

const response = await fetchVariants(store.product._id)
if (state.errorMsg) {
  appMessage.errorMsg = state.errorMsg
  store.variants = []
} else {
  store.variants = response.docs
}
current.value = JSON.stringify(store.variants)

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

  showBulkVariantsAlert.value = false
}

const preBulkVariants = () => {
  if (store.variants.length) showBulkVariantsAlert.value = true
  else bulkAddVariants()
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
  saveProduct(store.product)
  current.value = JSON.stringify(store.variants)

  emit('slideoutEventEmitted', false)
}

const deleteAllVariants = async () => {
  store.variants = []
  showDeleteAllVariantsAlert.value = false
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
  if (current.value !== JSON.stringify(store.variants)) return (showAlert.value = true)
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
      showDeleteAllVariantsAlert.value = true
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
  console.log('hererereer')
  setTimeout(() => {
    variantsActionSelect.value = ''
  }, 10)
}
</script>

<template>
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
              <!-- <pre style="font-size: 1rem">{{ store.variants }}</pre> -->
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
                      <!-- <button class="btn btn-primary" @click="handleVariantsAction">Go</button> -->
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
        gap: 4rem;

        .base-select {
          width: 30rem;
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

  .save {
    &:disabled {
      background-color: $slate-400;
      cursor: not-allowed;
    }
  }
}
</style>
