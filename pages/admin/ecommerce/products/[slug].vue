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

const { store, fetchAll, fetchBySlug, saveDoc } = useStore()
provide('store', store)
// provide('fetchAll', fetchAll)

// const { store, save, fetchSingle, fetchCategories, saveVariants, deleteVariants } = useProduct()

const route = useRoute()
const router = useRouter()
// const store = useStore()
const appMessage = useMessage()
const product = ref({})
const variants = ref([])
const showAttributesSlideout = ref(false)
const showMediaSelector = ref(false) // media selector toggler
const galleryIntro = ref('This image gallery contains all images associated with this product including its variants.')
const slug = route.params.slug === ' ' ? null : route.params.slug

await fetchBySlug(route.params.slug)
store.value.doc.productType = 'variable'

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
const selectMedia = async (event) => {
  // console.log('mediap', event)
  // // showMediaSelector.value = false
  // for (const prop in event) {
  //   const index = store.product.gallery.findIndex((el) => el._id === event[prop]._id)
  //   if (index === -1) {
  //     store.product.gallery.push(event[prop])
  //   }
  // }
}

const saveProduct = async () => {
  // store.product.slug = slugify(store.product.name, { lower: true })
  // if (!store.product.permalink) store.product.permalink = slugify(store.product.name, { lower: true })
  // response = await save(store.product)
  // if (store.errorMsg) return (appMessage.errorMsg = store.errorMsg)
  // store.product._id = response._id
  // await deleteVariants(store.product._id)
  // if (store.errorMsg) return (appMessage = store.errorMsg)
  // if (!store.variants.length) {
  //   router.push({ name: 'admin-ecommerce-products-slug', params: { slug: store.product.slug } })
  //   return (appMessage.successMsg = 'product saved succesfully')
  // }
  // console.log('SV', store.variants)
  // await saveVariants(store.variants)
  // if (store.errorMsg) return (appMessage = store.errorMsg)
  // appMessage.successMsg = 'product and variants saved succesfully'
  // router.push({ name: 'admin-ecommerce-products-slug', params: { slug: store.product.slug } })
}

const handleNewMediaSelectBtnClicked = () => {
  // store.referenceMedia = 'productMedia'
  // store.showMediaSelector = true
}

const updateStoreGallery = (gallery) => {
  console.log(gallery)
  store.value.docs.gallery = gallery
}

watch(
  () => store.selectedMedia,
  (currentVal) => {
    console.log(currentVal)
    if (store.referenceMedia === 'productMedia') selectMedia(currentVal)
    // store.showMediaSelector = false
    // store.selectedMedia = []
  },
  { deep: true }
)

provide('saveProduct', saveProduct)
</script>

<template>
  <div class="hfull flex-col items-center gap2 p3 border-red">
    <header class="flex-col gap2 wfull max-width-130">
      <div class="go-back" id="product-go-back">
        <NuxtLink class="admin-link" :to="{ name: 'admin-ecommerce-products' }">
          <IconsArrowWest /><span>Products</span>
        </NuxtLink>
      </div>
      <h3 class="header">Edit Product</h3>
    </header>
    <!-- {{ store.doc }} -->
    <main class="main flex1 max-width-130 wfull border-pink">
      <!-- <div class="columns"> -->
      <div class="left-sidebar shadow-md">
        <EcommerceAdminProductsProductLeftSidebar :product="product" />
      </div>

      <div class="main border-orange">
        <EcommerceAdminProductsProductInfo />
        <EcommerceAdminProductsProductPrice />
        <EcommerceAdminImageGallery
          :gallery="store.doc.gallery"
          :galleryIntro="galleryIntro"
          galleryType="product"
          @galleryModified="updateStoreGallery"
          @newMediaSelectBtnClicked="handleNewMediaSelectBtnClicked"
        />

        <EcommerceAdminProductsProductAttributesContent v-if="store.doc._id && store.doc.productType === 'variable'" />
        <EcommerceAdminProductsProductAttributesSlideout v-if="store.showAttributesSlideout" />
        <!-- <EcommerceAdminProductsProductAttributesSlideout
          v-if="store.showAttributesSlideout"
          :productAttributes="store.doc.attributes"
          :productId="store.doc._id"
          :showAttributesSlideout="showAttributesSlideout"
          @slideoutEventEmitted="showAttributesSlideout = $event"
        /> -->
        <!-- </section> -->
        <section
          class="variants"
          id="variants"
          v-if="store.doc._id && store.doc.type === 'variable' && store.doc.attributes.length"
        >
          <!-- <EcommerceAdminProductVariantsContent
						:productVariants="variants"
						@slideoutEventEmitted="store.showVariantsSlideout = $event"
					/> -->
          <!-- <EcommerceAdminProductVariantsSlideout
						v-if="store.showVariantsSlideout"
						@slideoutEventEmitted="store.showVariantsSlideout = $event"
						@saveProduct="saveProduct"
					/> -->
        </section>
        <!-- <EcommerceAdminProductShippingOptions /> -->
        <!-- <EcommerceAdminProductDigitalDelivery /> -->
        <!-- <EcommerceAdminProductExtraFields /> -->
        <!-- <EcommerceAdminProductSeo /> -->
        <!-- <EcommerceAdminProductMisc /> -->
        <EcommerceAdminProductsProductDetails />
      </div>
      <div class="right-sidebar border-green">
        Right
        <!-- <EcommerceAdminProductRightSidebar @productStatusUpdated="product.status = $event" @saveProduct="saveProduct" /> -->
      </div>
      <!-- </div> -->

      <div class="product-details">
        <!-- <Html>
			<Head><Title>Product</Title></Head>
		</Html> -->

        <!-- <pre style="font-size: 1rem">{{ store.product }}</pre> -->

        <!-- <div class="media-selector" v-if="showMediaSelector">
			<LazyMediaUploader
				@mediaSelected="selectMedia"
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

  .main {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

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
