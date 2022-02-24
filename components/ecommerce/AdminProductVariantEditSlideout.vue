<script setup>
import { useStore } from '~/store/useStore'

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

const showAlert = ref(false)
const showMediaSelector = ref(false) // media selector toggler
const current = JSON.stringify(store.variants[props.index])
const galleryIntro = ref('This image gallery contains all images associated with this variation.')

const selectMedia = async (event) => {
  showMediaSelector.value = false
  for (const prop in event) {
    const i = store.variants[props.index].gallery.findIndex((m) => m._id === event[prop]._id)
    if (i === -1) {
      store.variants[props.index].gallery.push(event[prop])
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
  console.log(store.variants[props.index])
  emit('slideoutEventEmitted', false)
}
</script>

<template>
  <section class="slideout">
    <div class="overlay"></div>
    <div class="slideout__wrapper" @click.self="closeSlideout">
      <transition name="slideout">
        <div class="slideout__content variant" v-show="showVariantEditSlideout">
          <div class="slideout__header shadow-md">
            <!-- <div class="title">
              <span> Edit Variant: </span>
              <span v-for="term in store.variants[index].attrTerms" :key="term._id"
                >{{ term.parent.name }}: {{ term.name }},
              </span>
            </div> -->
            <button class="btn close"><IconsClose @click.prevent="closeSlideout" /></button>
          </div>
          <div class="slideout__main">
            <div class="variant-edit">
              <pre style="font-size: 1rem">{{ store.variants[index] }}</pre>
              <h3>Select options for your variant</h3>
              <div class="attribute-terms">
                <div class="term" v-for="(term, j) in store.variants[index].attrTerms" :key="term._id">
                  <!-- <FormsBaseSelect
                    :value="store.variants[index].attrTerms[j]._id"
                    :label="term.parent.name"
                    @update:modelValue="setAttributeTerm(j, $event)"
                    :options="
                      store.product.attributes
                        .find((a) => a.attribute._id == term.parent._id)
                        .terms.map((t) => {
                          return { key: t._id, name: t.name }
                        })
                    "
                  /> -->
                </div>
              </div>
              <h3>Variant Details</h3>
              <EcommerceAdminImageGallery
                :gallery="store.variants[index].gallery"
                :galleryIntro="galleryIntro"
                galleryType="product"
                @mediaSelectorClicked="showMediaSelector = true"
              />
              <div class="sku-stock">
                <div class="sku">
                  <FormsBaseInput label="SKU" placeholder="SKU" v-model="store.variants[index].sku" />
                </div>
                <div class="stock">
                  <FormsBaseInput label="Stck Qty" placeholder="Stock Qty" v-model="store.variants[index].stockQty" />
                </div>
              </div>
              <div class="price">
                <FormsBaseInput label="Price" placeholder="Price" currency v-model="store.variants[index].price" />
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
            <button class="btn btn-primary save" @click.prevent="$emit('slideoutEventEmitted', false)">
              Save Changes
            </button>
          </div>
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
