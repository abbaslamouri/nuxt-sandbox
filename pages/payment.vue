<script setup>
// import { useCart } from '~/store/useCart'
// import { useAuth } from '~/store/useAuth'

// const router = useRouter()
// const cart = useCart()
// const auth = useAuth()

const paymentOptions = ref([
  { value: 'stripe', label: 'Credit Cars (Stripe)' },
  { value: 'check', label: 'Check' },
])

// if (auth.authenticated) cart.cart.customer = auth.user

const handleSubmit = () => {
  // cart.updatePaymentMethod()
  // router.push({ name: 'shop-placeOrder' })
}
</script>

<template>
  <div class="payment">
    <!-- <ProductsCheckoutSteps :step1="true" :step2="true" :step3="true" />
    <h1>Payment Method</h1>
    <div class="content flex gap-10">
      <form class="border" @submit.prevent="handleSubmit">
        <FormsBaseRadioGroup v-model="cart.cart.paymentMethod" name="payment-methods" :options="paymentOptions" />
        <button class="btn">Continue</button>
      </form>
      <div class="order-summary border flex-1 border-red-300">
        <div class="item w-full flex justify-around border items-center" v-for="item in cart.items" :key="item.product">
          <div class="image w-48">
            <img
              :src="item.featuredImage ? item.featuredImage.path : '/placeholder.png'"
              :alt="` ${item.name} Photo`"
            />
          </div>
          <h3 class="name">
            {{ item.name }}
          </h3>
          <h4 class="price">${{ item.price }}</h4>
          <div class="quantity">
            <span>{{ item.quantity }}</span>
          </div>
          <div class="line-item-total">{{ item.quantity * item.price }}</div>
        </div>
        <div>
          {{ cart.total }}
        </div>
      </div>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.payment {
  font-size: 1.6rem;
}
</style>
