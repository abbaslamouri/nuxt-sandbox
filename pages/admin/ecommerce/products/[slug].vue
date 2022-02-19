<script setup>
import slugify from 'slugify'
const route = useRoute()
const router = useRouter()

// Import products, categories, attributes, atterbute terms and variants state and actions
const { state: prodState, actions: prodActions, fetchBySlug: prodFetchBuSlug } = useFactory('products')
const { state: catState, actions: catActions } = useFactory('categories')
const { state: attState, actions: attActions } = useFactory('attributes')
const { state: attTermsState, actions: attTermsActions } = useFactory('attributeterms')
const { state: variantState, actions: variantActions } = useFactory('variants')

const showAttVarSlideout = ref(false)
const showMediaSelector = ref(false) // media selector toggler
const mediaReference = ref({}) // sets which media to update once a selection is made

// Set product filters
prodState.query.slug = route.params.slug
prodState.query.populate =
  'featuredImage gallery  thumbImage bodyBgImage attributesImage recipeImage categories attributes attributes.attribute attributes.terms attributes.defaultTerm'

const params = {
  populate:
    'gallery featuredImage thumbImage bodyBgImage attributesImage recipeImage categories attributes attributes.attribute attributes.terms attributes.defaultTerm',
}

// fetch product, categories, attributes and attribute terms
await Promise.all([
  prodFetchBuSlug(route.params.slug, params),
  catActions.fetchAll(),
  attActions.fetchAll(),
  attTermsActions.fetchAll(),
])
console.log(prodState.selectedItem)

if (prodState.selectedItem) {
  // prodState.selectedItem = prodState.items[0]
  variantState.query.populate = 'attrTerms gallery'
  variantState.query.product = prodState.selectedItem._id
  if (variantState.query.product) await variantActions.fetchAll()
  prodState.selectedItem.variants = variantState.items
} else {
  prodState.selectedItem = {
    name: '',
    slug: computed(() => slugify(prodState.selectedItem.name, { lower: true })),
    permalink: computed(() => slugify(prodState.selectedItem.name, { lower: true })),
    price: null,
    active: true,
    attributes: [],
    categories: [],
    gallery: [],
    extraFields: [],
    taxStatus: 'none',
    taxClass: 'standard',
    allowBcakOrder: 'notify',
    sortOrder: 0,
    variants: [],
  }
}

const currentProduct = JSON.stringify(prodState.selectedItem)
const currentVariants = JSON.stringify(prodState.selectedItem.variants)

// router.beforeEach((to, from) => {
//   console.log(to)

//   if (currentProduct !== JSON.stringify(prodState.selectedItem)) {
//     const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
//     // cancel the navigation and stay on the same page
//     if (!answer) return false
//     // else currentProduct = JSON.stringify(prodState.selectedItem)
//   }
// })

// Show media selector
const handleMediaSelectorClick = (payload) => {
  showMediaSelector.value = true
  // console.log(payload)
  mediaReference.value = payload
}

// Set media ince selection is made
const processSelectedMedia = async (media) => {
  showMediaSelector.value = false
  media = media.filter((el) => el.mimetype.includes('image'))
  if (mediaReference.value.image === 'variant') {
    for (const prop in media) {
      let index = prodState.selectedItem.variants[mediaReference.value.index].gallery.findIndex(
        (el) => el._id === media[prop]._id
      )
      if (index === -1) {
        prodState.selectedItem.variants[mediaReference.value.index].gallery.push(media[prop])
      }

      index = prodState.selectedItem.gallery.findIndex((el) => el._id === media[prop]._id)
      if (index === -1) {
        prodState.selectedItem.gallery.push(media[prop])
      }
    }
  }

  if (mediaReference.value.image === 'gallery') {
    for (const prop in media) {
      const index = prodState.selectedItem.gallery.findIndex((el) => el._id === media[prop]._id)
      if (index === -1) {
        prodState.selectedItem.gallery.push(media[prop])
      }
    }
    if (prodState.selectedItem.variants.length) {
      for (const prop in prodState.selectedItem.variants) {
        if (!prodState.selectedItem.variants[prop].gallery.length)
          prodState.selectedItem.variants[prop].gallery.push(prodState.selectedItem.gallery[0])
      }
    }
  }
}

const saveProduct = async () => {
  // nameInputRef.value.$el.querySelector('.error').innerHTML = ''
  // priceInputRef.value.$el.querySelector('.error').innerHTML = ''

  // if (!prodState.selectedItem.name) {
  //   nameInputRef.value.$el.querySelector('input').classList.add('invalid')
  //   nameInputRef.value.$el.querySelector('input').focus()
  //   if (nameInputRef.value.$el.querySelector('input').validity.valueMissing)
  //     nameInputRef.value.$el.querySelector('.error').innerHTML = 'Please enter a name'
  //   return appError.setSnackbar(true, 'Product name is required')
  // }

  // if (!prodState.selectedItem.price) {
  //   priceInputRef.value.$el.querySelector('input').classList.add('invalid')
  //   priceInputRef.value.$el.querySelector('input').focus()
  //   if (priceInputRef.value.$el.querySelector('input').validity.valueMissing)
  //     priceInputRef.value.$el.querySelector('.error').innerHTML = 'Please enter a price'
  //   return appError.setSnackbar(true, 'Product price is required')
  // } else if (isNaN(priceInputRef.value.$el.querySelector('input').value)) {
  //   priceInputRef.value.$el.querySelector('.error').innerHTML = 'Please enter a valid price'

  //   return appError.setSnackbar(true, 'Price must be a number')
  // }
  // const itemToSave = { ...prodState.selectedItem }
  // prodState.selectedItem = {
  variantState.selectedItems = prodState.selectedItem.variants

  // console.log(currentProduct === JSON.stringify(prodState.selectedItem))
  // console.log(currentVariants === JSON.stringify(prodState.selectedItem.variants))

  if (currentProduct !== JSON.stringify(prodState.selectedItem)) {
    const newProduct = await prodActions.saveItem()
    if (!prodState.errorMsg) {
      if (variantState.selectedItems.length && currentVariants !== JSON.stringify(variantState.selectedItems)) {
        await variantActions.deleteMany({ product: newProduct._id })
        await variantActions.saveMany()
        if (!variantState.errorMsg) router.push({ name: 'admin-products-slug', params: { slug: newProduct.slug } })
      } else {
        router.push({ name: 'admin-products-slug', params: { slug: newProduct.slug } })
      }
    }
  }
}

