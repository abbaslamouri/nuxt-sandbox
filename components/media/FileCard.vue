<script setup>
import iconType from '~/composables/useUtils'
// import { useError } from '~/pinia/useError'
// import axios from 'axios'

const props = defineProps({
  file: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['itemUploadedError'])

// const folderState = inject('folderState')
// const mediaState = inject('mediaState')
// const appError = useError()

// const http = axios.create({
//   baseURL: 'http://localhost:3000/api',
// })
// let axiosSource = axios.CancelToken.source()
const uploadProgress = ref(0)
const uploadState = ref('')

const upload = async () => {
  // let response = {}
  // try {
  //   uploadState.value = 'uploading'
  //   const config = {
  //     onUploadProgress: (e) => {
  //       if (e.lengthComputable) uploadProgress.value = Math.round((e.loaded * 100) / e.total)
  //     },
  //     cancelToken: axiosSource.token,
  //   }
  //   const formData = new FormData()
  //   formData.append('file', props.item.file)
  //   formData.append('folder', folderState.selectedItem._id)
  //   if (props.item.file.type.includes('image')) response = await http.post(`v1/media/image`, formData, config)
  //   else response = await http.post(`v1/media`, formData, config)
  //   uploadState.value = 'complete'
  //   const index = mediaState.items.findIndex((m) => m.file && m.file.name == props.item.file.name)
  //   if (index !== -1) mediaState.items.splice(index, 1, response.data)
  // } catch (err) {
  //   console.log('MyERROR', err)
  //   const index = mediaState.items.findIndex((m) => m.file && m.file.name == props.item.file.name)
  //   if (index !== -1) mediaState.items.splice(index, 1)
  //   emit('itemUploadedError', `<p>${err.response.data.message || err.response.data.statusMessage}</p>`)
  // }
}

onMounted(async () => {
  // if (props.item.uploadState === 'uploading') await upload()
})
</script>

<template>
  <div class="card">
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
  </div>
</template>

<style lang="scss" scoped>
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
      object-fit: cover;
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
}
</style>
