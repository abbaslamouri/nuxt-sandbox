<script setup>
useMeta({
  title: 'Categories | YRL',
})
definePageMeta({
  layout: 'admin',
})

const { state, fetchAll, deleteById } = useFactory('categories')
provide('state', state)
provide('deleteById', deleteById)

const keyword = ref(null)
const page = ref(1)
const perPage = ref(6)
const sortField = ref('createdAt')
const sortOrder = ref('-')

const pages = computed(() =>
  state.value.count % perPage.value
    ? parseInt(state.value.count / perPage.value) + 1
    : parseInt(state.value.count / perPage.value)
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

// Fetch all
await fetchAll(params.value)

// Set current page
const setPage = async (currentPage) => {
  page.value = currentPage
  await fetchAll(params.value)
}

const handleSearch = async (searchKeyword) => {
  keyword.value = searchKeyword
  page.value = 1
  await fetchAll(params.value)
}

const deleteDoc = async (doc) => {
  const categoryName = doc.name
  await deleteById(doc._id)
  if (!state.value.errorMsg) {
    await fetchAll(params.value)
    state.value.message = `Category ${categoryName} deleted succesfully`
  }
}
</script>

<template>
  <div class="flex1 flex-col items-center gap2 p2">
    <header class="flex-row items-center justify-between wfull max-width-130">
      <h3 class="title">Categories</h3>
      <NuxtLink class="link" :to="{ name: 'admin-ecommerce-categories-slug', params: { slug: ' ' } }">
        <button class="btn btn__primary btn__pill px2 py05 text-xs"><IconsPlus class="w2 h2" /><span>Add</span></button>
      </NuxtLink>
    </header>
    <main class="flex1 wfull max-width-130 flex-col gap3">
      <div class="content shadow-md bg-slate-200 flex-col br5">
        <div class="border-b-slate-300 p2" v-if="state.totalCount">
          <Search @searchKeywordSelected="handleSearch" />
        </div>
        <EcommerceAdminCategoriesList @deleteDocEmitted="deleteDoc" />
      </div>
    </main>
    <footer class="wfull max-width-130">
      <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1" />
    </footer>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
</style>
