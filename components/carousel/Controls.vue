<script>
defineEmits(['prev', 'next'])
</script>

<template>
  <div class="carousel-controls-wrapper">
    <button @click="$emit('prev')" class="carousel-controls left">Prev</button>
    <button @click="$emit('next')" class="carousel-controls right">Next</button>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.carousel-controls-wrapper {
  .carousel-controls {
    border: none;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    height: 50px;
    width: 70px;
    top: 50%;
    transform: translateY(-50%);
    color: $slate-50;
    cursor: pointer;
    transition: 0.5s;
  }
  .carousel-controls:hover {
    background: rgba(0, 0, 0, 0.8);
  }
  .left {
    left: 0;
  }
  .right {
    right: 0;
  }
}
</style>
