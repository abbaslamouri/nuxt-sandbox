<script setup>
import { useMessage } from '~/store/useMessage'

const props = defineProps({
  productAttributes: {
    type: Array,
  },
  productId: {
    type: String,
  },
  showAttributesSlideout: {
    type: Boolean,
  },
})

const emit = defineEmits(['saveVariants', 'slideoutEventEmitted', 'slideoutAttributesUpdated'])

const appMessage = useMessage()
const attributes = ref([])
const attributeTerms = ref([])
const showAlert = ref(false)
const slideoutAttributes = ref([])
const currentAttributes = JSON.stringify(props.productAttributes)
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

for (const prop in props.productAttributes) {
  slideoutAttributes.value.push(props.productAttributes[prop])
}

await Promise.all([fetchAttributes(), fetchAttributeTerms()])

const insertEmptyAttribute = () => {
  console.log(slideoutAttributes.value.length == attributes.value.length)
  if (slideoutAttributes.value.length == attributes.value.length)
    return (appMessage.errorMsg = 'You have used all available attributes')
  slideoutAttributes.value.push({
    attribute: {},
    terms: [],
    defaultTerm: {},
    active: true,
    variation: false,
  })
}

const updateAttribute = (event) => {
  console.log('MNMNMNM')
  slideoutAttributes.value[event.index] = event.attr
}

const deleteAttribute = (event) => {
  slideoutAttributes.value.splice(event, 1)
  console.log(event)
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
  console.log('Before', JSON.parse(currentAttributes))
  console.log('COMPARE', currentAttributes === JSON.stringify(slideoutAttributes.value))
  if (currentAttributes !== JSON.stringify(slideoutAttributes.value)) return (showAlert.value = true)
  emit('slideoutEventEmitted', false)
  // const newAttributes = []
  // for (const prop in props.productAttributes) {
  //   if (Object.values(props.productAttributes[prop].attribute).length)
  //     newAttributes.push(props.productAttributes[prop])
  // }
  // props.productAttributes = newAttributes
  // console.log('After', props.productAttributes)
}

const saveslideoutAttributes = () => {
  const newAttributes = []
  for (const prop in slideoutAttributes.value) {
    if (Object.values(slideoutAttributes.value[prop].attribute).length)
      newAttributes.push(slideoutAttributes.value[prop])
  }
  slideoutAttributes.value = newAttributes
  console.log('CCCC', slideoutAttributes.value)
  emit('slideoutAttributesUpdated', slideoutAttributes.value)

  // showAttributesSlideout.value = false
  // emit('productAttributesUpdated', newAttributes)
}

const updateAttributes = async () => {
  const newAttributes = []
  for (const prop in slideoutAttributes.value) {
    if (Object.values(slideoutAttributes.value[prop].attribute).length)
      newAttributes.push(slideoutAttributes.value[prop])
  }
  slideoutAttributes.value = newAttributes
  console.log('CCCC', slideoutAttributes.value)
  emit('slideoutAttributesUpdated', slideoutAttributes.value)
  emit('slideoutEventEmitted', false)

  // showAttributesSlideout.value = false
  // emit('productAttributesUpdated', newAttributes)
}

const cancelAttributes = () => {
  slideoutAttributes.value = JSON.parse(currentAttributes)
  // emit('productAttributesUpdated', JSON.parse(currentAttributes))
  emit('slideoutEventEmitted', false)
}

const updateVariants = async (event) => {
  // console.log('ECV', event)
  // await deleteVariants()
  // variants.value = event
  // await createVariants()
  // showAttributesSlideout.value = false
  // emit('saveVariants')
}

// watch(
//   () => slideoutAttributes.value,
//   (current) => {
//     console.log(current)
//     emit('slideoutAttributesUpdated', slideoutAttributes.value)
//   },
//   { deep: true }
// )
</script>

<template>
  <section class="slideout">
    <div class="overlay"></div>
    <div class="slideout__wrapper" @click.self="closeSlideout">
      <transition name="slideout">
        <div class="slideout__content" v-show="showAttributesSlideout">
          <section class="attributes">
            <div class="header shadow-md">
              <h3 class="title">Edit Attributes</h3>
              <button class="btn close"><IconsClose @click.prevent="closeSlideout" /></button>
            </div>
            <div class="main">
              <pre style="font-size: 1rem">{{ slideoutAttributes }}======={{ productAttributes }}</pre>
              <div v-if="!productId">
                <EcommerceAdminProductEmptyVariantMsg
                  :productId="productId"
                  @slideoutEventEmitted="$emit('slideoutEventEmitted', $event)"
                />
              </div>
              <div v-else class="attributes-table">
                <h4>Please select attributes for your product</h4>
                <header>
                  <h2>Attributes</h2>
                  <button class="btn btn-primary" @click="insertEmptyAttribute">Add New</button>
                </header>
                <main>
                  <div class="table admin-product-attributes">
                    <div class="table__header">
                      <div class="row">
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
                        v-for="(attribute, index) in slideoutAttributes"
                        :slideoutAttributes="slideoutAttributes"
                        :attributes="attributes"
                        :attributeTerms="attributeTerms"
                        :productAttribute="attribute"
                        :index="index"
                        @cardAttributeUpdated="updateAttribute"
                        @attributeToDeleteSelected="slideoutAttributes.splice($event, 1)"
                      />
                    </div>
                  </div>
                </main>
              </div>
            </div>
            <div class="footer actions shadow-md">
              <button class="btn btn-secondary cancel" @click.prevent="cancelAttributes">Cancel</button>
              <button class="btn btn-primary save" @click.prevent="updateAttributes">Save Changes</button>
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

.attributes {
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

    .attributes-table {
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
