<script setup>
import { useMessage } from '~/store/useMessage'

const props = defineProps({
  product: {
    type: Object,
  },
  productVariants: {
    type: Array,
  },
  productAttributes: {
    type: Array,
  },
  productId: {
    type: String,
  },
  showVariantsSlideout: {
    type: Boolean,
  },
})

const emit = defineEmits(['saveVariants', 'slideoutEventEmitted', 'slideoutVariantsUpdated'])

const appMessage = useMessage()
const attributes = ref([])
const attributeTerms = ref([])
const showAlert = ref(false)
const slideoutVariants = ref([])
const variantsActionSelect = ref('')
const regularPrices = ref(null)
const showRegularPricesInput = ref(false)
const salePrices = ref(null)
const showSalePricesInput = ref(false)

for (const prop in props.productVariants) {
  slideoutVariants.value.push(props.productVariants[prop])
}
const currentVariants = JSON.stringify(slideoutVariants.value)

console.log('COMPARE', currentVariants === JSON.stringify(slideoutVariants.value))

const variantActions = ref([
  { key: 'create-all', name: 'Create variations form all attribute', disable: false },
  { key: 'add-variant', name: 'Add Variation', disabled: false },
  {
    key: 'delete-all',
    name: 'Delete all variants',
    disabled: false,
    disabledIf: !slideoutVariants.value.length,
  },
  { key: 'disabled-action', name: 'Status', disabled: true },
  {
    key: 'toggle-enabled',
    name: 'Toggle Enabled',
    disabled: false,
    disabledIf: !slideoutVariants.value.length,
  },
  {
    key: 'toggle-downloadable',
    name: 'Toggle Downloadable',
    disabled: false,
    disabledIf: !slideoutVariants.value.length,
  },
  { key: 'disabled-action', name: 'Pricing', disabled: true },
  {
    key: 'set-regular-prices',
    name: 'Set Regular Prices',
    disabled: false,
    disabledIf: !slideoutVariants.value.length,
  },
  {
    key: 'set-sale-prices',
    name: 'Set Sale Prices',
    disabled: false,
    disabledIf: !slideoutVariants.value.length,
  },
])

const attributeParams = computed(() => {
  return {
    fields: 'name, slug',
  }
})
const attributeTermsParams = computed(() => {
  return {
    fields: 'name, slug, parent',
  }
})

