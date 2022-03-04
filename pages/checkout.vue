<script setup>
import { useCart } from '~/store/useCart'
import { useAuth } from '~/store/useAuth'
import { useMessage } from '~/store/useMessage'

useMeta({
  title: 'Checkout | YRL',
})
definePageMeta({
  layout: 'checkout',
})

const { state, fetchAll } = useProduct()
const router = useRouter()
const cart = useCart()
const auth = useAuth()
const appMessage = useMessage()
const showSelectQtys = ref([])
const promoCode = ref(null)
const freeSamples = ref([])

const coupon = ref('')

onMounted(async () => {
  const response = await fetchAll()
  if (state.errorMsg) {
    appMessage.errorMsg = state.errorMsg
  } else {
    for (const prop in response.docs) {
      if (response.docs[prop].categories.map((g) => g.slug).includes('free-samples'))
        freeSamples.value.push(response.docs[prop])
    }
  }
  console.log(freeSamples.value)
})

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

const handleCheckout = async () => {
  if (auth.authenticated) {
    // console.log(auth.user)
    // cart.updateCustomerInfo(auth.user)
    await cart.saveCart()
    router.push({ name: 'shipping' })
  } else {
    router.push('/secure?redirect=/shipping')
  }
}

const applyCoupon = () => {
  coupon.value = ''
}
</script>

