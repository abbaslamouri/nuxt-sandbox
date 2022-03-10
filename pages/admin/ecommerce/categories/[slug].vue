<script setup>
import slugify from 'slugify'

useMeta({
  title: 'Category | YRL',
})
definePageMeta({
  layout: 'admin',
})

const { state, fetchAll, fetchBySlug, saveDoc } = useFactory('categories')
provide('state', state)
provide('fetchAll', fetchAll)

const route = useRoute()
const router = useRouter()
const categories = ref([])
const category = ref({})
const galleryIntro = ref('This image gallery contains all images associated with this category.')

await fetchBySlug(route.params.slug)

const saveCategory = async () => {
  if (!state.value.doc.name) return (state.value.errorMsg = 'Category name is required')
  state.value.doc.slug = slugify(state.value.doc.name, { lower: true })
  if (!state.value.doc.permalink) state.value.doc.permalink = slugify(state.value.doc.name, { lower: true })
  await saveDoc(state.value.doc)
  router.push({ name: 'admin-ecommerce-categories' })
}

const handleNewMediaSelectBtnClicked = () => {
  state.value.referenceMedia = 'categoryMedia'
  state.value.showMediaSelector = true
}

const selectMediaGallery = async (media) => {
  if (!state.value.doc.gallery) state.value.doc.gallery = []
  for (const prop in media) {
    const index = state.value.doc.gallery.findIndex((el) => el._id === media[prop]._id)
    if (index === -1) {
      state.value.doc.gallery.push(media[prop])
    }
  }
}

watch(
  () => state.value.selectedMedia,
  (currentVal) => {
    console.log(currentVal)
    if (state.value.referenceMedia === 'categoryMedia') selectMediaGallery(currentVal)
  },
  { deep: true }
)
</script>

<template>
  <div class="category">
    <NuxtLink class="link" :to="{ name: 'admin-ecommerce-categories' }">
      <IconsArrowWest /><span>Category</span>
    </NuxtLink>
    <!-- <pre>{{ state.doc }}</pre> -->
    <h3 class="header">Edit Category</h3>
    <div class="columns">
      <div class="left">
        <EcommerceAdminCategoryDetails />
        <EcommerceAdminImageGallery
          :gallery="state.doc.gallery"
          :galleryIntro="galleryIntro"
          galleryType="product"
          @newMediaSelectBtnClicked="handleNewMediaSelectBtnClicked"
        />
      </div>
      <div class="right">
        <EcommerceAdminCategoryRightNav :categories="categories" :category="category" @saveCategory="saveCategory" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.category {
  width: 100%;
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
    grid-template-columns: 1fr 30rem;
    gap: 2rem;
    align-items: flex-start;

    .left {
      display: flex;
      flex-direction: column;
      gap: 3rem;
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
