<script setup>
// import { useStore } from '~/store/useStore'
import { useMessage } from '~/store/useMessage'

defineEmits(['saveVariants', 'slideoutEventEmitted'])

// const { store: attstore, fetchAll: fetchAtts } = useAttribute()
// const { store: attTermstore, fetchAll: fetchAttTerms } = useAttributeTerm()
// provide('attstore'.attstore)
// provide('attTermstore'.attTermstore)

const store = inject('store')

// const { store, fetchAttributes, fetchAttributeTerms } = useProduct()
// const saveProduct = inject('saveProduct')

// const store = useStore()
const appMessage = useMessage()
const showAlert = ref(false)
const showDeleteAllAttributesAlert = ref(false)
const deletedTerms = ref([])
const current = ref(null)
let response = null

response = await $fetch(`/api/v1/attributes`, { fields: 'name, slug' })
const allAttributes = response.docs

response = await $fetch(`/api/v1/attributeterms`, { fields: 'name, slug, parent' })
const allAttributeTerms = response.docs

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

current.value = JSON.stringify(store.value.doc.attributes)

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
  if (store.value.doc.attributes.length == allAttributes.length)
    return (store.errorMsg = 'You have used all available attributes')
  store.value.doc.attributes.push({
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
  if (current.value !== JSON.stringify(store.value.doc.attributes)) {
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
  // if (current.value == JSON.stringify(store.value.doc.attributes)) return (store.showAttributesSlideout = false)
  // const newAttributes = []
  // let errorMsg = ''
  // for (const prop in store.value.doc.attributes) {
  //   if (Object.values(store.value.doc.attributes[prop].attribute).length) {
  //     newAttributes.push(store.value.doc.attributes[prop])
  //   } else {
  //     errorMsg = `You must select attribute terms.  Please select a value for attribute ${prop * 1 + 1} `
  //     break
  //   }
  // }
  // if (errorMsg) return (appMessage.errorMsg = errorMsg)
  // store.value.doc.attributes = newAttributes
  // for (const prop in deletedTerms.value) {
  //   removeVariantByTermId(deletedTerms.value[prop])
  // }
  // saveProduct(store.product)
  // current.value = JSON.stringify(store.value.doc.attributes)
  // store.showAttributesSlideout = false
}

const cancelAttributesUpdate = () => {
  // store.value.doc.attributes = JSON.parse(current.value)
  // store.showAttributesSlideout = false
}

const deleteAllAttributes = () => {
  // store.value.doc.attributes = []
  // showDeleteAllAttributesAlert.value = false
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
          {{ appMessage.showAlert }}
          <div class="actions">
            <button class="btn btn-primary" @click="insertEmptyAttribute({}, [], {})">Add Attribute</button>
            <button class="btn btn-primary" @click="addAllAttributes">Add All Attributes</button>
            <button class="btn btn-secondary delete-all-attributes" @click="handleShowDeleteAttributesAlert">
              Delete All Attributes
            </button>
          </div>
        </header>
        <main>
          <div v-if="!store.doc.attributes.length">
            <EcommerceAdminProductEmptyAttributesMsg @slideoutEventEmitted="$emit('slideoutEventEmitted', $event)" />
          </div>
          <div v-else class="table admin-product-attributes">
            <div class="table__header">
              <div class="row">
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
                v-for="(attribute, index) in store.doc.attributes"
                :index="index"
                :allAttributes="allAttributes"
                :allAttributeTerms="allAttributeTerms"
                @termToDeleteUpdated="deletedTerms.push($event)"
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
          :disabled="current == JSON.stringify(store.doc.attributes)"
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
