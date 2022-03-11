<script setup>
import { useStore } from '~/store/useStore'

defineEmits(['saveProduct', 'productCategoriesUpdated', 'productStatusUpdated'])

// const prodState = inject('prodState')
// const prodActions = inject('prodActions')
// const catState = inject('catState')

const router = useRouter()
const store = useStore()

const selectedCategoryIds = ref([])
const nameInputRef = ref(null)
const priceInputRef = ref(null)
const productCategories = ref([])
const productStatus = ref(true)

selectedCategoryIds.value = [
  ...store.product.categories.map((c) => {
    return c._id
  }),
]

const setProductCategories = () => {
  // prodState.selectedItem.categories = []
  // // console.log(selectedCategories.value)
  // for (const prop in selectedCategories.value) {
  //   prodState.selectedItem.categories.push(catState.items.find((c) => c._id == selectedCategories.value[prop]))
  // }
}

// Update product categories
const updateProductCategories = (event) => {
  store.product.categories = []
  for (const prop in selectedCategoryIds.value) {
    const category = store.categories.find((c) => c._id == selectedCategoryIds.value[prop])
    store.product.categories.push(category)
  }
}
</script>

<template>
  <div class="admin-right-nav">
    <!-- {{ selectedCategoryIds }}==={{ store.product.categories }} -->
    <div class="save-changes shadow-md">
      <button class="btn btn-primary" @click.prevent="$emit('saveProduct')">Save Changes</button>
      <FormsBaseToggle v-model="productStatus" label="Active" @update:modelValue="$emit('saveProduct')" />
    </div>
    <div class="categories shadow-md">
      <header class="admin-section-header">Categories</header>
      <div class="category-list">
        <FormsBaseSelectMultiple
          v-model="selectedCategoryIds"
          @update:modelValue="updateProductCategories"
          label="Select
        Categories"
          :options="
            store.categories.map((c) => {
              return { key: c._id, name: c.name }
            })
          "
        />
      </div>
      <NuxtLink class="link" :to="{ name: 'admin-ecommerce-categories' }">
        <span>Edit Categories</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.admin-right-nav {
  .save-changes {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: white;
    border-radius: 5px;
    padding: 2rem 2rem;

    .btn {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
  }

  .categories {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;
    background-color: white;
    border-radius: 5px;
    padding: 2rem 2rem;

    .category-list {
      width: 100%;
    }
  }

  // w-1/4 border shadow-lg bg-white rounded py-4 px-4
}
</style>
