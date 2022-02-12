<script setup>
defineProps({
  selectedMedia: {
    type: Array,
  },
  mediaSortField: {
    type: String,
  },
  mediaSortOrder: {
    type: String,
  },
})
defineEmits(['fileUploadBtnClicked', 'toggleMediaSort'])
const keyword = ref(null)

// const mediaState = inject('mediaState')
// const mediaActions = inject('mediaActions')

const handleDeleteMedia = async () => {
  // if (!confirm('Are you sure?')) return
  // await mediaActions.deleteItems()
  // await Promise.all([mediaActions.fetchAll(), mediaActions.fetchCount()])
}

const handleSearch = async () => {
  // await Promise.all([mediaActions.fetchAll(), mediaActions.fetchCount()])
}
</script>

<template>
  <div class="file-actions">
    <button class="btn add-new-file" @click="$emit('fileUploadBtnClicked')">
      <IconsUpload />
      <span>Upload Files</span>
    </button>
    <div class="search-sort">
      <Search v-model="keyword" @handleSubmit="handleSearch" />
      <MediaSort
        :mediaSortField="mediaSortField"
        :mediaSortOrder="mediaSortOrder"
        @toggleMediaSort="$emit('toggleMediaSort', $event)"
      />
    </div>
    <div class="actions">
      <!-- <MediaMoveToFolder /> -->
      <button class="btn delete" v-if="selectedMedia.length" @click="handleDeleteMedia">
        <IconsDeleteFill />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.file-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4rem;
  padding: 2rem 0;
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
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 2rem;

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
