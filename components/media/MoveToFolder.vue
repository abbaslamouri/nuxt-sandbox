<script setup>
const props = defineProps({
  folders: {
    type: Array,
  },
  selectedMedia: {
    type: Array,
  },
  mediaSortField: {
    type: String,
  },
})
defineEmits(['moveMediaToFolder'])

// const mediaState = inject('mediaState')
// const mediaActions = inject('mediaActions')
// const folderState = inject('folderState')

const newFolderId = ref('')

// watch(newFolderId, (currentVal, oldVal) => {
//   console.log(currentVal);
//   console.log(oldVal);
//   handleMoveMediaToFolder(currentVal);
// });
</script>

<template>
  <div class="move-to-folder" v-if="selectedMedia.length">
    <div class="base-select">
      <select v-model="newFolderId" @change="$emit('moveMediaToFolder', newFolderId)">
        <option value="">Select Folder</option>
        <option v-for="option in folders" :key="option._id" :value="option._id">{{ option.name }}</option>
      </select>
      <label>Move To Folder</label>
    </div>

    <!-- <span>Move to Folder</span>
    <FormsBaseSelect
      v-model="newFolderId"
      nullOption="Select Folder"
      @change="$emit('moveMediaToFolder', newFolderId)"
      :options="
        folders.map((f) => {
          return { key: f._id, name: f.name }
        })
      "
      label="Move to folder"
    /> -->
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
  width: 18rem;
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
