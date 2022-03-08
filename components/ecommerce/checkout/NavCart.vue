<script setup>
import { useCart } from '~/store/useCart'
import { useMessage } from '~/store/useMessage'

const cart = useCart()
const appMessage = useMessage()

onMounted(() => {
  if (process.client && localStorage.getItem('cart')) {
    cart.items = JSON.parse(localStorage.getItem('cart')).items
    cart.customer = JSON.parse(localStorage.getItem('cart')).customer
    cart.shippingMethod = JSON.parse(localStorage.getItem('cart')).shippingMethod
    cart.taxes = JSON.parse(localStorage.getItem('cart')).taxes
    cart.coupons = JSON.parse(localStorage.getItem('cart')).coupons
  }
})
</script>

<template>
  <button
    class="nav-cart btn px2 h3"
    :class="{ btn__checkout: cart.items.length }"
    @click="appMessage.showCartSlideout = true"
  >
    <IconsCartFill class="w2 h2" />
    <span class="text-xs">Your bag</span>
    <span class="badge">({{ cart.numberOfItems }})</span>
  </button>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
</style>
