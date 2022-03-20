<script setup>
// import { useStore } from '~/store/useStore'

const props = defineProps({
  gallery: {
    type: Array,
    default: [],
  },
  galleryIntro: {
    type: String,
  },
  galleryType: {
    type: String,
  },
})

const emit = defineEmits([
  'setGalleryImage',
  'removeGalleryImage',
  // 'mediaSelectorClicked',
  // 'galleryModified',
  // 'selectFromProductImages',
  // 'newMediaSelectBtnClicked',
])

// const state = inject('state')

// const store = useStore()
// const currentGallery = ref([])
const draggableElements = ref([])
const pickIndex = ref(null)
const hoveredImage = ref(null)

// for (const prop in props.gallery) {
//   currentGallery.value[prop] = props.gallery[prop]
// }

const mouseEnter = (event, index) => {
  event.target.classList.add('hovered')
  hoveredImage.value = props.gallery[index]
}

const mouseLeave = (event, index) => {
  event.target.classList.remove('hovered')
  hoveredImage.value = null
}

// const removeGalleryImage = (index) => {
// emit('removeGalleryImage', index)
// currentGallery.value.splice(index, 1)
// }

const handleDragstart = (event, index) => {
  pickIndex.value = index
  event.target.closest('.thumb').classList.remove('hovered')
}

const handleDragend = (event, index) => {
  for (const prop in draggableElements.value) {
    if (draggableElements.value[prop]) draggableElements.value[prop].closest('.thumb').classList.remove('hovered')
  }
}

const handleDragover = (event, index) => {
  event.target.closest('.thumb').classList.add('over')
}

const handleDragleave = (event) => {
  event.target.closest('.thumb').classList.remove('over')
}
const handleDrop = async (event, index) => {
  const pickedElement = props.gallery[pickIndex.value]
  const droppedElement = props.gallery[index]
  emit('setGalleryImage', { index: pickIndex.value, value: droppedElement })
  emit('setGalleryImage', { index: index, value: pickedElement })
  // currentGallery.value[pickIndex.value] = pickedElement
  // currentGallery.value[index] = pickedElement
  event.target.closest('.thumb').classList.remove('over')
}

const setFeaturedImage = (event) => {
  console.log(event.target, pickIndex.value)
  // state.selectedItem.featuredImage = currentGallery.value[pickIndex.value]
}

// watch(
//   () => currentGallery.value,
//   (currentVal) => {
//     console.log(currentVal)
//     emit('galleryModified', currentGallery.value)
//   },
//   { deep: true }
// )
</script>

