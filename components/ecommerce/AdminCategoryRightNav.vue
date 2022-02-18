<script setup>
const props = defineProps({
  categories: {
    type: Array,
  },
  category: {
    type: Object,
    required: true,
  },
})
defineEmits(['saveCategory', 'parentCategorySelected'])

const categoryParent = props.category.parent ? ref(props.category.parent._id) : ''

const parentCategoryOptions = computed(() => {
  return props.categories
    .filter((c) => c._id != props.category._id && (!c.parent || (c.parent && c.parent._id != props.category._id)))
    .map((el) => {
      return { key: el._id, name: el.name }
    })
})
</script>

<template>
  <div class="admin-right-nav">
    <div class="save-changes shadow-md">
      <button class="btn btn-primary" @click.prevent="$emit('saveCategory')">Save Changes</button>
    </div>
    <section class="parent shadow-md">
      <header class="admin-section-header">Parent</header>
      <div class="content">
        Please add another category first
        <div class="parent">
          <div class="base-select">
            <select v-model="categoryParent" @change="$emit('parentCategorySelected', categoryParent)">
              <option value="">Select Category</option>
              <option v-for="option in parentCategoryOptions" :value="option.key" :key="option.key">
                {{ option.name }}
              </option>
            </select>
            <label>Category Parent</label>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.admin-right-nav {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .save-changes {
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 5px;
    padding: 2rem 2rem;

    .btn {
      padding: 2rem 3rem;
      border-radius: 5px;
      background-color: $green-800;
      font-size: 1.4rem;
      letter-spacing: 0.15rem;
    }
  }
  .parent {
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

  .sub-categories {
    background-color: white;
    border-radius: 5px;
    padding: 2rem 2rem 4rem;

    .admin-section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
