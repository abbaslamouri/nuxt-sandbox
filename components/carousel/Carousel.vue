<script setup>
const props = defineProps({
  slides: {
    type: Array,
    required: true,
  },
  controls: {
    type: Boolean,
    default: false,
  },
  indicators: {
    type: Boolean,
    default: false,
  },
  interval: {
    type: [String, Number],
    default: 1,
  },
  height: {
    type: [String, Number],
    default: 10,
  },
})

const currentSlide = ref(0)
const slideInterval = ref(null)
const direction = ref(null)
const transitionName = computed(() => (direction.value === 'right' ? 'carousel-ltr' : 'carousel-rtl'))
const carouselHeight = computed(() => `${props.height * 1}rem`)

const setCurrentSlide = (index) => {
  currentSlide.value = index
}

const next = (step = 1) => {
  const index = currentSlide.value < props.slides.length - 1 ? currentSlide.value + step : 0
  setCurrentSlide(index)
  direction.value = 'right'

  // startCarouselInterval()
}

const prevSlide = (step) => {
  const index = currentSlide.value > 0 ? currentSlide.value + step : props.slides.length - 1
  setCurrentSlide(index)
  direction.value = 'left'
  startCarouselInterval()
}

const nextSlide = (step) => {
  next(step)
  startCarouselInterval()
}

const switchSlide = (index) => {
  const step = index - currentSlide.value
  if (step > 0) nextSlide(step)
  else prevSlide(step)
}

const startCarouselInterval = () => {
  stopCarouselInterval()
  slideInterval.value = setInterval(() => {
    next()
  }, props.interval * 1000)
}

const stopCarouselInterval = () => {
  clearInterval(slideInterval.value)
}

onMounted(() => {
  startCarouselInterval()
})

onUnmounted(() => {
  stopCarouselInterval()
})
</script>

<template>
  <div class="carousel">
    <div class="carousel__inner">
      <div v-for="(slide, index) in slides" :key="`slide-${index}`">
        <transition :name="transitionName">
          <div
            v-show="currentSlide === index"
            class="carousel__item"
            @mouseenter="stopCarouselInterval"
            @mouseleave="startCarouselInterval"
          >
            <img :src="slide" alt="" />
          </div>
        </transition>
      </div>
      <div class="carousel__controls" v-if="controls">
        <button @click="prevSlide(-1)" class="btn control left"><IconsChevronLeft /></button>
        <button @click="nextSlide(1)" class="btn control right"><IconsChevronRight /></button>
      </div>
      <div class="carousel__indicators" v-if="indicators">
        <button
          class="indicator"
          :class="{ active: currentSlide === index }"
          v-for="(item, index) in slides.length"
          :key="`indicator-${item}`"
          @click="switchSlide(index)"
        ></button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.carousel {
  display: flex;
  justify-content: center;
  height: v-bind(carouselHeight);
  background-color: $slate-100;
  padding: 1rem;

  &__inner {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  &__item {
    position: absolute;
    inset: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  &__controls {
    .control {
      border: none;
      // background-color: $slate-900;
      opacity: 0.6;
      position: absolute;
      // height: 50px;
      // width: 70px;
      top: 50%;
      transform: translateY(-50%);
      // color: white;
      transition: 0.3s;

      svg {
        width: 3rem;
        height: 3rem;
        cursor: pointer;

        &:hover {
          // background-color: $slate-900;
          fill: $slate-400;
        }
      }
    }

    .left {
      left: 0;
    }
    .right {
      right: 0;
    }
  }

  &__indicators {
    position: absolute;
    bottom: 1.5em;
    z-index: 2;
    transform: translateX(-50%);
    left: 50%;

    .indicator {
      border: none;
      padding: 0;
      width: 15px;
      height: 15px;
      background: #fff;
      border-radius: 50%;
      opacity: 0.5;
      margin: 0.2em;
      cursor: pointer;

      &.active {
        opacity: 1;
      }
    }
  }
}
</style>
