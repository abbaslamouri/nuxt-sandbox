<script setup>
defineEmits(['saveVariants', 'slideoutEventEmitted'])

// const store = inject('store')
const { product } = useStore()
const { errorMsg, fetchAll } = useFactory()

// const { store, fetchAttributes, fetchAttributeTerms } = useProduct()
// const saveProduct = inject('saveProduct')

// const store = useStore()
const showAlert = ref(false)
const showActionKeys = ref([])
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
  // console.log(allAttributes)
  // console.log(store.attributeTerms)
  // for (const prop in allAttributes) {
  //   console.log(console.log(store.attributeTerms.filter((t) => t.parent._id == allAttributes[prop]._id)))
  //   const attribute = allAttributes[prop]
  //   const terms = store.attributeTerms.filter((t) => t.parent._id == allAttributes[prop]._id)
  //   insertEmptyAttribute(attribute, terms, terms[0])
  // }
}

const closeSlideout = () => {
  if (current.value !== JSON.stringify(product.value.attributes)) {
    store.value.alertHeading = 'You have unsaved changes'
    store.value.alertParagraph =
      'Please save your changes before closing this window or click cancel to exit without saving'
    store.value.showAlertCancelBtn = false
    // store.value.alertAction = 'closeAlert'
    return (store.value.showAlert = true)
  }
  store.value.showAttributesSlideout = false
}

const handleShowDeleteAttributesAlert = () => {
  // appMessage.alertHeading = 'Are you sure you want to delete all attributes'
  // appMessage.alertParagraph = 'All variants accociated with this product will aso be deleted'
  // appMessage.alertAction = 'deleteAllAttributes'
  // return (appMessage.showAlert = true)
}

const updateAttributes = async () => {
  // if (current.value == JSON.stringify(product.value.attributes)) return (store.showAttributesSlideout = false)
  // const newAttributes = []
  // let errorMsg = ''
  // for (const prop in product.value.attributes) {
  //   if (Object.values(product.value.attributes[prop].attribute).length) {
  //     newAttributes.push(product.value.attributes[prop])
  //   } else {
  //     errorMsg = `You must select attribute terms.  Please select a value for attribute ${prop * 1 + 1} `
  //     break
  //   }
  // }
  // if (errorMsg) return (appMessage.errorMsg = errorMsg)
  // product.value.attributes = newAttributes
  // for (const prop in deletedTerms.value) {
  //   removeVariantByTermId(deletedTerms.value[prop])
  // }
  // saveProduct(store.product)
  // current.value = JSON.stringify(product.value.attributes)
  // store.showAttributesSlideout = false
}

const cancelAttributesUpdate = () => {
  // product.value.attributes = JSON.parse(current.value)
  // store.showAttributesSlideout = false
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
  <Slideout @closeSlideout="closeSlideout" class="attributes">
    <template v-slot:header>
      <h3 class="title">Edit Attributes</h3>
    </template>
    <template v-slot:default>
      <div class="attributes-details">
        <!-- <pre style="font-size: 1rem">{{ store.doc }}</pre> -->
        <header>
          <h2>Attributes</h2>
          <div class="actions">
            <button class="btn btn-primary" @click="insertEmptyAttribute({}, [], {})">Add Attribute</button>
            <button class="btn btn-primary" @click="addAllAttributes">Add All Attributes</button>
            <button class="btn btn-secondary delete-all-attributes" @click="handleShowDeleteAttributesAlert">
              Delete All Attributes
            </button>
          </div>
        </header>
        <main>
          <div v-if="!product.attributes.length">
            <EcommerceAdminProductEmptyAttributesMsg @slideoutEventEmitted="$emit('slideoutEventEmitted', $event)" />
          </div>
          <div v-else class="table admin-product-attributes shadow-md">
            <div class="table__header bg-slate-200 ">
              <div class="row py2 px1">
                <div class="th">ID</div>
                <div class="th">Attribute</div>
                <div class="th">Enable</div>
                <div class="th">Variation</div>
                <div class="th">Default Term</div>
                <div class="th">Terms</div>
                <div class="th">Actions</div>
              </div>
            </div>
            <div class="table__body">
              <EcommerceAdminProductsProductAttributeCard
                v-for="(attribute, index) in product.attributes"
                :index="index"
                :showActions="showActionKeys[index]"
                :allAttributes="allAttributes"
                :allAttributeTerms="allAttributeTerms"
                @termToDeleteUpdated="deletedTerms.push($event)"
                @resetActions="resetActions"
              />
            </div>
          </div>
        </main>
      </div>
    </template>
    <template v-slot:footer>
      <div class="actions">
        <button class="btn btn-secondary" @click.prevent="cancelAttributesUpdate">Cancel</button>
        <button
          class="btn btn-primary"
          @click.prevent="updateAttributes"
          :disabled="current == JSON.stringify(product.attributes)"
        >
          Save Changes
        </button>
      </div>
    </template>
  </Slideout>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.attributes {
  .attributes-details {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    overflow: auto;
    padding: 2rem;

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2rem;
      background-color: $slate-300;
    }

    .delete-all-attributes {
      align-self: flex-end;
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
