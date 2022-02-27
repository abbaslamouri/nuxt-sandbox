<script setup>
const props = defineProps({
  slide: {
    type: String,
    required: true,
  },
  currentSlide: {
    type: Number,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  direction: {
    type: String,
    default: 'right',
  },
})

defineEmits(['mouseEnter', 'mouseLeave'])

const transitionName = computed(() => (props.direction === 'right' ? 'carousel-ltr' : 'carousel-rtl'))
</script>
<template>
  <div>
    <transition :name="transitionName">
      <div class="carousel-item" v-show="currentSlide === index">
        <img :src="slide" alt="" @mouseenter="$emit('mouseEnter')" @mouseleave="$emit('mouseLeave')" />
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.carousel-item {
  position: absolute;
  inset: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
