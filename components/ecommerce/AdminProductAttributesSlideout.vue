<script setup>
import { useStore } from '~/store/useStore'
import { useMessage } from '~/store/useMessage'

defineEmits(['saveVariants', 'slideoutEventEmitted'])

const { state, fetchAttributes, fetchAttributeTerms } = useProduct()
const saveProduct = inject('saveProduct')

const store = useStore()
const appMessage = useMessage()
const showAlert = ref(false)
const showDeleteAllAttributesAlert = ref(false)
const deletedTerms = ref([])
const current = ref(null)
let response = null

// Fetch all atributes
response = await fetchAttributes()
if (state.errorMsg) {
  appMessage.errorMsg = state.errorMsg
  store.attributes = []
} else {
  store.attributes = response.docs
}

// Fetch all attribute terms
response = await fetchAttributeTerms()
if (state.errorMsg) {
  appMessage.errorMsg = state.errorMsg
  store.attributeTerms = []
} else {
  store.attributeTerms = response.docs
}

current.value = JSON.stringify(store.product.attributes)

const removeVariantByTermId = (termId) => {
  let j = 0
  while (j < store.variants.length) {
    const k = store.variants[j].attrTerms.findIndex((t) => t._id == termId)
    const countBefore = store.variants[j].attrTerms.length
    if (k !== -1) store.variants[j].attrTerms.splice(k, 1)
    const countAfter = store.variants[j].attrTerms.length
    if (countBefore != countAfter) store.variants[j].discard = true
    j++
  }
  store.variants = store.variants.filter((el) => !el.discard)
}

const insertEmptyAttribute = (attribute, terms, defaultTerm) => {
  if (store.product.attributes.length == store.attributes.length)
    return (appMessage.errorMsg = 'You have used all available attributes')
  store.product.attributes.push({
    attribute,
    terms,
    defaultTerm,
    enabled: true,
    variation: true,
  })
}

const addAllAttributes = () => {
  console.log(store.attributes)
  console.log(store.attributeTerms)
  for (const prop in store.attributes) {
    console.log(console.log(store.attributeTerms.filter((t) => t.parent._id == store.attributes[prop]._id)))
    const attribute = store.attributes[prop]
    const terms = store.attributeTerms.filter((t) => t.parent._id == store.attributes[prop]._id)
    insertEmptyAttribute(attribute, terms, terms[0])
  }
}

const closeSlideout = () => {
  if (current.value !== JSON.stringify(store.product.attributes)) return (showAlert.value = true)
  store.showAttributesSlideout = false
}

const updateAttributes = async () => {
  if (current.value == JSON.stringify(store.product.attributes)) return (store.showAttributesSlideout = false)
  const newAttributes = []
  let errorMsg = ''
  for (const prop in store.product.attributes) {
    if (Object.values(store.product.attributes[prop].attribute).length) {
      newAttributes.push(store.product.attributes[prop])
    } else {
      errorMsg = `You must select attribute terms.  Please select a value for attribute ${prop * 1 + 1} `
      break
    }
  }
  if (errorMsg) return (appMessage.errorMsg = errorMsg)
  store.product.attributes = newAttributes
  saveProduct(store.product)
  current.value = JSON.stringify(store.product.attributes)
  store.showAttributesSlideout = false
}

const updateVariants = async (termIds) => {
  console.log(termIds)
  //   console.log('Save', store.variants)
  //   let errorMsg = ''
  //   for (const vprop in store.variants) {
  //     for (const prop in store.variants[vprop].attrTerms) {
  //       if (!Object.keys(store.variants[vprop].attrTerms[prop]).length)
  //         errorMsg += `Terms missing for attribute ${
  //           getVariantAttribute(store.variants[vprop].attrTerms[prop], prop).name
  //         }<br>`
  //     }
  //   }
  //   if (errorMsg) return (appMessage.errorMsg = `Attribute terms are required<br> ${errorMsg}`)
  //   console.log(deletedTerms.value)
  //   // removeVariantByTermId(termToDeleteId.value)
  //   // console.log(store.variants)
  //   // saveProduct(store.product)
}

const cancelAttributesUpdate = () => {
  store.product.attributes = JSON.parse(current.value)
  store.showAttributesSlideout = false
}

const deleteAllAttributes = () => {
  store.product.attributes = []
  showDeleteAllAttributesAlert.value = false
}
</script>

<template>
  <section class="slideout attributes">
    <div class="overlay"></div>
    <div class="slideout__wrapper" @click.self="closeSlideout">
      <transition name="slideout">
        <div class="slideout__content attributes" v-if="store.showAttributesSlideout">
          <div class="slideout__header shadow-md">
            <h3 class="title">Edit Attributes</h3>
            <button class="btn close"><IconsClose @click.prevent="closeSlideout" /></button>
          </div>
          <div class="slideout__main">
            <div class="attributes-details">
              <div class="attributes-table">
                <!-- <pre style="font-size: 1rem">{{ deletedTerms }}</pre> -->
                <header>
                  <h2>Attributes</h2>
                  <div class="actions">
                    <button class="btn btn-primary" @click="insertEmptyAttribute({}, [], {})">Add Attribute</button>
                    <button class="btn btn-primary" @click="addAllAttributes">Add All Attributes</button>
                    <button
                      class="btn btn-secondary delete-all-attributes"
                      @click="showDeleteAllAttributesAlert = true"
                    >
                      Delete All Attributes
                    </button>
                  </div>
                </header>
                <main>
                  <div v-if="!store.product.attributes.length">
                    <EcommerceAdminProductEmptyAttributesMsg
                      @slideoutEventEmitted="$emit('slideoutEventEmitted', $event)"
                    />
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
                      <EcommerceAdminProductAttributeCard
                        v-for="(attribute, index) in store.product.attributes"
                        :index="index"
                        @deleteTermsUpdated="deletedTerms.push($event)"
                      />
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
          <div class="slideout__footer actions shadow-md">
            <button class="btn btn-secondary cancel" @click.prevent="cancelAttributesUpdate">Cancel</button>
            <button
              class="btn btn-primary save"
              @click.prevent="updateAttributes"
              :disabled="current == JSON.stringify(store.product.attributes)"
            >
              Save Changes
            </button>
          </div>
        </div>
      </transition>
    </div>
    <Alert v-if="showAlert" @ok="showAlert = false" @cancel="showAlert = false" :showCancelBtn="false">
      <h3>You have unsaved changes</h3>
      <p>Please save your changes before closing this window or click cancel to exit without saving</p>
    </Alert>
    <Alert v-if="showDeleteAllAttributesAlert" @ok="deleteAllAttributes" @cancel="showDeleteAllAttributesAlert = false">
      <h3>Are you sure you want to delete all attributes</h3>
      <p>All variants accociated with this product will aso be deleted</p>
    </Alert>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.attributes {
  .attributes-table {
    display: flex;
    flex-direction: column;
    gap: 2rem;
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
        gap: 2rem;
      }
    }

    .delete-all-attributes {
      align-self: flex-end;
    }
  }

  .actions {
    .save {
      &:disabled {
        background-color: $slate-400;
        cursor: not-allowed;
      }
    }
  }
}
</style>
