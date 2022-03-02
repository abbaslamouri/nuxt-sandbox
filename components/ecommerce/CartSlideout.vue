<script setup>
import { useCart } from '~/store/useCart'
const cart = useCart()
</script>

<template>
  <Slideout @closeSlideout="cart.showCartSlideout = false" class="cart">
    <template v-slot:header> <h3 class="title">Shoping Bag</h3></template>
    <template v-slot:default>
      <div class="cart-details">
        <div class="top">
          <div class="free-samples-shipping">
            <div class="free-samples">
              <IconsCoffee />
              <div><span class="first">Free Coffee Samples with all orders.</span> <span>Add at Checkout</span></div>
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
                  <div class="price">${{ item.price }}</div>
                </div>
              </div>
              <div class="quantity">{{ item.quantity }}</div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="total">
            <div>Total</div>
            <div class="cart-total">${{ cart.total.toFixed(2) }}</div>
          </div>
          <p class="info">(Shipping costs, special offers not included)</p>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="actions shadow-md">
        <button class="btn btn-primary">Checkout</button>
      </div>
    </template>
  </Slideout>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.cart {
  .cart-details {
    // border: 1px solid green;
    height: 100%;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 3rem;

    .top {
      display: flex;
      flex-direction: column;
      gap: 3rem;
      .free-samples-shipping {
        display: flex;
        flex-direction: column;
        gap: 1.6rem;

        .free-samples {
          display: flex;
          align-items: center;
          gap: 2rem;

          svg {
            width: 4rem;
            height: 4rem;
          }

          .first {
            // font-size: 1.6rem;
            font-weight: 600;
          }
        }

        .free-shipping {
          display: flex;
          align-items: center;
          gap: 2rem;
          // font-size: 2rem;
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

            .name-price {
              font-size: 1.2rem;

              .name {
                font-weight: 500;
              }

              .price {
                color: $yellow-700;
              }
            }
          }

          .quantity {
            background-color: $green-700;
            color: $slate-50;
            padding: 1.5rem;
            border-radius: 5px;
          }
        }
      }
    }

    .bottom {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .total {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .cart-total {
          color: $yellow-700;
          font-size: 1.4rem;
        }
      }

      .info {
        font-size: 1.2rem;
      }
    }
  }
  .actions {
    // border:1px solid red;
    display: flex;
    .btn {
      flex:1;
      border-radius: 5px;
      background-color: $green-700;
      font-size: 1.4rem;
      padding: 1.5rem;
    }
  }
}
</style>
