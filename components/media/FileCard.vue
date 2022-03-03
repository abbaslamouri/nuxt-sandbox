<script setup>
import slugify from 'slugify'
import iconType from '~/composables/useUtils'
const config = useRuntimeConfig()

const props = defineProps({
  file: {
    type: Object,
    required: true,
  },
  selectedFolder: {
    type: Object,
  },
})
const emit = defineEmits(['itemUploadedError'])

const uploadProgress = ref(0)

const upload = async () => {
  try {
    const response = await $fetch('/api/v1/media/image', {
      method: 'POST',
      body: {
        name: props.file.file.name,
        filename: props.file.file.name,
        path: `/uploads/${props.file.file.name}`,
        slug: slugify(props.file.file.name, { lower: true }),
        mimetype: props.file.file.type,
        size: props.file.file.size,
        folder: props.selectedFolder._id,
        url: `${config.BASE_URL}/public/uploads/${props.file.file.name}`,
      },
    })
  } catch (error) {
    emit('itemUploadedError', error.data)
  }
}

onMounted(async () => {
  if (props.file.uploadState === 'uploading') await upload()
})
</script>

<template>
  <div
    class="card"
    @mouseenter="$event.target.classList.add('hovered')"
    @mouseleave="$event.target.classList.remove('hovered')"
  >
    <div v-if="file.mimetype && file.mimetype.includes('image')" class="thumb">
      <img :src="`${file.path}`" />
    </div>
    <div v-else class="file">
      <div class="icon">
        <component v-if="file.mimetype" :is="iconType(file.mimetype)" />
      </div>
      <p class="filename">
        {{ file.filename }}
      </p>
    </div>
    <IconsProgressRing v-if="uploadProgress" :progress="uploadProgress" class="progress" />
    <div class="tooltip">{{ file.filename }}</div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 12rem;
  height: 12rem;

  .thumb {
    img {
      width: 12rem;
      height: 12rem;
      object-fit: contain;
    }
  }

  .file {
    display: grid;
    grid-template-rows: 75% 50%;
    height: 100%;

    .icon {
      display: flex;
      justify-content: center;
      align-items: center;

      svg {
        width: 50%;
        height: 50%;
      }
    }

    .filename {
      vertical-align: middle;
      font-size: 1.2rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      padding: 0 0.5rem;
    }
  }

  .progress {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .tooltip {
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translate(-50%, -100%);
    background-color: $slate-600;
    display: grid;
    grid-template-columns: minmax(max-content, 40rem);
    color: white;
    padding: 1rem 2rem;
    border-radius: 5px;
    font-size:1rem;
    font-weight: 500;
    opacity: 0;
    visibility: hidden;

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: $slate-600 transparent transparent transparent;
    }
  }

  &.hovered {
    background-color: $slate-500;

    img {
      opacity: 0.5;
    }

    .tooltip {
      opacity: 1;
      visibility: visible;
    }
  }
}
</style>
