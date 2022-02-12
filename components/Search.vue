<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'handleSubmit'])

const inputRef = ref('')

const handleInput = () => {
  emit('handleSubmit', inputRef.value.value)
}

const resetItems = () => {
  if (!inputRef.value.value) emit('handleSubmit', inputRef.value.value)
}
</script>

<template>
  <form class="search base-input shadow-md" @submit.prevent="handleInput">
    <button type="submit" class="btn">
      <IconsSearchFill />
    </button>
    <input type="text" placeholder="Search" aria-label="Search" @input="resetItems" ref="inputRef" />
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
  min-width: 25rem;

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

    svg {
      fill: $slate-500;
      width: 2rem;
      height: 2rem;
    }
  }
}
</style>
