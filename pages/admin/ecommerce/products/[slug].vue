<script setup>
import slugify from 'slugify'
import { useMessage } from '~/store/useMessage'
// import { useStore } from '~/store/useStore'

useMeta({
  title: 'Product | YRL',
})
definePageMeta({
  layout: 'admin',
})

const { product, variants } = useStore()
const { errorMsg, selectedFiles, mediaReference, showMediaSelector, fetchBySlug, fetchAll, saveDoc } = useFactory()
// provide('store', store)
// provide('fetchAll', fetchAll)

// const { store, save, fetchSingle, fetchCategories, saveVariants, deleteVariants } = useProduct()

const route = useRoute()
const router = useRouter()
// const store = useStore()
const appMessage = useMessage()
// const product = ref({})
// const variants = ref([])
const showAttributesSlideout = ref(false)
const showVariantsSlideout = ref(false)
// const showMediaSelector = ref(false) // media selector toggler
// let response = null
const galleryIntro = ref('This image gallery contains all images associated with this product including its variants.')
const slug = route.params.slug === ' ' ? null : route.params.slug

product.value = await fetchBySlug('products', slug)
variants.value = (
  await fetchAll('variants', {
    fields: 'product, attrattributeTerms, gallery',
    product: product.value._id,
  })
).docs
product.value.productType = 'variable'
console.log('PPP', product.value)

// let response = await fetchSingle(slug)
// if (store.errorMsg) {
//   appMessage.errorMsg = store.errorMsg
//   store.product = []
// } else {
//   store.product = response
//   response = await fetchCategories()
//   if (store.errorMsg) {
//     appMessage.errorMsg = store.errorMsg
//     store.categories = []
//   } else {
//     store.categories = response.docs
//   }
// }

// Set category gallery
const setProductMedia = async (media) => {
  console.log('mediap', media.value)
  // showMediaSelector.value = false
  for (const prop in media.value) {
    const index = product.value.gallery.findIndex((el) => el._id == media.value[prop]._id)
    if (index === -1) {
      product.value.gallery.push(media.value[prop])
    }
  }
  console.log(product.value.gallery)
}

const saveProduct = async () => {
  console.log(product.value)
  product.value.slug = slugify(product.value.name, { lower: true })
  if (!product.value.permalink) product.value.permalink = slugify(product.value.name, { lower: true })
  const response = await saveDoc('products', product.value)
  console.log('SAVE', response)
  if (!response) return
  product.value = response
  // await deleteVariants(product.value._id)
  // if (errorMsg.value) return
  // if (!variants.value.length) {
  //   router.push({ name: 'admin-ecommerce-products-slug', params: { slug: product.value.slug } })
  //   return (appMessage.successMsg = 'product saved succesfully')
  // }
  // console.log('SV', store.variants)
  // await saveVariants(variants.value)
  // if (store.errorMsg) return (appMessage = store.errorMsg)
  // appMessage.successMsg = 'product and variants saved succesfully'
  // router.push({ name: 'admin-ecommerce-products-slug', params: { slug: product.value.slug } })

  showAttributesSlideout.value = false
}

const handleNewMediaSelectBtnClicked = () => {
  mediaReference.value = 'productMedia'
  showMediaSelector.value = true
}

const updateStoreGallery = (gallery) => {
  console.log(gallery)
  product.value.gallery = gallery
}

watch(
  () => selectedFiles,
  (currentVal) => {
    console.log(currentVal)
    if (mediaReference.value === 'productMedia') setProductMedia(currentVal)
    // store.showMediaSelector = false
    // store.selectedFiles = []
  },
  { deep: true }
)

provide('saveProduct', saveProduct)
</script>

