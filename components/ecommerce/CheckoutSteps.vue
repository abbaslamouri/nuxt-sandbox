<script setup>
// import { useAuth } from '~/pinia/useAuth'
// import { useCart } from '~/store/useCart'

defineProps({
  step: Number,

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
      <div class="step" :class="{ active: step === 1, completed: step > 1 }">
        <div class="top">Step 1<IconsCheck v-if="step > 1" /></div>
        <nuxt-link :to="{ name: 'checkout' }">Shopping Bag</nuxt-link>
        <!-- <a v-else class="disabled">Sign In</a> -->
      </div>
      <div class="step" :class="{ active: step === 2, completed: step > 2 }">
        <div class="top">Step 2<IconsCheck v-if="step > 2" /></div>
        <nuxt-link :to="{ name: 'shipping' }">Shipping</nuxt-link>
        <!-- <a v-else class="disabled">Shipping</a> -->
      </div>
      <div class="step" :class="{ active: step === 3, completed: step > 3 }">
        <div class="top">Step 3<IconsCheck v-if="step > 3" /></div>
        <nuxt-link :to="{ name: 'payment' }">Payment</nuxt-link>
        <!-- <a v-else class="disabled">Payment</a> -->
      </div>
      <div class="step" :class="{ active: step === 4, completed: step > 4 }">
        <div class="top">Step 4<IconsCheck v-if="step > 4" /></div>
        <nuxt-link :to="{ name: 'shipping' }">Review</nuxt-link>
        <!-- <a v-else class="disabled">Place Order</a> -->
      </div>
      <div class="step" :class="{ active: step === 5, completed: step > 5 }">
        <div class="top">Step 5<IconsCheck v-if="step > 4" /></div>
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
    flex-direction: column;
    gap: 0.25rem;
    justify-content: center;
    cursor: pointer;
    flex: 1;
    border-bottom: 0.3rem solid $slate-400;
    color: $slate-300;
    // padding: 2rem;
    font-weight: 500;
    // border: 1px solid red;
    height: 10rem;

    &.active {
      border-bottom: 0.3rem solid $slate-400;
      border-bottom-color: v-bind(activeColor);

      color: white;
      font-weight: 500;
    }

    &.completed {
      border-bottom-color: v-bind(activeColor);
    }

    .top {
      display: flex;
      align-items: center;
      gap: 1rem;

      svg {
        fill: $green-600;
      }
    }
  }
}
</style>
