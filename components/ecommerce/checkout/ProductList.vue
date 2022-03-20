<script setup>
// import { useCart } from '~/store/useCart'
// import { useAuth } from '~/store/useAuth'
// import { useMessage } from '~/store/useMessage'

defineProps({
  // item: {
  // 	type: Object,
  // 	required: true,
  // },
  // index: {
  // 	type: Number,
  // 	required: true,
  // },
})

useMeta({
  title: 'Checkout | YRL',
})
definePageMeta({
  layout: 'checkout',
})

// const { state, fetchAll } = useProduct()
const route = useRoute()
const { cart, updateItemQuantity } = useCart()
// const auth = useAuth()
// const appMessage = useMessage()
// const resetSelectQtyKeys = ref([])

const showSelectQtyKeys = ref([])

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
//   resetSelectQtyKeys.value[prop] = false
// }

// console.log(products.value)

const resetSelectQtyKeys = () => {
  for (const prop in cart.value.items) {
    showSelectQtyKeys.value[prop] = false
  }
}

const handleOkBtnClicked = (event, index) => {
  resetSelectQtyKeys()
  showSelectQtyKeys.value[index] = event.status
  updateItemQuantity(cart.value.items[index], event.quantity)
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
  <div>
    <table class="collapses text-sm">
      <thead class="bg-stone-200">
        <tr>
          <th>Item</th>
          <th>Unit Price</th>
          <th>Quantity</th>
          <th>Total</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in cart.items" :key="item.product">
          <td>
            <div class="flex-row gap1 items-center">
              <div class="w4 h4">
                <img
                  class="w-full hfull contain"
                  :src="item.thumb ? item.thumb.path : '/placeholder.png'"
                  :alt="` ${item.name} Photo`"
                />
              </div>
              <h4 class="">{{ item.name }}</h4>
            </div>
          </td>
          <td class="text-yellow-700">${{ item.price.toFixed(2) }}</td>
          <td>
            <div class="flex-row justify-center">
              <EcommerceCheckoutQuantitySelector
                class="cart"
                :item="item"
                :minVal="0"
                :maxVal="140"
                :stepVal="10"
                :showSelectQty="showSelectQtyKeys[index]"
                :btnText="item.quantity"
                @okBtnClicked="handleOkBtnClicked($event, index)"
                @cancel="resetSelectQtyKeys"
              />
            </div>
          </td>
          <!-- <td class="quantity td" v-else>
            <EcommerceCheckoutQuantitySelector
              v-if="item.slug === 'recycling-bag'"
              class="cart"
              :item="item"
              :minVal="0"
              :maxVal="4"
              :stepVal="1"
              :showSelectQty="showSelectQtyKeys[index]"
              :btnText="item.quantity"
              @okBtnClicked="handleOkBtnClicked($event, index)"
              @cancel="resetSelectQtyKeys"
            />
            <button v-else class="btn btn-secondary free-sample-single">{{ item.quantity }}</button>
          </td> -->
          <td class="text-yellow-700">${{ (item.quantity * item.price).toFixed(2) }}</td>
          <td class="" @click="removeItem(item)"><IconsClose class="w2 h2 fill-slate-400" /></td>
        </tr>
      </tbody>
    </table>
    <!-- <div class="table__header bg-stone-300 py2 px2">
      <div class="row">
        <div class="th">Item</div>
        <div class="th">Unit Price</div>
        <div class="th">Quantity</div>
        <div class="th">Total</div>
        <div class="th"></div>
      </div>
    </div>
    <div class="table__body py2 px2">
      <div class="row" v-for="(item, index) in cart.items" :key="item.product" :item="item" :index="index">
        <div class="td py1">
          <div class="w4 h4">
            <img
              class="w-full hfull contain"
              :src="item.thumb ? item.thumb.path : '/placeholder.png'"
              :alt="` ${item.name} Photo`"
            />
          </div>
          <h4 class="name">{{ item.name }}</h4>
        </div>
        <div class="price td">${{ item.price.toFixed(2) }}</div>
        <div class="quantity td" v-if="!item.categories.map((g) => g.slug).includes('free-samples')">
          <EcommerceCheckoutQuantitySelector
            class="cart"
            :item="item"
            :minVal="0"
            :maxVal="140"
            :stepVal="10"
            :showSelectQty="resetSelectQtyKeys[index]"
            :btnText="item.quantity"
            @okBtnClicked="handleOkBtnClicked($event, index)"
          />
        </div>
        <div class="quantity td" v-else>
          <EcommerceCheckoutQuantitySelector
            v-if="item.slug === 'recycling-bag'"
            class="cart"
            :item="item"
            :minVal="0"
            :maxVal="4"
            :stepVal="1"
            :showSelectQty="resetSelectQtyKeys[index]"
            :btnText="item.quantity"
            @okBtnClicked="handleOkBtnClicked($event, index)"
          />
          <button v-else class="btn btn-secondary free-sample-single">{{ item.quantity }}</button>
        </div>
        <div class="line-item-total td">${{ (item.quantity * item.price).toFixed(2) }}</div>
        <div class="trash td" @click="cart.removeItem(item)"><IconsClose /></div>
      </div>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

td {
  padding: 2rem;
  border-bottom: 1px solid $stone-300;
}

.checkout-product-list {
  td {
    border: 1px solid red;
  }
  .table__body {
    .row {
      border-bottom: 1px solid $stone-200;
    }
  }

  .row {
    // border-bottom: 1px solid $stone-200;

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
}
</style>
