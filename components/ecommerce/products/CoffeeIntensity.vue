<script setup>
const props = defineProps({
  intensity: {
    type: [Number, String],
  },
  total: {
    type: Number,
  },
})

const currentIntensity = computed(() => props.intensity)
</script>

<template>
  <div class="intensity-squares">
    <div v-for="n in total" :key="`square-${n}`" class="square" :class="{ full: currentIntensity >= n }"></div>
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
