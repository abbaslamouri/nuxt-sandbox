<script setup>
import slugify from 'slugify'

useMeta({
  title: 'Category | YRL',
})
definePageMeta({
  layout: 'admin',
})

const { category } = useStore()
const {
  errorMsg,
  message,
  galleryMedia,
  mediaReference,
  showMediaSelector,
  fetchBySlug,
  fetchAll,
  saveDoc,
  saveDocs,
  deleteMany,
} = useFactory()

const route = useRoute()
const router = useRouter()

const categories = ref([])
// const category = ref({})
const galleryIntro = ref('This image gallery contains all images associated with this category.')

const slug = route.params.slug === ' ' ? null : route.params.slug

category.value = await fetchBySlug('categories', slug)
console.log(category.value)
categories.value = (await fetchAll('categories', {})).docs
console.log(categories.value)

const saveCategory = async () => {
  if (!category.value.name) return (state.value.errorMsg = 'Category name is required')
  category.value.slug = slugify(category.value.name, { lower: true })
  if (!category.value.permalink) category.value.permalink = slugify(category.value.name, { lower: true })
  await saveDoc(category.value)
  router.push({ name: 'admin-ecommerce-categories' })
}

const handleNewMediaSelectBtnClicked = () => {
  category.value.referenceMedia = 'categoryMedia'
  category.value.showMediaSelector = true
}

const selectMediaGallery = async (media) => {
  if (!category.value.gallery) category.value.gallery = []
  for (const prop in media) {
    const index = category.value.gallery.findIndex((el) => el._id === media[prop]._id)
    if (index === -1) {
      category.value.gallery.push(media[prop])
    }
  }
}

watch(
  () => category.value.selectedMedia,
  (currentVal) => {
    console.log(currentVal)
    if (state.value.referenceMedia === 'categoryMedia') selectMediaGallery(currentVal)
  },
  { deep: true }
)
</script>

<template>
  <div class="hfull flex-col items-center gap2 p3">
    <header class="flex-col gap2 wfull max-width-130">
      <div class="go-back" id="product-go-back">
        <NuxtLink class="admin-link" :to="{ name: 'admin-ecommerce-categories' }">
          <IconsArrowWest /><span>Categories</span>
        </NuxtLink>
      </div>
      <h3 class="header">Edit Category</h3>
    </header>
    <!-- {{ product }} -->
    <main class="main flex1 max-width-130 wfull">
      <div class="center-col flex-col gap2">
        <EcommerceAdminCategoriesDetails />
        <section class="admin-image-gallery shadow-md p2 flex-col gap2 bg-white" id="image-gallery">
          <div class="flex-row items-center justify-between text-sm mb1">
            <div class="uppercase inline-block border-b-stone-300 font-bold pb05">Image Gallery</div>
            <div></div>
          </div>
          <div class="flex-col flex-col items-center gap2">
            <div class="intro flex-row items-center gap1 bg-slate-200 py1 px2 br3 text-sm" v-if="galleryIntro">
              <IconsInfo class="w3 h3 fill-sky-600" />
              <p>{{ galleryIntro }}</p>
            </div>
            <EcommerceAdminImageGallery
              :gallery="category.gallery"
              :galleryIntro="galleryIntro"
              galleryType="product"
              @removeGalleryImage="category.gallery.splice($event, 1)"
              @setGalleryImage="category.gallery[$event.index] = $event.value"
            />
            <div class="image-select-actions">
              <button class="btn btn__image-select" @click.prevent="handleNewMediaSelectBtnClicked">
                <IconsImage />
                <span> Select New Images </span>
              </button>
            </div>
            <p class="text-sm">PNG, JPG, and GIF Accepted</p>
          </div>
        </section>
      </div>
      <div class="right-col">
        <EcommerceAdminCategoriesCategoryRightNav :categories="categories" @saveCategory="saveCategory" />
        <div class="go-to-top">
          <a href="#product-go-back" class="btn">Go To Top</a>
        </div>
      </div>
      <!-- </div> -->
    </main>
    <footer class="wfull max-width-130">Footer</footer>
  </div>
  <!-- <div class="flex1 flex-col items-center p3">
    <div class="categories flex1 flex-col gap2">
      <NuxtLink class="link" id="top" :to="{ name: 'admin-ecommerce-categories' }">
        <IconsArrowWest /><span>Category</span>
      </NuxtLink>
      <h3 class="items-self-start">Edit Category</h3>
      <div class="columns wfull">
        <div class="main">
          <EcommerceAdminCategoriesDetails />
          <div class="flex-col flex-col items-center gap2">
            <div class="intro flex-row items-center gap1 bg-slate-200 py1 px2 br3 text-sm" v-if="galleryIntro">
              <IconsInfo class="w3 h3 fill-sky-600" />
              <p>{{ galleryIntro }}</p>
            </div>
            <EcommerceAdminImageGallery
              :gallery="category.gallery"
              :galleryIntro="galleryIntro"
              galleryType="product"
              @removeGalleryImage="category.gallery.splice($event, 1)"
              @setGalleryImage="category.gallery[$event.index] = $event.value"
            />
            <div class="image-select-actions">
              <button class="btn btn__image-select" @click.prevent="handleNewMediaSelectBtnClicked">
                <IconsImage />
                <span> Select New Images </span>
              </button>
            </div>
            <p class="text-sm">PNG, JPG, and GIF Accepted</p>
          </div>
        </div>
        <div class="aside"></div>
      </div>
      <div class="go-to-top">
        <a href="#top" class="btn btn__secondary">Go To Top</a>
      </div>
    </div>
  </div> -->
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

main {
  display: grid;
  grid-template-columns: 1fr 30rem;
  gap: 2rem;
  align-items: flex-start;

  .center-col {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .right-col {
    position: sticky;
    top: 10rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
}
</style>
