<script setup>
	useMeta({
		title: 'Categories | YRL',
	})
	definePageMeta({
		layout: 'admin',
	})

	defineEmits(['deleteDocEmitted'])

	const state = inject('state')
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
		<div class="admin-category-list" v-if="state.totalCount">
			<div class="table categories">
				<div class="table__header text-sm py2 px3">
					<div class="row">
						<div class="th">Name</div>
						<div class="th">Slug</div>
						<div class="th">Parent</div>
						<div class="th">actions</div>
					</div>
				</div>
				<div class="table__body bg-slate-50 px2">
					<EcommerceAdminCategoriesCategoryCard
						v-for="(doc, index) in state.docs"
						v-if="state.docs.length"
						:doc="doc"
						:index="index"
						:showActionsKeys="showActionsKeys[index]"
						:key="doc._id"
						@actionBtnClicked="handleActionBtnClicked"
						@deleteDocEmitted="$emit('deleteDocEmitted', $event)"
					/>
					<h2 v-else>There no items that match your criteria</h2>
				</div>
			</div>
		</div>
		<div v-else class="h60vh flex-row items-center justify-center shadow-md">
			<div class="empty-categories flex-col gap2 bg-slate-50 p4 br5">
				<h3 class="">Add categories and subcategories</h3>
				<div class="">Create nested product categories with category images and descriptions</div>
				<NuxtLink
					class="btn btn__primary btn__pill px3 py05 text-xs items-self-end"
					:to="{ name: 'admin-ecommerce-categories-slug', params: { slug: ' ' } }"
				>
					<IconsPlus class="w2 h2" />
					<span>Add</span>
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
