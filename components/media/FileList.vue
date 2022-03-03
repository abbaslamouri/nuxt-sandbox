<script setup>
const props = defineProps({
  media: {
    type: Array,
  },
  selectedMedia: {
    type: Array,
  },
  selectedFolder: {
    type: Object,
  },
})

defineEmits(['addToSelectedMedia', 'removeFromSelectedMedia', 'itemUploadedError'])

const fileRefs = ref([])
</script>

<template>
  <div class="media-list">
    <div class="main">
      <div v-for="(file, index) in media" class="item shadow-md">
        <MediaFileCard
          :file="file"
          :key="file._id"
          :selectedFolder="selectedFolder"
          @click="$emit('addToSelectedMedia', file)"
          :class="{ selected: selectedMedia.find((m) => m._id == file._id) }"
          @itemUploadedError="errorMsg += $event"
        />

        <div
          class="actions"
          @mouseenter="fileRefs[index].classList.remove('hidden')"
          @mouseleave="fileRefs[index].classList.add('hidden')"
          v-show="selectedMedia.find((m) => m._id == file._id)"
        >
          <IconsSuccess class="action" v-show="selectedMedia.find((m) => m._id == file._id)" />
          <div
            class="action hidden"
            :ref="
              (el) => {
                fileRefs[index] = el
              }
            "
            @click.exact="$emit('removeFromSelectedMedia', file)"
          >
            <span>-</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import '@/assets/scss/variables';

.media-list {
  // padding: 3rem 1rem;

  .main {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 3rem;
    overflow: scroll;
    padding: 4rem 1rem;

    .item {
      position: relative;

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
    }
  }
}
</style>