const fetchAttributes = async () => {
  appMessage.errorMsg = null
  try {
    const response = await $fetch('/api/v1/attributes', { params: attributeParams.value })
    attributes.value = response.docs
    console.log('Attributes', attributes.value)
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

const fetchAttributeTerms = async () => {
  appMessage.errorMsg = null
  try {
    const response = await $fetch('/api/v1/attributeterms', { params: attributeTermsParams.value })
    attributeTerms.value = response.docs
    console.log('Terms', attributeTerms.value)
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

// for (const prop in props.productVariants) {
//   slideoutVariants.value.push(props.productVariants[prop])
// }

await Promise.all([fetchAttributes(), fetchAttributeTerms()])

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
  if (!props.productAttributes.length) {
  } else {
    for (const prop in props.productAttributes) {
    }
    terms = props.productAttributes.map((el) => [...el.terms])
    console.log('TERMS', terms)
  }
  // Add term combinations if any to variants
  if (getCombinations(terms)[0].length)
    slideoutVariants.value = [...getCombinations(terms)].map((el) => {
      return {
        product: props.product._id,
        attrTerms: [...el],
        enabled: true,
        shipping: {
          dimensions: {},
        },
        stockQty: 0,
        price: props.product.price,
        sku: '',
        gallery: [],
      }
    })
}

const insertEmptyAttribute = () => {
  console.log(slideoutVariants.value.length == attributes.value.length)
  if (slideoutVariants.value.length == attributes.value.length)
    return (appMessage.errorMsg = 'You have used all available attributes')
  slideoutVariants.value.push({
    attribute: {},
    terms: [],
    defaultTerm: '',
    active: true,
    variation: false,
  })
}

const updateCompAttribute = (event) => {
  console.log('MNMNMNM')
  slideoutVariants.value[event.index] = event.attr
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

const updateVariant = (attribute, termId) => {
  // console.log('AT', attribute)
  // console.log(value)
  // const term = attribute.terms.find((t) => t._id == termId)
  // console.log('T', term)
  // if (!prodState.selectedItem.variants[props.index].attrTerms.length) {
  // prodState.selectedItem.variants[props.index].attrTerms.push(term)
  // }
}

const closeSlideout = () => {
  console.log('Before', JSON.parse(currentVariants))
  console.log('COMPARE', currentVariants === JSON.stringify(slideoutVariants.value))
  if (currentVariants !== JSON.stringify(slideoutVariants.value)) return (showAlert.value = true)
  emit('slideoutEventEmitted', false)
  // const newAttributes = []
  // for (const prop in props.productVariants) {
  //   if (Object.values(props.productVariants[prop].attribute).length)
  //     newAttributes.push(props.productVariants[prop])
  // }
  // props.productVariants = newAttributes
  // console.log('After', props.productVariants)
}

const saveslideoutVariants = () => {
  const newAttributes = []
  for (const prop in slideoutVariants.value) {
    if (Object.values(slideoutVariants.value[prop].attribute).length) newAttributes.push(slideoutVariants.value[prop])
  }
  slideoutVariants.value = newAttributes
  console.log('CCCC', slideoutVariants.value)
  emit('slideoutVariantsUpdated', slideoutVariants.value)

  // showVariantsSlideout.value = false
  // emit('productVariantsUpdated', newAttributes)
}

const updatesVariants = async () => {
  emit('slideoutVariantsUpdated', slideoutVariants.value)
  emit('slideoutEventEmitted', false)

  // showVariantsSlideout.value = false
  // emit('productVariantsUpdated', newAttributes)
}

const cancelVariants = () => {
  slideoutVariants.value = JSON.parse(currentVariants)
  emit('slideoutEventEmitted', false)
}

const updateVariants = async (event) => {
  // console.log('ECV', event)
  // await deleteVariants()
  // variants.value = event
  // await createVariants()
  // showVariantsSlideout.value = false
  // emit('saveVariants')
}

// watch(
//   () => slideoutVariants.value,
//   (current) => {
//     console.log(current)
//     emit('slideoutVariantsUpdated', slideoutVariants.value)
//   },
//   { deep: true }
// )
</script>

<template>
  <section class="slideout">
    <div class="overlay"></div>
    <div class="slideout__wrapper" @click.self="closeSlideout">
      <transition name="slideout">
        <div class="slideout__content" v-show="showVariantsSlideout">
          <section class="variants">
            <div class="header shadow-md">
              <h3 class="title">Edit Variants</h3>
              <button class="btn close"><IconsClose @click.prevent="closeSlideout" /></button>
            </div>
            <div class="main">
              <pre style="font-size: 1rem">{{ productVariants }}=======+++++++++++++{{ slideoutVariants }}</pre>
              <div v-if="!productId">
                <EcommerceAdminProductEmptyVariantMsg
                  :productId="productId"
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
                        <div class="th">Attributes Term</div>
                        <div class="th">Stock Qty.</div>
                        <div class="th">Price</div>
                        <div class="th">SKU</div>
                        <div class="th">Actions</div>
                      </div>
                    </div>
                    <div class="table__body">
                      <EcommerceAdminProductVariantCard
                        v-for="(variant, index) in slideoutVariants"
                        :index="index"
                        :productVariant="variant"
                        :attributes="attributes"
                        :attributeTerms="attributeTerms"
                        @showVariantSlideout="setProdVariantEdit(prodVariant, i)"
                      />
                    </div>
                  </div>
                </main>
              </div>
            </div>
            <div class="footer actions shadow-md">
              <button class="btn btn-secondary cancel" @click.prevent="cancelVariants">Cancel</button>
              <button class="btn btn-primary save" @click.prevent="updatesVariants">Save Changes</button>
            </div>
          </section>
        </div>
      </transition>
    </div>
    <Alert v-if="showAlert" @ok="showAlert = false" @cancel="showAlert = false">
      <h3>You have unsaved changes</h3>
      <p>Please save your changes before closing this window or click cancel to exit without saving</p>
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
