<script setup>
// import { useStore } from '~/store/useStore'
import { useMessage } from '~/store/useMessage'
import isEqual from 'lodash.isequal'

const props = defineProps({
  index: {
    type: Number,
  },
  showVariantEditSlideout: {
    type: Boolean,
  },
})

const emit = defineEmits(['slideoutEventEmitted'])

const { product, variants } = useStore()
const { selectedMedia, mediaReference } = useFactory()

const allAttributes = inject('allAttributes')
const allAttributeTerms = inject('allAttributeTerms')

// const store = useStore()
const appMessage = useMessage()
const showAlert = ref(false)
const showMediaSelector = ref(false) // media selector toggler
const showProductGallery = ref(false)
const current = JSON.stringify(variants.value[props.index])

const getVariantAttribute = (term, j) => {
  if (Object.values(term).length) {
    return allAttributes.find((a) => a._id == term.parent._id)
  } else {
    return product.value.attributes[j].attribute
  }
}

const getVariantAttributeTerm = (term, j) => {
  const attributes = product.value.attributes.find((a) => a.attribute._id == getVariantAttribute(term, j)._id)
  return attributes.terms.map((t) => {
    return { key: t._id, name: t.name }
  })
}

const updateVariantMedia = async (event) => {
  console.log('media', event)
  showMediaSelector.value = false
  for (const prop in event) {
    const i = variants.value[props.index].gallery.findIndex((m) => m._id === event[prop]._id)
    if (i === -1) variants.value[props.index].gallery.push(event[prop])
  }
}

const closeSlideout = () => {
  if (current !== JSON.stringify(variants.value[props.index])) {
    appMessage.alertHeading = 'You have unsaved changes'
    appMessage.alertParagraph =
      'Please save your changes before closing this window or click cancel to exit without saving'
    appMessage.showAlertCancelBtn = false
    return (appMessage.showAlert = true)
  }
  emit('slideoutEventEmitted', false)
}

const setAttributeTerm = async (j, termId) => {
  const term = allAttributeTerms.find((t) => t._id == termId)
  variants.value[props.index].attrTerms[j] = term
}

const cancelVariant = () => {
  variants.value[props.index] = JSON.parse(current)
  emit('slideoutEventEmitted', false)
}

const updateVariant = () => {
  //  Check for duplicate variants
  for (const prop in variants.value) {
    if (
      prop * 1 !== props.index * 1 &&
      isEqual(
        variants.value[prop].attrTerms.map((t) => t._id),
        variants.value[props.index].attrTerms.map((t) => t._id)
      )
    ) {
      appMessage.errorMsg = `Duplicate variants not allowed.  You new variant uses the same attributes and attribute terms as ${
        prop * 1 + 1
      } variant`
      return
    }
  }

  let errorMsg = ''
  for (const prop in variants.value[props.index].attrTerms) {
    if (!Object.keys(variants.value[props.index].attrTerms[prop]).length)
      errorMsg += `Terms missing for attribute ${
        getVariantAttribute(variants.value[props.index].attrTerms[prop], prop).name
      }<br>`
  }
  if (errorMsg) appMessage.errorMsg = `Attribute terms are required<br> ${errorMsg}`
  else emit('slideoutEventEmitted', false)
}

const handleNewMediaSelectBtnClicked = () => {
  referenceMedia.value = 'variantMedia'
  showMediaSelector.value = true
}

// watch(
// 	() => appMessage.showMediaSelector,
// 	(currentVal) => {
// 		if (currentVal !== 'ok') return
// 		updateVariantMedia()
// 		appMessage.showMediaSelector = false
// 	},
// 	{ deep: true }
// )

watch(
  () => selectedMedia.value,
  (currentVal) => {
    console.log(currentVal)
    if (referenceMedia.value === 'variantMedia') updateVariantMedia(currentVal)
    // store.showMediaSelector = false
    // store.selectedMedia = []
  },
  { deep: true }
)
</script>

<template>
  <Slideout @closeSlideout="closeSlideout" class="variant-edit">
    <template v-slot:header>
      <div class="title">
        <div>Edit Variant:</div>
        <div class="attribute-terms" v-for="(term, j) in variants[index].attrTerms" :key="`term-${j}`">
          <span class="attribute">{{ getVariantAttribute(term, j).name }}:</span>
          <span class="term" v-if="Object.keys(term).length">{{ term.name }}</span>
        </div>
      </div>
    </template>
    <template v-slot:default>
      <div class="variant-edit-details">
        <!-- <pre style="font-size: 1rem">{{ variants[index] }}</pre> -->
        <h3>Variant Options</h3>
        <div class="attribute-terms">
          <div class="term" v-for="(term, j) in variants[index].attrTerms" :key="term._id">
            {{ variants[index].attrTerms[j]._id }}
            <FormsBaseSelect
              v-model="variants[index].attrTerms[j]._id"
              :label="getVariantAttribute(term, j).name"
              @update:modelValue="setAttributeTerm(j, $event)"
              :options="getVariantAttributeTerm(term, j)"
            />
          </div>
        </div>
        <div class="enabled">
          <FormsBaseToggle v-model="variants[index].enabled" label="Enabled" />
        </div>
        <EcommerceAdminImageGallery
          :gallery="variants[index].gallery"
          galleryType="variant"
          @newMediaSelectBtnClicked="handleNewMediaSelectBtnClicked"
          @selectFromProductImages="showProductGallery = true"
        />
        <EcommerceAdminImageGallerySelect
          :index="index"
          :showProductGallery="showProductGallery"
          @productGalleryEventEmitted="showProductGallery = $event"
        />

        <div class="sku-stock">
          <div class="sku">
            <FormsBaseInput label="SKU" placeholder="SKU" v-model="variants[index].sku" />
          </div>
          <div class="stock">
            <FormsBaseInput
              label="Stck Qty"
              placeholder="Stock Qty"
              v-model="variants[index].stockQty"
              v-if="product.manageInventory"
            />
            <div class="base-input" v-else>
              <input type="text" placeholder="stock Qty." disabled />
              <label>Enable product manageInventory to set Stock Qty.</label>
            </div>
          </div>
        </div>
        <div class="price">
          <FormsBaseInput label="Price" placeholder="Price" currency v-model="variants[index].price" />
          <FormsBaseInput label="Sale Price" placeholder="Sale Price" currency v-model="variants[index].salePrice" />
        </div>
        <div class="description">
          <FormsBaseInput label="Description" placeholder="Description" v-model="variants[index].description" />
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="actionsx">
        <button class="btn btn-secondary" @click.prevent="cancelVariant">Cancel</button>
        <button
          class="btn btn-primary"
          @click.prevent="updateVariant"
          :disabled="current == JSON.stringify(variants[index])"
        >
          Save Changes
        </button>
      </div>
    </template>
  </Slideout>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
.variant-edit {
  .title {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  .attribute-terms {
    font-size: 1.4rem;
    font-weight: 400;
  }
  .variant-edit-details {
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

    .price {
      display: flex;
      align-items: center;
      gap: 2rem;
    }
  }
  .actionsx {
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
