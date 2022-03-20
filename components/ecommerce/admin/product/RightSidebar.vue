<script setup>
defineEmits(['saveProduct', 'productCategoriesUpdated', 'productStatusUpdated'])

const { product } = useStore()
const { fetchAll } = useFactory()

const selectedCategoryIds = ref([])

const allCategories = (await fetchAll(`categories`, { fields: 'name, slug, permalink, description, parent, gallery' }))
  .docs

selectedCategoryIds.value = product.value.categories
  ? [
      ...product.value.categories.map((c) => {
        return c._id
      }),
    ]
  : []

// Update product categories
const updateProductCategories = (event) => {
  product.value.categories = []
  for (const prop in selectedCategoryIds.value) {
    const category = allCategories.find((c) => c._id == selectedCategoryIds.value[prop])
    product.value.categories.push(category)
  }
}
</script>

<template>
  <div class="flex-col gap2">
    <section class="shadow-md w-full bg-white p2 br5" id="details">
      <div class="flex-col gap2">
        <div class="flex-col gap2">
          <button class="btn btn__checkout" @click.prevent="$emit('saveProduct')">Save Changes</button>
          <FormsBaseToggle v-model="product.status" label="Active" />
        </div>
      </div>
    </section>
    <section class="shadow-md w-full bg-white p2 br5" id="details">
      <div class="flex-row items-center justify-between text-sm mb1">
        <div class="uppercase inline-block border-b-stone-300 font-bold pb05">Categories</div>
        <div></div>
      </div>
      <div class="flex-col gap2">
        <div class="">
          <FormsBaseSelectMultiple
            v-model="selectedCategoryIds"
            @update:modelValue="updateProductCategories"
            label="Select Categories"
            :options="
              allCategories.map((c) => {
                return { key: c._id, name: c.name }
              })
            "
          />
        </div>
        <NuxtLink class="link" :to="{ name: 'admin-ecommerce-categories' }">
          <span>Edit Categories</span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped></style>
