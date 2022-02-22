<script setup>
import { useMessage } from '~/store/useMessage'

const props = defineProps({
  product: {
    type: Object,
  },
  // variants: {
  //   type: Array,
  // },
  attributes: {
    type: Array,
  },
  attributeTerms: {
    type: Array,
  },

  // showSlideout: {
  //   type: Boolean,
  // },
  // index: Number,
})

const emit = defineEmits(['saveVariants', 'hideSlidout', 'productAttributesUpdated'])

const appMessage = useMessage()

const variants = ref([])

const showSlideout = ref(false)

// const prodState = inject('prodState')
// const attState = inject('attState')
// const variantState = inject('variantState')
// const variantActions = inject('variantActions')

// const showSlideout = inject('showSlideout')

const router = useRouter()

const variantParams = computed(() => {
  return {
    fields: 'product, attrattributeTerms, gallery',
    product: props.product._id,
  }
})

// const showSlideout = ref(false)

const fetchVariants = async () => {
  appMessage.errorMsg = null
  try {
    const response = await $fetch('/api/v1/variants', { params: variantParams.value })
    variants.value = response.docs
    // console.log('variants', variants.value)
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

const deleteVariants = async () => {
  appMessage.errorMsg = null
  try {
    await Promise.all(
      variants.value.map(async (item) => {
        await $fetch('/api/v1/variants', {
          method: 'DELETE',
          params: { id: item._id },
        })
      })
    )
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

const createVariants = async () => {
  appMessage.errorMsg = null
  try {
    await Promise.all(
      variants.value.map(async (item) => {
        await $fetch('/api/v1/variants', {
          method: 'POST',
          body: item,
        })
      })
    )
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

await fetchVariants()

const saveVariants = async () => {
  // showSlideout.value = false
  // emit('saveVariants')
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

const updateVariants = async (event) => {
  // console.log('ECV', event)
  await deleteVariants()
  variants.value = event
  await createVariants()
  // showSlideout.value = false
  // emit('saveVariants')
}
</script>

<template>
  <section class="variants shadow-md" id="variants">
    <!-- <header class="admin-section-header">
      <p class="title">Variants</p>
      <button class="btn btn-heading" @click="showSlideout = true">
        <span v-show="!variants.length">Add</span>
        <span v-show="variants.length">Edit</span>
      </button>
    </header>
    <div class="content">
      <div>Different types of this product (e.g. size, color)</div>
      <div class="attributes">
        <div class="attribute" v-for="attribute in product.attributes" :key="attribute.attribute._id">
          <p class="attribute-name">{{ attribute.attribute.name }}:</p>
          <div class="terms">
            <div class="term" v-for="term in attribute.terms" :key="term._id">
              <span class="term-name">{{ term.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="slideout" v-show="showSlideout">
      <div class="overlay"></div>
      <div class="wrapper" @click.self="showSlideout = false">
        <transition name="slideout">
          <div class="content" v-show="showSlideout">
            <section class="attributes-variants">
              <!-- <div class="dialog shadow-md"> -->
              <div class="header shadow-md">
                <h3 class="title">Edit Variants</h3>
                <button class="btn close"><IconsClose @click.prevent="showSlideout = false" /></button>
              </div>
              <div class="main">
                <div v-if="!product._id">
                  <EcommerceAdminProductEmptyVariantMsg :product="product" @hideSlideout="showSlideout = false" />
                </div>
                <div v-else class="attributes-variants">
                  <h3>Please select attributes to use for variants</h3>
                  <EcommerceAdminProductAttributesPanel
                    :product="product"
                    :attributes="attributes"
                    :attributeTerms="attributeTerms"
                    @compAttributesUpdated="$emit('productAttributesUpdated', $event)"
                  />
                  <EcommerceAdminProductVariantsPanel
                    :product="product"
                    :attributes="attributes"
                    :attributeTerms="attributeTerms"
                    :variants="variants"
                    @compVariantsUpdated="updateVariants"
                  />
                </div>
              </div>

              <div class="footer actions shadow-md">
                <!-- <div class="actions" v-if="product._id && product.attributes.length"> -->
                <!-- <div class="actions"> -->
                <button class="btn btn-secondary cancel" @click="saveAttributes">Cancel</button>
                <button class="btn btn-primary save" @click.prevent="saveVariants">Save Changes</button>
                <!-- </div> -->
              </div>
            </section>

            <!-- </div> -->
          </div>
        </transition>
      </div>
    </div>
    <!-- <EcommerceAdminProductVariants
            :product="product"
            @saveVariants="saveProduct"
            :showSlideout="showSlideout"
          /> -->
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
.variants {
  background-color: white;
  border-radius: 5px;
  padding: 2rem 2rem 4rem;

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    .title {
      font-size: 80%;
    }

    .attributes {
      display: flex;
      flex-direction: column;
      gap: 2rem;

      .attribute {
        display: flex;
        align-items: center;
        gap: 1rem;

        .terms {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 2rem;
          // border: 1px solid red;

          .term {
            background-color: $slate-500;
            color: $slate-50;
            font-size: 80%;
            padding: 0.25rem 1rem 0.5rem;
            border-radius: 2rem;
          }
        }
      }
    }
  }
  .attributes-variants {
    width: 100%;
    height: 100%;
    background-color: $slate-100;
    // border: 10px solid red;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2rem;
      background-color: white;
      // border: 1px solid red;

      .btn {
        border: none;

        svg {
          width: 2rem;
          height: 2rem;
        }
      }
    }
    .main {
      flex: 1;
      // border: 1px solid red;

      // .attributes-variants {
      //   display: flex;
      //   flex-direction: column;
      //   gap: 2rem;
      // }
    }

    .footer {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 2rem;
      padding: 2rem;
      background-color: white;
      // border: 1px solid red;
    }
  }
}
</style>