<template>
  <div class="checkout">
    <div class="checkout-steps">
      <EcommerceCheckoutSteps step1 activeColor="#15803d" />
    </div>
    <div class="content" v-if="cart.items.length">
      <div class="main">
        <!-- <pre class="text-sm">{{ cart.cart }}</pre> -->

        <div class="intro">
          <IconsErrorFilled />
          <p>Your shopping bag has been updated.</p>
        </div>
        <div class="table shopping-bag">
          <div class="table__header">
            <div class="row">
              <div class="th">Item</div>
              <div class="th">Unit Price</div>
              <div class="th">Quantity</div>
              <div class="th">Total</div>
              <div class="th"></div>
            </div>
          </div>
          <div class="table__body">
            <div class="item row" v-for="(item, index) in cart.items" :key="item.product">
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
          </div>
          <nuxt-link class="link continue-shopping" :to="{ name: 'original-coffee-pods' }">
            <IconsChevronLeft />
            <div>shopping</div>
          </nuxt-link>
          <div class="promo-code-total">
            <div class="promo-code">
              <div class="header">Promo Code</div>
              <div class="main">
                <div class="title">Enter promo code</div>
                <form>
                  <div class="input">
                    <FormsBaseInput
                      label="Promo Code"
                      placeholder="Promo Code"
                      v-model="promoCode"
                      hint="Please enter a valid coupon code"
                    />
                  </div>
                  <button class="btn bttn-secondary">Apply Coupon</button>
                </form>
              </div>
            </div>
            <div class="total">
              <div class="cart-subtotal row">
                <span> Subtotal</span><span class="currency">${{ cart.total.toFixed(2) }}</span>
              </div>
              <div class="cart-taxes row">
                <span> Estimated Taxes</span>
                <span v-if="cart.taxes" class="currency">${{ cart.taxes.toFixed(2) }}</span>
                <span v-else class="currency">$0.00</span>
              </div>
              <div class="cart-total row">
                <span> Total</span>
                <span v-if="cart.taxes" class="currency">${{ (cart.total + cart.taxes).toFixed }}</span>
                <span v-else class="currency">${{ cart.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
          <div class="footer">
            <button class="btn btn-primary"><span> Proceed to checkout</span><IconsChevronRight /></button>
          </div>
        </div>
      </div>
      <div class="aside">
        <div class="intro">Add Free Sample Pack and Recycling Bag</div>
        <div class="free-samples">
          <div v-for="freeSample in freeSamples" :key="freeSample._id">
            <div class="row" v-if="!cart.items.find((item) => item.product == freeSample._id)">
              <div class="product">
                <div class="image">
                  <img
                    v-if="freeSample.gallery[1]"
                    :src="freeSample.gallery[1].path"
                    :alt="`${freeSample.gallery[1].name} Image`"
                  />
                  <img
                    v-else-if="freeSample.gallery[0]"
                    :src="freeSample.gallery[0].path"
                    :alt="`${freeSample.gallery[0].name} Image`"
                  />
                  <img v-else src="placeholder.png" :alt="`Placeholder Image`" />
                </div>
                <div class="title">
                  <p>{{ freeSample.name }}</p>
                </div>
              </div>
              <div class="quantity">
                <div class="price">$0.00</div>
                <button class="btn btn-secondary" @click="cart.addItem(freeSample, 1)"><IconsPlus /></button>
              </div>
            </div>
          </div>
        </div>
        <div class="nyc">
          <h3>NYC: No Bag Needed</h3>
          <p>Just place used capsules in your blue recycling bin</p>
        </div>
      </div>
    </div>
    <div v-else class="empty-cart">
      <p>You have no items in your bag</p>
      <NuxtLink
        class="link btn btn-primary"
        :to="{ name: 'original-coffee-pods' }"
        @click="cart.showCartSlideout = false"
      >
        <span>Start Shopping</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.checkout {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $slate-900;
  width: 100%;

  .checkout-steps {
    width: 996px;
    color: $slate-50;
    background-color: $slate-700;
  }

  .empty-cart {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    background-color: $slate-50;
    width: 996px;
    padding: 3rem;
    font-size: 2rem;

    border: 1px solid red;
    .link {
      // align-self: stretch;
      border-radius: 5px;
      padding: 1rem 3rem;
      background-color: $green-700;
      font-size: 1.4rem;
    }
  }

  .content {
    display: flex;
    align-items: flex-start;
    gap: 2rem;
    width: 996px;

    .main {
      width: 655px;
      background-color: $slate-50;

      .intro {
        padding: 2rem;
        display: flex;
        align-items: center;
        gap: 2rem;
        color: $yellow-700;

        svg {
          width: 4rem;
          height: 4rem;
          fill: $yellow-700;
        }
      }

      .shopping-bag {
        .table__body {
          .row {
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
        }
      }

      .continue-shopping {
        display: flex;
        align-items: center;
        padding: 1rem 2rem;
        color: $yellow-700;

        svg {
          fill: $yellow-700;
        }
      }

      .promo-code-total {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .promo-code {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 2rem 0;
          font-size: 1.4rem;
          border-bottom: 1px solid $stone-300;

          .header {
            background-color: $stone-300;
            padding: 2rem;
          }

          .main {
            display: flex;
            align-items: center;
            gap: 2rem;
            padding: 2rem;

            form {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 3rem;
              // border: 1px solid green;

              .input {
                width: 100%;
                // border: 1px solid red;
              }

              .btn {
                min-width: 15rem;
                width: 15rem;
                align-self: center;
                border-radius: 3px;
                padding: 1rem 3rem;
                // border: 1px solid red;
              }
            }
          }
        }

        .total {
          // border:1px solid red;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          font-size: 1.2rem;
          border-bottom: 1px solid $stone-300;

          .cart-total {
            font-size: 1.6rem;
            font-weight: 500;
          }

          .row {
            // border:1px solid red;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .currency {
            color: $yellow-700;
          }
        }
      }

      .footer {
        padding: 2rem;
        display: flex;
        justify-content: flex-end;

        .btn {
          // display:flex;
          cursor: pointer;
          gap: 2rem;
          padding: 1rem 3rem;
          border-radius: 3px;
          background-color: $green-700;

          svg {
            fill: $slate-50;
          }
        }
      }
    }
    .aside {
      background-color: $slate-50;
      flex: 1;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;

      .intro {
        text-align: center;
        font-weight: 700;
        letter-spacing: 0.15rem;
      }

      .free-samples {
        .row {
          border-bottom: 1px solid $stone-300;

          .product {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .image {
              width: 10rem;
              height: 10rem;

              img {
                max-width: 100%;
                object-fit: contain;
              }
            }

            .title {
              font-size: 1.4rem;
              font-weight: 700;
            }
          }

          .quantity {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 2rem 2rem;

            .btn {
              background-color: $green-700;
              border-radius: 3px;
              padding: 1rem;

              svg {
                fill: $slate-50;
                width: 1.5rem;
                height: 1.5rem;
              }
            }
          }
        }
      }

      .nyc {
        display:flex;
        flex-direction: column;
        align-items: center;
        gap:2rem;
        h3 {
          font-size: 2rem;
        }
        p{
          text-align: center;
        }
      }
    }
  }
}
</style>
