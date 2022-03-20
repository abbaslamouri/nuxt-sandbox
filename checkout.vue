<script setup>
// import { useCart } from '~/store/useCart'
// import { useAuth } from '~/store/useAuth'
// import { useMessage } from '~/store/useMessage'

// useMeta({
//   title: 'Checkout | YRL',
// })
// definePageMeta({
//   layout: 'checkout',
// })

// const { state, fetchAll } = useProduct()
// const router = useRouter()
// const cart = useCart()
// const auth = useAuth()
// const appMessage = useMessage()

// const freeSamples = ref([])

// onMounted(async () => {
// const response = await fetchAll()
// if (state.errorMsg) {
//   appMessage.errorMsg = state.errorMsg
// } else {
//   for (const prop in response.docs) {
//     if (response.docs[prop].categories.map((g) => g.slug).includes('free-samples'))
//       freeSamples.value.push(response.docs[prop])
//   }
// }
// console.log(freeSamples.value)
// })

// const handleCheckout = async () => {
// if (auth.authenticated) {
//   await cart.saveCart()
//   router.push({ name: 'shipping' })
// } else {
//   router.push('/secure?redirect=/shipping')
// }
// }
</script>

<template>
  <div class="flex-1 flex-col items-center bg-slate-900 p3">
    <!-- <div class="w996">
      <div><EcommerceCheckoutSteps :step="1" /></div>
      <div class="flex-row items-start gap2 w996" v-if="cart.items.length">
        <div class="flex-1 bg-slate-50 flex-col gap2">
          <EcommerceCheckoutProductList />
          <nuxt-link class="link" :to="{ name: 'ecoomerce-products' }">
            <IconsChevronLeft />
            <div>Continue Shopping</div>
          </nuxt-link>
          <EcommerceCheckoutCoupons />
          <div class="px3">
            <EcommerceCheckoutCartTotal :showTaxesAndTotal="true" />
          </div>
          <div class="px3 py2 items-self-end">
            <NuxtLink class="btn btn__checkout text-xs" :to="{ name: 'shipping' }">
              <span> Proceed to checkout</span><IconsChevronRight />
            </NuxtLink>
          </div>
        </div>
        <EcommerceCheckoutFreeItems />
      </div>
      <EcommerceCheckoutEmptyCart v-else class="bg-slate-50 p3" />
    </div> -->
  </div>
</template>

<style lang="scss" scoped></style>
