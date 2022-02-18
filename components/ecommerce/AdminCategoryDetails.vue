<script setup>
const props = defineProps({
  category: {
    type: Object,
  },
})
const emit = defineEmits(['detailsEmitted'])
const details = reactive({
  name: props.category.name,
  permalink: props.category.permalink,
  description: props.category.description,
})

watch(
  () => details,
  (current, old) => {
    console.log(current)
    console.log(old)
    emit('detailsEmitted', current)
  },
  { deep: true }
)
</script>

<template>
  <section class="details shadow-md">
    <header class="admin-section-header">Details</header>
    <div class="content">
      <div class="name-permalink">
        <div class="name">
          <FormsBaseInput label="Name" placeholder="Name" required v-model="details.name" />
        </div>
        <div class="permalink">
          <FormsBaseInput label="Permalink" placeholder="Permalink" v-model="details.permalink" />
        </div>
      </div>
      <div class="base-textarea">
        <textarea v-model="details.description" label="Description" placeholder="Description" rows="5"></textarea>
        <label>Description</label>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.details {
  background-color: white;
  border-radius: 5px;
  padding: 2rem 2rem 4rem;

  .content {
    display: flex;
    flex-direction: column;
    gap: 3rem;

    .name-permalink {
      display: flex;
      align-items: center;
      gap: 2rem;
      width: 100%;

      .name,
      .permalink {
        flex: 1;
      }
    }
  }
}
</style>
