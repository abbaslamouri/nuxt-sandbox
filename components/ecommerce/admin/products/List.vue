<script setup>
const props = defineProps({
  products: {
    type: Array,
  },
  totalCount: {
    type: Number,
  },
})
const emit = defineEmits(['deleteProduct'])

const router = useRouter()

// const products = inject('products')
// const totalCount = inject('totalCount')
const showActionKeys = ref([])

const resetActions = () => {
  for (const prop in props.products) {
    showActionKeys.value[prop] = false
  }
}

const setActions = (payload) => {
  resetActions()
  showActionKeys.value[payload.index] = payload.action
}
const handleEditProduct = (slug) => {
  resetActions()
  router.push({ name: 'admin-ecommerce-products-slug', params: { slug } })
}

const handleDeleteProduct = (productId) => {
  resetActions()
  emit('deleteProduct', productId)
}
</script>

<template>
  <div class="shadow-md">
    <div v-if="totalCount">
      <table class="text-xs shadow-md">
        <thead>
          <tr class="bg-slate-200">
            <th>Image</th>
            <th>Product</th>
            <th>Stock Qty.</th>
            <th>Orders</th>
            <th>Sales</th>
            <th class="text-right minw12">actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="product._id">
            <td class="flex-row justify-center">
              <div class="w5 h5">
                <img
                  class="wfull hfull contain"
                  v-if="product.gallery.length && product.gallery[0] && product.gallery[0].mimetype.includes('image')"
                  :src="`${product.gallery[0].path}`"
                />
                <img v-else class="wfull hfull contain" :src="`/placeholder.png`" />
              </div>
            </td>
            <td>{{ product.name }}</td>
            <td class=" ">{{ product.Qty }}</td>
            <td class=" ">{{ product.orders }}</td>
            <td class=" ">{{ product.sales }}</td>
            <td class="minw12">
              <EcommerceAdminActions
                :showAction="showActionKeys[index]"
                :showEdit="true"
                @moreHoriz="setActions({ index: index, action: !showActionKeys[index] })"
                @deleteAction="handleDeleteProduct(product._id)"
                @editAction="handleEditProduct(product.slug)"
              />
              <!-- <div class="menu shadow-md p1 border border-stone-300 font-bold" v-if="showActionsKeys">
                <NuxtLink class="link" :to="{ name: 'admin-ecommerce-products-slug', params: { slug: product.slug } }">
                  Edit
                </NuxtLink>
                <a href="#" class="text-red-700" @click.prevent="showAlert = true">Delete</a>
              </div>
              <button class="btn btn__close p1" @click.prevent="$emit('actionBtnClicked', index)">
                <IconsMoreHoriz />
              </button> -->
            </td>
          </tr>
        </tbody>
      </table>

      <!-- <div class="table admin-products">
        <div class="table__header text-sm py2 px3">
          <div class="row">
            <div class="th">Product</div>
            <div class="th">Stock Qty.</div>
            <div class="th">Orders</div>
            <div class="th">Sales</div>
            <div class="th">actions</div>
          </div>
        </div>
        <div class="table__body bg-slate-50 px2">
          <EcommerceAdminProductsProductCard
            v-for="(product, index) in products"
            v-if="products.length"
            :product="product"
            :index="index"
            :showActionsKeys="showActionsKeys[index]"
            :key="product._id"
            @actionBtnClicked="handleActionBtnClicked"
            @deleteProduct="$emit('deleteProduct', $event)"
          />
          <h2 v-else>There no items that match your criteria</h2>
        </div>
      </div> -->
    </div>
    <div v-else class="h60vh flex-row items-center justify-center shadow-md">
      <div class="empty-categories flex-col gap2 bg-slate-50 p4 br5">
        <h3 class="">Add your first physical or digital product</h3>
        <div class="">Add your product and variants. Products must have at least a name and a price</div>
        <NuxtLink
          class="btn btn__primary btn__pill px3 py05 text-xs items-self-end"
          :to="{ name: 'admin-ecommerce-products-slug', params: { slug: ' ' } }"
        >
          <IconsPlus class="w2 h2" />
          <span>Add</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
