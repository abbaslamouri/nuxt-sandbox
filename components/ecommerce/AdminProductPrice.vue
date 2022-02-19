<script setup>
const props = defineProps({
  product: {
    type: Object,
  },
})
const emit = defineEmits(['productPriceEmitted'])
const productPrice = reactive({
  price: props.product.price,
})

watch(
  () => productPrice,
  (current) => {
    console.log(current)
    emit('productPriceEmitted', current)
  },
  { deep: true }
)
</script>

<template>
  <section class="price shadow-md" id="price">
    <header class="admin-section-header">Price</header>
    <FormsBaseInput label="Price" required currency v-model="productPrice.price" />
  </section>
</template>

<style lang="scss" scoped>
.price {
  background-color: white;
  border-radius: 5px;
  padding: 2rem 2rem 4rem;
}
</style>
