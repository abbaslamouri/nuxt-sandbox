<script setup>
import { useCart } from '~/store/useCart'
import { useAuth } from '~/store/useAuth'

const router = useRouter()
const cart = useCart()
// const auth = useAuth()

// if (auth.authenticated) cart.cart.customer = auth.user

const handleSubmit = async () => {
  // cart.updateCustomerInfo()
  // cart.updateCustomerInfo(cart.customer)
  await cart.saveCart()
  router.push({ name: 'payment' })
}
</script>

<!-- <script>
export default {
  layout: 'basir',
}
</script> -->

<template>
  <div class="shipping">
    <h2>Shipping Details</h2>
    {{ cart.cart }}
    <ProductsCheckoutSteps :step1="true" :step2="true" />

    <form @submit.prevent="handleSubmit">
      <FormsBaseInput
        type="text"
        label="Name"
        icon="envelope"
        v-model="cart.customer.name"
        leadingIcon="IconsPersonFill"
        :required="true"
        minlength="8"
        maxlength="25"
        hint="Enter a valid email"
      />
      <FormsBaseInput
        type="email"
        label="Email"
        icon="envelope"
        v-model="cart.customer.email"
        leadingIcon="IconsPersonFill"
        :required="true"
        minlength="8"
        maxlength="25"
        hint="Enter a valid email"
      />
      <FormsBaseInput
        type="text"
        label="Address"
        icon="envelope"
        v-model="cart.customer.shippingAddress.address"
        leadingIcon="IconsPersonFill"
        :required="true"
        minlength="8"
        maxlength="25"
        hint="Enter a valid email"
      />
      <FormsBaseInput
        type="text"
        label="City"
        icon="envelope"
        v-model="cart.customer.shippingAddress.city"
        leadingIcon="IconsPersonFill"
        :required="true"
        minlength="8"
        maxlength="25"
        hint="Enter a valid email"
      />
      <FormsBaseInput
        type="text"
        label="Postal Code"
        icon="envelope"
        v-model="cart.customer.shippingAddress.postalCode"
        leadingIcon="IconsPersonFill"
        :required="true"
        minlength="8"
        maxlength="25"
        hint="Enter a valid email"
      />
      <FormsBaseInput
        type="text"
        label="Country"
        icon="envelope"
        v-model="cart.customer.shippingAddress.country"
        leadingIcon="IconsPersonFill"
        :required="true"
        minlength="8"
        maxlength="25"
        hint="Enter a valid email"
      />

      <button class="btn">Continue</button>
    </form>
  </div>
</template>

<style lang="scss" scoped></style>
