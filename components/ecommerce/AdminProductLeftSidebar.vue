<script setup>
import { useStore } from '~/store/useStore'
const store = useStore()

const nav = ref([
  { key: 'details', title: 'Details', showIf: true },
  { key: 'price', title: 'Price', showIf: true },
  { key: 'image-gallery', title: 'Image Gallery', showIf: true },
  { key: 'attributes', title: 'Attributes', showIf: !!store.product._id },
  { key: 'variants', title: 'Variants', showIf: !!(store.product._id && store.product.attributes.length) },
  { key: 'shipping-options', title: 'Shipping Options', showIf: true },
  { key: 'digital-delivery', title: 'Digital Delivery', showIf: true },
  { key: 'extra-fields', title: 'Extra Fields', showIf: true },
  { key: 'seo', title: 'SEO', showIf: true },
  { key: 'misc', title: 'Misc', showIf: true },
])
</script>

<template>
  <ul class="admin-product-nav">
    <li v-for="navItem in nav" :key="navItem" :class="{ hide: !navItem.showIf }">
      <a :href="`#${navItem.key}`">{{ navItem.title }}</a>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.admin-product-nav {
  li {
    padding: 0.5rem 1rem;
    transition: all 0.3s ease;
    border-radius: 2px;

    &.hide {
      display: none;
    }
    &:hover {
      background-color: $slate-200;
    }
  }
}
</style>
