<script setup>
useMeta({
  title: 'Products | YRL',
})

const { fetchAll } = useFactory()
const { errorMsg, message, alert } = useAppState()
const params = {
  fields:
    'name, slug, productType, price, salePrice, permalink, categories, excerpt, description, intensity, roastiness, attributes, gallery, manageInventory',
}

const products = ref([])
const slides = ref(['/assets/vday-d-3.webp', '/assets/dott-baristatray-choco.webp'])

const response = await fetchAll('products', params)
products.value = response.docs
// for (const prop in response.docs) {
//   if (!response.docs[prop].categories.map((g) => g.slug).includes('free-samples'))
//     products.value.push(response.docs[prop])
// }
</script>

<template>
  <div class="flex-1 flex-col items-center">
    <section class="w996">
      <Carousel :slides="slides" indicators controls interval="5" height="10" />
    </section>
    <EcommerceProductsHero />
    <EcommerceProductsFiltersAndViews />
    <EcommerceProductsList :products="products" />
  </div>
</template>

<style lang="scss" scoped></style>
