<script setup>
const emit = defineEmits(['saveAttributes', 'closeSlideout'])

// const store = inject('store')
const { product, variants } = useStore()
const { errorMsg, alert } = useFactory()

// const { store, fetchAttributes, fetchAttributeTerms } = useProduct()
// const saveProduct = inject('saveProduct')

// const store = useStore()
// const showAlert = ref(false)
const showActionKeys = ref([])
const attributeToDelteIndex = ref(null)
const termToDeleteId = ref(null)
const showDeleteAllAttributesAlert = ref(false)
const deletedTerms = ref([])
const current = ref(null)
let response = null

const allAttributes = (await $fetch(`/api/v1/attributes`, { fields: 'name, slug' })).docs
const allAttributeTerms = (await $fetch(`/api/v1/attributeterms`, { fields: 'name, slug, parent' })).docs

//     variantParams: {
//       fields: 'product, attrTerms, gallery, price, salePrice, sku, stockQty, enabled',
//     },
// await fetchAtts()
// await fetchAttTerms()

console.log(allAttributes)
console.log(allAttributeTerms)
// Fetch all atributes
// response = await fetchAttributes()
// if (store.errorMsg) {
// 	appMessage.errorMsg = store.errorMsg
// 	allAttributes = []
// } else {
// 	allAttributes = response.docs
// }

// Fetch all attribute terms
// response = await fetchAttributeTerms()
// if (store.errorMsg) {
// 	appMessage.errorMsg = store.errorMsg
// 	store.attributeTerms = []
// } else {
// 	store.attributeTerms = response.docs
// }

current.value = JSON.stringify(product.value.attributes)

const removeVariantByTermId = (termId) => {
  // let j = 0
  // while (j < store.variants.length) {
  //   const k = store.variants[j].attrTerms.findIndex((t) => t._id == termId)
  //   const countBefore = store.variants[j].attrTerms.length
  //   if (k !== -1) store.variants[j].attrTerms.splice(k, 1)
  //   const countAfter = store.variants[j].attrTerms.length
  //   if (countBefore != countAfter) store.variants[j].discard = true
  //   j++
  // }
  // store.variants = store.variants.filter((el) => !el.discard)
}

const insertEmptyAttribute = (attribute, terms, defaultTerm) => {
  if (product.value.attributes.length >= allAttributes.length)
    return (errorMsg.value = 'You have used up all available attributes')
  product.value.attributes.push({
    attribute,
    terms,
    defaultTerm,
    enabled: true,
    variation: true,
  })
}

const addAllAttributes = () => {
  for (const prop in allAttributes) {
    const attribute = allAttributes[prop]
    const terms = allAttributeTerms.filter((t) => t.parent._id == allAttributes[prop]._id)
    insertEmptyAttribute(attribute, terms, terms[0])
  }
}

const closeSlideout = () => {
  if (current.value !== JSON.stringify(product.value.attributes)) {
    showAlert(
      'You have unsaved changes',
      'Please save your changes before closing this window or click cancel to exit without saving.',
      'closeSlideout',
      false
    )
  } else {
    emit('closeSlideout')
  }
}

const handleShowDeleteAttributesAlert = () => {
  // appMessage.alertHeading = 'Are you sure you want to delete all attributes'
  // appMessage.alertParagraph = 'All variants accociated with this product will aso be deleted'
  // appMessage.alertAction = 'deleteAllAttributes'
  // return (appMessage.showAlert = true)
}

const updateAttributes = async () => {
  if (current.value == JSON.stringify(product.value.attributes)) return emit('closeSlideout')

  const newAttributes = []
  for (const prop in product.value.attributes) {
    if (Object.values(product.value.attributes[prop].attribute).length) {
      newAttributes.push(product.value.attributes[prop])
    } else {
      errorMsg.value = `You must select attribute terms.  Please select a value for attribute ${prop * 1 + 1} `
      return
    }
  }
  // if (errorMsg) return (appMessage.errorMsg = errorMsg)
  product.value.attributes = newAttributes
  // for (const prop in deletedTerms.value) {
  //   removeVariantByTermId(deletedTerms.value[prop])
  // }
  // saveProduct(store.product)
  // current.value = JSON.stringify(product.value.attributes)
  emit('saveAttributes')

  // store.showAttributesSlideout = false
}

const cancelAttributesUpdate = () => {
  product.value.attributes = JSON.parse(current.value)
  emit('closeSlideout')
}

const deleteAllAttributes = () => {
  // product.value.attributes = []
  // showDeleteAllAttributesAlert.value = false
}

const resetActions = (payload) => {
  console.log(product.value.attributes)
  for (const prop in product.value.attributes) {
    showActionKeys.value[prop] = false
  }
  showActionKeys.value[payload.index] = payload.action
}

