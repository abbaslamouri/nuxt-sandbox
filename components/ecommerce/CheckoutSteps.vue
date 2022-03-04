<script setup>
// import { useAuth } from '~/pinia/useAuth'
// import { useCart } from '~/store/useCart'

defineProps({
  step1: Boolean,
  step2: Boolean,
  step3: Boolean,
  step4: Boolean,
  step5: Boolean,
  activeColor: {
    type: String,
    default: '#FFFFFF',
  },
})
// const auth = useAuth()
// const cart = useCart()

// cart.updateCustomerInfo()
// console.log('AU', auth.user)
// const cart = useCart()
</script>

<template>
  <div>
    <!-- {{ cart.customer }}===={{ cart.items }} -->
    <nav class="steps">
      <div class="step" :class="{ active: step1 }">
        <nuxt-link :to="{ name: 'checkout' }">Shopping Bag</nuxt-link>
        <!-- <a v-else class="disabled">Sign In</a> -->
      </div>
      <div class="step" :class="{ active: step2 }">
        <nuxt-link :to="{ name: 'shipping' }">Shipping</nuxt-link>
        <!-- <a v-else class="disabled">Shipping</a> -->
      </div>
      <div class="step" :class="{ active: step3 }">
        <nuxt-link :to="{ name: 'payment' }">Payment</nuxt-link>
        <!-- <a v-else class="disabled">Payment</a> -->
      </div>
      <div class="step" :class="{ active: step4 }">
        <nuxt-link :to="{ name: 'shipping' }">Review</nuxt-link>
        <!-- <a v-else class="disabled">Place Order</a> -->
      </div>
      <div class="step" :class="{ active: step5 }">
        <nuxt-link :to="{ name: 'shipping' }">Confirmation</nuxt-link>
        <!-- <a v-else class="disabled">Place Order</a> -->
      </div>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.steps {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 3rem 0;
  font-size: 1.6rem;
  width: 100%;
  padding: 1rem 2rem 4rem;

  .step {
    display: flex;
    justify-content: center;
    cursor: pointer;
    flex: 1;
    border-bottom: 0.3rem solid #c0c0c0;
    color: #c0c0c0;
    padding: 2rem;
    cursor: not-allowed;

    &.active {
      border-bottom: 0.3rem solid $green-700;
      border-bottom-color: v-bind(activeColor);
      color: white;
      font-weight: 500;
    }
  }
}
</style>
