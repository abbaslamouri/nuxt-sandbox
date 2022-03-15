<script setup>
// import { useStore } from '~/store/useStore'

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
  // showProductGallery: {
  //   type: Boolean,
  // },
})

const emit = defineEmits(['productGalleryEventEmitted'])

const { product, variants } = useStore()

// const store = useStore()
const galleryThumbRef = ref([])
const selectedImages = ref([])

const setSelectedImages = (image, j) => {
  galleryThumbRef.value[j].classList.toggle('selected')
  const i = selectedImages.value.findIndex((img) => img._id == image._id)
  if (i === -1) selectedImages.value.push(image)
  else selectedImages.value.splice(i, 1)
}

const SetVariantGallery = () => {
  variants.value[props.index].gallery = [...variants.value[props.index].gallery, ...selectedImages.value]
  selectedImages.value = []
  emit('productGalleryEventEmitted', false)
}
const cancelSelectedImages = () => {
  selectedImages.value = []
  emit('productGalleryEventEmitted', false)
}
</script>

<template>
  <div class="variant-select-existing" >
    <div class="overlay"></div>
    <div class="wrapper">
      <div class="content shadow-md">
        <h3>Select from product images</h3>
        <div class="thumbs" v-if="product.gallery">
          <div
            v-for="(image, j) in product.gallery.filter(
              (img) => !variants[index].gallery.find((item) => item._id == img._id)
            )"
            :key="image._id"
            class="thumb shadow-md relative"
            :class="{
              selected: variants[index].gallery.find((img) => img._id == image._id),
            }"
            :ref="(el) => (galleryThumbRef[j] = el)"
            @click="setSelectedImages(image, j)"
          >
            <div>
              <!-- <div v-if="!variants[index].gallery.find((img) => img._id == image._id)"> -->
              <img :src="image.path" :alt="`${image.name} Photo`" />
              <span v-if="selectedImages.find((img) => img._id == image._id)" class="check"><IconsSuccess /></span>
            </div>
          </div>
        </div>
        <div class="actions">
          <button class="btn btn-secondary" @click.prevent="cancelSelectedImages">
            <span> Cancel</span>
          </button>
          <button class="btn btn-primary" @click.prevent="SetVariantGallery">
            <span> Select</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.variant-select-existing {
  .wrapper {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    z-index: 9;
    border: 10px solid $slate-600;

    .content {
      display: flex;
      flex-direction: column;
      gap: 2rem;

      border-radius: 5px;
      max-width: 75%;
      background-color: white;
      padding: 4rem 6rem;
      border: 1px solid $slate-200;

      .thumbs {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 2rem;
        padding: 4rem;
        min-height: 20px;
        border: 1px solid $slate-200;
        border-radius: 5px;

        .thumb {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          border: 1px solid $slate-200;
          padding: 1rem;
          cursor: pointer;
          border-radius: 5px;

          &.selected {
            border: 1px solid $green-600;

            .check {
              background-color: $green-600;
            }
          }

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          .check {
            position: absolute;
            top: 0;
            left: 0;
            background-color: $slate-400;
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0.25rem;
            transform: translate(-50%, -50%);
            svg {
              fill: white;
            }
          }
        }
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding: 0 4rem;
        .btn {
          padding: 1rem 2rem;
        }
      }
    }
  }
}
</style>
