<script setup>
useMeta({
  title: 'Categories | YRL',
})
definePageMeta({
  layout: 'admin',
})

const router = useRouter()
const { errorMsg, message, alert, mediaReference, fetchAll, deleteById } = useFactory()

const categories = ref([])
const categoryToDeleteId = ref(null)
const count = ref(null) // item count taking into account params
const totalCount = ref(null) // Total item count in the database
const keyword = ref(null)
const page = ref(1)
const perPage = ref(8)
const sortField = ref('createdAt')
const sortOrder = ref('-')
let response = null

const pages = computed(() =>
  count.value % perPage.value ? parseInt(count.value / perPage.value) + 1 : parseInt(count.value / perPage.value)
)

const params = computed(() => {
  return {
    page: page.value,
    limit: perPage.value,
    sort: `${sortOrder.value}${sortField.value}`,
    keyword: keyword.value,
    indexPage: true,
  }
})

// Fetch all
response = await fetchAll('categories', params.value)

categories.value = response.docs
count.value = response.count
totalCount.value = response.totalCount

// response = await fetchAll('categories', { parent: { $exists: true, $ne: null } })
console.log('OOOOOO', response)

const levels = [categories.value.filter((c) => !c.parent)]
let other = [categories.value.filter((c) => c.parent)]
console.log(levels)
console.log(other)
let i = 1

while (other.length) {
  levels[i] = other.filter((c) => !c.parent)
  other = other.filter((c) => c.parent)
  i++
}
console.log('PPPP', levels)
console.log('PPPP', other)

const setPage = async (currentPage) => {
  page.value = currentPage
  await fetchAll()
}

const handleSearch = async (searchKeyword) => {
  keyword.value = searchKeyword
  page.value = 1
  await fetchAll(params.value)
}

const deleteCategory = async (doc) => {
  const category = categories.value.find((c) => c._id == categoryToDeleteId.value)
  if (!category)
    return (errorMsg.value = `We are not able to find a category with this ID: ${categoryToDeleteId.value} `)

  response = await deleteById('categories', category._id)
  categoryToDeleteId.value = null
  alert.value.show = false
  alert.value.action = ''
  message.value = `Category ${category.name} deleted succesfully`
  response = await fetchAll('categories', params.value)
  categories.value = response.docs
}

const showDeleteCategoryAlert = (categoryId) => {
  categoryToDeleteId.value = categoryId
  showAlert('Are you sure you want to delete this category?', '', 'deleteCategory', true)
}

const showAlert = (heading, paragraph, action, showCancelBtn) => {
  alert.value.heading = heading
  alert.value.paragraph = paragraph
  alert.value.action = action
  alert.value.showCancelBtn = showCancelBtn
  alert.value.show = true
}

watch(
  () => alert.value.show,
  (currentVal) => {
    if (currentVal === 'ok' && alert.value.action === 'deleteCategory') deleteCategory()
  }
  // { deep: true }
)
</script>

<template>
  <div class="hfull flex-col items-center gap2 p3">
    <header class="flex-row items-center justify-between wfull max-width-130">
      <h3 class="title">Categories</h3>
      <NuxtLink class="link" :to="{ name: 'admin-ecommerce-categories-slug', params: { slug: ' ' } }">
        <button class="btn btn__primary btn__pill px2 py05 text-xs"><IconsPlus class="w2 h2" /><span>Add</span></button>
      </NuxtLink>
    </header>
    <main class="flex1 max-width-130 wfull flex-col gap3">
      <div class="flex-col gap3 flex-col br5">
        <div class="border-b-slate-300 p2" v-if="totalCount">
          <Search @searchKeywordSelected="handleSearch" />
        </div>
        <EcommerceAdminCategoriesList
          :categories="categories"
          :totalCount="totalCount"
          @deleteCategory="showDeleteCategoryAlert"
        />
      </div>
    </main>
    <footer class="wfull max-width-130">
      <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1" />
    </footer>
  </div>
</template>

<style lang="scss" scoped></style>