provide('prodState', prodState)
provide('prodActions', prodActions)
provide('catState', catState)
provide('attState', attState)
provide('attTermsState', attTermsState)
provide('variantState', variantState)
provide('variantActions', variantActions)
provide('handleMediaSelectorClick', handleMediaSelectorClick)
provide('processSelectedMedia', processSelectedMedia)
provide('showAttVarSlideout', showAttVarSlideout)
</script>

<script>
export default {
  layout: 'admin',
}
</script>

<template>
  <div class="product-details">
    <Html>
      <Head><Title>Product</Title></Head>
    </Html>

    <NuxtLink class="link" :to="{ name: 'admin-products' }"> <IconsArrowWest /><span>Products</span> </NuxtLink>

    <h3 class="header">Edit Product</h3>
    <!-- <pre>{{ prodState.selectedItem }}</pre> -->
    <div class="columns">
      <div class="left shadow-md">
        <ProductsAdminProductNav />
      </div>

      <div class="center">
        <ProductsAdminDetails />
        <ProductsAdminPrice />
        <ProductsAdminProductImageGallery />

        <section class="variants shadow-md" id="variants">
          <header class="admin-section-header">
            <p class="title">Variants</p>
            <button class="btn btn-heading" @click="showAttVarSlideout = true">
              <IconsPlus v-if="!prodState.selectedItem.variants.length" />
              <span v-if="!prodState.selectedItem.variants.length">Add</span>
              <span v-else>Edit</span>
            </button>
          </header>
          <div class="content">
            <div>Different types of this product (e.g. size, color)</div>
            <div class="attributes">
              <div
                class="attribute"
                v-for="attribute in prodState.selectedItem.attributes"
                :key="attribute.attribute._id"
              >
                <p class="attribute-name">{{ attribute.attribute.name }}:</p>
                <div class="terms">
                  <div class="term" v-for="term in attribute.terms" :key="term._id">
                    <span class="term-name">{{ term.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ProductsAdminVariants @saveVariants="saveProduct" />
        </section>

        <ProductsAdminShippingOptions />
        <ProductsAdminDigitalDelivery />
        <ProductsAdminExtraFields />
        <ProductsAdminSeo />
        <ProductsAdminMisc />
      </div>

      <div class="right">
        <ProductsAdminRightNav @saveProduct="saveProduct" />
      </div>
    </div>
    <div class="media-selector" v-if="showMediaSelector">
      <LazyMediaUploader
        @mediaSelected="processSelectedMedia"
        @mediaSelectCancel="showMediaSelector = false"
        v-if="showMediaSelector"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.product-details {
  max-width: 1280px;
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .link {
    display: flex;
    align-items: center;
    gap: 0.3rem;

    svg {
      width: 1.8rem;
      height: 1.8rem;
    }
  }

  .columns {
    display: grid;
    grid-template-columns: 18rem 1fr 25rem;
    gap: 2rem;
    align-items: flex-start;

    .left {
      position: sticky;
      top: 10rem;
      background-color: white;
      border: 1px solid $slate-100;
      border-radius: 3px;
      padding: 2rem 0.5rem;
    }

    .center {
      display: flex;
      flex-direction: column;
      gap: 3rem;

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
      }
      // z-index:-1;

      // .details {
      //   background-color: white;
      //   border-radius: 5px;
      //   padding: 2rem 2rem;

      //   .info {
      //     display: flex;
      //     flex-direction: column;
      //     gap: 1rem;

      //     .sku-inventory {
      //       display: flex;
      //       align-items: center;
      //       justify-content: space-between;
      //       gap: 2rem;

      //       .sku {
      //         flex: 1;
      //       }

      //       .inventory {
      //         display: flex;
      //         flex-direction: column;
      //         gap: 0.5rem;
      //         font-size: 1.3rem;

      //         .available {
      //           display: flex;
      //           align-items: center;
      //           gap: 1rem;

      //           .title {
      //             font-weight: 600;
      //           }
      //         }
      //       }
      //     }
      //   }
      // }

      // .price {
      //   background-color: white;
      //   border-radius: 5px;
      //   padding: 2rem 2rem;
      // }
    }

    .right {
      position: sticky;
      top: 10rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
  }

  .link {
    font-weight: 500;
    color: $slate-400;

    &:hover {
      color: $slate-800;
    }
  }
}
</style>
