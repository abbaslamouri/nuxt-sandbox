<script setup>
	const showModal = ref(false)
</script>

<script>
	export default {}
</script>

<template>
	<section class="product-pathway">
		<article class="card">
			<div class="image">
				<img src="assets/hp-shop-coffee-jan2.jpeg" alt="Shop Coffee" />
			</div>
			<NuxtLink class="link" :to="{ name: 'admin-ecommerce-products-slug', params: { slug: ' ' } }">
				<button class="btn btn-primary">
					<IconsPlus />
					<span>Shop Coffee</span>
				</button>
			</NuxtLink>
		</article>
		<article class="card">
			<div class="image">
				<img src="assets/hp-shop-machines-jan3.jpeg" alt="Shop Coffee" />
			</div>
			<NuxtLink class="link" :to="{ name: 'admin-ecommerce-products-slug', params: { slug: ' ' } }">
				<button class="btn btn-primary">
					<IconsPlus />
					<span>Shop Machines</span>
				</button>
			</NuxtLink>
		</article>
	</section>
</template>

<style lang="scss" scoped>
	@import '@/assets/scss/variables';

	.product-pathway {
		display: flex;

		.card {
			flex: 1;
			display: grid;
			grid-template-columns: 1fr;
			grid-template-rows: 1fr;

			.image {
				grid-row: 1 / 2;
				grid-column: 1 / 2;

				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}

			.link {
				grid-row: 1 / 2;
				grid-column: 1 / 2;
				display: flex;
				align-items: flex-end;
				justify-content: center;
				padding: 5rem 0;

				.btn {
					opacity: 0.7;
					font-size: 2rem;
					letter-spacing: 0.2rem;
					border-radius: 5px;
					padding: 1rem 2rem;
				}
			}
		}
	}
</style>