<template>
  <div class="hfull flex-col items-center gap2 p3">
    <header class="flex-col gap2 wfull max-width-130">
      <div class="go-back" id="product-go-back">
        <NuxtLink class="admin-link" :to="{ name: 'admin-ecommerce-products' }">
          <IconsArrowWest /><span>Products</span>
        </NuxtLink>
      </div>
      <h3 class="header">Edit Product</h3>
    </header>
    <!-- {{ product }} -->
    <main class="main flex1 max-width-130 wfull">
      <!-- <div class="columns"> -->
      <div class="left-sidebar shadow-md">
        <EcommerceAdminProductsProductLeftSidebar />
      </div>

      <div class="flex-col gap2">
        <EcommerceAdminProductsProductInfo />
        <EcommerceAdminProductsProductPrice />
        <EcommerceAdminImageGallery
          :gallery="product.gallery"
          :galleryIntro="galleryIntro"
          galleryType="product"
          @galleryModified="updateStoreGallery"
          @newMediaSelectBtnClicked="handleNewMediaSelectBtnClicked"
        />

        <EcommerceAdminProductsAttributesContent
          v-if="product._id && product.productType === 'variable'"
          @showAttributesSlideout="showAttributesSlideout = $event"
        />
        <EcommerceAdminProductsAttributesSlideout
          v-if="showAttributesSlideout"
          @closeSlideout="showAttributesSlideout = false"
          @saveAttributes="saveProduct"
        />

        <!-- <section
          class="variants"
          id="variants"
          v-if="product._id && product.productType === 'variable' && product.attributes.length"
        > -->
        <EcommerceAdminProductsVariantsContent
          @showVariantsSlideout="showVariantsSlideout = $event"
          v-if="product._id && product.productType === 'variable' && product.attributes.length"
        />
        <EcommerceAdminProductsVariantsSlideout
          v-if="showVariantsSlideout"
          @closeSlideout="showVariantsSlideout = false"
          @saveVariants="saveProduct"
        />
        <!-- </section> -->
        <!-- <EcommerceAdminProductShippingOptions /> -->
        <!-- <EcommerceAdminProductDigitalDelivery /> -->
        <!-- <EcommerceAdminProductExtraFields /> -->
        <!-- <EcommerceAdminProductSeo /> -->
        <!-- <EcommerceAdminProductMisc /> -->
        <EcommerceAdminProductsProductDetails />
      </div>
      <div class="right-sidebar">
        <EcommerceAdminProductsProductRightSidebar
          @productStatusUpdated="product.status = $event"
          @saveProduct="saveProduct"
        />
      </div>
      <!-- </div> -->

      <div class="product-details">
        <!-- <Html>
			<Head><Title>Product</Title></Head>
		</Html> -->

        <!-- <pre style="font-size: 1rem">{{ store.product }}</pre> -->

        <!-- <div class="media-selector" v-if="showMediaSelector">
			<LazyMediaUploader
				@mediaSelected="setProductMedia"
				@mediaSelectCancel="showMediaSelector = false"
				v-if="showMediaSelector"
			/>
		</div> -->
        <div class="go-to-top">
          <a href="#product-go-back" class="btn">Go To Top</a>
        </div>
      </div>
    </main>
    <footer class="wfull max-width-130">Footer</footer>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.main {
  // .columns {
  display: grid;
  grid-template-columns: 18rem 1fr 25rem;
  gap: 2rem;
  align-items: flex-start;

  .left-sidebar {
    position: sticky;
    top: 10rem;
    background-color: white;
    border: 1px solid $slate-100;
    border-radius: 3px;
    padding: 2rem 0.5rem;
  }

  // .main {
  //   display: flex;
  //   flex-direction: column;
  //   gap: 3rem;
  // }

  .right-sidebar {
    position: sticky;
    top: 10rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  // }
  // max-width: 1280px;
  // min-height: 100vh;
  // padding: 2rem;
  // display: flex;
  // flex-direction: column;
  // gap: 2rem;

  // .link {
  //   display: flex;
  //   align-items: center;
  //   gap: 0.3rem;

  //   svg {
  //     width: 1.8rem;
  //     height: 1.8rem;
  //   }
  // }

  // .columns {
  //   display: grid;
  //   grid-template-columns: 18rem 1fr 25rem;
  //   gap: 2rem;
  //   align-items: flex-start;

  //   .left {
  //     position: sticky;
  //     top: 10rem;
  //     background-color: white;
  //     border: 1px solid $slate-100;
  //     border-radius: 3px;
  //     padding: 2rem 0.5rem;
  //   }

  //   .center {
  //     display: flex;
  //     flex-direction: column;
  //     gap: 3rem;
  //   }

  //   .right {
  //     position: sticky;
  //     top: 10rem;
  //     display: flex;
  //     flex-direction: column;
  //     gap: 2rem;
  //   }
  // }

  // .link {
  //   font-weight: 500;
  //   color: $slate-400;

  //   &:hover {
  //     color: $slate-800;
  //   }
  // }

  // .go-to-top {
  //   text-align: right;
  //   // border: 1px solid red;
  //   position: sticky;
  //   bottom: 5rem;

  //   a {
  //     display: inline-block;
  //   }
  // }
}
</style>
