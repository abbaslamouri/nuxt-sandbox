<script setup>
	// import { useMessage } from '~/store/useMessage'

	useMeta({
		title: 'Products | YRL',
	})
	definePageMeta({
		layout: 'admin',
	})

	// const { store, fetchAll, deleteSingle } = useProduct()

	// const { store, fetchAll, deleteById } = useStore()
	// provide('store', store)
	// provide('deleteById', deleteById)

	const { errorMsg, galleryMedia, mediaReference, showMediaSelector, fetchBySlug, fetchAll, saveDoc } = useFactory()

	// const appMessage = useMessage()
	const products = ref([])
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
			page: page.value,
			limit: perPage.value,
			sort: `${sortOrder.value}${sortField.value}`,
			keyword: keyword.value,
			indexPage: true,
		}
	})

	const response = await fetchAll('products', params.value)
	products.value = response.docs
	count.value = response.count
	totalCount.value = response.totalCount
	provide('products', products.value)
	provide('totalCount', totalCount.value)
	console.log(response)

	// Set current page
	const setPage = async (currentPage) => {
		page.value = currentPage
		await fetchAll()
	}

	// Fetch all
	// const fetchAll = async () => {
	//   const response = await fetchAll(params.value)
	//   if (store.errorMsg) {
	//     appMessage.errorMsg = store.errorMsg
	//   } else {
	//     products.value = response.docs
	//     count.value = response.count
	//     totalCount.value = response.totalCount
	//   }
	// }

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

	// // Delete product
	// const deleteProduct = async (id) => {
	//   await deleteSingle(id)
	//   if (store.errorMsg) {
	//     appMessage.errorMsg = store.errorMsg
	//   } else {
	//     appMessage.successMsg = 'Product deleted succesfully'
	//     await fetchAll()
	//   }
	// }

	// await fetchAll()

	const deleteDoc = async (doc) => {
		const docName = doc.name
		await deleteById(doc._id)
		if (!errorMsg.value) {
			await fetchAll(params.value)
			message.value = `Category ${docName} deleted succesfully`
			// ******Need to delete variants
		}
	}
</script>

<!-- <template> -->
<template>
	<div class="hfull flex-col items-center gap2 p3">
		<header class="flex-row items-center justify-between wfull max-width-130">
			<h3 class="title">Products</h3>
			{{}}
			<NuxtLink class="link" :to="{ name: 'admin-ecommerce-products-slug', params: { slug: ' ' } }">
				<button class="btn btn__primary btn__pill px2 py05 text-xs">
					<IconsPlus class="w2 h2" />
					<span>Add</span>
				</button>
			</NuxtLink>
		</header>
		<main class="flex1 max-width-130 wfull flex-col gap3">
			<div class="content shadow-md bg-slate-200 flex-col br5">
				<div class="border-b-slate-300 p2" v-if="totalCount">
					<Search @searchKeywordSelected="handleSearch" />
				</div>
				<EcommerceAdminProductsList :products="products" @deleteDocEmitted="deleteDoc" />
			</div>
		</main>
		<footer class="wfull max-width-130">
			<Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1" />
		</footer>
	</div>
</template>

<!-- <div class="admin-products"> -->
<!-- <header> -->
<!-- <h3 class="title">Products</h3> -->
<!-- <NuxtLink class="link" :to="{ name: 'admin-ecommerce-products-slug', params: { slug: ' ' } }">
        <button class="btn btn-primary">
          <IconsPlus />
          <span>Add</span>
        </button>
      </NuxtLink> -->
<!-- </header> -->
<!-- <div class="main" v-if="products.length">
      <div class="content">
        <Search @searchKeywordSelected="handleSearch" /> -->
<!-- <div class="admin-product-list">
          <div class="table">
            <div class="table__header">
              <div class="row">
                <div class="th">Product</div>
                <div class="th">Stock Qty.</div>
                <div class="th">Orders</div>
                <div class="th">Sales</div>
                <div class="th">actions</div>
              </div>
            </div>
            <div class="table__body">
              <EcommerceAdminProductCard
                v-for="product in products"
                :key="product._id"
                :product="product"
                @itemToDeleteEmitted="deleteProduct"
              />
            </div>
          </div>
        </div> -->
<!-- </div> -->
<!-- <footer> -->
<!-- <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1" /> -->
<!-- </footer> -->
<!-- </div> -->
<!-- <div class="admin-no-products" v-else>
      <div class="inner">
        <h3 class="">Add your first physical or digital product</h3>
        <div class="">Add your roduct and variants. Products must have at least a name and a price</div>
        <NuxtLink class="link" :to="{ name: 'admin-ecommerce-products-slug', params: { slug: ' ' } }">
          <button class="btn btn-primary">
            <IconsPlus />
            <span>Add</span>
          </button>
        </NuxtLink>
      </div>
    </div> -->
<!-- </div> -->
<!-- </template> -->

<style lang="scss" scoped>
	@import '@/assets/scss/variables';

	.admin-products {
		min-height: 92vh;
		height: 100%;
		width: 100%;
		padding: 3rem 2rem;
		border: 1px solid red;
		display: flex;
		flex-direction: column;
		gap: 3rem;

		header {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.main {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			gap: 3rem;

			.content {
				display: flex;
				flex-direction: column;
				gap: 3rem;
			}
		}

		.admin-no-products {
			display: flex;
			justify-content: center;
			align-items: center;
			border: 1px solid teal;
			min-height: 50vh;

			.inner {
				gap: 1rem;
				border: 1px solid $slate-200;
				display: flex;
				flex-direction: column;
				gap: 2rem;
				background-color: White;
				padding: 4rem;
				border-radius: 5px;

				.link {
					align-self: flex-end;
				}
			}
		}
	}
</style>