<template>
  <section class="flex-col gap2">
    <div class="image-name br3 h4 flex-row items-center">
      <span class="px3 text-xs" v-if="hoveredImage">{{ hoveredImage.name }}</span>
    </div>
    <div class="gallery" v-if="gallery.length">
      <div
        class="thumb shadow-md border border-slate-200 p1 br5 cursor-pointer"
        :class="{ product: galleryType === 'product' || galleryType == 'variant' }"
        v-for="(image, index) in gallery"
        :key="image._id"
        @dragover="handleDragover($event, index)"
        @drop="handleDrop($event, index)"
        @dragleave="handleDragleave($event, index)"
        @dragover.prevent
        @mouseenter="mouseEnter($event, index)"
        @mouseleave="mouseLeave($event, index)"
      >
        <div
          class="thumb__draggable"
          :class="{ first: index == 0 }"
          :ref="(el) => (draggableElements[index] = el)"
          draggable="true"
          @dragstart="handleDragstart($event, index)"
          @dragend="handleDragend($event, index)"
        >
          <img class="w-full hfull contain" :src="image.path" :alt="`${image.name} Photo`" draggable="false" />
        </div>
        <span class="thumb__delete" @click.prevent="$emit('removeGalleryImage', index)"><IconsDeleteFill /></span>
        <div class="thumb__move"><IconsMove /></div>
        <div class="thumb__index">{{ index + 1 }}</div>
        <div class="thumb__imageTitle" v-if="index === 0">
          <span>Thumbnail</span>
        </div>
        <div class="thumb__imageTitle" v-if="index === 1">
          <span>Featured</span>
        </div>
        <div class="thumb__imageTitle" v-if="index === 2">
          <span>Body</span>
        </div>
        <div class="thumb__imageTitle" v-if="index === 3">
          <span>Attributes</span>
        </div>
        <div class="thumb__imageTitle" v-if="index === 4">
          <span>Recipe</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.gallery {
  display: grid;
  grid-template-columns: repeat(20, minmax(0, 1fr));
  gap: 2rem;
  padding: 2rem;
  border: 1px solid $slate-200;
  border-radius: 5px;

  .thumb {
    grid-column: span 3 / span 3;
    grid-row: span 3 / span 3;
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(3, 1fr);
    &.product {
      &:nth-of-type(1),
      &:nth-of-type(2),
      &:nth-of-type(3),
      &:nth-of-type(4),
      &:nth-of-type(5) {
        grid-column: span 4 / span 4;
        grid-row: span 4 / span 4;
      }
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    // border: 1px solid red;

    &__index {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
      transform: translate(-100%, -100%);
      background-color: $slate-600;
      width: 1.8rem;
      height: 1.8rem;
      color: $slate-50;
      border-radius: 50%;
      font-size: x-small;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__draggable {
      grid-column: 1 / 4;
      grid-row: 1 / 4;
    }

    &__delete {
      grid-column: 3 / 4;
      grid-row: 1 / 2;
      top: 1rem;
      right: 1rem;
      opacity: 0;
      visibility: hidden;
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;

      svg {
        fill: $slate-50;
      }
    }

    &__move {
      grid-column: 2 / 3;
      grid-row: 2 / 3;
      opacity: 0;
      visibility: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      svg {
        fill: $slate-50;
      }
    }

    &__imageTitle {
      grid-column: 1 / 4;
      grid-row: 1 / 2;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      transform: translateY(-30%);

      span {
        background-color: $slate-600;
        color: $slate-50;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        border-radius: 3px;
      }
    }

    // &__tooltip {
    //   grid-column: 1 / 4;
    //   grid-row: 1 / 2;
    //   opacity: 0;
    // }

    // &:first-child {
    // 	grid-column: span 2 / span 2;
    // 	grid-row: span 2 / span 2;
    // }

    // &__delete {
    //   // position: absolute;
    //   top: 1rem;
    //   right: 1rem;
    //   opacity: 0;
    //   visibility: hidden;

    //   svg {
    //     fill: $slate-50;
    //   }
    // }

    // &__move {
    //   // position: absolute;
    //   top: 50%;
    //   left: 50%;
    //   transform: translate(-50%, -50%);
    //   opacity: 0;
    //   visibility: hidden;

    //   svg {
    //     fill: $slate-50;
    //   }
    // }

    // &__index {
    //   // position: absolute;
    //   top: 2%;
    //   left: 2%;
    //   transform: translate(-50%, -50%);
    //   background-color: $slate-600;
    //   width: 1.5rem;
    //   height: 1.5rem;
    //   color: $slate-50;
    //   border-radius: 50%;
    //   font-size: x-small;
    //   display: flex;
    //   justify-content: center;
    //   align-items: center;
    // }

    // &__tooltip {
    //   position: absolute;
    //   top: -1.5rem;
    //   left: 50%;
    //   transform: translate(-50%, -100%);
    //   background-color: $slate-600;
    //   display: grid;
    //   grid-template-columns: minmax(max-content, 40rem);
    //   color: white;
    //   padding: 1rem 2rem;
    //   border-radius: 5px;
    //   font-weight: 500;
    //   opacity: 0;
    //   visibility: hidden;

    //   &::after {
    //     content: '';
    //     position: absolute;
    //     top: 100%;
    //     left: 50%;
    //     margin-left: -5px;
    //     border-width: 5px;
    //     border-style: solid;
    //     border-color: $slate-600 transparent transparent transparent;
    //   }
    // }

    &.hovered {
      background-color: $slate-500;

      img {
        opacity: 0.1;
      }

      .thumb__tooltip,
      .thumb__delete,
      .thumb__move {
        opacity: 1;
        visibility: visible;
      }

      .thumb__delete {
        z-index: 1;
      }
    }

    &.over {
      opacity: 0.3;
      border: 2px dashed $slate-600;
    }

    &.featured-image,
    &.body-bg-image,
    &.attributes-image,
    &.recipe-image,
    &.thumb-image {
      // border: 1px solid red;
      min-width: 10rem;
      min-height: 10rem;
    }
  }
}
// }

.image-select-actions {
  display: flex;
  gap: 3rem;
}
// }

// .featured-image {
//   min-height: 10rem;
//   min-width: 1orem;
//   border: 1px solid red;
// }
</style>
