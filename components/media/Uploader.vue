<script setup>
import { useMessage } from '~/store/useMessage'

const route = useRoute()
const appMessage = useMessage()
const selectedMedia = ref([])
const media = ref([])
const mediaCount = ref(null)
const folders = ref([])
const selectedFolder = ref({})
const page = ref(1)
const perPage = ref(100)
const folderSortField = ref('name')
const folderSortOrder = ref('')
const mediaSortField = ref('name')
const mediaSortOrder = ref('-')
const showDropZone = ref(false)

//Set folder query params
const folderParams = computed(() => {
  return {
    fields: 'name, slug, path',
    sort: `${folderSortOrder.value}${folderSortField.value}`,
  }
})

// Set media query params
const mediaParams = computed(() => {
  return {
    fields: 'name, slug, filename, folder, path, mimetype',
    page: 1,
    limit: perPage.value,
    sort: `${mediaSortOrder.value}${mediaSortField.value}`,
  }
})

appMessage.snackbar.show = false
try {
  const [mediaData, folderData] = await Promise.all([
    $fetch('/api/v1/media', { params: mediaParams.value }),
    // $fetch('/api/v1/media/count', { params: mediaParams.value }),
    $fetch('/api/v1/folders', { params: folderParams.value }),
  ])
  media.value = mediaData
  // mediaCount.value = mediaItemCount
  folders.value = folderData
} catch (error) {
  appMessage.setSnackbar(true, error.data, 'Error')
}

// console.log('MediaCount', mediaCount.value)
// console.log('Media', media.value)
// console.log('Folders', folders.value)

const pages = computed(() =>
  mediaCount.value % perPage.value
    ? parseInt(mediaCount.value / perPage.value) + 1
    : parseInt(mediaCount.value / perPage.value)
)
// // const appError = useError()
// const { state: folderState, actions: folderActions } = useFactory('folders')
// const { state: mediaState, actions: mediaActions } = useFactory('media')

// provide('folderState', folderState)
// provide('folderActions', folderActions)
// provide('mediaState', mediaState)
// provide('mediaActions', mediaActions)

// defineEmits(['mediaSelected', 'mediaSelectCancel'])

// const showDropZone = ref(false)
// const itemsToUpload = ref([])

// //Pagination
// const page = ref(1)
// const perPage = ref(10)
// const pages = computed(() =>
//   mediaState.totalItemCount % perPage.value
//     ? parseInt(mediaState.totalItemCount / perPage.value) + 1
//     : parseInt(mediaState.totalItemCount / perPage.value)
// )

// // Set folder query
// folderState.query.fields = 'name,slug'
// folderState.sort.field = 'name'
// folderState.sort.order = ''

// // Set media query
// mediaState.query.fields = 'name, filename, folder, path, mimetype'
// mediaState.query.page = 1
// mediaState.query.limit = perPage.value
// mediaState.query.populate = 'folder'
// mediaState.sort.field = 'name'
// mediaState.sort.order = ''
// mediaState.query.sort = `${mediaState.sort.order}${mediaState.sort.field}`

// // Fetch all folders, media and media count
// await Promise.all([folderActions.fetchAll(), mediaActions.fetchAll(), mediaActions.fetchCount()])

const handleFileUploadBtnClicked = () => {
  if (!selectedFolder.value._id) appMessage.setSnackbar(true, 'Please selecet a folder', 'Error', 5)
  else showDropZone.value = !showDropZone.value
}

const handleUplodItemsSelected = async (ulploadItems) => {
  showDropZone.value = false

  for (const prop in ulploadItems) {
    media.value.unshift({
      uploadState: 'uploading',
      uploadProgress: 0,
      file: ulploadItems[prop],
    })
  }
}

const setPage = (currentPage) => {
  // page.value = currentPage
  // mediaState.query.page = currentPage
  // mediaActions.fetchAll()
}

const handleSelectFolder = async (event) => {
  selectedFolder.value = event
  if (Object.values(selectedFolder.value).length) {
    mediaParams.value.folder = selectedFolder.value._id
  } else {
    delete mediaParams.value.folder
  }
  media.value = await $fetch('/api/v1/media', { params: mediaParams.value })
  // await Promise.all([mediaActions.fetchAll(), mediaActions.fetchCount()])
}

const handleFolderSaved = async (event) => {
  console.log('E', event)
  const index = folders.value.findIndex((f) => f._id == event._id)
  console.log(index)
  if (index !== -1) folders.value.splice(index, 1, event)
  else folders.value.push(event)

  // folders.push(event)

  // const index = folders.value.findIndex((f) => f._id == selectedFolder.value._id)
  // if (index !== -1) folders.value.splice(index, 1)
  // selectedFolder.value = {}
  // console.log(mediaParams.value)
  // delete mediaParams.value.folder
  // media.value = await $fetch('/api/v1/media', { params: mediaParams.value })
}

