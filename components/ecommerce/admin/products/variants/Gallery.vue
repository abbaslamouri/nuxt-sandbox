<script setup>
const props = defineProps({
  index: {
    type: Number,
  },
})

const { variants } = useStore()
const { galleryMedia, mediaReference, showMediaSelector } = useFactory()

const showProductGallery = ref(false)
const galleryIntro = ref('This image gallery contains all images associated with this product variant.')

const updateVariantMedia = async (event) => {
  console.log('media', event)
  showMediaSelector.value = false
  for (const prop in event) {
    const i = variants.value[props.index].gallery.findIndex((m) => m._id === event[prop]._id)
    if (i === -1) variants.value[props.index].gallery.push(event[prop])
  }
}

const handleNewMediaSelectBtnClicked = () => {
  mediaReference.value = 'variantMedia'
  showMediaSelector.value = true
}

watch(
  () => galleryMedia.value,
  (currentVal) => {
    console.log(currentVal)
    if (mediaReference.value === 'variantMedia') updateVariantMedia(currentVal)
  },
  { deep: true }
)
</script>

<template>
  <section class="shadow-md p2 flex-col gap2 bg-white" id="image-gallery">
    <div class="flex-row items-center justify-between text-sm mb1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb05">Image Gallery</div>
      <div></div>
    </div>
    <div class="flex-col gap2">
      <div class="items-self-center flex-col items-center gap2 maxw60">
        <div class="intro flex-row items-center gap1 bg-slate-200 py1 px2 br3 text-sm" v-if="galleryIntro">
          <IconsInfo class="w3 h3 fill-sky-600" />
          <p>{{ galleryIntro }}</p>
        </div>
        <EcommerceAdminImageGallery
          v-if="!showProductGallery"
          :gallery="variants[index].gallery"
          :galleryIntro="galleryIntro"
          galleryType="variant"
          @removeGalleryImage="variants[index].gallery.splice($event, 1)"
          @setGalleryImage="variants[index].gallery[$event.index] = $event.value"
        />
        <EcommerceAdminProductsVariantsSelectExisting
          v-else
          :index="index"
          @productGalleryEventEmitted="showProductGallery = $event"
        />
        <div class="flex-row gap2">
          <button class="btn btn__image-select" @click.prevent="handleNewMediaSelectBtnClicked">
            <IconsImage />
            <span> Select New Images </span>
          </button>
          <button class="btn btn__image-select" @click.prevent="showProductGallery = true">
            <IconsImage />
            <span> Select From Product Images </span>
          </button>
        </div>
        <p class="text-sm">PNG, JPG, and GIF Accepted</p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
