<script setup>
import { useCart } from '~/store/useCart'
import { useAuth } from '~/store/useAuth'
// import { useMessage } from '~/store/useMessage'

defineProps({
  item: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
})

useMeta({
  title: 'Checkout | YRL',
})
definePageMeta({
  layout: 'checkout',
})

// const { state, fetchAll } = useProduct()
const route = useRoute()
const cart = useCart()
// const auth = useAuth()
// const appMessage = useMessage()
const showSelectQtys = ref([])
// const promoCode = ref(null)
// const coupon = ref('')

// const freeSamples = ref([])

// onMounted(async () => {
//   const response = await fetchAll()
//   if (state.errorMsg) {
//     appMessage.errorMsg = state.errorMsg
//   } else {
//     for (const prop in response.docs) {
//       if (response.docs[prop].categories.map((g) => g.slug).includes('free-samples'))
//         freeSamples.value.push(response.docs[prop])
//     }
//   }
//   // console.log(freeSamples.value)
// })

// if (auth.authenticated) cart.cart.customer = auth.user

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
// // products.value = response.docs
// for (const prop in products.value) {
//   showSelectQtys.value[prop] = false
// }

// console.log(products.value)

const handleOkBtnClicked = (event, index) => {
  for (const prop in showSelectQtys.value) {
    showSelectQtys.value[prop] = false
  }
  showSelectQtys.value[index] = event.status
  cart.updateItemQuantity(cart.items[index], event.quantity)
}

// const handleCheckout = async () => {
//   if (auth.authenticated) {
//     // console.log(auth.user)
//     // cart.updateCustomerInfo(auth.user)
//     await cart.saveCart()
//     router.push({ name: 'shipping' })
//   } else {
//     router.push('/secure?redirect=/shipping')
//   }
// }

// const applyCoupon = () => {
//   coupon.value = ''
// }
</script>

<template>
  <div class="cart-card">
    <div class="image-name td">
      <div class="image">
        <img :src="item.thumb ? item.thumb.path : '/placeholder.png'" :alt="` ${item.name} Photo`" />
      </div>
      <h4 class="name">{{ item.name }}</h4>
    </div>
    <div class="price td">${{ item.price.toFixed(2) }}</div>
    <div class="quantity td" v-if="!item.categories.map((g) => g.slug).includes('free-samples')">
      <EcommerceQuantitySelector
        class="cart"
        :item="item"
        :minVal="0"
        :maxVal="140"
        :stepVal="10"
        :showSelectQty="showSelectQtys[index]"
        :btnText="item.quantity"
        @okBtnClicked="handleOkBtnClicked($event, index)"
      />
    </div>
    <div class="quantity td" v-else>
      <EcommerceQuantitySelector
        v-if="item.slug === 'recycling-bag'"
        class="cart"
        :item="item"
        :minVal="0"
        :maxVal="4"
        :stepVal="1"
        :showSelectQty="showSelectQtys[index]"
        :btnText="item.quantity"
        @okBtnClicked="handleOkBtnClicked($event, index)"
      />
      <button v-else class="btn btn-secondary free-sample-single">{{ item.quantity }}</button>
    </div>
    <div class="line-item-total td">${{ (item.quantity * item.price).toFixed(2) }}</div>
    <div class="trash td" @click="cart.removeItem(item)"><IconsClose /></div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.cart-card {
  border-bottom: 1px solid $stone-200;
  .image-name {
    .image {
      width: 4rem;
      height: 4rem;

      img {
        width: 100%;
      }
    }

    .name {
      font-weight: 600;
    }
  }

  .price {
    color: $yellow-700;
  }

  .quantity {
    .free-sample-single {
      // background-color: $green-700;
      border-radius: 3px;
      padding: 1.5rem;
      // color: $slate-50;
      cursor: not-allowed;

      svg {
        fill: $slate-50;
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  }

  .trash {
    cursor: pointer;
    svg {
      width: 1.5rem;
      height: 1.5rem;
      fill: $slate-600;
    }
  }
}
</style>
