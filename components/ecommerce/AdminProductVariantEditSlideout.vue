<script setup>
import { useStore } from '~/store/useStore'
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

const store = useStore()
const appMessage = useMessage()
const showAlert = ref(false)
const showMediaSelector = ref(false) // media selector toggler
const showProductGallery = ref(false)
const current = JSON.stringify(store.variants[props.index])

const getVariantAttribute = (term, j) => {
  if (Object.values(term).length) {
    return store.attributes.find((a) => a._id == term.parent._id)
  } else {
    return store.product.attributes[j].attribute
  }
}

const getVariantAttributeTerm = (term, j) => {
  const attributes = store.product.attributes.find((a) => a.attribute._id == getVariantAttribute(term, j)._id)
  return attributes.terms.map((t) => {
    return { key: t._id, name: t.name }
  })
}

const updateVariantMedia = async (event) => {
  showMediaSelector.value = false
  for (const prop in event) {
    const i = store.variants[props.index].gallery.findIndex((m) => m._id === event[prop]._id)
    if (i === -1) {
      store.variants[props.index].gallery.push(event[prop])
      store.product.gallery.push(event[prop])
    }
  }
}

const closeSlideout = () => {
  showAlert.value = true
  if (current !== JSON.stringify(store.variants[props.index])) return (showAlert.value = true)
  emit('slideoutEventEmitted', false)
}

const setAttributeTerm = async (j, termId) => {
  const term = store.attributeTerms.find((t) => t._id == termId)
  store.variants[props.index].attrTerms[j] = term
}

const cancelVariant = () => {
  store.variants[props.index] = JSON.parse(current)
  emit('slideoutEventEmitted', false)
}

const updateVariant = () => {
  //  Check for duplicate variants
  for (const prop in store.variants) {
    if (
      prop * 1 !== props.index * 1 &&
      isEqual(
        store.variants[prop].attrTerms.map((t) => t._id),
        store.variants[props.index].attrTerms.map((t) => t._id)
      )
    ) {
      appMessage.errorMsg = `Duplicate variants not allowed.  You new variant uses the same attributes and attribute terms as ${
        prop * 1 + 1
      } variant`
      return
    }
  }

  let errorMsg = ''
  for (const prop in store.variants[props.index].attrTerms) {
    if (!Object.keys(store.variants[props.index].attrTerms[prop]).length)
      errorMsg += `Terms missing for attribute ${
        getVariantAttribute(store.variants[props.index].attrTerms[prop], prop).name
      }<br>`
  }
  if (errorMsg) appMessage.errorMsg = `Attribute terms are required<br> ${errorMsg}`
  else emit('slideoutEventEmitted', false)
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
              <div>Edit Variant:</div>
              <div class="attribute-terms" v-for="(term, j) in store.variants[index].attrTerms" :key="`term-${j}`">
                <span class="attribute">{{ getVariantAttribute(term, j).name }}:</span>
                <span class="term" v-if="Object.keys(term).length">{{ term.name }}</span>
              </div>
            </div>
            <button class="btn close"><IconsClose @click.prevent="closeSlideout" /></button>
          </div>
          <div class="slideout__main">
            <div class="variant-edit">
              <!-- <pre style="font-size: 1rem">{{ store.variants[index] }}</pre> -->
              <h3>Variant Options</h3>
              <div class="attribute-terms">
                <div class="term" v-for="(term, j) in store.variants[index].attrTerms" :key="term._id">
                  <FormsBaseSelect
                    :value="store.variants[index].attrTerms[j]._id"
                    :label="getVariantAttribute(term, j).name"
                    @update:modelValue="setAttributeTerm(j, $event)"
                    :options="getVariantAttributeTerm(term, j)"
                  />
                </div>
              </div>
              <div class="enabled">
                <FormsBaseToggle v-model="store.variants[index].enabled" label="Enabled" />
              </div>
              <EcommerceAdminImageGallery
                :gallery="store.variants[index].gallery"
                galleryType="variant"
                @mediaSelectorClicked="showMediaSelector = true"
                @selectFromProductImages="showProductGallery = true"
              />

              <EcommerceAdminImageGallerySelect
                :index="index"
                :showProductGallery="showProductGallery"
                @productGalleryEventEmitted="showProductGallery = $event"
              />

              <div class="sku-stock">
                <div class="sku">
                  <FormsBaseInput label="SKU" placeholder="SKU" v-model="store.variants[index].sku" />
                </div>
                <div class="stock">
                  <FormsBaseInput
                    label="Stck Qty"
                    placeholder="Stock Qty"
                    v-model="store.variants[index].stockQty"
                    v-if="store.product.manageInventory"
                  />
                  <div class="base-input" v-else>
                    <input type="text" placeholder="stock Qty." disabled />
                    <label>Enable product manageInventory to set Stock Qty.</label>
                  </div>
                </div>
              </div>
              <div class="price">
                <FormsBaseInput label="Price" placeholder="Price" currency v-model="store.variants[index].price" />
                <FormsBaseInput
                  label="Sale Price"
                  placeholder="Sale Price"
                  currency
                  v-model="store.variants[index].salePrice"
                />
              </div>
              <div class="description">
                <FormsBaseInput
                  label="Description"
                  placeholder="Description"
                  v-model="store.variants[index].description"
                />
              </div>
            </div>
          </div>
          <div class="slideout__footer actions shadow-md">
            <button class="btn btn-secondary cancel" @click.prevent="cancelVariant">Cancel</button>
            <button
              class="btn btn-primary save"
              @click.prevent="updateVariant"
              :disabled="current == JSON.stringify(store.variants[index])"
            >
              Save Changes
            </button>
          </div>
        </div>
      </transition>
    </div>
    <div class="media-selector" v-if="showMediaSelector">
      <LazyMediaUploader
        @mediaSelected="updateVariantMedia"
        @mediaSelectCancel="showMediaSelector = false"
        v-if="showMediaSelector"
      />
    </div>
    <Alert v-if="showAlert" @ok="showAlert = false" @cancel="showAlert = false" :showCancelBtn="false">
      <h3>You have unsaved changes</h3>
      <p>Please save your changes before closing this variant window or click cancel to exit without saving</p>
    </Alert>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
.variant {
  .title {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  .attribute-terms {
    font-size: 1.4rem;
    font-weight: 400;
  }
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

    .price {
      display: flex;
      align-items: center;
      gap: 2rem;
    }
  }
  .actions {
    display: flex;
    align-items: center;
    gap: 2rem;

    .save {
      &:disabled {
        background-color: $slate-400;
        cursor: not-allowed;
      }
    }
  }
}
</style>
