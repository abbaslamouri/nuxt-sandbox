<script setup>
	const props = defineProps({
		pages: {
			type: Number,
			required: true,
		},
		page: {
			type: Number,
			required: true,
		},
	})

	const emit = defineEmits(['pageSet'])

	const currentPage = ref(props.page)

	const setCurrentPage = async (p, action) => {
		switch (action) {
			case 'next':
				if (currentPage.value < props.pages) currentPage.value = currentPage.value + 1
				break
			case 'prev':
				if (currentPage.value > 1) currentPage.value = currentPage.value - 1
				break
			default:
				currentPage.value = p
				break
		}
		emit('pageSet', currentPage.value)
	}

	// watch(currentPage, (current) => {
	//   emit('pageSet', currentPage.value)
	// })
</script>

<template>
	<nav class="pagination">
		<span class="page" @click="setCurrentPage(0, 'prev')" :class="{ disabled: currentPage === 1 }">
			<IconsChevronLeft />
		</span>
		<span
			v-if="pages"
			class="page"
			v-for="p in pages"
			:key="p"
			@click="setCurrentPage(p, 'current')"
			:class="{ active: currentPage === p }"
		>
			{{ p }}
		</span>
		<span class="page" @click="setCurrentPage(0, 'next')" :class="{ disabled: currentPage === pages }">
			<IconsChevronRight />
		</span>
	</nav>
</template>

<style lang="scss" scoped>
	.pagination {
		display: flex;
		justify-content: center;
		gap: 0.5rem;

		.page {
			display: flex;
			align-items: center;
			justify-content: center;
			border: 1px solid #b0bec5;
			width: 3rem;
			height: 3rem;
			border-radius: 2px;
			background-color: #eceff1;
			cursor: pointer;

			&.disabled {
				cursor: not-allowed;
				svg {
					fill: #ccc;
				}
			}

			&.active {
				background-color: #546e7a;
				color: #fff;
			}
		}
	}
</style>
