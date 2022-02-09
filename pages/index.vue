<script setup>
	const perfectNesChoices = ref(['', '', ''])
	const showCoffeeOptions = ref(false)
	const showRoastOptopns = ref(false)
	const showPerfectForOptopns = ref(false)
</script>

<template>
	<div class="home">
		<WelcomeOfferBand />
		<HeroBanner />
		<PromoBar />
		<ProductPathway />
		<GuidedSelling />

		<div style="height: 300px; background-color: black">
			<!-- <img src="assets/venezia-title.svg" alt="" /> -->
		</div>

		<div><span class="glyphicon glyphicon-envelope"></span>opopopopopopop</div>
	</div>
</template>

<style lang="scss" scoped>
	@import '@/assets/scss/variables';
	.home {
		min-height: 100vh;
		.guided-selling {
			display: grid;
			grid-template-columns: 1fr;
			grid-template-rows: 1fr;
			max-height: 800px;
			overflow: hidden;
			.image {
				grid-row: 1 / 2;
				grid-column: 1 / 2;
				height: 100%;
				img {
					width: 100%;
					height: 100%;
					object-fit: contain;
				}
			}
			.wrapper {
				grid-row: 1 / 2;
				grid-column: 1 / 2;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100%;
				max-height: 800px;
				.content {
					max-width: 996px;
					// width: 80%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					gap: 3rem;
					.heading {
						font-weight: 400;
						letter-spacing: 0.5rem;
						font-size: 3rem;
					}
					.sub-heading {
						max-width: 80rem;
						text-align: center;
						line-height: 2rem;
						letter-spacing: 0.2rem;
						margin-bottom: 4rem;
					}
					.queries {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						gap: 6rem;
						width: 100%;
						.query-1,
						.query-2,
						.query-3 {
							position: relative;
							display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: center;
							width: 50%;
							// gap: 2rem;
							.heading {
								text-transform: uppercase;
								// margin-bottom: 1rem;
								font-size: 2.5rem;
							}
							.choice {
								// border: 1px solid red;
								width: 150%;
								display: flex;
								align-items: center;
								justify-content: space-between;
								gap: 2rem;
								.left {
									flex: 1;
									display: flex;
									align-items: center;
									justify-content: space-between;
									gap: 2rem;
									border-bottom: 1px solid $slate-400;
								}
								.right {
									.chevron {
										cursor: pointer;
									}
								}
								.check {
									width: 2.5rem;
									height: 2.5rem;
									background-color: #8d6609;
									fill: white;
									border-radius: 50%;
									padding: 0.5rem;
								}
							}
							.options {
								top: 100%;
								left: -25%;
								position: absolute;
								background-color: white;
								width: 150%;
								padding: 1rem;
								z-index: 1;
								li {
									cursor: pointer;
								}
							}
						}
					}
					.link {
						margin-top: 3rem;
						.btn {
							background-color: $slate-600;
							border-radius: 5px;
							padding: 1rem 2rem;
							letter-spacing: 0.1rem;
							font-size: 1.3rem;
							font-weight: 200;
						}
					}
				}
			}
		}
	}
</style>
