<script setup>
// import { useCart } from '~/store/useCart'
// import { useAuth } from '~/store/useAuth'
// import { useMessage } from '~/store/useMessage'
const showCartSlideout = ref(false)

// const router = useRouter()
// const cart = useCart()
// const auth = useAuth()
// const appMessage = useMessage()

// const handleCheckoutBtnClick = async () => {
// appMessage.showCartSlideout = false
// if (auth.authenticated) {
//   appMessage.errorMsg = null
//   try {
//     const response = await $fetch('/api/v1/users', { params: { id: auth.user._id } })
//     cart.updateCartCustomer(response)
//   } catch (error) {
//     appMessage.errorMsg = error.data
//     return false
//   }
//   router.push({ name: 'checkout' })
// } else {
//   router.push({ name: 'auth-secure' })
// }
// }
</script>

<template>
  <Slideout @closeSlideout="showCartSlideout = false" class="cart">
    <!-- <template v-slot:header>
      <h3 class="cart__title">Shoping Bag</h3>
    </template>
    <template v-slot:default>
      <div class="cart__details flex-col gap3 p2">
        <div class="promo-items flex-col gap1 px3">
          <div class="flex-row gap1 items-center">
            <IconsCoffee />
            <div><span class="font-bold">Free Coffee Samples with all orders.</span> <span>Add at Checkout</span></div>
          </div>
          <div class="flex-row gap1 items-center">
            <IconsShippingFilled />
            <span>Free shipping from $35</span>
          </div>
        </div>
        <template v-if="cart.items.length">
          <EcommerceCheckoutCartItemList />
          <EcommerceCheckoutCartTotal />
          <p class="text-xs">(Shipping costs, special offers not included)</p>
        </template>
        <template v-else>
          <EcommerceCheckoutEmptyCart />
        </template>
      </div>
    </template>
    <template v-slot:footer>
      <div class="flex-row justify-end px3" v-if="cart.items.length">
        <button class="btn btn__checkout px3 py1" @click="handleCheckoutBtnClick">Checkout</button>
      </div>
    </template> -->
  </Slideout>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
</style>
