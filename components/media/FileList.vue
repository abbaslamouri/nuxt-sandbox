<script setup>
const props = defineProps({
  media: {
    type: Array,
  },
  selectedFolder: {
    type: Object,
  },
  // itemsToUpload: {
  //   type: Array,
  // },
})
// import axios from 'axios';

// const http = axios.create({
//   baseURL: 'http://localhost:3000/api',
// });
// let axiosSource = axios.CancelToken.source();
// const uploadProgress = ref(0);
// const uploadState = ref('');

// import { useError } from '~/pinia/useError';
defineEmits(['itemUploadedError'])

// const appError = useError();

// const mediaState = inject('mediaState')
// const mediaActions = inject('mediaActions')

const selectedFiles = reactive(new Set())
const errorMsg = ref('')
const showRemoveCheckMark = ref(false)
const fileRefs = ref([])

// const uploadItems = computed(() => props.itemsToUpload)
// const error = computed(() => errorMsg.value);
// const files = computed(() => mediaState.items);

const addSelected = (file) => {
  const index = mediaState.selectedItems.findIndex((m) => m._id == file._id)
  if (index === -1) mediaState.selectedItems.push(file)
  // if (selectedFiles.has(file)) {
  //   if (selectedFiles.size === 1) {
  //     selectedFiles.clear();
  //   } else {
  //     selectedFiles.clear();
  //     selectedFiles.add(file);
  //   }
  // } else {
  // selectedFiles.clear();
  // selectedFiles.add(file);
  // }
  // mediaState.selectedItems = Array.from(selectedFiles);
}

const removeSelected = (file) => {
  const index = mediaState.selectedItems.findIndex((m) => m._id == file._id)
  if (index !== -1) mediaState.selectedItems.splice(index, 1)

  // selectedFiles.delete(file);
  // mediaState.selectedItems = Array.from(selectedFiles);
}

// const selectMultiple = (file) => {
//   if (selectedFiles.has(file)) {
//     selectedFiles.delete(file);
//   } else {
//     selectedFiles.add(file);
//   }
//   mediaState.selectedItems = Array.from(selectedFiles);
// };

const handleItemUploaded = async (event) => {
  // console.log('EEEEEEEV', event)
  // console.log('EEEEEEEVU', uploadItems.value)
  const index = uploadItems.value.findIndex((el) => el.name == event.name)
  if (index != -1) uploadItems.value.splice(index, 1)
  await Promise.all([mediaActions.fetchAll(), mediaActions.fetchCount()])
  // mediaState.items.unshift(event)
}

const handleUploadError = (payload) => {
  // console.log('EEEEER', payload)
  errorMsg.value += payload.error
  const index = uploadItems.value.findIndex((el) => el.name == payload.file.name)
  if (index != -1) uploadItems.value.splice(index, 1)
  // if (errorMsg.value) appError.setSnackbar(true, errorMsg.value);
}

const showRemoveButton = (index) => {
  fileRefs.value[index].classList.remove('hidden')
  // fileRefs.value[index].classList.add('flex');
}

const hideRemoveButton = (index) => {
  fileRefs.value[index].classList.add('hidden', 'flex')
}

const handleMediaUploadError = (event) => {
  // console.log('EVENT', event);
  // appError.setSnackbar(true, event, 'Error', 0);
}

// onUpdated(() => {
//   console.log(mediaState.items);
// });
</script>

<template>
  <div class="media-list">
    <pre class="text-xs">
    <!-- {{ mediaState.items }}===={{ mediaState.totalItemCount }} -->
    </pre>
    <transition nam="slide">
      <div class="error" v-show="errorMsg" v-html="errorMsg"></div>
    </transition>
    <div class="main">
      <div v-for="(file, index) in media" class="item shadow-md">
        <!-- <MediaFileCard
          :item="file"
          :key="file._id"
          :class="{ selected: mediaState.selectedItems.find((m) => m._id == file._id) }"
          @click.exact="addSelected(file)"
          @itemUploadedError="errorMsg += $event"
        /> -->
        <MediaFileCard :file="file" :key="file._id" :selectedFolder="selectedFolder" />

        <!-- <div
          class="actions"
          @mouseenter="showRemoveButton(index)"
          @mouseleave="hideRemoveButton(index)"
          v-show="mediaState.selectedItems.find((m) => m._id == file._id)"
        >
          <IconsSuccess class="action" v-show="mediaState.selectedItems.find((m) => m._id == file._id)" />
          <div
            class="action hidden"
            :ref="
              (el) => {
                fileRefs[index] = el
              }
            "
            @click.exact="
              removeSelected(file)
              fileRefs[index].classList.add('hidden')
            "
          >
            <span>-</span>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import '@/assets/scss/variables';

.media-list {
  padding: 0 0 3rem 0;

  .error {
    background-color: $red-50;
    padding: 2rem;
    border-left: 5px solid $red-400;
    font-size: 1.4rem;
    margin-bottom: 2rem;
    border-radius: 3px;
  }

  .main {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 3rem;

    .item {
      position: relative;
      // border: 1px solid $slate-200;
      // padding: .1rem;

      .selected {
        outline: 4px solid $sky-600;
      }

      .actions {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        border: 1px solid $sky-400;
        top: 0;
        right: 0;
        transform: translate(25%, -25%);
        width: 25px;
        height: 25px;

        svg {
          width: 100%;
          height: 100%;
          fill: $sky-50;
        }

        .action {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          background-color: $sky-600;
          width: 100%;
          height: 100%;
          color: $sky-50;

          border: 2px solid $sky-50;
          outline: 2px solid $sky-600;

          span {
            // border: 1px solid red;
            display: block;
            font-size: 3rem;
          }

          // border:1px solid red;
        }
      }

      .hidden {
        opacity: 0;
        visibility: hidden;
      }
      // absolute top-0 right-0 border border-blue-600 bg-blue-600 p-[3px] w-6 h-6 translate-x-1/4 -translate-y-1/4 outline-blue-600 outline-offset-1 outline-1 justify-center items-center hidden text-white text-2xl

      // &.selected {
      // border: 4px solid #0277bd;
      // color: #fff;
      // }
    }
  }
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 1s ease;
}
</style>
