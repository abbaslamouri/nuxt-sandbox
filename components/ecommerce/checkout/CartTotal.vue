<script setup>
defineProps({
  showTaxesAndTotal: {
    type: Boolean,
    default: false,
  },
})
const { cart, cartTotal } = useCart()
</script>

<template>
  <div class="cart-total">
    <div class="row">
      <span> Subtotal</span><span class="currency">${{ cartTotal().toFixed(2) }}</span>
    </div>
    <div class="row" v-if="showTaxesAndTotal">
      <span> Estimated Taxes</span>
      <span v-if="cart.taxes" class="currency">${{ cart.taxes.toFixed(2) }}</span>
      <span v-else class="currency">$0.00</span>
    </div>
    <div class="row" v-if="showTaxesAndTotal">
      <span> Total</span>
      <span v-if="cart.taxes" class="currency">${{ (cartTotal() + cart.taxes).toFixed }}</span>
      <span v-else class="currency">${{ cartTotal().toFixed(2) }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.cart-total {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  font-size: 1.4rem;
  border-bottom: 1px solid $stone-300;

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .currency {
    color: $yellow-700;
  }
}
</style>
