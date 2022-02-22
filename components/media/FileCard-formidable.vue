<script setup>
// import slugify from 'slugify'
import iconType from '~/composables/useUtils'
import { useMessage } from '~/store/useMessage'
const config = useRuntimeConfig()

// import { useError } from '~/pinia/useError'

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

// const folderState = inject('folderState')
// const mediaState = inject('mediaState')
// const appError = useError()

const appMessage = useMessage()

const uploadProgress = ref(0)
const uploadState = ref('')

const upload = async () => {
  // console.log('HHHere', props.file)
  // console.log(props.file.file)
  // console.log(props.selectedFolder._id)

  // let response = null
  try {
    // const fd = new FormData()
    // fd.append('file', props.file.file)
    // // fd.append('folder', props.selectedFolder._id)
    // console.log('FD', fd.getAll('file'))
    // // if (props.file.file.type.includes('image'))
    // response = await $fetch('/api/v1/media/image', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': `multipart/form-data; boundary=---arbit`,
    //   },
    //   body: fd,
    // })

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

    // response = await http.post(`v1/media/image`, formData)

    // console.log('GGGGG', response)

    // await http.post(`v1/media/image`, formData, config)
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
  } catch (error) {
    // console.log(error)
    appMessage.setSnackbar(true, error.data, 'Error')
  }
}

onMounted(async () => {
  if (props.file.uploadState === 'uploading') await upload()
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
