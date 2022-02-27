<script setup>
import { useStore } from '~/store/useStore'
import { useMessage } from '~/store/useMessage'

defineEmits(['saveVariants', 'slideoutEventEmitted'])

const saveProduct = inject('saveProduct')
const { state, fetchAttributes, fetchAttributeTerms } = useProduct()

const store = useStore()
const appMessage = useMessage()
const showAlert = ref(false)
let response = null

const insertEmptyAttribute = () => {
  if (store.product.attributes.length == store.attributes.length)
    return (appMessage.errorMsg = 'You have used all available attributes')
  store.product.attributes.push({
    attribute: {},
    terms: [],
    defaultTerm: {},
    active: true,
    variation: true,
  })
}

const closeSlideout = () => {
  if (current !== JSON.stringify(store.product.attributes)) return (showAlert.value = true)
  store.showAttributesSlideout = false
}

const updateAttributes = async () => {
  if (current == JSON.stringify(store.product.attributes)) {
    store.showAttributesSlideout = false
    return
  }
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
  if (errorMsg) {
    appMessage.errorMsg = errorMsg
    return
  }
  store.product.attributes = newAttributes
  saveProduct(store.product)
  store.showAttributesSlideout = false
}

const cancelAttributes = () => {
  store.product.attributes = JSON.parse(current)
  store.showAttributesSlideout = false
}

response = await fetchAttributes()
if (state.errorMsg) {
  appMessage.errorMsg = state.errorMsg
  store.attributes = []
} else {
  store.attributes = response.docs
}

response = await fetchAttributeTerms()
if (state.errorMsg) {
  appMessage.errorMsg = state.errorMsg
  store.attributeTerms = []
} else {
  store.attributeTerms = response.docs
}

const current = JSON.stringify(store.product.attributes)

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
              <div v-if="!store.product._id">
                <EcommerceAdminProductEmptyVariantsMsg
                  :productId="store.$attrsproduct._id"
                  @slideoutEventEmitted="$emit('slideoutEventEmitted', $event)"
                />
              </div>
              <div v-else class="attributes-table">
                <!-- <pre style="font-size: 1rem">{{ store.product.attributes }}</pre> -->
                <header>
                  <h2>Attributes</h2>
                  <button class="btn btn-primary" @click="insertEmptyAttribute">Add New</button>
                </header>
                <main v-if="store.product.attributes.length">
                  <div class="table admin-product-attributes">
                    <div class="table__header">
                      <div class="row">
                        <div class="th">ID</div>
                        <div class="th">Attribute</div>
                        <div class="th">Default Term</div>
                        <div class="th">Enable</div>
                        <div class="th">Variation</div>
                        <div class="th">Terms</div>
                        <div class="th">Actions</div>
                      </div>
                    </div>
                    <div class="table__body">
                      <EcommerceAdminProductAttributeCard
                        v-for="(attribute, index) in store.product.attributes"
                        :index="index"
                      />
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
          <div class="slideout__footer actions shadow-md">
            <button class="btn btn-secondary cancel" @click.prevent="cancelAttributes">Cancel</button>
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
