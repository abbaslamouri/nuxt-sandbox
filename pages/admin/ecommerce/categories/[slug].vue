<script setup>
import slugify from 'slugify'
import { useMessage } from '~/store/useMessage'

useMeta({
  title: 'Category | YRL',
})
definePageMeta({
  layout: 'admin',
})

const route = useRoute()
const router = useRouter()
const appMessage = useMessage()
const categories = ref([])
const category = ref({})
const showMediaSelector = ref(false) // media selector toggler
const galleryIntro = ref('This image gallery contains all images associated with this category.')

// Set query params
const params = computed(() => {
  return {
    fields: 'name, slug, permalink, decsription, parent, gallery',
  }
})

const fetchAll = async () => {
  appMessage.errorMsg = null
  try {
    const response = await $fetch('/api/v1/categories', { params: params.value })
    categories.value = response.docs
    console.log(response)
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

// Fetch all
await fetchAll()

// Set category
if (route.params.slug !== ' ') {
  category.value = categories.value.find((c) => c.slug == route.params.slug)
} else {
  category.value = {
    name: '',
    gallery: [],
  }
}

const currentCategory = JSON.stringify(category.value)

// Set category gallery
const selectMedia = async (event) => {
  console.log(event)
  showMediaSelector.value = false
  for (const prop in event) {
    const index = category.value.gallery.findIndex((el) => el._id === event[prop]._id)
    if (index === -1) {
      category.value.gallery.push(event[prop])
    }
  }
}

// Save category
const saveCategory = async () => {
  appMessage.errorMsg = null
  appMessage.successMsg = null
  console.log(category.value._id)
  try {
    if (currentCategory !== JSON.stringify(category.value)) {
      if (category.value._id) {
        await $fetch('/api/v1/categories', {
          method: 'PATCH',
          params: { id: category.value._id },
          body: category.value,
        })
      } else {
        await $fetch('/api/v1/categories', { method: 'POST', body: category.value })
      }
      appMessage.successMsg = `Category ${category.value.name} saved succesfully`
      router.push({ name: 'admin-ecommerce-categories' })
    }
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

//Upfate category details
const updateDetails = (event) => {
  category.value.name = event.name
  category.value.slug = slugify(category.value.name, { lower: true })
  category.value.description = event.description
  if (!event.permalink) {
    category.value.permalink = slugify(category.value.name, { lower: true })
  } else {
    category.value.permalink = slugify(event.permalink, { lower: true })
  }
}
</script>

<template>
  <div class="category">
    <NuxtLink class="link" :to="{ name: 'admin-ecommerce-categories' }">
      <IconsArrowWest /><span>Category</span>
    </NuxtLink>
    <!-- <pre>{{ category }}</pre> -->
    <h3 class="header">Edit Category</h3>
    <div class="columns">
      <div class="left">
        <EcommerceAdminCategoryDetails :category="category" @detailsEmitted="updateDetails" />
        <EcommerceAdminCategoryGallery
          :gallery="category.gallery"
          :galleryIntro="galleryIntro"
          @mediaSelectorClicked="showMediaSelector = true"
        />
      </div>
      <div class="right">
        <EcommerceAdminCategoryRightNav
          :categories="categories"
          :category="category"
          @parentCategorySelected="category.parent = $event"
          @saveCategory="saveCategory"
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
