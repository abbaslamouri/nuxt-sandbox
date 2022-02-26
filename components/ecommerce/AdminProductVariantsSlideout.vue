<script setup>
import { useMessage } from '~/store/useMessage'
import { useStore } from '~/store/useStore'

const emit = defineEmits(['slideoutEventEmitted', 'saveProduct'])

const { state, fetchVariants } = useProduct()

const store = useStore()
const appMessage = useMessage()
const showAlert = ref(false)
const showDeleteAllVariantsAlert = ref(false)
const variantsActionSelect = ref('')
const regularPrice = ref(null)
const showRegularPriceInput = ref(false)
const salePrice = ref(null)
const showSalePriceInput = ref(false)

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
  terms = store.product.attributes.map((el) => [...el.terms])
  if (getCombinations(terms)[0].length)
    store.variants = [...getCombinations(terms)].map((el) => {
      return variantBase([...el])
    })
}

const addSingleVariant = () => {
  const terms = []
  for (const prop in store.product.attributes) {
    terms[prop] = {}
  }
  store.variants.unshift(variantBase([...terms]))
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

const deleteDbVariants = async () => {
  appMessage.errorMsg = null
  try {
    const response = await $fetch('/api/v1/variants/delete-many', {
      method: 'POST',
      params: { id: store.product._id },
    })
    console.log('deletedCount', response.deletedCount)
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

const saveDbVariants = async () => {
  appMessage.errorMsg = null
  try {
    let message = ''
    let error = ''
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
    appMessage.successMsg = 'Product variants saved succesfully'
    emit('slideoutEventEmitted', false)
    console.log('saved', store.variants)
    // router.push({ name: 'admin-ecommerce-products-slug', params: { slug: response.slug } })
  } catch (error) {
    appMessage.errorMsg = error.data
  }
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
  if (errorMsg) {
    appMessage.errorMsg = `Attribute terms are required<br> ${errorMsg}`
  } else {
    await deleteDbVariants()
    await saveDbVariants()
    emit('saveProduct')
  }
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



// const deleteAllVariants = async () => {
//   appMessage.errorMsg = null
//   try {
//     const response = await $fetch('/api/v1/variants/delete-many', {
//       method: 'POST',
//       params: { id: store.product._id },
//     })
//     // console.log('deletedCount', response.deletedCount)
//     if (response.deletedCount) appMessage.successMsg = 'All variants deleted succesfuluy'
//     store.variants = []
//   } catch (error) {
//     appMessage.errorMsg = error.data
//   }
// }

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
  if (current !== JSON.stringify(store.variants)) return (showAlert.value = true)
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
  store.variants = JSON.parse(current)
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

const removeVariantByTermId = (termId) => {
  // let j = 0
  // while (j < prodState.selectedItem.variants.length) {
  //   const k = prodState.selectedItem.variants[j].attrTerms.findIndex((t) => t._id == termId)
  //   const countBefore = prodState.selectedItem.variants[j].attrTerms.length
  //   // console.log('Before', countBefore)
  //   if (k !== -1) prodState.selectedItem.variants[j].attrTerms.splice(k, 1)
  //   const countAfter = prodState.selectedItem.variants[j].attrTerms.length
  //   // console.log('After', countAfter)
  //   if (countBefore != countAfter) prodState.selectedItem.variants[j].discard = true
  //   j++
  // }
  // prodState.selectedItem.variants = prodState.selectedItem.variants.filter((el) => !el.discard)
  // if (!prodState.selectedItem.variants.length) prodState.selectedItem.variants = []
}

const removeDuplicateVariants = () => {
  // prodState.selectedItem.variants = Array.from(
  //   prodState.selectedItem.variants
  //     .reduce((map, obj) => {
  //       let id = ''
  //       for (const prop in obj.attrTerms) {
  //         id = `${id}_${obj.attrTerms[prop]._id}`
  //       }
  //       // console.log(id)
  //       return map.set(id, obj)
  //     }, new Map())
  //     .values()
  // )
}

const response = await fetchVariants(store.product._id)
if (state.errorMsg) {
  appMessage.errorMsg = state.errorMsg
  store.variants = []
} else {
  store.variants = response.docs
}
const current = JSON.stringify(store.variants)
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
              <!-- <pre style="font-size: 1rem">{{ JSON.parse(current) }}======={{ store.variants }}</pre> -->
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
                    <button class="btn btn-primary" @click="bulkAddVariants">Bulk Add</button>
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
