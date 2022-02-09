<script setup></script>

<script>
	export default {}
</script>

<template>
	<section class="hero-banner">
		<div class="hero-banner__image"><img src="assets/vday-1440.webp" alt="LOVE AT First Sip" /></div>

		<div class="hero-banner__container">
			<div class="heading">Love at first sip</div>
			<div class="sub-heading">Make their Valentine Day special with te gift of coffee</div>
			<NuxtLink class="link" :to="{ name: 'admin-ecommerce-products-slug', params: { slug: ' ' } }">
				<button class="btn">
					<span>Shop Now</span>
				</button>
			</NuxtLink>
		</div>
	</section>

	<section class="promo-bar">
		<div class="wrapper">
			<div class="promo-1"></div>
			<div class="promo-2"></div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
	@import '@/assets/scss/variables';

	.hero-banner {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		// height: 40rem;
		// overflow:hidden;

		&__image {
			grid-row: 1 / 2;
			grid-column: 1 / 2;

			img {
				width: 100%;
				height: 100%;
				object-fit: fit;
			}
		}
		&__container {
			grid-row: 1 / 2;
			grid-column: 1 / 2;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 1rem;

			.heading {
				text-transform: uppercase;
				font-weight: 800;
				font-size: 5rem;
				letter-spacing: 1rem;
			}

			.sub-heading {
				font-size: 2rem;
				letter-spacing: 0.5rem;
			}

			.link {
				margin-top: 2rem;

				.btn {
					border-radius: 5px;
					padding: 1rem 3rem;
					background-color: white;
					font-size: 1.4rem;
					letter-spacing: 0.2rem;
					font-weight: 100;
				}
			}
		}
	}
</style>
