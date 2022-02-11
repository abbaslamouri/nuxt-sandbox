<script setup>
const props = defineProps({
  selectedFolder: {
    type: Object,
  },
})

const emit = defineEmits(['folderSelected', 'saveFolderEmitted'])
// import { useError } from '~/pinia/useError'

// const appError = useError()
// const folderState = inject('folderState')
// const folderActions = inject('folderActions')
// const mediaState = inject('mediaState')
// const mediaActions = inject('mediaActions')

const showForm = ref(false)
const newFolder = reactive({
  name: '',
})

const toggleSort = async () => {
  // folderState.sort.order = folderState.sort.order == '-' ? `` : `-`
  // folderState.query.sort = `${folderState.sort.order}${folderState.sort.field}`
  // await folderActions.fetchAll()
}

const setSelectedFolder = (event) => {
  // emit('folderSelected', event)
  // selectedI = event
  showForm.value = true
}

const handleSave = () => {
  emit('saveFolderEmitted', newFolder)
  // folderActions.saveItem()
  showForm.value = false
}

const handleDelete = async () => {
  // if (!confirm('Are you sure?')) return
  // if (mediaState.items.length) {
  //   const errorMsg = 'You cannot delete non-empty folders'
  //   appError.setSnackbar(true, errorMsg)
  // } else {
  //   await folderActions.deleteItem()
  //   folderState.selectedItem = {}
  //   delete mediaState.query.folder
  //   await mediaActions.fetchAll()
  // }
}
</script>

<template>
  <div class="folder-actions">
    <div class="new-folder">
      <button class="btn add-new-folder" @click="setSelectedFolder({ name: '' })">
        <IconsFolderPlus />
        <span> New Folder </span>
      </button>
      <transition name="folder-form">
        <form class="form" v-if="showForm" @submit.prevent="handleSave">
          <FormsBaseInput type="text" label="Folder" v-model="newFolder.name" />
          <div class="actions">
            <button class="submit btn btn-primary" type="submit">OK</button>
            <button class="submit btn btn-secondary" @click.prevent="showForm = false">Cancel</button>
          </div>
        </form>
      </transition>
    </div>
    <div class="sort-actions">
      <div class="sort" @click="toggleSort">
        <span>Sort Order</span>
        <button class="btn">
          <!-- <IconsSouth v-if="folderState.sort.order == '-'" /> -->
          <!-- <IconsNorth v-else /> -->
        </button>
      </div>
      <div class="actions" v-if="selectedFolder._id">
        <button class="btn edit" @click="setSelectedFolder(selectedFolder)">
          <IconsEditFill />
        </button>
        <button class="btn delete" @click="handleDelete">
          <IconsDeleteFill />
        </button>
      </div>
    </div>
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
      border: 1px solid $sky-400;
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
