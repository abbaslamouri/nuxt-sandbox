<script setup>
defineProps({
  count: {
    type: Number,
  },
  active: {
    type: Boolean,
  },
})
</script>

<template>
  <div class="carousel-indicators">
    <button
      class="carousel-indicator-item"
      :class="{ active: active === index }"
      v-for="(item, index) in count"
      :key="`indicator-${item}`"
      @click="$emit('switch', index)"
    ></button>
  </div>
</template>

<style lang="scss" scoped>
.carousel-indicators {
  position: absolute;
  bottom: 1.5em;
  z-index: 2;
  transform: translateX(-50%);
  left: 50%;
}
.carousel-indicator-item {
  border: none;
  padding: 0;
  width: 15px;
  height: 15px;
  background: #fff;
  border-radius: 50%;
  opacity: 0.5;
  margin: 0.2em;
  cursor: pointer;
}

.active {
  opacity: 1;
}
</style>