const handleFolderDeleted = async () => {
  const index = folders.value.findIndex((f) => f._id == selectedFolder.value._id)
  if (index !== -1) folders.value.splice(index, 1)
  selectedFolder.value = {}
  delete mediaParams.value.folder
  media.value = await $fetch('/api/v1/media', { params: mediaParams.value })
}

const toggleFolderSortOrder = async () => {
  folderSortOrder.value = folderSortOrder.value == '-' ? `` : `-`
  console.log(folderSortOrder.value)
  console.log(folderParams.value)
  folders.value = await $fetch('/api/v1/folders', { params: folderParams.value })
}
const toggleMediaSort = async (event) => {
  console.log('E', event)
  mediaSortField.value = event.field
  mediaSortOrder.value = event.order
  media.value = await $fetch('/api/v1/media', { params: mediaParams.value })
}

const addToSelectedMedia = (event) => {
  const index = media.value.findIndex((m) => m._id == event._id)
  if (index !== -1 && !selectedMedia.value.find((m) => m._id == event._id)) selectedMedia.value.push(event)
}

const removeFromSelectedMedia = (event) => {
  const index = selectedMedia.value.findIndex((m) => m._id == event._id)
  if (index !== -1) selectedMedia.value.splice(index, 1)
}

const handleMoveMediaToFolder = async (event) => {
  console.log('MOVE', event)
  // if (!confirm('Are you sure?')) return;
  setTimeout(async () => {
    // console.log('LLLLL', newFolderId);
    const index = props.folders.findIndex((f) => f._id === newFolderId.value)
    // console.log(index);
    if (index != -1) {
      // await mediaActions.updateItems({ folder: newFolderId.value })
      // folderState.selectedItem = folderState.items[index]
      // mediaState.query.folder = folderState.selectedItem._id
      // mediaActions.fetchAll()
      // newFolderId.value = null
      // mediaState.selectedItems = []
    }
  }, 200)
}
</script>

<template>
  <div class="media-uploader">
    {{ pages }}
    <div class="folders shadow-md">
      <h3 class="title">Folders</h3>
      <div class="content">
        <MediaFolderActions
          :selectedFolder="selectedFolder"
          :media="media"
          :folderSortOrder="folderSortOrder"
          @folderSelected="selectedFolder = $event"
          @folderSaved="handleFolderSaved"
          @folderDeleted="handleFolderDeleted"
          @toggleFolderSortOrder="toggleFolderSortOrder"
        />
        <MediaFolderList
          v-if="folders.length"
          :folders="folders"
          :selectedFolder="selectedFolder"
          @folderSelected="handleSelectFolder"
        />
      </div>
    </div>
    <div class="files shadow-md">
      <h3 class="title">Files</h3>
      <div class="content">
        <MediaFileActions
          :folders="folders"
          :selectedMedia="selectedMedia"
          :mediaSortField="mediaSortField"
          :mediaSortOrder="mediaSortOrder"
          @toggleMediaSort="toggleMediaSort"
          @fileUploadBtnClicked="handleFileUploadBtnClicked"
          @moveMediaToFolder="handleMoveMediaToFolder"
        />

        <transition name="dropZone">
          <MediaDropZone
            v-show="showDropZone"
            :selectedFolder="selectedFolder"
            @fileUploadBtnClicked="handleFileUploadBtnClicked"
            @uploadItemsSelected="handleUplodItemsSelected"
          />
        </transition>
        <MediaFileList
          :media="media"
          :selectedMedia="selectedMedia"
          :selectedFolder="selectedFolder"
          @addToSelectedMedia="addToSelectedMedia"
          @removeFromSelectedMedia="removeFromSelectedMedia"
        />
        <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1" />
      </div>
    </div>
    <div class="media-select-actions">
      <button
        class="btn btn-primary"
        @click="$emit('mediaSelected', selectedItems)"
        v-if="route.name !== 'admin-media'"
      >
        Selct
      </button>
      <button
        v-if="route.name !== 'admin-media'"
        class="btn btn-secondary cancel"
        @click="$emit('mediaSelectCancel', selectedItems)"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.media-uploader {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding: 1rem;

  .folders {
    display: flex;
    flex-direction: column;
    background-color: white;

    .title {
      text-align: center;
      background-color: $slate-300;
      padding: 1rem;
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding: 1rem;
    }
  }

  .files {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: white;

    .title {
      text-align: center;
      background-color: $slate-300;
      padding: 1rem;
    }

    .content {
      padding: 1rem;
    }
  }

  .media-select-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 0 4rem;

    .btn {
      font-size: 1.4rem;
      padding: 1rem 2rem;
    }
  }
}
</style>
