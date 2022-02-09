<script setup>
const props = defineProps({
  radius: {
    type: Number,
    default: 16,
  },
  strokeWidth: {
    type: Number,
    default: 3,
  },
  progress: {
    type: Number,
    default: 0,
  },
});

const normalizedRadius = computed(() => props.radius - props.strokeWidth * 2);
const circumference = computed(() => normalizedRadius.value * 2 * Math.PI);
const strokeDashOffset = computed(() => circumference.value - (props.progress / 100) * circumference.value);
</script>

<template>
  <div>
    <svg :width="radius * 2" :height="radius * 2">
      <circle
        stroke="#CCC"
        :stroke-width="strokeWidth"
        fill="transparent"
        :cx="radius"
        :cy="radius"
        :r="normalizedRadius"
      />
      <circle
        class="progress-ring"
        stroke="#3881ff"
        :stroke-width="strokeWidth"
        fill="transparent"
        :cx="radius"
        :cy="radius"
        :r="normalizedRadius"
        :stroke-dasharray="`${circumference} ${circumference}`"
        :stroke-dashoffset="strokeDashOffset"
      />
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.progress-ring {
  transition: sytoke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}
</style>
