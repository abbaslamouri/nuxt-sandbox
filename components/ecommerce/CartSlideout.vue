<script setup>
import { useStore } from '~/store/useStore'
import { useAuth } from '~/store/useAuth'
import { useCart } from '~/store/useCart'
import { useMessage } from '~/store/useMessage'

defineEmits(['saveVariants', 'slideoutEventEmitted'])

const store = useStore()
const auth = useAuth()
const cart = useCart()
const appMessage = useMessage()
const showAlert = ref(false)
const showDeleteAllAttributesAlert = ref(false)
const deletedTerms = ref([])
const current = ref(null)
let response = null
const coupon = ref('')

console.log(JSON.parse(localStorage.getItem('cart')))

const closeSlideout = () => {
  console.log('CLOSE')
  cart.showCartSlideout = false
}
</script>

<template>
  <section class="slideout cart">
    <div class="overlay"></div>
    <div class="slideout__wrapper" @click.self="closeSlideout">
      <transition name="slideout">
        <div class="slideout__content cart" v-if="cart.showCartSlideout">
          <div class="slideout__header shadow-md">
            <h3 class="title">Shoping Bag</h3>
            <button class="btn close"><IconsClose @click="closeSlideout" /></button>
          </div>
          <div class="slideout__main">
            <div class="cart-details">
              <div class="free-samples-shipping">
                <div class="free-samples">
                  <IconsCoffee />
                  <div>
                    <span class="first">Free Coffee Samples with all orders.</span> <span>Add at Checkout</span>
                  </div>
                </div>
                <div class="free-shipping">
                  <IconsShippingFilled />
                  <span>Free shipping from $35</span>
                </div>
              </div>
              <div class="cart-items">
                <div class="item" v-for="(item, index) in cart.items" :key="`cart-item-${index}`">
                  <div class="left">
                    <div class="thumb"><img :src="item.thumb.path" /></div>
                    <div class="name-price">
                      <div class="name">{{ item.name }}</div>
                      <div class="price">{{ item.price }}</div>
                    </div>
                  </div>
                  <div class="quantity">{{ item.quantity }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="slideout__footer actions shadow-md">
            <button class="btn btn-primary">Checkout</button>
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.cart {
  .cart-details {
    // border: 1px solid red;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 3rem;

    .free-samples-shipping {
      display: flex;
      flex-direction: column;
      gap: 2rem;

      .free-samples {
        display: flex;
        align-items: center;
        gap: 2rem;

        svg {
          width: 4rem;
          height: 4rem;
        }

        .first {
          font-size: 2rem;
          font-weight: 600;
        }
      }

      .free-shipping {
        display: flex;
        align-items: center;
        gap: 2rem;
        font-size: 2rem;
      }
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      // gap: 2rem;
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid $stone-300;
        border-bottom: 1px solid $stone-300;
        padding: 1rem 0;
        margin-top: -1px;

        .left {
          display: flex;
          align-items: center;
          gap: 2rem;

          .thumb {
            width: 5rem;
            height: 5rem;

            img {
              max-width: 100%;
              object-fit: contain;
            }
          }
        }

        .quantity{
          background-color: $green-700;
          color: $slate-50;
          padding:1.5rem;
          border-radius:5px;
        }
      }
    }
  }
  .actions {
    // border:1px solid red;
    display:flex;
    .btn{
      flex:1;
      border-radius:5px;
      background-color:$green-700;
      font-size:1.4rem;
      padding:1.5rem
    }
  }
}
</style>
