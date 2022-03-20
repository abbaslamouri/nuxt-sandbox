<script setup>
const { cart } = useCart()
</script>

<template>
  <div class="flex-1 flex-col items-center bg-slate-900 p3">
    <div class="w996">
      <div><EcommerceCheckoutSteps :step="1" /></div>
      <div class="flex-row items-start gap2 w996" v-if="cart.items.length">
        <div class="flex-1 bg-slate-50 flex-col gap2">
          <EcommerceCheckoutProductList />
          <nuxt-link class="link" :to="{ name: 'ecommerce-products' }">
            <IconsChevronLeft />
            <div>Continue Shopping</div>
          </nuxt-link>
          <EcommerceCheckoutCoupons />
          <div class="px3">
            <EcommerceCheckoutCartTotal :showTaxesAndTotal="true" />
          </div>
          <div class="px3 py2 items-self-end">
            <NuxtLink class="btn btn__checkout text-xs" :to="{ name: 'ecommerce-shipping' }">
              <span> Proceed to checkout</span><IconsChevronRight />
            </NuxtLink>
          </div>
        </div>
        <!-- <EcommerceCheckoutFreeItems /> -->
      </div>
      <EcommerceCheckoutEmptyCart v-else class="bg-slate-50 p3" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
