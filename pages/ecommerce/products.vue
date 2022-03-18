<script setup>
// import { useMessage } from '~/store/useMessage'

useMeta({
  title: 'Products | YRL',
})
definePageMeta({
  // layout: 'admin',
})

const { errorMsg, message, alert, fetchAll } = useFactory()
const params = {
  fields:
    'name, slug, productType, price, salePrice, permalink, categories, excerpt, description, intensity, roastiness, attributes, gallery, manageInventory',
}

// const { state, fetchAll } = useProduct()
// const appMessage = useMessage()

const products = ref([])
const slides = ref(['/assets/vday-d-3.webp', '/assets/dott-baristatray-choco.webp'])

const response = await fetchAll('products', params)
products.value = response.docs
console.log(products.value)
// for (const prop in response.docs) {
//   if (!response.docs[prop].categories.map((g) => g.slug).includes('free-samples'))
//     products.value.push(response.docs[prop])
// }
</script>

<template>
  <div class="flex1 flex-col items-center">
    <section class="w996">
      <Carousel :slides="slides" indicators controls interval="5" height="10" />
    </section>
    <EcommerceProductsHero />
    <EcommerceProductsFiltersAndViews />
    <EcommerceProductsList :products="products" />
  </div>
</template>

<style lang="scss" scoped></style>
