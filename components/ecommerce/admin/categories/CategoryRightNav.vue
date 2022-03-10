<script setup>
defineEmits(['saveCategory'])

const state = inject('state')
const fetchAll = inject('fetchAll')

await fetchAll()

const parentCategoryOptions = computed(() => {
  return state.value.docs
    .filter((c) => c._id != state.value.doc._id && (!c.parent || (c.parent && c.parent._id != state.value.doc._id)))
    .map((el) => {
      return { key: el._id, name: el.name }
    })
})
</script>

margin-bottom: 2rem; text-transform: uppercase; border-bottom: 1px solid $slate-200; padding-bottom: 0.5rem; display:
inline-block; font-weight: 500; font-size: 1.4rem; margin-bottom: 1rem;

<template>
  <div class="flex-col gap2">
    <div class="p2 br5 shadow-md">
      <button class="btn btn__checkout wfull py3" @click.prevent="$emit('saveCategory')">Save Changes</button>
    </div>
    <section class="bg-white p2 br5 shadow-md">
      <header class="admin-section-header">Parent</header>
      <div class="flex-col gap3">
        <p v-if="state.docs.length == 0">Please add another category first</p>
        <FormsBaseSelect
          v-else
          v-model="state.doc.parent"
          label="Parent Category"
          :options="parentCategoryOptions"
          nullOption="Select Category"
        />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped></style>
