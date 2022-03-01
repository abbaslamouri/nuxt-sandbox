<script setup>
import { useCart } from '~/store/useCart'
const cart = useCart()

// const itemsTotal = Math.round((cart.subTotal + Number.EPSILON) * 100) / 100
// const taxes = Math.round((0.11 * cart.subTotal + Number.EPSILON) * 100) / 100
// const shipping = 0
// const total = Math.round((itemsTotal + taxes + shipping + Number.EPSILON) * 100) / 100

const placeOrderHandler = () => {
  const order = {}
  order.items = cart.items
  order.customer = cart.customer
  order.paymentMethod = cart.paymentMethod
  order.subTotal = cart.subTotal
  order.shipping = 0
  order.taxes = 0.11 * cart.subTotal
  order.total = (1 + 0.11) * cart.subTotal + 0
  cart.placeOrder(order)
}
</script>

<template>
  <div class="place-order">
    <!-- {{ cart.customer }} -->
    <ProductsCheckoutSteps :step1="true" :step2="true" :step3="true" :step4="true" />

    <div v-if="!cart.hasItems" class="empty-cart">Your cart is empty</div>
    <main>
      <div class="order-info">
        <div class="shipping">
          <h2>Shipping</h2>
          <p>{{ cart.customer.name }}</p>
          <p>{{ cart.customer.shippingAddress.address }}</p>
          <p>
            {{ cart.customer.shippingAddress.city }}
            {{ cart.customer.shippingAddress.postalCode }}
            {{ cart.customer.shippingAddress.country }}
          </p>
          <p>{{ cart.customer.email }}</p>
        </div>
        <div class="payment-method">
          <h2>Payment Method</h2>
          <p>{{ cart.paymentMethod }}</p>
        </div>
        <div class="order-items">
          <h2>Order Items</h2>
          <div class="item" v-for="item in cart.items" :key="item.product">
            <nuxt-link class="image link" :to="{ name: 'shop-id', params: { id: item.product } }">
              <img :src="item.image" :alt="`${item.name} Product Image`" />
            </nuxt-link>
            <nuxt-link class="name link" :to="{ name: 'shop-id', params: { id: item.product } }">
              {{ item.name }}
            </nuxt-link>
            <div class="quantity">{{ item.quantity }} x</div>
            <div class="line-item-total">${{ item.price }} =</div>
            <div>${{ item.price * item.quantity }}</div>
          </div>
        </div>
      </div>
      <div class="order-summary">
        <h2>Order Summary</h2>
        <p>Items: ${{ (Math.round((cart.subTotal + Number.EPSILON) * 100) / 100).toFixed(2) }}</p>
        <p>Shipping: {{ 0 }}</p>
        <p>Taxes: ${{ (Math.round((0.11 * cart.subTotal + Number.EPSILON) * 100) / 100).toFixed(2) }}</p>
        <p>
          Total: ${{ (Math.round((cart.subTotal + 0.11 * cart.subTotal + 0 + Number.EPSILON) * 100) / 100).toFixed(2) }}
        </p>
      </div>
    </main>
    <button class="btn" @click="placeOrderHandler">Place Order</button>
  </div>
</template>

<style lang="scss" scoped>
.place-order {
  // .empty-cart{

  // }

  main {
    display: flex;
    .order-info {
      .order-items {
        border: 1px solid red;

        grid-column: 1 / 2;
        grid-row: 1 / 2;

        .item {
          display: flex;
          align-items: center;
          gap: 2rem;

          .image {
            width: 10rem;

            img {
              max-width: 100%;
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
    }
  }
}
</style>
