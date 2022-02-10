<script setup>
const perfectNesChoices = ref(['', '', ''])
const showCoffeeOptions = ref(false)
const showRoastOptopns = ref(false)
const showPerfectForOptopns = ref(false)
</script>

<template>
  <div class="home">
    <WelcomeOfferBand />
    <HeroBanner />
    <PromoBar />
    <ProductPathway />
    <GuidedSelling />
    <div style="height: 300px; background-color: black">
      <img src="assets/venezia-title.svg" alt="" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
.home {
  min-height: 100vh;
}
</style>