const showRemoveAttributeAlert = (attributeIndex) => {
  attributeToDelteIndex.value = attributeIndex
  showAlert(
    'Are you sure you want to delete this attribute?',
    'All product variants associated with this attribute will also be removed.',
    'removeAttribute',
    true
  )
}

const removeAttribute = () => {
  // const attributeId = product.value.attributes[props.index].attribute._id
  // for (const prop in product.value.variants) {
  //   const i = product.value.variants[prop].attrTerms.findIndex((t) => t.parent._id == attributeId)
  //   if (i !== -1) product.value.variants[prop].attrTerms.splice(i, 1)
  // }
  product.value.attributes.splice(attributeToDelteIndex.value, 1)
  // emit('resetActions', { index: props.index, action: false })
  alert.value.show = false
  alert.value.action = ''
}

const showRemoveTermAlert = (termId) => {
  console.log('TTTTTTTTT', termId)
  termToDeleteId.value = termId
  showAlert(
    'Are you sure you want to remove this attribute term?',
    'Any variants containing this term will also be removed.',
    'removeTerm',
    true
  )
}

const removeTerm = async () => {
  console.log(variants.value)
  // const product.value.attributes = product.value.attributes.filter((a) => a.enabled && a.variation)
  console.log('ATT', product.value.attributes)
  console.log('ID', termToDeleteId.value)
  for (const prop in product.value.attributes) {
    const i = product.value.attributes[prop].terms.findIndex((t) => t._id == termToDeleteId.value)
    console.log(i)
    if (i !== -1) product.value.attributes[prop].terms.splice(i, 1)
  }
  console.log('ATT1', product.value.attributes)

  for (const prop in variants.value) {
    const term = variants.value[prop].attrTerms.find((t) => t._id == termToDeleteId.value)
    if (term) variants.value[prop].toDelete = true
  }
  variants.value = variants.value.filter((v) => !v.toDelete)
  // console.log(variants.value)
  // // await saveProduct()
  // // const i = product.value.attributes[props.index].terms.findIndex((t) => t._id == termToDeleteId.value)
  // // if (i !== -1) product.value.attributes[props.index].terms.splice(i, 1)
  termToDeleteId.value = null
  alert.value.show = false
  alert.value.action = ''
}

// const setAlertss = (alertPayload, i = null) => {
//   attributeToDelteIndex.value = i
//   alert.value.action = alertPayload.alertAction
//   alert.value.heading = alertPayload.alertHeading
//   alert.value.paragraph = alertPayload.alertParagraph
//   alert.value.showCancelBtn = alertPayload.alertParagraph
//   alert.value.show = true
//   console.log('A', alertPayload, i)
// }

const showAlert = (heading, paragraph, action, showCancelBtn) => {
  alert.value.heading = heading
  alert.value.paragraph = paragraph
  alert.value.action = action
  alert.value.showCancelBtn = showCancelBtn
  alert.value.show = true
}

watch(
  () => alert.value.show,
  (currentVal) => {
    console.log('W', currentVal)
    if (currentVal === 'ok' && alert.value.action === 'closeSlideout') alert.value = false
    if (currentVal === 'ok' && alert.value.action === 'removeAttribute') removeAttribute()
    if (currentVal === 'ok' && alert.value.action === 'removeTerm') removeTerm()
  }
  // { deep: true }
)

// watch(
//   () => appMessage.showAlert,
//   (currentVal) => {
//     if (currentVal !== 'ok') return
//     appMessage.alertHeading = ''
//     appMessage.alertParagraph = ''
//     if (appMessage.alertAction === 'deleteAllAttributes') deleteAllAttributes()
//     appMessage.showAlert = false
//   },
//   { deep: true }
// )

// const removeVariantByTermId = (termId) => {
//   // let j = 0
//   // while (j < store.variants.length) {
//   //   const k = store.variants[j].attrTerms.findIndex((t) => t._id == termId)
//   //   const countBefore = store.variants[j].attrTerms.length
//   //   if (k !== -1) store.variants[j].attrTerms.splice(k, 1)
//   //   const countAfter = store.variants[j].attrTerms.length
//   //   if (countBefore != countAfter) store.variants[j].discard = true
//   //   j++
//   // }
//   // store.variants = store.variants.filter((el) => !el.discard)
// }

// const insertEmptyAttribute = (attribute, terms, defaultTerm) => {
//   if (product.value.attributes.length >= allAttributes.length)
//     return (errorMsg.value = 'You have used up all available attributes')
//   product.value.attributes.push({
//     attribute,
//     terms,
//     defaultTerm,
//     enabled: true,
//     variation: true,
//   })
// }

