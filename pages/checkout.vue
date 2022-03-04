<script setup>
import { useCart } from '~/store/useCart'
import { useAuth } from '~/store/useAuth'

const router = useRouter()
const cart = useCart()
const auth = useAuth()
const showSelectQtys = ref([])
const promoCode = ref(null)

const coupon = ref('')

onMounted(() => {
  // console.log(JSON.parse(localStorage.getItem('cart')))
})

// if (auth.authenticated) cart.cart.customer = auth.user

const handleOkBtnClicked = (event, index) => {
  console.log(event, index)
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

    <div class="content">
      <div class="main">
        <pre class="text-sm">{{ cart.cart }}</pre>

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
                <h3 class="name">{{ item.name }}</h3>
              </div>
              <div class="price td">${{ item.price.toFixed(2) }}</div>
              <div class="quantity td">
                <EcommerceQuantitySelector
                  class="cart"
                  :item="item"
                  :showSelectQty="showSelectQtys[index]"
                  :btnText="item.quantity"
                  @okBtnClicked="handleOkBtnClicked($event, index)"
                />
              </div>
              <div class="line-item-total td">${{ (item.quantity * item.price).toFixed(2) }}</div>
              <div class="trash td" @click="cart.removeItem(item)"><IconsClose /></div>
            </div>
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
            <div class="cart-subtotal">
              <span> Subtotal</span><span>{{ cart.total.toFixed(2) }}</span>
            </div>
            <div class="cart-taxes">
              <span> Estimated Taxes</span>
              <span v-if="cart.taxes">{{ cart.taxes.toFixed(2) }}</span>
              <span v-else>0.00</span>
            </div>
            <div class="cart-total">
              <span> Total</span>
              <span v-if="cart.taxes">{{ (cart.total + cart.taxes).toFixed }}</span>
              <span v-else>{{ cart.total.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- <h2>Shopping Cart</h2> -->
        <!-- <div v-if="!cart.hasItems">
          <div>Your cart is empty</div>
          <nuxt-link class="link" :to="{ name: 'index' }">
            <div>Continue shopping</div>
          </nuxt-link>
          <router-link class="link" :to="{ name: 'index' }">Start Shopping Now</router-link>
        </div> -->
        <!-- <div v-else class="cart-details">
          <div class="items"></div>
          <div class="total">
            <div>{{ cart.numberOfItems }} items</div>
            <div class="total">${{ typeof cart.total }}ppppp</div>
            <nuxt-link :to="{ name: 'shipping' }"></nuxt-link>
            <button class="btn" @click="handleCheckout">Proceed to checkout</button>
            <button class="btn" @click="">Empty Cart</button>
          </div>
          <div>
            <FormsBaseInput type="text" label="Coupon" v-model="coupon" />
            <button class="btn" @click="applyCoupon">Apply Coupon</button>
          </div>
        </div> -->
      </div>
      <div class="aside">Asidedsffsdfsd</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.checkout {
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
            }

            .price {
              color: $yellow-700;
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

      .promo-code {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding: 2rem 0;
        font-size: 1.4rem;

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
              // border: 1px solid red;
            }
          }
        }
      }
    }
    .aside {
      background-color: $slate-50;
      flex: 1;
    }
  }
  h2 {
    margin-bottom: 2rem;
  }
  font-size: 1.6rem;
  padding: 4rem;

  .cart-details {
    // border: 1px solid red;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 2fr 1fr;
    gap: 4rem;
    .items {
      // border: 1px solid red;

      grid-column: 1 / 2;
      grid-row: 1 / 2;

      .item {
        display: flex;
        align-items: center;
        gap: 2rem;

        .image {
          width: 10rem;

          img {
            width: 100%;
          }
        }

        .name {
          flex: 1;
        }

        .quantity {
          .btn {
            padding: 1rem;
            margin: 0 1rem;

            &:disabled {
              cursor: not-allowed;
            }
          }
        }

        .trash {
          svg {
            fill: #d9534f;
            cursor: pointer;
          }
        }
      }
    }

    .total {
      // border: 1px solid red;

      grid-column: 2 / 3;
      grid-row: 1 / 2;
    }
  }

  .btn {
    align-self: flex-start;
    &.link {
      &:hover {
        background-color: rgba(24, 103, 192, 0.1);
      }
    }
  }
}
</style>
