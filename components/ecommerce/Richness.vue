<script setup>
const props = defineProps({
  richness: {
    type: Number,
  },
  total: {
    type: Number,
    required: true,
  },
})

const currentRichness = computed(() => props.richness)
</script>

<template>
  <div class="richness-squares">
    <div class="square" :class="{ full: currentRichness >= 1 }"></div>
    <div class="square" :class="{ full: currentRichness >= 2 }"></div>
    <div class="square" :class="{ full: currentRichness >= 3 }"></div>
    <div class="square" :class="{ full: currentRichness >= 4 }"></div>
    <div class="square" :class="{ full: currentRichness >= 5 }"></div>
    <div class="square" :class="{ full: currentRichness >= 6 }"></div>
    <div class="square" :class="{ full: currentRichness >= 7 }"></div>
    <div class="square" :class="{ full: currentRichness >= 8 }"></div>
    <div class="square" :class="{ full: currentRichness >= 9 }"></div>
    <div class="square" :class="{ full: currentRichness >= 10 }"></div>
    <div class="square" :class="{ full: currentRichness >= 11 }"></div>
    <div class="square" :class="{ full: currentRichness >= 12 }"></div>
    <div class="square" :class="{ full: currentRichness >= 13 }"></div>
    <div class="total">{{ richness }}</div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.richness-squares {
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
    margin-left: .5rem;;
  }
}
</style>
