<script setup>
import { useMessage } from '~/store/useMessage'
import { useStore } from '~/store/useStore'

const props = defineProps({
  // product: {
  //   type: Object,
  // },
  // productVariants: {
  //   type: Array,
  // },
  // product.attributes: {
  // 	type: Array,
  // },
  // productId: {
  //   type: String,
  // },
  // showVariantsSlideout: {
  //   type: Boolean,
  // },
})

const emit = defineEmits(['slideoutEventEmitted'])

const store = useStore()
const router = useRouter()
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

// for (const prop in store.productVariants) {
//   store.variants.push(store.productVariants[prop])
// }
const currentVariants = JSON.stringify(store.variants)

// console.log('COMPARE', currentVariants === JSON.stringify(store.variants))

const variantActions = ref([
  { key: 'create-all', name: 'Create variations form all attribute', disable: false },
  { key: 'add-variant', name: 'Add Variation', disabled: false },
  {
    key: 'delete-all',
    name: 'Delete all variants',
    disabled: false,
    disabledIf: !store.variants.length,
  },
  { key: 'disabled-action', name: 'Status', disabled: true },
  {
    key: 'toggle-enabled',
    name: 'Toggle Enabled',
    disabled: false,
    disabledIf: !store.variants.length,
  },
  {
    key: 'toggle-downloadable',
    name: 'Toggle Downloadable',
    disabled: false,
    disabledIf: !store.variants.length,
  },
  { key: 'disabled-action', name: 'Pricing', disabled: true },
  {
    key: 'set-regular-prices',
    name: 'Set Regular Prices',
    disabled: false,
    disabledIf: !store.variants.length,
  },
  {
    key: 'set-sale-prices',
    name: 'Set Sale Prices',
    disabled: false,
    disabledIf: !store.variants.length,
  },
])

