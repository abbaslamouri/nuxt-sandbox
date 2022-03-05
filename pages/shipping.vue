<script setup>
import { useCart } from '~/store/useCart'
import { useAuth } from '~/store/useAuth'

useMeta({
  title: 'Shipping | YRL',
})
definePageMeta({
  layout: 'checkout',
})

const router = useRouter()
const cart = useCart()
const { state, fetchAll } = useProduct()
const promoCode = ref(null)
const showSelectQtys = ref([])
const shippingOption = ref(null)

// const auth = useAuth()

// if (auth.authenticated) cart.cart.customer = auth.user

const freeSamples = ref([])

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
  // console.log(freeSamples.value)
})

const handleOkBtnClicked = (event, index) => {
  for (const prop in showSelectQtys.value) {
    showSelectQtys.value[prop] = false
  }
  showSelectQtys.value[index] = event.status
  cart.updateItemQuantity(cart.items[index], event.quantity)
}

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
    <div class="checkout-steps">
      <EcommerceCheckoutSteps :step="2" activeColor="#16a34a" />
    </div>
    <div class="content" v-if="cart.items.length">
      <div class="main">
        <!-- <pre class="text-sm">{{ cart.cart }}</pre> -->
        <div class="shipping-address">
          <!-- <div class="promo-code"> -->
          <div class="header">Shipping Address</div>
          <div class="main">
            <div class="title">Address</div>
            <div class="address">
              <div class="name">{{ cart.customer.name }}</div>
              <div class="street">Street</div>
              <div class="city-state-postalCode">
                <span class="city">City</span>, <span class="state">State</span>&nbsp;
                <span class="postal-code">postalCode</span>
              </div>
            </div>
            <p class="info">Currently set as your default address</p>
            <button class="btn btn-secondary edit-address">Add Address</button>
            <button class="btn btn-secondary add-address">Add Address</button>
          </div>
        </div>
        <div class="shipping-options">
          <!-- <div class="promo-code"> -->
          <div class="header">Shipping Options</div>
          <div class="main">
            <div class="deliveries">
              <div class="title">Home and Office Deliveries</div>
              <div class="option free">
                <div class="radio-button">
                  <FormsBaseRadio v-model="shippingOption" value="free" />
                </div>
                <IconsFree />
                <div class="content">
                  <div class="title">Standard - Free (from $35)</div>
                  <div class="details">Arrives in 3 - 5 business days</div>
                </div>
                <div class="cost">Free</div>
              </div>
              <div class="option paid">
                <div class="radio-button">
                  <FormsBaseRadio v-model="shippingOption" value="paid" />
                </div>
                <IconsFree />
                <div class="content">
                  <div class="title">Standard - Paid (from $34.99)</div>
                  <div class="details">Arrives in 1 - 3 business days</div>
                </div>
                <div class="cost">$6.95</div>
              </div>
            </div>
            <div class="pickup">
              <div class="title">Pickup</div>
              <div class="option free">
                <div class="radio-button">
                  <FormsBaseRadio v-model="shippingOption" value="fedexUps" />
                </div>
                <IconsFree />
                <div class="content">
                  <div class="title">Pick Up Point (FedEx or UPS)</div>
                  <div class="details">Arrives in 1 - 3 business days</div>
                  <button class="btn btn-secondary learn-more">Learn More <IconsChevronRight /></button>
                </div>
                <div class="cost">Free</div>
              </div>
              <div class="option paid">
                <div class="radio-button">
                  <FormsBaseRadio v-model="shippingOption" value="Boutique" />
                </div>
                <IconsFree />
                <div class="content">
                  <div class="title">YRL Boutique</div>
                  <div class="details">Immediate. Buy online, pick up in store</div>
                  <div class="learn-more">
                    Ready in-store 2 hours after your order is placed online. Order will be held until store closing the
                    following day. Unclaimed orders will be canceled and refunded 24 hours after purchase.
                  </div>
                </div>
                <div class="cost">$6.95</div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <button class="btn btn-secondary back"><IconsChevronLeft /><span> Back To Basket</span></button>
          <NuxtLink class="link btn btn-primary" :to="{ name: 'shipping' }">
            <span> continue</span><IconsChevronRight />
          </NuxtLink>
        </div>
      </div>
      <div class="aside">
        <div class="intro">Add Free Sample Pack and Recycling Bag</div>
        <div class="free-samples">
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
              <NuxtLink class="link btn btn-primary" :to="{ name: 'shipping' }">
                <span> Proceed to checkout</span><IconsChevronRight />
              </NuxtLink>
              <!-- <button class="btn btn-primary"><span> Proceed to checkout</span><IconsChevronRight /></button> -->
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
      <NuxtLink class="link btn btn-primary" :to="{ name: 'original-coffee-pods' }">
        <span>Start Shopping</span>
      </NuxtLink>
    </div>

    <h2>Shipping Details</h2>
    {{ cart.cart }}
    <!-- <CheckoutSteps :step1="true" :step2="true" /> -->

    <!-- <form @submit.prevent="handleSubmit">
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
    </form> -->
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.shipping {
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

      .shipping-address {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .header {
          background-color: $stone-400;
          padding: 2rem;
          color: $slate-50;
          text-transform: uppercase;
        }

        .main {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 2rem;

          .title {
            text-transform: uppercase;
            color: $stone-500;
            font-size: 1.2rem;
          }
          .address {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            font-size: 1.2rem;
            font-weight: 700;
          }

          .info {
            color: $stone-500;
            font-size: 1.2rem;
          }

          .btn {
            border-radius: 3px;

            &.edit-address {
              color: $yellow-700;
              border: none;
              align-self: flex-start;
              padding: 0;
            }

            &.add-address {
              align-self: flex-end;
              padding: 1rem 2rem;
            }
          }
        }
      }

      .shipping-options {
        // display: flex;
        // flex-direction: column;
        font-size: 1.2rem;
        .header {
          background-color: $stone-400;
          padding: 2rem;
          color: $slate-50;
          text-transform: uppercase;
        }

        .main {
          .deliveries,
          .pickup {
            .title {
              background-color: $stone-300;
              padding: 1rem 2rem;
            }

            .option {
              padding: 1rem 2rem;
              display: flex;
              align-items: center;
              gap: 2rem;
              // border: 1px solid red;

              svg {
                width: 5rem;
                height: 5rem;
              }

              .content {
                display: flex;
                flex-direction: column;
                gap: 0.3rem;

                .title {
                  background-color: transparent;
                  padding: 0;
                  font-size: 1.4rem;
                  font-weight: 600;
                }

                .details {
                  color: $stone-600;
                }

                .btn {
                  padding: 0;
                  border: none;
                  height: fit-content;
                  color: $yellow-700;
                  text-transform: capitalize;

                  svg {
                    width: 1.5rem;
                    height: 1.5rem;
                  }
                }
              }

              .cost {
                color: $yellow-700;
              }
            }
          }
        }
      }

      .footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 2rem;
        display: flex;

        .btn {
          // display:flex;
          // cursor: pointer;
          gap: 2rem;
          padding: 1rem 3rem;
          border-radius: 3px;
          background-color: $green-700;

          &.back {
            padding: 1rem 2rem;
            color: $yellow-700;
            background-color: transparent;
            border: none;

            svg {
              fill: $yellow-700;
            }
          }

          svg {
            fill: $slate-50;
          }
        }
      }

      // <div class="header">Shipping Options</div>
      //     <div class="main">
      //       <div class="deliveries">
      //         <div class="title">Home and Office Deliveries</div>
      //         <div class="free">
      //           <div class="radio-button">
      //             <FormsBaseRadio v-model="shippingOption" value="free" />
      //           </div>
      //           <div class="content">
      //             <div class="title">Standard - Free (from $35)</div>
      //             <div class="details">Arrives in 3--5 business days</div>
      //           </div>
      //           <div class="cost">Free</div>
      //         </div>
      //       </div>
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
    }
  }
}
</style>
