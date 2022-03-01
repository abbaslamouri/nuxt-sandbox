<script setup>
	const props = defineProps({
		intensity: {
			type: Number,
		},
		total: {
			type: Number,
			required: true,
		},
	})

	const currentIntensity = computed(() => props.intensity)
</script>

<template>
	<div class="intensity-squares">
		<div class="square" :class="{ full: currentIntensity >= 1 }"></div>
		<div class="square" :class="{ full: currentIntensity >= 2 }"></div>
		<div class="square" :class="{ full: currentIntensity >= 3 }"></div>
		<div class="square" :class="{ full: currentIntensity >= 4 }"></div>
		<div class="square" :class="{ full: currentIntensity >= 5 }"></div>
		<div class="square" :class="{ full: currentIntensity >= 6 }"></div>
		<div class="square" :class="{ full: currentIntensity >= 7 }"></div>
		<div class="square" :class="{ full: currentIntensity >= 8 }"></div>
		<div class="square" :class="{ full: currentIntensity >= 9 }"></div>
		<div class="square" :class="{ full: currentIntensity >= 10 }"></div>
		<div class="square" :class="{ full: currentIntensity >= 11 }"></div>
		<div class="square" :class="{ full: currentIntensity >= 12 }"></div>
		<div class="square" :class="{ full: currentIntensity >= 13 }"></div>
		<div class="total">{{ intensity }}</div>
	</div>
</template>

<style lang="scss" scoped>
	@import '@/assets/scss/variables';

	.intensity-squares {
		display: flex;
		gap: 0.25rem;
		align-items: center;
		justify-content: center;

		.square {
			width: 0.75rem;
			height: 0.75rem;
			border: 1px solid $slate-800;

			&.full {
				background-color: $slate-800;
			}
		}
		.total {
			font-size: 1.5rem;
			margin-left: 0.5rem;
		}
	}
</style>
