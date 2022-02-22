<script setup>
import { useStore } from '~/store/useStore'
const store = useStore()
</script>

<template>
  <section class="price shadow-md" id="price">
    <header class="admin-section-header">Price</header>
    <FormsBaseInput label="Price" required currency v-model="store.product.price" />
  </section>
</template>

<style lang="scss" scoped>
.price {
  background-color: white;
  border-radius: 5px;
  padding: 2rem 2rem 4rem;
}
</style>
