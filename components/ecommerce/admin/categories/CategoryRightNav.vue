<script setup>
const props = defineProps({
  categories: {
    type: Array,
  },
})
defineEmits(['saveCategory'])

const { category } = useStore()

const parentCategoryOptions = computed(() => {
  return props.categories
    .filter((c) => c._id != category.value._id && (!c.parent || (c.parent && c.parent._id != category.value._id)))
    .map((el) => {
      return { key: el._id, name: el.name }
    })
})
</script>

<template>
  <div class="flex-col gap2">
    <div class="p2 br5 shadow-md">
      <button class="btn btn__checkout wfull py3" @click.prevent="$emit('saveCategory')">Save Changes</button>
    </div>
    <section class="bg-white p2 br5 shadow-md">
      <header class="admin-section-header">Parent</header>
      <div class="flex-col gap3">
        <p v-if="categories.length == 0">Please add another category first</p>
        <FormsBaseSelect
          v-else
          v-model="category.parent"
          label="Parent Category"
          :options="parentCategoryOptions"
          nullOption="Select Category"
        />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped></style>
