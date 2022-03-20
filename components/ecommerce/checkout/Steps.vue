<script setup>
defineProps({
  step: Number,
})
</script>

<template>
  <div class="w-full">
    <!-- {{ cart.customer }}===={{ cart.items }} -->
    <nav class="steps flex-row items-center justify-evenly text-sm px2 py2 pb4">
      <div class="step" :class="{ active: step === 1, completed: step > 1 }">
        <div class="top">Step 1<IconsCheck v-if="step > 1" /></div>
        <nuxt-link :to="{ name: 'ecommerce-checkout' }">Shopping Bag</nuxt-link>
        <!-- <a v-else class="disabled">Sign In</a> -->
      </div>
      <div class="step" :class="{ active: step === 2, completed: step > 2 }">
        <div class="top">Step 2<IconsCheck v-if="step > 2" /></div>
        <nuxt-link :to="{ name: 'ecommerce-shipping' }">Shipping</nuxt-link>
        <!-- <a v-else class="disabled">Shipping</a> -->
      </div>
      <div class="step" :class="{ active: step === 3, completed: step > 3 }">
        <div class="top">Step 3<IconsCheck v-if="step > 3" /></div>
        <nuxt-link :to="{ name: 'ecommerce-payment' }">Payment</nuxt-link>
        <!-- <a v-else class="disabled">Payment</a> -->
      </div>
      <div class="step" :class="{ active: step === 4, completed: step > 4 }">
        <div class="top">Step 4<IconsCheck v-if="step > 4" /></div>
        <nuxt-link :to="{ name: 'ecommerce-shipping' }">Review</nuxt-link>
        <!-- <a v-else class="disabled">Place Order</a> -->
      </div>
      <div class="step" :class="{ active: step === 5, completed: step > 5 }">
        <div class="top">Step 5<IconsCheck v-if="step > 4" /></div>
        <nuxt-link :to="{ name: 'ecommerce-shipping' }">Confirmation</nuxt-link>
        <!-- <a v-else class="disabled">Place Order</a> -->
      </div>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.steps {
  .step {
    cursor: pointer;
    flex: 1;
    border-bottom: 0.3rem solid $slate-400;
    color: $slate-300;
    font-weight: 500;
    height: 5rem;

    &.active {
      border-bottom: 0.3rem solid $green-700;

      color: white;
      font-weight: 500;
    }

    &.completed {
      border-bottom-color: $green-700;
    }

    .top {
      display: flex;
      align-items: center;
      gap: 1rem;

      svg {
        fill: $green-700;
      }
    }
  }
}
</style>
