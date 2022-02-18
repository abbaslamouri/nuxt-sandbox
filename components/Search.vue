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
  <form class="search base-input shadow-md" @submit.prevent="emitSearchField">
    <button type="submit" class="btn">
      <IconsSearchFill />
    </button>
    <input type="text" placeholder="Search" aria-label="Search" v-model="keyword" @input="resetItems" />
    <button class="btn cancel" @click="clearSearchField">
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
  gap: 0;
  border: 1px solid $slate-400;
  border-radius: 5px;
  font-size: 1.3rem;
  height: 4rem;
  background-color: white;
  color: #fff;
  // min-width: 25rem;

  input {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    border: none;
    width: 100%;
    height: 100%;
    color: $slate-600;
    padding: 0 0 0 4rem;
    &:focus {
      outline: 3px solid $sky-200;
    }
  }

  .btn {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    border: none;
    padding: 0 1rem;
    width: 4rem;
    height: 4rem;

    &.cancel {
      justify-self: flex-end;
    }

    svg {
      fill: $slate-500;
      width: 2rem;
      height: 2rem;
    }
  }
}
</style>
