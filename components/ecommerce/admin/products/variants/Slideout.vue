<script setup>
import isEqual from 'lodash.isequal'

const emit = defineEmits(['saveVariants', 'closeSlideout'])

const { product, variants } = useStore()
const { alert, errorMsg } = useFactory()

const variantToDelteIndex = ref(null)
const variantsActionSelect = ref('')
const showDeleteVariantAlerts = ref([])
const showActions = ref([])
const showRegularPriceInput = ref(false)
const showSalePriceInput = ref(false)

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

const current = JSON.stringify(variants.value)

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
        errorMsg.value = `Duplicate variants not allowed.  Variant ${j * 1 + 1} uses the same attributes and terms as ${
          i * 1 + 1
        }`
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
  else bulkAddVariants()
}

const bulkAddVariants = () => {
  console.log('ALERT', alert.value)
  let terms = []
  if (!product.value.attributes.length)
    return (appMessage.errorMsg = 'I do not know how you got here but you need to create attributes first')
  const filteredAttributes = product.value.attributes.filter((a) => a.enabled && a.variation)
  for (const prop in filteredAttributes) {
    if (!filteredAttributes[prop].terms.length)
      return (appMessage.errorMsg = `All attributes must contain terms.  Attribute ${filteredAttributes[prop].attribute.name} does not contain any terms.  Please delete this attribute or add terms`)
  }
  terms = filteredAttributes.map((el) => [...el.terms])
  if (getCombinations(terms)[0].length)
    variants.value = [...getCombinations(terms)].map((el) => {
      return variantBase([...el])
    })
  console.log(variants.value)
}

const addSingleVariant = () => {
  const filteredAttributes = product.value.attributes.filter((a) => a.enabled && a.variation)
  const maxVariantCount = filteredAttributes
    .map((a) => {
      return a.terms.length
    })
    .reduce((a, b) => a * b, 1)

  if (!maxVariantCount) return (errorMsg.value = 'You do not have any attributes enabled for variations')

  if (variants.value.length >= maxVariantCount)
    return (errorMsg.value = 'You have created all possible variantions.  Please edit an existing one.')

  const terms = []
  for (const prop in filteredAttributes) {
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
  showRegularPriceInput.value = false
}

const setSalePrices = (price) => {
  for (const prop in variants.value) {
    variants.value[prop].salePrice = price
  }
  showSalePriceInput.value = false
}

const closeSlideout = () => {
  if (current !== JSON.stringify(variants.value)) {
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
      showAlert('Are you sure?', 'All variants associated with this product will be deleted', 'removeAllVariants', true)
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
    </template>
  </Slideout>
</template>

<style lang="scss" scoped></style>
