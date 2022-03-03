<script setup>
defineProps({
  folders: {
    type: Array,
  },
  selectedMedia: {
    type: Array,
  },
  selectedFolder: {
    type: Object,
  },
  mediaSortField: {
    type: String,
  },
  mediaSortOrder: {
    type: String,
  },
})
const emit = defineEmits([
  'fileUploadBtnClicked',
  'toggleMediaSort',
  'moveMediaToFolder',
  'deleteMedia',
  'searchKeywordSelected',
])

const keyword = ref(null)
const moveToFolderId = ref('')
const showMediaMoveAlert = ref(false)
const showMediaDeleteAlert = ref(false)

const handleMoveMedia = async () => {
  showMediaMoveAlert.value = false
  emit('moveMediaToFolder', moveToFolderId.value)
  moveToFolderId.value = ''
}

const handleDeleteMedia = async () => {
  showMediaDeleteAlert.value = false
  emit('deleteMedia')
}

const handleCancelMoveMedia = async () => {
  showMediaMoveAlert.value = false
  moveToFolderId.value = ''
}

const clearKeyword = async () => {
  emit('searchKeywordSelected', '')
  keyword.value = ''
  // showMediaMoveAlert.value = false
  // moveToFolderId.value = ''
}
</script>

<template>
  <div class="file-actions">
    <button class="btn add-new-file" @click="$emit('fileUploadBtnClicked')">
      <IconsUpload />
      <span>Upload Files</span>
    </button>
    <div class="search-sort">
      <div class="search">
        <Search @searchKeywordSelected="$emit('searchKeywordSelected', $event)" />
      </div>
      <div class="sort">
        <MediaSort
          :mediaSortField="mediaSortField"
          :mediaSortOrder="mediaSortOrder"
          @toggleMediaSort="$emit('toggleMediaSort', $event)"
        />
      </div>
    </div>
    <div class="actions">
      <div class="move-to">
        <div class="base-select" v-if="selectedMedia.length">
          <select v-model="moveToFolderId" @change="showMediaMoveAlert = true">
            <option value="">Select Folder</option>
            <option
              v-for="option in folders.filter((f) => f._id != selectedFolder._id)"
              :key="option._id"
              :value="option._id"
            >
              {{ option.name }}
            </option>
          </select>
          <label>Move To Folder</label>
        </div>
      </div>
      <button class="btn delete" v-if="selectedMedia.length" @click="showMediaDeleteAlert = true">
        <IconsDeleteFill />
      </button>
    </div>
    <Alert v-if="showMediaMoveAlert" @ok="handleMoveMedia" @cancel="handleCancelMoveMedia">
      <h3>
        `Are you sure you want to move these files to folder
        <span>{{ folders.find((f) => f._id === moveToFolderId).name }}</span> ?`
      </h3>
    </Alert>
    <Alert v-if="showMediaDeleteAlert" @ok="handleDeleteMedia" @cancel="showMediaDeleteAlert = false">
      <h3>Are you sure you want to delete these files?</h3>
      <p>Your will not be able to recover these files.</p>
    </Alert>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.file-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4rem;
  padding: 1rem;
  border-bottom: 1px #ccc solid;

  .add-new-file {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid $sky-400;
    color: $sky-600;

    svg {
      fill: $sky-600;
    }
  }

  .search-sort {
    display: flex;
    align-items: center;
    gap: 3rem;

    .search {
      min-width: 20rem;
    }
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 2rem;

    .move-to {
      width: 18rem;
    }

    .delete {
      border: none;

      svg {
        fill: $red-600;
        width: 2.5rem;
        height: 2.5rem;
      }
    }

    .edit {
      svg {
        fill: $green-800;
      }
    }
  }

  .btn {
    border-radius: 5px;
  }
}
</style>
