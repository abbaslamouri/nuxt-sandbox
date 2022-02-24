<script setup>
import slugify from 'slugify'
import { useMessage } from '~/store/useMessage'
import { useStore } from '~/store/useStore'

useMeta({
  title: 'Product | YRL',
})
definePageMeta({
  layout: 'admin',
})

const route = useRoute()
const router = useRouter()
const store = useStore()
const appMessage = useMessage()
const product = ref({})
const variants = ref([])
const categories = ref([])
const attributes = ref([])
const attributeTerms = ref([])
const showAttributesSlideout = ref(false)
const showVariantsSlideout = ref(false)
const showMediaSelector = ref(false) // media selector toggler
const mediaReference = ref({}) // sets which media to update once a selection is made
const galleryIntro = ref('This image gallery contains all images associated with this product including its variants.')
const slug = route.params.slug === ' ' ? null : route.params.slug

// Set query params
const productParams = computed(() => {
  return {
    fields: 'name, slug, price, permalink, categories, description, attributes, gallery, manageInventory',
    slug,
    indexPage: false,
  }
})

const categoryParams = computed(() => {
  return {
    fields: 'name, slug, permalink, decsription, parent, gallery',
  }
})

const fetchProduct = async () => {
  appMessage.errorMsg = null
  try {
    if (slug) {
      let response = await $fetch('/api/v1/products', { params: productParams.value })
      store.product = response.docs[0]
    } else {
      store.product = {
        attributes: [],
        categories: [],
        gallery: [],
        extraFields: [],
      }
    }
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

const fetchCategories = async () => {
  appMessage.errorMsg = null
  try {
    const response = await $fetch('/api/v1/categories', { params: categoryParams.value })
    categories.value = response.docs
    store.categories = response.docs
    // console.log('Categories', categories.value)
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

await Promise.all([fetchProduct(), fetchCategories()])

// const pp = useState('pp', () => store.product)

// pp.value = store.product

// await fetchCategories()
// await fetchAttributes()
// await fetchAttributeTerms()
// await fetchProduct()

// console.log('SLUG', slug)
// const response = await $fetch(`/api/v1/products/slug`, { params: productParams.value })
// console.log('RES', response)

// const fetchProduct = async (slug) => {
//   appMessage.errorMsg = null
//   let response = null
//   try {
//     if (slug !== ' ') {
//       productParams.value.slug = slug
//       response = await $fetch('/api/v1/products', { params: productParams.value })
//       console.log('products', response)
//       store.product = response.docs[0]
//       variantParams.value.product = store.product._id
//       response = await $fetch('/api/v1/variants', { params: variantParams.value })
//       console.log('variants', response)
//       store.variants = response.docs
//     } else {
//       store.product = {
//         // name: '',
//         // slug: "",
//         // permalink: "",
//         // price: null,
//         // active: true,
//         attributes: [],
//         categories: [],
//         gallery: [],
//         extraFields: [],
//         // taxStatus: 'none',
//         // taxClass: 'standard',
//         // allowBcakOrder: 'notify',
//         // sortOrder: 0,
//         // variants: [],
//       }
//     }
//     console.log('PRODUCTS', store.product)
//   } catch (error) {
//     appMessage.errorMsg = error.data
//   }
// }

const current = JSON.stringify(store.product)
const currentVariants = JSON.stringify(store.variants)

///////////////////////////////

// // Set product filters
// prodState.query.slug = route.params.slug
// prodState.query.populate =
//   'featuredImage gallery  thumbImage bodyBgImage attributesImage recipeImage categories attributes attributes.attribute attributes.terms attributes.defaultTerm'

// const params = {
//   populate:
//     'gallery featuredImage thumbImage bodyBgImage attributesImage recipeImage categories attributes attributes.attribute attributes.terms attributes.defaultTerm',
// }

// fetch product, categories, attributes and attribute terms

// router.beforeEach((to, from) => {
//   console.log(to)

//   if (current !== JSON.stringify(prodState.selectedItem)) {
//     const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
//     // cancel the navigation and stay on the same page
//     if (!answer) return false
//     // else current = JSON.stringify(prodState.selectedItem)
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
  // showMediaSelector.value = false
  // media = media.filter((el) => el.mimetype.includes('image'))
  // if (mediaReference.value.image === 'variant') {
  //   for (const prop in media) {
  //     let index = prodState.selectedItem.variants[mediaReference.value.index].gallery.findIndex(
  //       (el) => el._id === media[prop]._id
  //     )
  //     if (index === -1) {
  //       prodState.selectedItem.variants[mediaReference.value.index].gallery.push(media[prop])
  //     }
  //     index = prodState.selectedItem.gallery.findIndex((el) => el._id === media[prop]._id)
  //     if (index === -1) {
  //       prodState.selectedItem.gallery.push(media[prop])
  //     }
  //   }
  // }
  // if (mediaReference.value.image === 'gallery') {
  //   for (const prop in media) {
  //     const index = prodState.selectedItem.gallery.findIndex((el) => el._id === media[prop]._id)
  //     if (index === -1) {
  //       prodState.selectedItem.gallery.push(media[prop])
  //     }
  //   }
  //   if (prodState.selectedItem.variants.length) {
  //     for (const prop in prodState.selectedItem.variants) {
  //       if (!prodState.selectedItem.variants[prop].gallery.length)
  //         prodState.selectedItem.variants[prop].gallery.push(prodState.selectedItem.gallery[0])
  //     }
  //   }
  // }
}

const saveProduct = async () => {
  // console.log('SAVE', store.product)
  appMessage.errorMsg = null
  let response = null
  try {
    if (!store.product.name || !store.product.price)
      return (appMessage.errorMsg = 'Product name and price are required')
    if (current === JSON.stringify(store.product)) return (appMessage.errorMsg = 'All is good')
    store.product.slug = slugify(store.product.name, { lower: true })
    if (!store.product.permalink) store.product.permalink = slugify(store.product.name, { lower: true })

    if (store.product._id) {
      response = await $fetch('/api/v1/products', {
        method: 'PATCH',
        body: store.product,
        params: { id: store.product._id },
      })
    } else {
      response = await $fetch('/api/v1/products', {
        method: 'POST',
        body: store.product,
      })
    }
    // console.log('savedProduct', response)
    // store.product = response
    router.push({ name: 'admin-ecommerce-products-slug', params: { slug: response.slug } })
    appMessage.successMsg = 'Product saved succesfully'
  } catch (error) {
    appMessage.errorMsg = error.data
  }

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
  // variantState.selectedItems = prodState.selectedItem.variants
  // console.log(current === JSON.stringify(prodState.selectedItem))
  // console.log(currentVariants === JSON.stringify(prodState.selectedItem.variants))
  // if (current !== JSON.stringify(prodState.selectedItem)) {
  //   const newProduct = await prodActions.saveItem()
  //   if (!prodState.errorMsg) {
  //     if (variantState.selectedItems.length && currentVariants !== JSON.stringify(variantState.selectedItems)) {
  //       await variantActions.deleteMany({ product: newProduct._id })
  //       await variantActions.saveMany()
  //       if (!variantState.errorMsg) router.push({ name: 'admin-products-slug', params: { slug: newProduct.slug } })
  //     } else {
  //       router.push({ name: 'admin-products-slug', params: { slug: newProduct.slug } })
  //     }
  //   }
  // }
}

const updateAttributes = async (event) => {
  store.product.attributes = event
  await saveProduct()
}

// Set category gallery
const selectMedia = async (event) => {
  // console.log(event)
  showMediaSelector.value = false
  for (const prop in event) {
    const index = store.product.gallery.findIndex((el) => el._id === event[prop]._id)
    if (index === -1) {
      store.product.gallery.push(event[prop])
    }
  }
}

// Update product details
// const updateDetails = (event) => {
//   store.product.name = event.name
//   store.product.description = event.description
//   store.product.sku = event.sku
//   store.product.stockQty = event.stockQty
//   store.product.manageInventory = event.manageInventory
//   store.product.slug = slugify(store.product.name, { lower: true })
// }

// Upfate product SEO
const updateProductSeo = (event) => {
  store.product.permalink = slugify(event.permalink, { lower: true })
  store.product.seoTitle = event.seoTitle
  store.product.seoDescription = event.seoDescription
}

// Upfate product Misc
const updateProductMisc = (event) => {
  store.product.thankYouPage = event.thankYouPage
  store.product.sortOrder = event.sortOrder
}

// Update product extra fields
const updateExtraFields = (event) => {
  for (const prop in event) {
    // console.log(event[prop].name)
    store.product.extraFields[prop] = {}
    store.product.extraFields[prop].name = event[prop].name
    store.product.extraFields[prop].isRequired = event[prop].isRequired
  }
}

const xxx = async (event) => {
  // console.log(event)
  showAttributesSlideout.value = true
}
</script>

<template>
  <div class="product-details">
    <Html>
      <Head><Title>Product</Title></Head>
    </Html>

    <NuxtLink class="link" :to="{ name: 'admin-ecommerce-products' }">
      <IconsArrowWest /><span>Products</span>
    </NuxtLink>

    <h3 class="header">Edit Product</h3>
    <!-- <pre style="font-size: 1rem">{{ store.product }}</pre> -->
    <div class="columns">
      <div class="left shadow-md">
        <EcommerceAdminProductLeftSidebar :product="product" />
      </div>

      <div class="center">
        <EcommerceAdminProductDetails :product="product" />
        <EcommerceAdminProductPrice :product="product" />
        <EcommerceAdminImageGallery
          :gallery="store.product.gallery"
          :galleryIntro="galleryIntro"
          galleryType="product"
          @mediaSelectorClicked="showMediaSelector = true"
        />
        <section class="attributes" id="attributes">
          <EcommerceAdminProductAttributesContent />
          <EcommerceAdminProductAttributesSlideout
            v-show="store.showAttributesSlideout"
            :productAttributes="product.attributes"
            :productId="product._id"
            :showAttributesSlideout="showAttributesSlideout"
            @slideoutEventEmitted="showAttributesSlideout = $event"
            @attributesUpdated="updateAttributes"
          />
        </section>
        <section class="variants" id="variants">
          <EcommerceAdminProductVariantsContent
            :productVariants="variants"
            @slideoutEventEmitted="store.showVariantsSlideout = $event"
          />
          <EcommerceAdminProductVariantsSlideout
            v-show="store.showVariantsSlideout"
            @slideoutEventEmitted="store.showVariantsSlideout = $event"
          />
        </section>
        <!-- <LazyEcommerceAdminProductAttributes
          :productId="product._id"
          :productAttributes="product.attributes"
          @compAttributesUpdated="updateAttributes"
        /> -->
        <!-- <LazyEcommerceAdminProductVariants
          :product="product"
          :attributes="attributes"
          :attributeTerms="attributeTerms"
          @productAttributesUpdated="product.attributes = $event"
        /> -->

        <EcommerceAdminProductShippingOptions
          :product="product"
          @shippingOptionsEmitted="product.shippingOptions = $event.shippingOptions"
        />
        <EcommerceAdminProductDigitalDelivery
          :product="product"
          @digitalDeliveryEmitted="product.downloadable = $event.downloadable"
        />
        <EcommerceAdminProductExtraFields :product="product" @extraFieldsEmitted="updateExtraFields" />
        <EcommerceAdminProductSeo :product="product" @productSeoEmitted="updateProductSeo" />
        <EcommerceAdminProductMisc :product="product" @productMiscEmitted="updateProductMisc" />
      </div>
      <div class="right">
        <EcommerceAdminProductRightSidebar @productStatusUpdated="product.status = $event" @saveProduct="saveProduct" />
      </div>
    </div>
    <div class="media-selector" v-if="showMediaSelector">
      <LazyMediaUploader
        @mediaSelected="selectMedia"
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

      // .variants {
      //   background-color: white;
      //   border-radius: 5px;
      //   padding: 2rem 2rem 4rem;

      //   header {
      //     display: flex;
      //     align-items: center;
      //     justify-content: space-between;
      //   }

      //   .content {
      //     display: flex;
      //     flex-direction: column;
      //     gap: 2rem;

      //     .title {
      //       font-size: 80%;
      //     }

      //     .attributes {
      //       display: flex;
      //       flex-direction: column;
      //       gap: 2rem;

      //       .attribute {
      //         display: flex;
      //         align-items: center;
      //         gap: 1rem;

      //         .terms {
      //           flex: 1;
      //           display: flex;
      //           align-items: center;
      //           gap: 2rem;
      //           // border: 1px solid red;

      //           .term {
      //             background-color: $slate-500;
      //             color: $slate-50;
      //             font-size: 80%;
      //             padding: 0.25rem 1rem 0.5rem;
      //             border-radius: 2rem;
      //           }
      //         }
      //       }
      //     }
      //   }
      // }
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
