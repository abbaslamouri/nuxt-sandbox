<script setup>
import { useMessage } from '~/store/useMessage'

const props = defineProps({
  productVariant: {
    type: Object,
  },
  // index: {
  //   type: Number,
  // },
  attributes: {
    type: Array,
  },
  showVariantEditSlideout: {
    type: Boolean,
  },
  attributeTerms: {
    type: Array,
  },
})

const emit = defineEmits([
  'saveVariant',
  // 'saveVariants',
  'variantEditSlideoutEventEmitted',
  // 'slideoutVariantsUpdated',
  // 'deleteAllVariantsEventEmitted',
])

const appMessage = useMessage()
const variantTermId = ref(null)
const attributeTerms = ref([])
const showAlert = ref(false)
const showDeleteAllVariantsAlert = ref(false)
const slideoutVariants = ref([])
const variantsActionSelect = ref('')
const regularPrices = ref(null)
const showRegularPricesInput = ref(false)
const salePrices = ref(null)
const showSalePricesInput = ref(false)
const editdVariant = ref({})
// const editdVariantAttribute = ref({})
const showMediaSelector = ref(false) // media selector toggler

const showActions = ref(false)
const galleryIntro = ref('This image gallery contains all images associated with this variation.')

// editdVariant.value = JSON.parse(JSON.stringify(props.productVariant))
editdVariant.value = { ...props.productVariant }

const currentVariant = JSON.stringify(editdVariant.value)

const getAttributeByVariantTermParent = (parentId) => {
  return props.attributes
    .find((a) => a.attribute._id == parentId)
    .terms.map((t) => {
      return { key: t._id, name: t.name }
    })
}

// Set category gallery
const selectMedia = async (event) => {
  // console.log(event)
  showMediaSelector.value = false
  for (const prop in event) {
    const index = editdVariant.value.gallery.findIndex((m) => m._id === event[prop]._id)
    if (index === -1) {
      editdVariant.value.gallery.push(event[prop])
    }
  }
}

// for (const prop in props.productVariants) {
// 	slideoutVariants.value.push(props.productVariants[prop])
// }
// const currentVariants = JSON.stringify(slideoutVariants.value)

// console.log('COMPARE', currentVariants === JSON.stringify(slideoutVariants.value))

const closeSlideout = () => {
  showAlert.value = true
  console.log('COMPARE', currentVariant === JSON.stringify(editdVariant.value))
  if (currentVariant !== JSON.stringify(editdVariant.value)) return (showAlert.value = true)
  emit('variantEditSlideoutEventEmitted', false)
  // const newAttributes = []
  // for (const prop in props.productVariants) {
  //   if (Object.values(props.productVariants[prop].attribute).length)
  //     newAttributes.push(props.productVariants[prop])
  // }
  // props.productVariants = newAttributes
  // console.log('After', props.productVariants)
}

const setAttributeTerm = async (j, termId) => {
  console.log(j, termId)
  console.log(props.attributeTerms)
  const term = props.attributeTerms.find((t) => t._id == termId)
  console.log(term)
  editdVariant.value.attrTerms[j] = term

  // emit('slideoutVariantsUpdated', slideoutVariants.value)
  // emit('slideoutEventEmitted', false)
  // showVariantsSlideout.value = false
  // emit('productVariantsUpdated', newAttributes)
}

const updateVariant = async () => {
  emit('variantEditSlideoutEventEmitted', false)
  emit('saveVariant', editdVariant.value)

  // emit('slideoutVariantsUpdated', slideoutVariants.value)
  // emit('slideoutEventEmitted', false)
  // showVariantsSlideout.value = false
  // emit('productVariantsUpdated', newAttributes)
}

const cancelVariant = () => {
  editdVariant.value = JSON.parse(currentVariant)
  emit('variantEditSlideoutEventEmitted', false)
}
</script>

<template>
  <section class="slideout">
    <div class="overlay"></div>
    <div class="slideout__wrapper" @click.self="closeSlideout">
      <transition name="slideout">
        <div class="slideout__content variant" v-show="showVariantEditSlideout">
          <div class="slideout__header shadow-md">
            <div class="title">
              <span> Edit Variant: </span>
              <span v-for="term in editdVariant.attrTerms" :key="term._id"
                >{{ term.parent.name }}: {{ term.name }},
              </span>
            </div>
            <button class="btn close"><IconsClose @click.prevent="closeSlideout" /></button>
          </div>
          <div class="slideout__main">
            <div class="variant-edit">
              <!-- <pre style="font-size: 1rem">old{{ productVariant }}====NEW{{ editdVariant }}</pre> -->
              <h3>Select options for your variant</h3>
              <div class="attribute-terms">
                <div class="term" v-for="(term, j) in editdVariant.attrTerms" :key="term._id">
                  <FormsBaseSelect
                    :value="editdVariant.attrTerms[j]._id"
                    :label="term.parent.name"
                    @update:modelValue="setAttributeTerm(j, $event)"
                    :options="getAttributeByVariantTermParent(term.parent._id)"
                  />
                </div>
              </div>
              <h3>Variant Details</h3>
              <EcommerceAdminCategoryGallery
                :gallery="editdVariant.gallery"
                :galleryIntro="galleryIntro"
                galleryType="product"
                @mediaSelectorClicked="showMediaSelector = true"
              />
              <div class="sku-stock">
                <div class="sku">
                  <FormsBaseInput label="SKU" placeholder="SKU" v-model="editdVariant.sku" />
                </div>
                <div class="stock">
                  <FormsBaseInput label="Stck Qty" placeholder="Stock Qty" v-model="editdVariant.stockQty" />
                </div>
              </div>
              <div class="price">
                <FormsBaseInput label="Price" placeholder="Price" currency v-model="editdVariant.price" />
              </div>
              <div class="description">
                <FormsBaseInput label="Description" placeholder="Description" v-model="editdVariant.description" />
              </div>
            </div>
          </div>
          <div class="slideout__footer actions shadow-md">
            <button class="btn btn-secondary cancel" @click.prevent="cancelVariant">Cancel</button>
            <button class="btn btn-primary save" @click.prevent="updateVariant">Save Changes</button>
          </div>
          <!-- </section> -->
        </div>
      </transition>
    </div>
    <div class="media-selector" v-if="showMediaSelector">
      <LazyMediaUploader
        @mediaSelected="selectMedia"
        @mediaSelectCancel="showMediaSelector = false"
        v-if="showMediaSelector"
      />
    </div>
    <Alert v-if="showAlert" @ok="showAlert = false" @cancel="showAlert = false" :showCancelBtn="false">
      <h3>You have unsaved changes</h3>
      <p>Please save your changes before closing this variant window or click cancel to exit without saving</p>
    </Alert>
    <!-- <Alert v-if="showDeleteAllVariantsAlert" @ok="deleteAllVariants" @cancel="showDeleteAllVariantsAlert = false">
			<h3>Are you sure?</h3>
			<p>All variants associated with this product will be deleted</p>
		</Alert> -->
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
.variant {
  .variant-edit {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    height: 100%;
    overflow: scroll;
    padding: 2rem;

    .attribute-terms {
      display: flex;
      align-items: center;
      gap: 2rem;

      .term {
        flex: 1;
      }
    }

    .sku-stock {
      display: flex;
      align-items: center;
      gap: 2rem;

      .sku,
      .stock {
        flex: 1;
      }
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 2rem;
      .base-select {
        width: 30rem;
      }
    }
  }
}
</style>
