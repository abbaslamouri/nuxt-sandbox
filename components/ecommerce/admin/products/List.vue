<script setup>
	defineEmits(['deleteDocEmitted'])

	const products = inject('products')
	const totalCount = inject('totalCount')
	const showActionsKeys = ref([])

	const handleActionBtnClicked = (i) => {
		console.log(i)
		for (const prop in showActionsKeys.value) {
			showActionsKeys.value[prop] = false
		}
		showActionsKeys.value[i] = !showActionsKeys.value[i]
	}
</script>

<template>
	<div class="shadow-md">
		<div v-if="totalCount">
			<div class="table admin-products">
				<div class="table__header text-sm py2 px3">
					<div class="row">
						<div class="th">Product</div>
						<div class="th">Stock Qty.</div>
						<div class="th">Orders</div>
						<div class="th">Sales</div>
						<div class="th">actions</div>
					</div>
				</div>
				<div class="table__body bg-slate-50 px2">
					<EcommerceAdminProductsProductCard
						v-for="(product, index) in products"
						v-if="products.length"
						:product="product"
						:index="index"
						:showActionsKeys="showActionsKeys[index]"
						:key="product._id"
						@actionBtnClicked="handleActionBtnClicked"
						@deleteDocEmitted="$emit('deleteDocEmitted', $event)"
					/>
					<h2 v-else>There no items that match your criteria</h2>
				</div>
			</div>
		</div>
		<div v-else class="h60vh flex-row items-center justify-center shadow-md">
			<div class="empty-categories flex-col gap2 bg-slate-50 p4 br5">
				<h3 class="">Add your first physical or digital product</h3>
				<div class="">Add your product and variants. Products must have at least a name and a price</div>
				<NuxtLink
					class="btn btn__primary btn__pill px3 py05 text-xs items-self-end"
					:to="{ name: 'admin-ecommerce-products-slug', params: { slug: ' ' } }"
				>
					<IconsPlus class="w2 h2" />
					<span>Add</span>
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