// const addAllAttributes = () => {
//   // console.log(allAttributes)
//   // console.log(store.attributeTerms)
//   // for (const prop in allAttributes) {
//   //   console.log(console.log(store.attributeTerms.filter((t) => t.parent._id == allAttributes[prop]._id)))
//   //   const attribute = allAttributes[prop]
//   //   const terms = store.attributeTerms.filter((t) => t.parent._id == allAttributes[prop]._id)
//   //   insertEmptyAttribute(attribute, terms, terms[0])
//   // }
// }

// const closeSlideout = () => {
//   if (current.value !== JSON.stringify(product.value.attributes)) {
//     store.value.alertHeading = 'You have unsaved changes'
//     store.value.alertParagraph =
//       'Please save your changes before closing this window or click cancel to exit without saving'
//     store.value.showAlertCancelBtn = false
//     // store.value.alertAction = 'closeAlert'
//     return (store.value.showAlert = true)
//   }
//   store.value.showAttributesSlideout = false
// }

// const handleShowDeleteAttributesAlert = () => {
//   // appMessage.alertHeading = 'Are you sure you want to delete all attributes'
//   // appMessage.alertParagraph = 'All variants accociated with this product will aso be deleted'
//   // appMessage.alertAction = 'deleteAllAttributes'
//   // return (appMessage.showAlert = true)
// }

// const updateAttributes = async () => {
//   // if (current.value == JSON.stringify(product.value.attributes)) return (store.showAttributesSlideout = false)
//   // const newAttributes = []
//   // let errorMsg = ''
//   // for (const prop in product.value.attributes) {
//   //   if (Object.values(product.value.attributes[prop].attribute).length) {
//   //     newAttributes.push(product.value.attributes[prop])
//   //   } else {
//   //     errorMsg = `You must select attribute terms.  Please select a value for attribute ${prop * 1 + 1} `
//   //     break
//   //   }
//   // }
//   // if (errorMsg) return (appMessage.errorMsg = errorMsg)
//   // product.value.attributes = newAttributes
//   // for (const prop in deletedTerms.value) {
//   //   removeVariantByTermId(deletedTerms.value[prop])
//   // }
//   // saveProduct(store.product)
//   // current.value = JSON.stringify(product.value.attributes)
//   // store.showAttributesSlideout = false
// }

// const cancelAttributesUpdate = () => {
//   // product.value.attributes = JSON.parse(current.value)
//   // store.showAttributesSlideout = false
// }

// const deleteAllAttributes = () => {
//   // product.value.attributes = []
//   // showDeleteAllAttributesAlert.value = false
// }

// watch(
//   () => appMessage.showAlert,
//   (currentVal) => {
//     if (currentVal !== 'ok') return
//     appMessage.alertHeading = ''
//     appMessage.alertParagraph = ''
//     if (appMessage.alertAction === 'deleteAllAttributes') deleteAllAttributes()
//     appMessage.showAlert = false
//   },
//   { deep: true }
// )
</script>

<template>
  <Slideout class="attributes" @closeSlideout="closeSlideout">
    <template v-slot:header>
      <h3>Edit Attributes</h3>
    </template>
    <template v-slot:default>
      <div class="flex-col gap2 p2">
        <!-- <pre style="font-size: 1rem">{{ store.doc }}</pre> -->
        <header class="flex-row items-center justify-between bg-slate-200 p2">
          <h2>Attributes</h2>
          <div class="flex-row gap2">
            <button class="btn btn__primary py05 px2 text-xs" @click="insertEmptyAttribute({}, [], {})">
              Add Attribute
            </button>
            <button class="btn btn__primary py05 px2 text-xs" @click="addAllAttributes">Add All Attributes</button>
            <button class="btn btn__secondary py05 px2 text-xs" @click="handleShowDeleteAttributesAlert">
              Delete All Attributes
            </button>
          </div>
        </header>
        <main>
          <EcommerceAdminProductsProductEmptyAttributesMsg
            v-if="!product.attributes.length"
            :allAttributes="allAttributes"
          />
          <EcommerceAdminProductsAttributesList
            v-else
            @removeAttribute="showRemoveAttributeAlert"
            @removeTerm="showRemoveTermAlert"
          />
        </main>
      </div>
    </template>
    <template v-slot:footer>
      <div class="flex-row items-center justify-end gap2">
        <button class="btn btn_secondary py05 px3" @click.prevent="cancelAttributesUpdate">Cancel</button>
        <button
          class="btn btn__primary py05 px3"
          :class="{ disabled: current == JSON.stringify(product.attributes) }"
          @click.prevent="updateAttributes"
        >
          Save Changes
        </button>
      </div>
    </template>
  </Slideout>
</template>

<style lang="scss" scoped></style>