const variantParams = computed(() => {
  return {
    fields: 'product, attrTerms, gallery, price, salePrice, sku, stockQty, enabled',
  }
})
const fetchVariants = async () => {
  appMessage.errorMsg = null
  try {
    variantParams.value.product = store.product._id
    const response = await $fetch('/api/v1/variants', { params: variantParams.value })
    store.variants = response.docs
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

await fetchVariants()

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
  terms = store.product.attributes.map((el) => [...el.terms])
  if (getCombinations(terms)[0].length)
    store.variants = [...getCombinations(terms)].map((el) => {
      return {
        product: store.product._id,
        attrTerms: [...el],
        enabled: true,
        shipping: {
          dimensions: {},
        },
        stockQty: 0,
        price: store.product.price,
        sku: '',
        gallery: [],
      }
    })
}

const addSingleVariant = () => {
  // const attributes = store.product.attributes.filter((a) => a.terms && a.terms.length > 0)
  const variant = {
    product: store.product._id,
    attrTerms: [],
    enabled: true,
    shipping: {
      dimensions: {},
    },
    stockQty: 0,
    price: store.product.price,
    sku: '',
    gallery: [],
  }
  for (const prop in store.product.attributes) {
    variant.attrTerms[prop] = {}
  }
  store.variants.unshift(variant)
  console.log(store.variants)
}

const insertEmptyAttribute = () => {
  // console.log(store.variants.length == attributes.value.length)
  if (store.variants.length == attributes.value.length)
    return (appMessage.errorMsg = 'You have used all available attributes')
  store.variants.push({
    attribute: {},
    terms: [],
    defaultTerm: '',
    active: true,
    variation: false,
  })
}

const updateCompAttribute = (event) => {
  // console.log('MNMNMNM')
  store.variants[event.index] = event.attr
}

const getAttribute = (attributeId) => {
  // return prodState.selectedItem.attributes.filter((el) => el.item._id == attributeId)[0].item
}

const getTerms = (attributeId) => {
  // const terms = prodState.selectedItem.attributes.filter((el) => el.item._id == attributeId)[0].terms
  // return terms
}

const removeVariant = () => {
  // if (!confirm('Are you sure?')) return
  // prodState.selectedItem.variants.splice(props.index, 1)
}

const updateVariants = async () => {
  console.log('Save')
  appMessage.errorMsg = null
  try {
    const response = await $fetch('/api/v1/variants/delete-many', {
      method: 'POST',
      params: { id: store.product._id },
    })
    console.log('deletedCount', response.deletedCount)
    let message = ''
    let error = ''
    // const newVariants = []
    await Promise.all(
      store.variants.map(async (variant) => {
        try {
          const response = await $fetch(`/api/v1/variants`, {
            method: 'POST',
            body: variant,
          })
          message += ` deleted.<br>`
        } catch (err) {
          console.error('MyERROR', err)
          error += `${err.data}.<br>`
        }
      })
    )
    emit('slideoutEventEmitted', false)
    console.log('saved', store.variants)

    router.push({ name: 'admin-ecommerce-products-slug', params: { slug: response.slug } })
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

const deleteAllVariants = async () => {
  appMessage.errorMsg = null
  try {
    const response = await $fetch('/api/v1/variants/delete-many', {
      method: 'POST',
      params: { id: store.product._id },
    })
    // console.log('deletedCount', response.deletedCount)
    if (response.deletedCount) appMessage.successMsg = 'All variants deleted succesfuluy'
    store.variants = []
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

// const updateVariant = (event) => {
//   console.log('I', index)
//   // console.log('AT', attribute)
//   // console.log(value)
//   // const term = attribute.terms.find((t) => t._id == termId)
//   // console.log('T', term)
//   // if (!prodState.selectedItem.variants[props.index].attrTerms.length) {
//   // prodState.selectedItem.variants[props.index].attrTerms.push(term)
//   // }
// }

const closeSlideout = () => {
  if (currentVariants !== JSON.stringify(store.variants)) return (showAlert.value = true)
  emit('slideoutEventEmitted', false)
}

const saveslideoutVariants = () => {
  const newAttributes = []
  for (const prop in store.variants) {
    if (Object.values(store.variants[prop].attribute).length) newAttributes.push(store.variants[prop])
  }
  store.variants = newAttributes
  // console.log('CCCC', store.variants)
  // emit('slideoutVariantsUpdated', store.variants)

  // showVariantsSlideout.value = false
  // emit('productVariantsUpdated', newAttributes)
}

const updatesVariants = async () => {
  // emit('slideoutVariantsUpdated', store.variants)
  // emit('slideoutEventEmitted', false)
  // showVariantsSlideout.value = false
  // emit('productVariantsUpdated', newAttributes)
}

const cancelVariants = () => {
  store.variants = JSON.parse(currentVariants)
  emit('slideoutEventEmitted', false)
}

// const deleteAllVariants = () => {
//   emit('deleteAllVariantsEventEmitted')
//   showDeleteAllVariantsAlert.value = false
// }

// watch(
//   () => store.variants,
//   (current) => {
//     console.log(current)
//     emit('slideoutVariantsUpdated', store.variants)
//   },
//   { deep: true }
// )

const handleVariantsAction = () => {
  if (!variantsActionSelect.value) return (appMessage.errorMsg = 'Please select an action')
  switch (variantsActionSelect.value) {
    case 'create-all':
      bulkAddVariants()
      break
    case 'add-variant':
      addSingleVariant()
      break
    case 'delete-all':
      showDeleteAllVariantsAlert.value = true
      break
    //   case 'toggle-enabled':
    //     toggleEnabled()
    //     break
    //   case 'toggle-virtual':
    //     toggleVirtual()
    //     break
    //   case 'toggle-downloadable':
    //     toggleDownloadable()
    //     break
    //   case 'set-regular-prices':
    //     showRegularPricesInput.value = true
    //     break
    //   case 'set-sale-prices':
    //     showSalePricesInput.value = true
    //     break
  }
  variantsActionSelect.value = ''
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
              <pre style="font-size: 1rem">{{ store.product.attributes }}======={{ store.variants }}</pre>
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
                    />
                    <div class="actions">
                      <form v-if="showRegularPricesInput" @submit.prevent="setRegularPrices">
                        <label>Regular Price</label>
                        <input type="text" class="bg-gray-300" v-model="regularPrices" />
                        <button class="btn">submit</button>
                      </form>
                      <form v-if="showSalePricesInput" @submit.prevent="setSalePrices">
                        <label>Sale Price</label>
                        <input type="text" class="bg-gray-300" v-model="salePrices" />
                        <button class="btn">submit</button>
                      </form>
                      <button class="btn btn-primary" @click="handleVariantsAction">Go</button>
                      <button class="btn btn-primary" @click="bulkAddVariants">Bulk Add</button>
                    </div>
                  </div>
                </header>
                <main>
                  <div class="table admin-product-variants">
                    <div class="table__header">
                      <div class="row">
                        <div class="th">Image</div>
                        <div class="th">Variation</div>
                        <div class="th">Stock Qty.</div>
                        <div class="th">Price</div>
                        <div class="th">SKU</div>
                        <div class="th">Actions</div>
                      </div>
                    </div>
                    <div class="table__body" v-show="store.variants.length">
                      <EcommerceAdminProductVariantCard
                        v-for="(variant, index) in store.variants"
                        :index="index"
                        @variantUpdated="updateVariants"
                      />
                    </div>
                  </div>
                </main>
              </div>
            </div>
            <div class="footer actions shadow-md">
              <button class="btn btn-secondary cancel" @click.prevent="cancelVariants">Cancel</button>
              <button class="btn btn-primary save" @click.prevent="updateVariants">Save Changes</button>
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
