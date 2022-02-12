<script setup>
const mediaState = inject('mediaState')
const mediaActions = inject('mediaActions')
const folderState = inject('folderState')

const newFolderId = ref('')

const handleMoveMediaToFolder = async () => {
  // if (!confirm('Are you sure?')) return;
  setTimeout(async () => {
    // console.log('LLLLL', newFolderId);
    const index = folderState.items.findIndex((f) => f._id === newFolderId.value)
    // console.log(index);
    if (index != -1) {
      await mediaActions.updateItems({ folder: newFolderId.value })
      folderState.selectedItem = folderState.items[index]
      mediaState.query.folder = folderState.selectedItem._id
      mediaActions.fetchAll()
      newFolderId.value = null
      mediaState.selectedItems = []
    }
  }, 200)
}

// watch(newFolderId, (currentVal, oldVal) => {
//   console.log(currentVal);
//   console.log(oldVal);
//   handleMoveMediaToFolder(currentVal);
// });
</script>

<template>
  <div class="move-to-folder" v-if="mediaState.selectedItems.length">
    <!-- Move to Folder
    <select v-model="newFolderId" @change="handleMoveMediaToFolder">
      <option value="">Select Folder</option>
      <option v-for="option in folderState.items" :key="option._id" :value="option._id">{{ option.name }}</option>
    </select> -->
    <!-- <span>Move to Folder</span> -->
    <FormsBaseSelect
      v-model="newFolderId"
      nullOption="Select Folder"
      @change="handleMoveMediaToFolder"
      :options="
        folderState.items.map((f) => {
          return { key: f._id, name: f.name }
        })
      "
      label="Move to folder"
    />
    <!-- <select v-model="newFolderId" @change="handleMoveMediaToFolder">
      <option value="">Select Folder</option>
      <option v-for="folder in folderState.items" :key="folder._id" :value="folder._id">
        {{ folder.name }}
      </option>
    </select> -->
  </div>
</template>

<style lang="scss" scoped>
.move-to-folder {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
  min-width: 18rem;
}
// .media-uploader {
//   padding: 1rem;

//   .folders {
//     border: 1px solid grey;
//   }

//   .files {
//     border: 1px solid grey;

//     .file-actions {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       padding: 1rem 2rem;
//       border-bottom: 1px #ccc solid;

//       .btn {
//         background-color: transparent;
//         color: #4285f4;
//         display: flex;
//         gap: 1rem;
//         align-items: center;
//         height: fit-content;
//         border: 1px solid teal;
//         border-radius: 3px;
//         padding: 0.7rem 2rem;
//         cursor: pointer;
//       }

//       .search {
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         gap: 2rem;

//         form {
//           padding: 0 1.5rem 0 0;
//           border-radius: 2rem;
//           background-color: #bdbdbd;
//           display: flex;
//           align-items: center;
//           gap: 1.3rem;
//           color: #fff;

//           input {
//             border: 1px #bdbdbd solid;
//             padding: 0.6rem 2rem;
//             border-radius: 2rem 0 0 2rem;
//           }

//           .btn {
//             border: none;
//             padding: 0;
//             color: #fff;
//             svg {
//               width: 1.7rem;
//               // height: 2rem;
//               cursor: pointer;
//             }
//           }
//         }
//       }

//       .action-buttons {
//         display: flex;
//         align-items: center;
//         gap: 2rem;

//         .move {
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//           font-size: 1.3rem;

//           select {
//             padding: 0.7rem 1rem;
//           }
//         }

//         .btn {
//           padding: 0;
//           border: none;

//           &.delete {
//             svg {
//               fill: #d32f2f;
//             }
//           }

//           &.edit {
//             color: #43a047;
//           }

//           svg {
//             width: 2rem;
//             // height: 2rem;
//           }
//         }
//       }
//     }
//   }
// }
</style>
