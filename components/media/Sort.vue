<script setup>
const props = defineProps({
  mediaSortField: {
    type: String,
  },
  mediaSortOrder: {
    type: String,
  },
})

const emit = defineEmits(['toggleMediaSort'])

const sort = reactive({
  field: props.mediaSortField,
  order: props.mediaSortOrder,
})

const sortByOptions = [
  { key: 'name', name: 'Filename' },
  { key: 'size', name: 'File size' },
  { key: 'dateCreated', name: 'Date Created' },
]

watch(
  () => sort,
  (sortVal) => {
    // console.log(sortVal)
    emit('toggleMediaSort', sortVal)
  },
  { deep: true }
)
</script>

<template>
  <div class="sort">
    <div class="sort-field">
      <FormsBaseSelect :options="sortByOptions" v-model="sort.field" label="Sort by" />
    </div>
    <div class="sort-order" @click="toggleSort">
      <span>Sort Order</span>
      <button class="btn" @click="sort.order == '-' ? (sort.order = ``) : (sort.order = `-`)">
        <IconsSouth v-if="sort.order == '-'" />
        <IconsNorth v-else />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.sort {
  display: flex;
  align-items: center;
  gap: 2rem;
  font-size: 1.2rem;

  .sort-field {
    min-width: 15rem;
  }

  .sort-order {
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
}
</style>
