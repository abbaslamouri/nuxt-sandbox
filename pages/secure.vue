<script setup>
import { useAuth } from '~/store/useAuth'
import { useCart } from '~/store/useCart'
// import { useMainStore } from '~/myStore/useMain'

const router = useRouter()
const route = useRoute()

const auth = useAuth()
const cart = useCart()
// const mainStore = useMainStore()

console.log(router)
console.log(route.query)

const user = reactive({
  email: 'axl@yrlus.com',
  password: 'adrar0714',
})

const handleLogin = async () => {
  // mainStore.setSnackbar({ show: false })
  await auth.login(user)
  if (!auth.errorMsg) {
    // console.log(route.query.redirect)
    // cart.updateCustomerInfo({
    //   _id: auth.user._id,
    //   name: auth.user.name,
    //   email: auth.user.email,
    //   shippingAddress: { ...auth.user.shippingAddress },
    // })
    router.push(route.query.redirect)
  } else {
    // mainStore.setSnackbar({ show: true, message: auth.errorMsg })
  }
}

const handleGuestCheckout = () => {
  router.push(route.query.redirect)
}
</script>

<!-- <script>
export default {
  layout: '',
}
</script> -->

<template>
  <main class="auth-wrap">
    <form @submit.prevent="handleLogin">
      {{ cart.customer }}===={{ cart.items }}
      <h2>Returning Customers</h2>
      <FormsBaseInput
        type="email"
        label="Email"
        icon="envelope"
        v-model="user.email"
        leadingIcon="IconsPersonFill"
        trailingIcon="IconsPersonFill"
        :required="true"
        minlength="8"
        maxlength="25"
        hint="Enter a valid email"
      />
      <FormsBaseInput
        type="password"
        label="Password"
        icon="lock"
        v-model="user.password"
        leadingIcon="IconsHttpsFill"
        trailingIcon="IconsVisibilityFill"
        alternateTrailingIcon="IconsVisibilityOffFill"
        :required="true"
        minlength="8"
        maxlength="25"
      />
      <button class="btn submit primary">Sign In</button>
      <p><NuxtLink class="nuxt-link" :to="{ name: `auth-forgot-password` }">Forgot Password?</NuxtLink></p>
    </form>
    <button class="btn submit primary" @click="handleGuestCheckout">Checkout as a guest</button>
  </main>
</template>

<style lang="scss" scoped></style>
