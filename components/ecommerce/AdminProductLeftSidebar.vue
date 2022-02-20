<script setup>
defineProps({
  product: {
    type: Object,
  },
})
const nav = ref([
  { key: 'details', title: 'Details', open: true },
  { key: 'price', title: 'Price', open: false },
  { key: 'image-gallery', title: 'Image Gallery', open: false },
  { key: 'attributes', title: 'Attributes', open: false },
  { key: 'variants', title: 'Variants', open: false },
  { key: 'shipping-options', title: 'Shipping Options', open: false },
  { key: 'digital-delivery', title: 'Digital Delivery', open: false },
  { key: 'extra-fields', title: 'Extra Fields', open: false },
  { key: 'seo', title: 'SEO', open: false },
  { key: 'misc', title: 'Misc', open: false },
])
</script>

<template>
  <ul class="admin-product-nav">
    <li v-for="navItem in nav" :key="navItem">
      <a :href="`#${navItem.key}`">{{ navItem.title }}</a>
    </li>
    <!-- <pre style="font-size: 1rem">{{ product }}</pre> -->
  </ul>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.admin-product-nav {
  li {
    padding: 0.5rem 1rem;
    transition: all 0.3s ease;
    border-radius: 2px;
    &:hover {
      background-color: $slate-200;
    }
  }
}
</style>
