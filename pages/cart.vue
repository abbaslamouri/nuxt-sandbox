<script setup>
import { useCart } from '~/store/useCart'
import { useAuth } from '~/store/useAuth'

const router = useRouter()
const cart = useCart()
const auth = useAuth()

const coupon = ref('')

onMounted(() => {
  console.log(JSON.parse(localStorage.getItem('cart')))
})

// if (auth.authenticated) cart.cart.customer = auth.user

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
  <div class="cart">
    <pre class="text-sm">{{ cart.cart }}</pre>
    <h2>Shopping Cart</h2>
    <div v-if="!cart.hasItems">
      <div>Your cart is empty</div>
      <nuxt-link class="link" :to="{ name: 'index' }">
        <div>Continue shopping</div>
      </nuxt-link>
      <router-link class="link" :to="{ name: 'index' }">Start Shopping Now</router-link>
    </div>
    <div v-else class="cart-details">
      <div class="items">
        <div class="item" v-for="item in cart.items" :key="item.product">
          <div class="image">
            <nuxt-link class="link" :to="{ name: 'index', params: { slug: item.slug } }">
              <img
                :src="item.featuredImage ? item.featuredImage.path : '/placeholder.png'"
                :alt="` ${item.name} Photo`"
              />
            </nuxt-link>
          </div>
          <h3 class="name">
            <nuxt-link class="link" :to="{ name: 'index', params: { slug: item.slug } }">
              {{ item.name }}
            </nuxt-link>
          </h3>
          <h4 class="price">${{ item.price }}</h4>
          <div class="quantity">
            <button class="btn" :disabled="item.quantity <= 1" @click="cart.decrementItemCount(item)">-</button>
            <span>{{ item.quantity }}</span>
            <button class="btn" :disabled="item.quantity >= item.countInStock" @click="cart.incrementItemCount(item)">
              +
            </button>
          </div>
          <!-- <div class="line-item-total">{{ Math.round((item.quantity * item.price + Number.EPSILON) * 100) / 100 }}</div> -->
          <div class="line-item-total">${{ item.quantity * item.price }}</div>

          <div class="trash" @click="cart.removeItem(item)"><IconsDeleteFill /></div>
        </div>
      </div>
      <div class="total">
        <div>{{ cart.numberOfItems }} items</div>
        <div class="total">${{ cart.total }}</div>
        <nuxt-link :to="{ name: 'shipping' }"></nuxt-link>
        <button class="btn" @click="handleCheckout">Proceed to checkout</button>
        <button class="btn" @click="">Empty Cart</button>
      </div>
      <div>
        <FormsBaseInput type="text" label="Coupon" v-model="coupon" />
        <button class="btn" @click="applyCoupon">Apply Coupon</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cart {
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
