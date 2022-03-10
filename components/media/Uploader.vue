<script setup>
import { useMessage } from '~/store/useMessage'
import { useStore } from '~/store/useStore'

const { state } = useFactory()

const store = useStore()
const route = useRoute()
const appMessage = useMessage()
const selectedMedia = ref([])
const media = ref([])
const mediaCount = ref(null)
const folders = ref([])
const selectedFolder = ref({})
const page = ref(1)
const perPage = ref(20)
const folderSortField = ref('name')
const folderSortOrder = ref('')
const mediaSortField = ref('name')
const mediaSortOrder = ref('-')
const showDropZone = ref(false)
const keyword = ref('')

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
    page: page.value,
    limit: perPage.value,
    sort: `${mediaSortOrder.value}${mediaSortField.value}`,
    keyword: keyword.value,
  }
})

const pages = computed(() =>
  mediaCount.value % perPage.value
    ? parseInt(mediaCount.value / perPage.value) + 1
    : parseInt(mediaCount.value / perPage.value)
)

const fetchMedia = async () => {
  appMessage.errorMsg = null
  try {
    let params = {}
    if (Object.values(selectedFolder.value).length) {
      params = { ...mediaParams.value, folder: selectedFolder.value._id }
    } else {
      params = { ...mediaParams.value }
    }
    const response = await $fetch('/api/v1/media', { params })
    media.value = response.docs
    mediaCount.value = response.count
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

// Fetch folders
try {
  appMessage.errorMsg = null
  folders.value = await $fetch('/api/v1/folders', { params: folderParams.value })
} catch (error) {
  appMessage.errorMsg = error.data
}

//Fetch media
await fetchMedia()

// Handles upload button click
const handleFileUploadBtnClicked = () => {
  if (!selectedFolder.value._id) appMessage.errorMsg = 'Please selecet a folder'
  else showDropZone.value = !showDropZone.value
}

// Handles meia upload
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

const setPage = async (currentPage) => {
  page.value = currentPage
  await fetchMedia()
}

const handleSelectFolder = async (event) => {
  selectedFolder.value = event
  page.value = 1
  await fetchMedia()
}

//save folder
const handleFolderSaved = async (event) => {
  const index = folders.value.findIndex((f) => f._id == event._id)
  if (index !== -1) folders.value.splice(index, 1, event)
  else folders.value.push(event)
}

// Delete folder
const handleFolderDeleted = async () => {
  const index = folders.value.findIndex((f) => f._id == selectedFolder.value._id)
  if (index !== -1) folders.value.splice(index, 1)
  selectedFolder.value = {}
  await fetchMedia()
}

// Toggle folder sort
const toggleFolderSortOrder = async () => {
  folderSortOrder.value = folderSortOrder.value == '-' ? `` : `-`
  folders.value = await $fetch('/api/v1/folders', { params: folderParams.value })
}

// Toggle media sort
const toggleMediaSort = async (event) => {
  mediaSortField.value = event.field
  mediaSortOrder.value = event.order
  await fetchMedia()
}

// Add file to selected media
const addToSelectedMedia = (event) => {
  const index = media.value.findIndex((m) => m._id == event._id)
  if (index !== -1 && !selectedMedia.value.find((m) => m._id == event._id)) selectedMedia.value.push(event)
}

// Remove file from selected media
const removeFromSelectedMedia = (event) => {
  const index = selectedMedia.value.findIndex((m) => m._id == event._id)
  if (index !== -1) selectedMedia.value.splice(index, 1)
}

// Delete media
const handleDeleteMedia = async () => {
  let message = ''
  let error = ''
  // console.log(selectedMedia.value)
  await Promise.all(
    selectedMedia.value.map(async (item) => {
      try {
        await $fetch(`/api/v1/media`, {
          method: 'DELETE',
          body: { id: item._id },
        })
        message += `${item.name} deleted.<br>`
      } catch (err) {
        console.error('MyERROR', err)
        error += `${err.data}.<br>`
      }
    })
  )
  if (message) appMessage.successMsg = message
  if (error) appMessage.errorMsg = error
  await fetchMedia()
  selectedMedia.value = []
}

// Move media to a different folder
const handleMoveMediaToFolder = async (event) => {
  appMessage.errorMsg = null
  const index = folders.value.findIndex((f) => f._id == event)
  if (index != -1) {
    await Promise.all(
      selectedMedia.value.map(async (item) => {
        try {
          const response = await $fetch(`/api/v1/media`, {
            method: 'PATCH',
            params: { id: item._id },
            body: { folder: event },
          })
          // console.log(response)
        } catch (err) {
          // console.error('MyERROR', err)
          appMessage.errorMsg = err.data
        }
      })
    )
    selectedFolder.value = folders.value.find((f) => f._id == event)
    await fetchMedia()
    selectedMedia.value = []
  }
}

const handleSearch = async (event) => {
  page.value = 1
  keyword.value = event
  await fetchMedia()
}

const setSelectedMedia = () => {
  state.value.selectedMedia = selectedMedia.value
  state.value.showMediaSelector = false
}
</script>

<template>
  <div class="media-uploader">
    <div class="top shadow-md">
      <h3 class="title">Media</h3>
      <div class="folders">
        <div class="folder__actions">
          <MediaFolderActions
            :selectedFolder="selectedFolder"
            :media="media"
            :folderSortOrder="folderSortOrder"
            @folderSelected="selectedFolder = $event"
            @folderSaved="handleFolderSaved"
            @folderDeleted="handleFolderDeleted"
            @toggleFolderSortOrder="toggleFolderSortOrder"
          />
        </div>
        <div class="forlder__list">
          <MediaFolderList
            v-if="folders.length"
            :folders="folders"
            :selectedFolder="selectedFolder"
            @folderSelected="handleSelectFolder"
          />
        </div>
      </div>
      <div class="file-actions">
        <MediaFileActions
          :folders="folders"
          :selectedMedia="selectedMedia"
          :selectedFolder="selectedFolder"
          :mediaSortField="mediaSortField"
          :mediaSortOrder="mediaSortOrder"
          @toggleMediaSort="toggleMediaSort"
          @fileUploadBtnClicked="handleFileUploadBtnClicked"
          @moveMediaToFolder="handleMoveMediaToFolder"
          @deleteMedia="handleDeleteMedia"
          @searchKeywordSelected="handleSearch"
        />
        <transition name="dropZone">
          <MediaDropZone
            v-show="showDropZone"
            :selectedFolder="selectedFolder"
            @fileUploadBtnClicked="handleFileUploadBtnClicked"
            @uploadItemsSelected="handleUplodItemsSelected"
          />
        </transition>
      </div>
    </div>
    <div class="bottom shadow-md">
      <MediaFileList
        :media="media"
        :selectedMedia="selectedMedia"
        :selectedFolder="selectedFolder"
        @addToSelectedMedia="addToSelectedMedia"
        @removeFromSelectedMedia="removeFromSelectedMedia"
      />
      <div class="pagination">
        <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1" />
      </div>
    </div>
    <div class="actions" v-if="route.name !== 'admin-media'">
      <button class="btn btn-secondary cancel" @click="$emit('mediaSelectCancel')">Cancel</button>
      <button class="btn btn-primary" @click="setSelectedMedia">Select</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.media-uploader {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .top {
    .title {
      background-color: $slate-300;
      padding: 1rem;
      text-align: center;
    }

    .folders {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      border-bottom: 1px solid $slate-400;
      padding: 2rem;

      .folder-actions {
        display: flex;
      }
    }
  }

  .bottom {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
    background-color: $slate-50;
    flex: 1;
    overflow-y: auto;
    padding: 0 0 2rem 0;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 0 4rem;
    // border: 5px solid teal;
    background-color: $slate-50;
    padding: 1rem 3rem;
    background-color: $slate-300;

    .btn {
      font-size: 1.2rem;
      padding: 1rem 2rem;

      &.cancel {
        border: none;
      }
    }
  }
}
</style>
