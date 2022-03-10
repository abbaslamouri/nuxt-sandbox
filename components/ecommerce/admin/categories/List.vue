<script setup>
useMeta({
  title: 'Categories | YRL',
})
definePageMeta({
  layout: 'admin',
})

// const { state, fetchAll, deleteById } = useFactory('categories')
const state = inject('state')
const deleteById = inject('deleteById')

// const keyword = ref(null)
// const page = ref(1)
// const perPage = ref(6)
// const sortField = ref('createdAt')
// const sortOrder = ref('-')

// const pages = computed(() =>
//   state.value.count.value % perPage.value
//     ? parseInt(state.value.count.value / perPage.value) + 1
//     : parseInt(state.value.count.value / perPage.value)
// )

// Set query params
// const params = computed(() => {
//   return {
//     fields: 'name, slug, permalink, decsription, parent, gallery',
//     page: page.value,
//     limit: perPage.value,
//     sort: `${sortOrder.value}${sortField.value}`,
//     keyword: keyword.value,
//   }
// })

// Fetch all
// await fetchAll(params.value)

// Delete document
const deleteDoc = async (docId) => {
  await deleteById(docId)
  if (state.errorMsg) return
  const index = state.value.docs.findIndex((c) => c._id == docId)
  if (index !== -1) {
    state.value.docs.splice(index, 1)
    state.value.message = `Category ${state.value.docs[index].name} deleted succesfully`
  }
}

// Search
// const handleSearch = async (event) => {
//   keyword.value = event
//   page.value = 1
//   await fetchAll(params.value)
// }

// Set current page
// const setPage = async (currentPage) => {
//   page.value = currentPage
//   await fetchAll(params.value)
// }

// const errorMsg = useErrorMsg()
</script>

<template>
  <div class="shadow-md">
    <div class="admin-category-list" v-if="state.totalCount">
      <div class="table categories">
        <div class="table__header p2">
          <div class="row">
            <div class="th">Name</div>
            <div class="th">Slug</div>
            <div class="th">Parent</div>
            <div class="th">actions</div>
          </div>
        </div>
        <div class="table__body bg-slate-50">
          <EcommerceAdminCategoriesCategoryCard
            v-for="category in state.docs"
            v-if="state.docs.length"
            :category="category"
            :key="category._id"
            @deleteCategory="deleteDoc"
          />
          <h2 v-else>There no items that match your criteria</h2>
        </div>
      </div>
    </div>
    <div v-else class="empty-categories shadow-md">
      <div class="inner">
        <h3 class="">Add categories and subcategories</h3>
        <div class="">Create nested product categories with category images and descriptions</div>
        <NuxtLink
          class="btn btn__primary btn__pill px3 py05 text-xs"
          :to="{ name: 'admin-ecommerce-categories-slug', params: { slug: ' ' } }"
        >
          <IconsPlus class="w2 h2" />
          <span>Add</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.empty-categories {
  height: 60vh;
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
    background-color: $slate-50;
    padding: 4rem;
    border-radius: 5px;

    .btn {
      align-self: flex-end;
    }
  }
}
</style>
