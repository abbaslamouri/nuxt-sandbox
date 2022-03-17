<script setup>
const props = defineProps({
  categories: {
    type: Array,
  },
  totalCount: {
    type: Number,
  },
})
const emit = defineEmits(['deleteCategory'])

const router = useRouter()

const showActionKeys = ref([])

const resetActions = () => {
  for (const prop in props.categories) {
    showActionKeys.value[prop] = false
  }
}

const setActions = (payload) => {
  resetActions()
  showActionKeys.value[payload.index] = payload.action
}
const handleEditProduct = (slug) => {
  resetActions()
  router.push({ name: 'admin-ecommerce-categories-slug', params: { slug } })
}

const handleDeleteCategory = (categoryId) => {
  resetActions()
  emit('deleteCategory', categoryId)
}
</script>

<template>
  <div>
    <div v-if="totalCount">
      <table class="text-xs shadow-md">
        <thead>
          <tr class="bg-slate-200">
            <th>Order</th>
            <th>Image</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Parent</th>
            <th class="text-right minw12">actions</th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="(category, index) in categories" :key="category._id">
            <td>{{ category.categoryOrder }}</td>
            <td class="flex-row justify-center">
              <div class="w5 h5">
                <img
                  class="wfull hfull contain"
                  v-if="
                    category.gallery.length && category.gallery[0] && category.gallery[0].mimetype.includes('image')
                  "
                  :src="`${category.gallery[0].path}`"
                />
                <img v-else class="wfull hfull contain" :src="`/placeholder.png`" />
              </div>
            </td>
            <td>
              <div class="flex-col items-center">
                <div class="flex-row items-center" v-for="item in category.children">
                  {{ category.name }} -> {{ item.name }}
                  <div class="flex-row items-center" v-for="child in item.children">
                    -> {{ child.name }}
                    <div class="flex-row items-center" v-for="grandChild in child.children">
                      -> {{ grandChild.name }}
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td>{{ category.slug }}</td>
            <td>
              <span v-if="category.parent">
                {{ category.parent.name }}
              </span>
              <span v-else>-</span>
            </td>
            <td class="minw12">
              <EcommerceAdminActions
                :showAction="showActionKeys[index]"
                :showEdit="true"
                @moreHoriz="setActions({ index: index, action: !showActionKeys[index] })"
                @deleteAction="handleDeleteCategory(category._id)"
                @editAction="handleEditProduct(category.slug)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="h60vh flex-row items-center justify-center shadow-md">
      <div class="empty-categories flex-col gap2 bg-slate-50 p4 br5">
        <h3 class="">Add categories and subcategories</h3>
        <div class="">Create nested product categories with category images and descriptions</div>
        <NuxtLink
          class="btn btn__primary btn__pill px3 py05 text-xs items-self-end"
          :to="{ name: 'admin-ecommerce-products-slug', params: { slug: ' ' } }"
        >
          <IconsPlus class="w2 h2" />
          <span>Add</span>
        </NuxtLink>
      </div>
    </div>

    <div v-else class="h60vh flex-row items-center justify-center shadow-md">
      <div class="empty-categories flex-col gap2 bg-slate-50 p4 br5">
        <h3 class="">Add categories and subcategories</h3>
        <div class="">Create nested product categories with category images and descriptions</div>
        <NuxtLink
          class="btn btn__primary btn__pill px3 py05 text-xs items-self-end"
          :to="{ name: 'admin-ecommerce-categories-slug', params: { slug: ' ' } }"
        >
          <IconsPlus class="w2 h2" />
          <span>Add</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
