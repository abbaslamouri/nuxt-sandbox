<script setup>
useMeta({
  title: 'Products | YRL',
})
definePageMeta({
  layout: 'admin',
})

const { fetchAll, deleteById } = useFactory()
const { errorMsg, message, alert } = useAppState()

const products = ref([])
const productToDeleteId = ref(null)
const count = ref(null) // item count taking into account params
const totalCount = ref(null) // Total item count in the database
const keyword = ref(null)
const page = ref(1)
const perPage = ref(60)
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

response = await fetchAll('products', params.value)
products.value = response.docs
count.value = response.count
totalCount.value = response.totalCount

const setPage = async (currentPage) => {
  page.value = currentPage
  await fetchAll()
}

const handleSearch = async (searchKeyword) => {
  keyword.value = searchKeyword
  page.value = 1
  await fetchAll(params.value)
}

// // Search
// const handleSearch = async (event) => {
//   keyword.value = event
//   page.value = 1
//   await fetchAll()
// }

const deleteProduct = async () => {
  const product = products.value.find((p) => p._id == productToDeleteId.value)
  if (!product) return (errorMsg.value = `We are not able to find a product with this ID: ${productToDeleteId.value} `)
  console.log(product)
  response = await deleteById('products', product._id)
  if (!response) return
  response = await fetchAll('products', params.value)
  products.value = response.docs
  count.value = response.count
  totalCount.value = response.totalCount
  message.value = `Product ${product.name} deleted succesfully`
  productToDeleteId.value = null
  alert.value.show = false
  alert.value.action = ''
}

const showDeleteProductAlert = (productId) => {
  productToDeleteId.value = productId
  showAlert('Are you sure you want to delete this product?', '', 'deleteProduct', true)
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
    if (currentVal === 'ok' && alert.value.action === 'deleteProduct') deleteProduct()
  }
  // { deep: true }
)

// provide('products', products.value)
// provide('totalCount', totalCount.value)
</script>

<template>
  <div class="h-full flex-col items-center gap2 p-3">
    <header class="flex-row items-center justify-between w-full max-w-130">
      <h3>Products</h3>
      {{}}
      <NuxtLink class="link" :to="{ name: 'admin-ecommerce-products-slug', params: { slug: ' ' } }">
        <button class="btn btn__primary btn__pill px-2 py-05 text-xs">
          <IconsPlus class="w-2 h-2" />
          <span>Add</span>
        </button>
      </NuxtLink>
    </header>
    <main class="flex-1 max-width-130 w-full flex-col gap3">
      <div class="flex-col gap2 br5">
        <div class="border-b-slate-300 p-2" v-if="totalCount">
          <Search @searchKeywordSelected="handleSearch" />
        </div>
        <EcommerceAdminProductsList
          :products="products"
          :totalCount="totalCount"
          @deleteProduct="showDeleteProductAlert"
        />
      </div>
    </main>
    <footer class="w-full max-width-130">
      <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1" />
    </footer>
  </div>
</template>

<style lang="scss" scoped></style>
