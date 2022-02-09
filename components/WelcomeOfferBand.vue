<script setup>
	const showModal = ref(false)
</script>

<script>
	export default {}
</script>

<template>
	<section class="welcome-offer">
		<div class="band">
			<div class="image">
				<img src="/assets/N-Welcome-Kit-ICE-VL-150x75-AW.webp" alt="YRL || Welcome Offer Image" />
			</div>
			<div class="content">
				<p>
					Enjoy the <span class="emphasis">Signature Welcome Gift.</span> Our gift to new customers ordering 10+ coffee
					sleeves. Original Code <span class="emphasis">ourgifttoyou.</span> *<button @click="showModal = true">
						Details
					</button>
				</p>
			</div>
		</div>
		<div class="details" v-show="showModal">
			<Modal @closeModal="showModal = false">
				<template #header>
					<h3 class="modal-header">YRL Signature welcome gift</h3>
				</template>
				<template #default>
					<div class="modal-content">
						<p>Our gift to new customers ordering 10+ sleeves (100 capsules). Enter relevant code at checkout.</p>
						<p>
							Vertuo includes a set of Vertuo Coffee Mugs, a sleeve of our latest coffee, a set of two coasters and a
							recycling bag. CODE: <span class="emphasis">COFFEEGIFT</span>
						</p>
						<p>
							Original includes a set of View Espresso cups and saucers, a sleeve of our latest coffee, a set of two
							coasters and a recycling bag. CODE: <span class="emphasis">ESPRESSOGIFT</span>
						</p>
						<div class="image">
							<img src="assets/N-Welcome-Kit-ICE-VL-200x167-AW.webp" alt="Nespree0 Welcome Offer" />
						</div>
					</div>
				</template>

				<template #footer>
					<div class="modal-footer">
						Offer available on qualifying (single) order of 10+ sleeves & redeemable one time per customer and is
						available until customers 3rd coffee order. While supplies last.
					</div>
				</template>
			</Modal>
		</div>
	</section>
</template>

<style lang="scss" scoped>
	@import '@/assets/scss/variables';
	.welcome-offer {
		.band {
			background-color: $red-300;
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 2rem;
			font-size: 1.2rem;
			padding: 1rem 2rem;
			.image {
				width: 10rem;
				img {
					width: 100%;
					height: 100%;
					object-fit: contain;
				}
			}
			.content {
				text-align: center;
				gap: 0.5rem;
				max-width: 600px;
				line-height: 2rem;
				.emphasis {
					text-transform: uppercase;
					font-weight: 700;
					font-size: 1.3rem;
				}
				button {
					background-color: transparent;
					outline: none;
					border: none;
					text-decoration: underline;
					font-size: 1.4rem;
					cursor: pointer;
					&:hover {
						color: $slate-500;
					}
				}
			}
		}
		.details {
			font-size: 1.2rem;
			.modal-header {
				text-transform: uppercase;
			}
			.modal-content {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 2rem;
				p {
					text-align: center;
					line-height: 1.6rem;
					&:first-child {
						width: 70%;
					}
				}
				.emphasis {
					text-transform: uppercase;
					font-weight: 700;
					font-size: 1.4rem;
				}
				.image {
					width: 20rem;
					height: 20rem;
					img {
						width: 100%;
						height: 100%;
						object-fit: contain;
					}
				}
			}
			.modal-footer {
				text-align: center;
				line-height: 1.6rem;
			}
		}
	}
</style>
