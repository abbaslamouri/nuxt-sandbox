<script setup>
import slugify from 'slugify'
import { useMessage } from '~/store/useMessage'

const props = defineProps({
  media: {
    type: Array,
  },
  folderSortOrder: {
    type: String,
  },
  selectedFolder: {
    type: Object,
  },
})

const emit = defineEmits(['folderSelected', 'folderSaved', 'folderDeleted', 'toggleFolderSortOrder'])

const appMessage = useMessage()
const showForm = ref(false)
const ItemToDelete = ref(null)
const showAlert = ref(false)
const newFolder = ref({})

const editFolder = () => {
  newFolder.value.name = props.selectedFolder.name
  newFolder.value._id = props.selectedFolder._id
  showForm.value = true
}

const cancelEditFolder = () => {
  newFolder.value = {}
  showForm.value = false
}

const saveNewFolder = async () => {
  appMessage.errorMsg = null
  try {
    newFolder.value.slug = slugify(newFolder.value.name, { lower: true })
    let savedFolder = null
    if (newFolder.value._id)
      savedFolder = await $fetch('/api/v1/folders/', {
        method: 'PATCH',
        body: newFolder.value,
        params: { id: newFolder.value._id },
      })
    else savedFolder = await $fetch('/api/v1/folders/', { method: 'POST', body: newFolder.value })
    emit('folderSaved', savedFolder)
    showForm.value = false
    newFolder.value = {}
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

const selectFolderToDelete = async () => {
  ItemToDelete.value = props.selectedFolder
  showAlert.value = true
}

const deleteFolder = async () => {
  appMessage.errorMsg = null
  showAlert.value = false
  if (props.media.filter((m) => m.folder._id == props.selectedFolder._id).length) {
    return (
      (appMessage.errorMsg =
        'You cannot delete non-empty folders.  Please delete or move all media to another folder before deleting folders.'),
      'Error'
    )
  }
  try {
    await $fetch('/api/v1/folders/', { method: 'DELETE', params: { id: props.selectedFolder._id } })
    emit('folderDeleted')
    appMessage.successMsg = `Folder ${props.selectedFolder.name} deleted succesfully`
  } catch (error) {
    appMessage.errorMsg = error.data
  }
  showAlert.value = false
}
</script>

<template>
  <div class="folder-actions">
    <div class="new-folder">
      <button class="btn add-new-folder" @click="showForm = true">
        <IconsFolderPlus />
        <span> New Folder </span>
      </button>
      <transition name="folder-form">
        <form class="form" v-if="showForm" @submit.prevent="saveNewFolder">
          <FormsBaseInput type="text" label="Folder" v-model="newFolder.name" />
          <div class="actions">
            <button class="submit btn btn-primary" type="submit">OK</button>
            <button class="btn btn-secondary" @click.prevent="cancelEditFolder">Cancel</button>
          </div>
        </form>
      </transition>
    </div>
    <div class="sort-actions">
      <div class="sort" @click="$emit('toggleFolderSortOrder')">
        <span>Sort Order</span>
        <button class="btn">
          <IconsSouth v-if="folderSortOrder == '-'" />
          <IconsNorth v-else />
        </button>
      </div>
      <div class="actions" v-if="selectedFolder._id">
        <button class="btn edit" @click="editFolder">
          <IconsEditFill />
        </button>
        <button class="btn delete" @click="selectFolderToDelete">
          <IconsDeleteFill />
        </button>
      </div>
    </div>
    <Alert v-if="showAlert" @ok="deleteFolder" @cancel="showAlert = false">
      <h3>Are you sure you want to delete this folder?</h3>
      <p>this folder will be deleted if it does not contain any media</p>
    </Alert>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.folder-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .new-folder {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    align-items: center;

    .add-new-folder {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border: 1px solid $sky-600;
      border-radius: 5px;
      color: $sky-600;

      svg {
        fill: $sky-600;
      }
    }

    .form {
      display: flex;
      align-items: center;
      min-width: 20rem;

      gap: 1rem;

      .actions {
        display: flex;
        gap: 0.5rem;
      }
    }
  }
  .sort-actions {
    display: flex;
    align-items: center;
    gap: 4rem;
    font-size: 1.4rem;

    .sort {
      display: flex;
      align-items: center;

      button {
        border: none;
        background-color: transparent;

        svg {
          fill: $sky-600;
          width: 2rem;
          height: 2rem;
        }
      }
    }

    .actions {
      display: flex;

      .btn {
        border: none;

        &.delete {
          svg {
            fill: $red-600;
          }
        }

        &.edit {
          svg {
            fill: $green-800;
          }
        }
        svg {
          width: 2.5rem;
          height: 2.5rem;
        }
      }
    }
  }
}
</style>
