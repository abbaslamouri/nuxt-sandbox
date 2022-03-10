<script setup>
const emit = defineEmits(['searchKeywordSelected', 'clearSearch'])

const keyword = ref(null)

const emitSearchField = () => {
  emit('searchKeywordSelected', keyword.value)
}

const resetItems = () => {
  if (!keyword.value) emitSearchField()
}

const clearSearchField = () => {
  keyword.value = null
  emitSearchField()
}
</script>

<template>
  <form class="search base-input br3 test-sm" @submit.prevent="emitSearchField">
    <IconsSearch class="search-icon items-self-center border" />
    <input type="text" placeholder="Search" aria-label="Search" v-model="keyword" @input="resetItems" />
    <button class="btn btn__close justify-self-end items-self-center" @click="clearSearchField">
      <IconsClose />
    </button>
  </form>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.search {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;

  input {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    color: $slate-600;
    padding: 0 0 0 4rem;
  }

  .search-icon,
  .btn {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    border: none;
    padding: 0 1rem;
    width: 4rem;
    height: 4rem;
    fill: $slate-500;
  }
}
</style>
