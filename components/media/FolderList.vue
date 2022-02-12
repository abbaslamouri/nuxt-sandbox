<script setup>
defineProps({
  folders: {
    type: Array,
  },
  selectedFolder: {
    type: Object,
  },
})
defineEmits(['folderSelected'])
</script>

<template>
  <div class="folder-list" v-if="folders.length">
    <button
      class="btn folder"
      :class="{ selected: !selectedFolder || !selectedFolder._id }"
      @click="$emit('folderSelected', {})"
    >
      <IconsFolder />
      <span>All</span>
    </button>
    <button
      class="btn folder"
      v-for="folder in folders"
      :key="folder._id"
      :class="{ selected: selectedFolder && selectedFolder._id === folder._id }"
      @click="$emit('folderSelected', folder)"
    >
      <IconsFolder />
      <span>{{ folder.name }}</span>
    </button>
  </div>
</template>
<style lang="scss" scoped>
@import '@/assets/scss/variables';

.folder-list {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;

  .btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 5px;

    svg {
      fill: $slate-800;
    }

    &.selected {
      background-color: $slate-300;
    }
  }
}
</style>
