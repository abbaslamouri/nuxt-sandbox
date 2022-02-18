<script setup>
import { useMessage } from '~/store/useMessage'

useMeta({
  title: 'Categories | YRL',
})
definePageMeta({
  layout: 'admin',
})

const appMessage = useMessage()
const categories = ref([])
const count = ref(null) // item count taking into account params
const totalCount = ref(null) // Total item count in the database
const keyword = ref(null)
const page = ref(1)
const perPage = ref(6)
const sortField = ref('createdAt')
const sortOrder = ref('-')

const pages = computed(() =>
  count.value % perPage.value ? parseInt(count.value / perPage.value) + 1 : parseInt(count.value / perPage.value)
)

// Set query params
const params = computed(() => {
  return {
    fields: 'name, slug, permalink, decsription, parent, gallery',
    page: page.value,
    limit: perPage.value,
    sort: `${sortOrder.value}${sortField.value}`,
    keyword: keyword.value,
  }
})

const fetchAll = async () => {
  appMessage.errorMsg = null
  try {
    const response = await $fetch('/api/v1/categories', { params: params.value })
    categories.value = response.docs
    count.value = response.count
    totalCount.value = response.totalCount
    console.log(response)
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

// Fetch all
await fetchAll()

// Delete category
const handleDelete = async (event) => {
  appMessage.errorMsg = null
  appMessage.successMsg = null
  try {
    await $fetch(`/api/v1/categories`, {
      method: 'DELETE',
      body: { id: event },
    })
    const index = categories.value.findIndex((c) => c._id == event)
    if (index !== -1) {
      const categoryName = `Category ${categories.value[index].name} deleted succesfully`
      categories.value.splice(index, 1)
      appMessage.successMsg = categoryName
    }
  } catch (err) {
    appMessage.errorMsg = err.data
  }
}

// Search
const handleSearch = async (event) => {
  keyword.value = event
  page.value = 1
  await fetchAll()
}

// Set current page
const setPage = async (currentPage) => {
  page.value = currentPage
  await fetchAll()
}
</script>

<template>
  <div class="categories">
    <div v-if="totalCount" class="main">
      <header>
        <h3 class="title">Categories</h3>
        <NuxtLink class="link" :to="{ name: 'admin-ecommerce-categories-slug', params: { slug: ' ' } }">
          <button class="btn btn-primary">
            <IconsPlus />
            <span>Add</span>
          </button>
        </NuxtLink>
      </header>
      <div class="content shadow-md">
        <Search @searchKeywordSelected="handleSearch" />
        <div class="admin-category-list">
          <div class="table">
            <div class="table__header">
              <div class="row">
                <div class="th">Name</div>
                <div class="th">Slug</div>
                <div class="th">Parent</div>
                <div class="th">actions</div>
              </div>
            </div>
            <div class="table__body">
              <EcommerceAdminCategoryCard
                v-for="category in categories"
                v-if="categories.length"
                :category="category"
                :key="category._id"
                @deleteCategory="handleDelete"
              />
              <h2 v-else>There no items that match your criteria</h2>
            </div>
          </div>
        </div>
        <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1" />
      </div>
    </div>
    <div v-else class="no-categories shadow-md">
      <div class="inner">
        <h3 class="">Add categories and subcategories</h3>
        <div class="">Create nested product categories with category images and descriptions</div>
        <NuxtLink class="link" :to="{ name: 'admin-ecommerce-categories-slug', params: { slug: ' ' } }">
          <button class="btn btn-primary">
            <IconsPlus />
            <span>Add</span>
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.categories {
  min-height: 100%;
  height: 100%;
  width: 100%;
  padding: 3rem 2rem;

  .main {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: 3rem;
      padding: 2rem;
    }
  }

  .no-categories {
    height: 92vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .inner {
      gap: 1rem;
      border: 1px solid $slate-200;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      transform: translateY(-50%);

      background-color: White;
      padding: 4rem;
      border-radius: 5px;

      .link {
        align-self: flex-end;
      }
    }
  }

  .btn {
    svg {
      fill: $slate-50;
      width: 1.8rem;
      height: 1.8rem;
    }
  }
}
</style>
