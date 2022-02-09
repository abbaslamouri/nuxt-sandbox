<script setup>
	const perfectNesChoices = ref(['', '', ''])
	const showCoffeeOptions = ref(false)
	const showRoastOptopns = ref(false)
	const showPerfectForOptopns = ref(false)
</script>

<script>
	export default {}
</script>

<template>
	<section class="guided-selling">
		<div class="image">
			<img src="assets/coffee-discovery-3x.jpeg" alt="Find Your Perfect Nespresso" />
		</div>
		<div class="wrapper">
			<div class="content">
				<h2 class="heading">FIND YOUR PERFECT NESPRESSO</h2>
				<p class="sub-heading">
					While you can enjoy a Nespresso however you'd like, select your tasting preferences for curated
					recommendations.
				</p>
				<div class="queries">
					<article class="query-1">
						<div class="heading">I'm looking for</div>
						<div class="choice">
							<div class="left">
								<span>
									{{ perfectNesChoices[0] || 'Coffee' }}
								</span>
								<div class="right">
									<IconsChevronUp
										class="chevron"
										@click="showCoffeeOptions = !showCoffeeOptions"
										v-if="showCoffeeOptions"
									/>
									<IconsChevronDown class="chevron" @click="showCoffeeOptions = !showCoffeeOptions" v-else />
								</div>
							</div>
							<IconsSuccess class="check" v-if="perfectNesChoices[0]" />
						</div>
						<ul class="options" v-if="showCoffeeOptions">
							<li
								@click="
									(event) => {
										perfectNesChoices[0] = event.target.innerHTML
										showCoffeeOptions = false
									}
								"
							>
								Coffee
							</li>
							<li
								@click="
									(event) => {
										perfectNesChoices[0] = event.target.innerHTML
										showCoffeeOptions = false
									}
								"
							>
								Espresso
							</li>
						</ul>
					</article>
					<article class="query-2">
						<div class="heading">That's</div>
						<div class="choice">
							<div class="left">
								<span>
									{{ perfectNesChoices[1] || 'Dark Roast ' }}
								</span>
								<div class="right">
									<IconsChevronUp
										class="chevron"
										@click="showRoastOptopns = !showRoastOptopns"
										v-if="showRoastOptopns"
									/>
									<IconsChevronDown class="chevron" @click="showRoastOptopns = !showRoastOptopns" v-else />
								</div>
							</div>
							<IconsSuccess class="check" v-if="perfectNesChoices[1]" />
						</div>
						<ul class="options" v-if="showRoastOptopns">
							<li
								@click="
									(event) => {
										perfectNesChoices[1] = event.target.innerHTML
										showRoastOptopns = false
									}
								"
							>
								Light Roast
							</li>
							<li
								@click="
									(event) => {
										perfectNesChoices[1] = event.target.innerHTML
										showRoastOptopns = false
									}
								"
							>
								Medium Roast
							</li>
							<li
								@click="
									(event) => {
										perfectNesChoices[1] = event.target.innerHTML
										showRoastOptopns = false
									}
								"
							>
								Dark Roast
							</li>
							<li
								@click="
									(event) => {
										perfectNesChoices[1] = event.target.innerHTML
										showRoastOptopns = false
									}
								"
							>
								Flavored
							</li>
							<li
								@click="
									(event) => {
										perfectNesChoices[1] = event.target.innerHTML
										showRoastOptopns = false
									}
								"
							>
								Iced
							</li>
						</ul>
					</article>
					<article class="query-3">
						<div class="heading">And perfect for</div>
						<div class="choice">
							<div class="left">
								<span>
									{{ perfectNesChoices[2] || 'Anytime' }}
								</span>
								<div class="right">
									<IconsChevronUp
										class="chevron"
										@click="showPerfectForOptopns = !showPerfectForOptopns"
										v-if="showPerfectForOptopns"
									/>
									<IconsChevronDown class="chevron" @click="showPerfectForOptopns = !showPerfectForOptopns" v-else />
								</div>
							</div>
							<IconsSuccess class="check" v-if="perfectNesChoices[2]" />
						</div>
						<ul class="options" v-if="showPerfectForOptopns">
							<li
								@click="
									(event) => {
										perfectNesChoices[2] = event.target.innerHTML
										showPerfectForOptopns = false
									}
								"
							>
								Morning
							</li>
							<li
								@click="
									(event) => {
										perfectNesChoices[2] = event.target.innerHTML
										showPerfectForOptopns = false
									}
								"
							>
								Afternoon
							</li>
							<li
								@click="
									(event) => {
										perfectNesChoices[2] = event.target.innerHTML
										showPerfectForOptopns = false
									}
								"
							>
								Evening
							</li>
							<li
								@click="
									(event) => {
										perfectNesChoices[2] = event.target.innerHTML
										showPerfectForOptopns = false
									}
								"
							>
								Anytime
							</li>
						</ul>
					</article>
				</div>
				<NuxtLink class="link" :to="{ name: 'admin-ecommerce-products-slug', params: { slug: ' ' } }">
					<button class="btn btn-primary">
						<span>Explore recommnedadtions</span>
					</button>
				</NuxtLink>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
	@import '@/assets/scss/variables';

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
</style>
