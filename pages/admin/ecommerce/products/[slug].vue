<script setup>
import slugify from 'slugify'
import { useMessage } from '~/store/useMessage'

useMeta({
  title: 'Product | YRL',
})
definePageMeta({
  layout: 'admin',
})

const route = useRoute()
const router = useRouter()
const appMessage = useMessage()
const product = ref({})
const variants = ref([])
const categories = ref([])
const attributes = ref([])
const terms = ref([])
const showSlideout = ref(false)
const showMediaSelector = ref(false) // media selector toggler
const mediaReference = ref({}) // sets which media to update once a selection is made
const galleryIntro = ref('This image gallery contains all images associated with this product including its variants.')

// Set query params
const productParams = computed(() => {
  return {
    fields: 'name, slug, price, permalink, categories, decsription, attributes, gallery',
  }
})

const variantParams = computed(() => {
  return {
    fields: 'product, attrTerms, gallery',
  }
})
const categoryParams = computed(() => {
  return {
    fields: 'name, slug, permalink, decsription, parent, gallery',
  }
})

const attributeParams = computed(() => {
  return {
    fields: 'name, slug',
  }
})

// Set query params
const attributeTermsParams = computed(() => {
  return {
    fields: 'name, slug, parent',
  }
})

const fetchProduct = async (slug) => {
  appMessage.errorMsg = null
  let response = null
  try {
    if (slug !== ' ') {
      productParams.value.slug = slug
      response = await $fetch('/api/v1/products', { params: productParams.value })
      console.log('products', response)
      product.value = response.docs[0]
      variantParams.value.product = product.value._id
      response = await $fetch('/api/v1/variants', { params: variantParams.value })
      console.log('variants', response)
      variants.value = response.docs
    } else {
      product.value = {
        // name: '',
        // slug: "",
        // permalink: "",
        // price: null,
        // active: true,
        attributes: [],
        categories: [],
        gallery: [],
        extraFields: [],
        // taxStatus: 'none',
        // taxClass: 'standard',
        // allowBcakOrder: 'notify',
        // sortOrder: 0,
        // variants: [],
      }
    }
    console.log('PRODUCTS', product.value)
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

// const fetchVariants = async () => {
//   appMessage.errorMsg = null
//   try {
//     const response = await $fetch('/api/v1/variants', { params: variantParams.value })
//     product.value.variants = response.docs
//     console.log(response)
//   } catch (error) {
//     appMessage.errorMsg = error.data
//   }
// }

const fetchCategories = async () => {
  appMessage.errorMsg = null
  try {
    const response = await $fetch('/api/v1/categories', { params: categoryParams.value })
    console.log('Categories', response)
    categories.value = response.docs
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

const fetchAttributes = async () => {
  appMessage.errorMsg = null
  try {
    const response = await $fetch('/api/v1/attributes', { params: attributeParams.value })
    console.log('Attributes', response)
    attributes.value = response.docs
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

const fetchTerms = async () => {
  appMessage.errorMsg = null
  try {
    const response = await $fetch('/api/v1/attributeterms', { params: attributeTermsParams.value })
    console.log('Terms', response)
    terms.value = response.docs
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

await Promise.all([fetchProduct(route.params.slug), fetchCategories(), fetchAttributes(), fetchTerms()])

const currentProduct = JSON.stringify(product.value)
const currentVariants = JSON.stringify(product.value.variants)

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
  console.log('SAVE', product.value)
  appMessage.errorMsg = null
  let response = null
  try {
    if (currentProduct === JSON.stringify(product.value)) return
    if (product.value._id) {
      response = await $fetch('/api/v1/products', {
        method: 'PATCH',
        body: product.value,
        params: { id: product.value._id },
      })
    } else {
      response = await $fetch('/api/v1/products', {
        method: 'POST',
        body: product.value,
      })
    }
    console.log('product', response)
    router.push(`/admin/ecommerce/products/${response.slug}`)
    router.push({ name: `admin-ecommerce-products-slug`, params: { slug: response.slug } })
    // productParams.value.slug = response.slug
    // response = await $fetch('/api/v1/products', { params: productParams.value })
    // console.log('ZZZZZZZZZZZZZZZ', response)
    // product.value = response.docs[0]

    // product.value = response
    appMessage.successMsg = 'Product saved succesfully'
    // product.value = response
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
  // console.log(currentProduct === JSON.stringify(prodState.selectedItem))
  // console.log(currentVariants === JSON.stringify(prodState.selectedItem.variants))
  // if (currentProduct !== JSON.stringify(prodState.selectedItem)) {
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

// Set category gallery
const selectMedia = async (event) => {
  console.log(event)
  showMediaSelector.value = false
  for (const prop in event) {
    const index = product.value.gallery.findIndex((el) => el._id === event[prop]._id)
    if (index === -1) {
      product.value.gallery.push(event[prop])
    }
  }
}

// Update product details
const updateDetails = (event) => {
  product.value.name = event.name
  product.value.description = event.description
  product.value.sku = event.sku
  product.value.stockQty = event.stockQty
  product.value.manageInventory = event.manageInventory
  product.value.slug = slugify(product.value.name, { lower: true })
}

// Upfate product SEO
const updateProductSeo = (event) => {
  product.value.permalink = slugify(event.permalink, { lower: true })
  product.value.seoTitle = event.seoTitle
  product.value.seoDescription = event.seoDescription
}

// Upfate product Misc
const updateProductMisc = (event) => {
  product.value.thankYouPage = event.thankYouPage
  product.value.sortOrder = event.sortOrder
}

// Update product extra fields
const updateExtraFields = (event) => {
  for (const prop in event) {
    console.log(event[prop].name)
    product.value.extraFields[prop] = {}
    product.value.extraFields[prop].name = event[prop].name
    product.value.extraFields[prop].isRequired = event[prop].isRequired
  }
}

// Update product categories
const updateProductCategories = (event) => {
  const categorieIds = [...event]
  product.value.categories = []
  for (const prop in categorieIds) {
    const category = categories.value.find((c) => c._id == categorieIds[prop])
    console.log(category)
    product.value.categories.push(category)
  }
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
    <div class="columns">
      <div class="left shadow-md">
        <EcommerceAdminProductLeftSidebar :product="product" />
      </div>

      <div class="center">
        <EcommerceAdminProductDetails :product="product" @productDetailsEmitted="updateDetails" />
        <EcommerceAdminProductPrice :product="product" @productPriceEmitted="product.price = $event.price" />
        <EcommerceAdminCategoryGallery
          :gallery="product.gallery"
          :galleryIntro="galleryIntro"
          galleryType="product"
          @mediaSelectorClicked="showMediaSelector = true"
        />
        <!-- <EcommerceAdminProductVariants :product="product" :variants="variants" @saveVariants="saveProduct" /> -->
        <!-- <section class="variants shadow-md" id="variants">
          <header class="admin-section-header">
            <p class="title">Variants</p>
            <button class="btn btn-heading" @click="showSlideout = true">
              <IconsPlus v-if="!product.variants.length" />
              <span v-if="!product.variants.length">Add</span>
              <span v-else>Edit</span>
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
          </div>
          <EcommerceAdminProductVariants
            :product="product"
            @saveVariants="saveProduct"
            :showSlideout="showSlideout"
          />
        </section> -->

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
        <EcommerceAdminProductRightSidebar
          :product="product"
          :categories="categories"
          @productStatusUpdated="product.status = $event"
          @productCategoriesUpdated="updateProductCategories"
          @saveProduct="saveProduct"
        />
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
