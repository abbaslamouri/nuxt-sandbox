<script setup>
const { cart, numberOfItems } = useCart()
const { showCartSlideout } = useAppState()

onMounted(() => {
  if (process.client && localStorage.getItem('cart')) {
    cart.value = JSON.parse(localStorage.getItem('cart'))
  }
})
</script>

<template>
  <div class="border border-slate-50 br3">
    <button class="btn px2 h3 gap05" :class="{ btn__checkout: numberOfItems() }" @click="showCartSlideout = true">
      <IconsCartFill class="w2 h2" />
      <span class="text-xs">Your bag</span>
      <span class="badge">({{ numberOfItems() }})</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
</style>
