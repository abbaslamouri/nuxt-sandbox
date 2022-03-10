<script setup>
useMeta({
  title: 'Categories | YRL',
})
definePageMeta({
  layout: 'admin',
})

const { state, fetchAll, deleteById } = useFactory('categories')
provide('state', state.value)
provide('deleteById', deleteById)

const keyword = ref(null)
const page = ref(1)
const perPage = ref(6)
const sortField = ref('createdAt')
const sortOrder = ref('-')

const pages = computed(() =>
  state.value.count.value % perPage.value
    ? parseInt(state.value.count.value / perPage.value) + 1
    : parseInt(state.value.count.value / perPage.value)
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
// await fetchAll(params.value)

// Delete document
// const deleteDoc = async (docId) => {
//   await deleteById(docId)
//   if (state.errorMsg) return
//   const index = state.value.docs.findIndex((c) => c._id == docId)
//   if (index !== -1) {
//     state.value.docs.splice(index, 1)
//     state.value.message = `Category ${state.value.docs[index].name} deleted succesfully`
//   }
// }

// Search
const handleSearch = async (event) => {
  keyword.value = event
  page.value = 1
  // await fetchAll(params.value)
}

// Set current page
const setPage = async (currentPage) => {
  page.value = currentPage
  await fetchAll(params.value)
}
</script>

<template>
  <div class="p3 flex-col gap3">
    <header class="flex-row items-center justify-between">
      <h3 class="title">Categories</h3>
      <NuxtLink class="link" :to="{ name: 'admin-ecommerce-categories-slug', params: { slug: ' ' } }">
        <button class="btn btn__primary btn__pill px2 py05 text-xs"><IconsPlus class="w2 h2" /><span>Add</span></button>
      </NuxtLink>
    </header>
    <div class="content shadow-md bg-slate-200 flex-col br5">
      <div class="border-b-slate-300 p2" v-if="state.totalCount">
        <Search @searchKeywordSelected="handleSearch" />
      </div>
      <EcommerceAdminCategoriesList />
      <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';


</style>
