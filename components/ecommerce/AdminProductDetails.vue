<script setup>
	import { useStore } from '~/store/useStore'
	import BaseSelect from '../forms/BaseSelect.vue'
	import BaseTextarea from '../forms/BaseTextarea.vue'
	const store = useStore()
</script>

<template>
	<section class="details shadow-md" id="details">
		<header class="admin-section-header">Details</header>
		<div class="content">
			<FormsBaseInput label="Name" placeholder="Name" required v-model="store.product.name" />
			<FormsBaseSelect
				nullOption="Select Product Type"
				label="Product Type"
				:options="[
					{ key: 'simple', name: 'Simple' },
					{ key: 'variable', name: 'Variable' },
				]"
				v-model="store.product.type"
			/>
			<div class="sku-inventory">
				<div class="sku">
					<FormsBaseInput label="SKU" placeholder="SKU" v-model="store.product.sku" />
				</div>
				<div class="inventory">
					<div class="available">
						<h4 class="title">Available Stock:</h4>
						<span>{{ store.product.stockQty || 0 }}</span>
					</div>
					<FormsBaseToggle v-model="store.product.manageInventory" label="Manage Inventory" />
				</div>
			</div>
			<FormsBaseTextarea v-model="store.product.excerpt" label="Excerpt" placeholder="Excerpt" rows="3" />
			<FormsBaseTextarea v-model="store.product.description" label="Description" placeholder="Description" rows="5" />
			<div class="intensity-roastiness">
				<FormsBaseInput type="number" label="Intensity" placeholder="Intensity" v-model="store.product.intensity" />
				<FormsBaseInput label="Roastiness" placeholder="Roastiness" v-model="store.product.roastiness" />
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
	.details {
		background-color: white;
		border-radius: 5px;
		padding: 2rem 2rem 4rem;

		.content {
			display: flex;
			flex-direction: column;
			gap: 3rem;

			.sku-inventory {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 2rem;

				.sku {
					flex: 1;
				}

				.inventory {
					display: flex;
					flex-direction: column;
					gap: 0.5rem;
					font-size: 1.3rem;

					.available {
						display: flex;
						align-items: center;
						gap: 1rem;

						.title {
							font-weight: 600;
						}
					}
				}
			}

			.intensity-roastiness {
				display: flex;
				align-items: center;
				gap: 2rem;

				.intensity,
				.roastiness {
					flex: 1;
				}
			}
		}
	}
</style>
