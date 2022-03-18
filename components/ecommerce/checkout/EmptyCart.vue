<script setup>
import { useMessage } from '~/store/useMessage'
const appMessage = useMessage()
</script>

<template>
  <div class="empty-cart flex-col gap2 justify-center items-center">
    <p>You have no items in your bag</p>
    <NuxtLink
      class="btn btn__checkout py1 px3 text-sm"
      :to="{ name: 'ecommerce-products' }"
      @click="appMessage.showCartSlideout = false"
    >
      <span>Start Shopping</span>
    </NuxtLink>
  </div>
</template>

<style lang="scss" scoped></style>
