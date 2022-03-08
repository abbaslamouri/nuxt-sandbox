<script setup>
import { useMessage } from '~/store/useMessage'

const { state, fetchAll } = useProduct()
const appMessage = useMessage()

const products = ref([])
const slides = ref(['assets/vday-d-3.webp', 'assets/dott-baristatray-choco.webp'])

const response = await fetchAll()
if (state.errorMsg) {
  appMessage.errorMsg = state.errorMsg
  products.value = []
} else {
  for (const prop in response.docs) {
    if (!response.docs[prop].categories.map((g) => g.slug).includes('free-samples'))
      products.value.push(response.docs[prop])
  }
}
</script>

<template>
  <div class="flex1 flex-col items-center">
    <section class="w996">
      <Carousel :slides="slides" indicators controls interval="5" height="10" />
    </section>
    <EcommerceProductsHero />
    <EcommerceProductsFiltersAndViews :hasProducts="!!products.length" />
    <EcommerceProductsList :products="products" />
  </div>
</template>

<style lang="scss" scoped></style>
