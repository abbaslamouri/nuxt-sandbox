<script setup>
import { useCart } from '~/store/useCart'

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
})

const cart = useCart()
const listType = ref('tile')
const showSelectQtys = ref([])

for (const prop in props.products) {
  showSelectQtys.value[prop] = false
}

const handleItemQuantitySelected = (event, i) => {
  for (const prop in showSelectQtys.value) {
    showSelectQtys.value[prop] = false
  }
  showSelectQtys.value[i] = event.status
  cart.addItem(props.products[i], event.quantity)
}
</script>

<template>
  <div class="w996">
    <div v-if="products.length">
      <div
        class="header flex-col items-center gap2 p2 text-slate-50 bg-norepeat bg-cover"
        :style="{ backgroundImage: `url('assets/barista-creations-coffee-capsules-desktop2.webp')` }"
      >
        <h3 class="tracking-wider">ISPIRAZIONE ITALIANA</h3>
        <p class="tracking-wide">
          Unique flavors inspired by Italian roasting traditions passed down through generations
        </p>
        <NuxtLink class="flex-row items-center gap1" :to="{ name: 'original-coffee-pods', params: { slug: ' ' } }">
          <span>Discover the range</span>
          <IconsChevronRight class="fill-slate-50" />
        </NuxtLink>
      </div>
      <div class="flex-row wrap">
        <!-- <EcommerceProductsProductCard
          v-for="(product, i) in products"
          :key="product._id"
          :product="product"
          :listType="listType"
          @itemQuantitySelected="handleItemQuantitySelected($event, i)"
          :showSelectQty="showSelectQtys[i]"
        /> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
