<script setup>
import { useCart } from '~/store/useCart'
import { useMessage } from '~/store/useMessage'
import QuantitySelector from './QuantitySelector.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  listType: {
    type: String,
  },
  showSelectQty: {
    type: Boolean,
  },
})

const emit = defineEmits(['selectQuantityBtnClicked', 'closeSelectQuantity', 'itemQuantitySelected'])

const { state, fetchVariants } = useProduct()
const appMessage = useMessage()
const cart = useCart()
const hide = ref(true)
// const quantity = ref(null)
const variants = ref([])
// const showQuantitySelector = ref(false)
// const quantitySelectorPosition = ref(null)

const response = await fetchVariants(props.product._id)
if (state.errorMsg) {
  cart.errorMsg = state.errorMsg
  variants.value = []
} else {
  variants.value = response.docs
}

// const setQuantitySelectorPosition = (event) => {
//   // console.log(event.target)
//   const position = event.target.getBoundingClientRect().y
//   // console.log(position)
//   if (position < 320) quantitySelectorPosition.value = 'below'
//   else quantitySelectorPosition.value = null
//   showQuantitySelector.value = true
//   emit('selectQuantityBtnClicked', !props.showSelectQty)
// }
</script>

<template>
  <div class="product" :class="{ tile: listType === 'tile', list: listType === 'list' }">
    <div class="top">
      <div class="thumb-description" @mouseenter="hide = false" @mouseleave="hide = true">
        <div class="thumb" :class="{ hide: !hide }" v-if="product.gallery.length > 1">
          <img :src="product.gallery[1].path" :alt="`${product.gallery[1].name} Image`" />
        </div>
        <div class="description" :class="{ hide: hide }">{{ product.excerpt }}</div>
      </div>
      <div class="title">
        {{ product.name }}
      </div>
      <div class="roastiness">{{ product.roastiness }}</div>
      <div class="intensity">
        <EcommerceIntensity :intensity="product.intensity" :total="13" v-if="product.intensity" />
      </div>
    </div>
    <div class="bottom">
      <div class="price">
        <div class="regular-price" :class="{ strikeout: product.salePrice }">{{ product.price }}</div>
        <div class="sale-price">{{ product.salePrice }}</div>
      </div>
      <EcommerceQuantitySelector :showSelectQty="showSelectQty" @okBtnClicked="$emit('itemQuantitySelected', $event)" />
      <!-- <div class="quantity-selector">
        <button class="btn btn secondary" @click="setQuantitySelectorPosition"><IconsPlus /></button>
        <div class="quantity-selector" :class="quantitySelectorPosition" v-if="showSelectQty">
          <ul>
            <li v-for="n in 15" :key="`predefined-quantity-${n}`" @click="quantity = (n - 1) * 10">
              <span>
                {{ (n - 1) * 10 }}
              </span>
            </li>
          </ul>
          <div class="cart-quantity">
            <input type="text" v-model="quantity" placeholder="Add custom quantity" />
            <button class="btn btn-secondary" @click="addToCart">OK</button>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.product {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  width: 25%;
  height: 300px;
  border: 1px solid $slate-300;
  padding: 1rem 2rem;
  margin-left: -1px;
  margin-top: -1px;
  padding: 1rem 0;

  .top {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;

    .thumb-description {
      // border: 1px solid red;
      display: grid;
      grid-template-rows: 1fr;
      grid-template-columns: 1fr;
      width: 100%;
      cursor: pointer;
      text-align: center;
      align-items: center;

      .thumb {
        grid-column: 1 / 2;
        grid-row: 1 / 2;
        height: 10rem;

        &.hide {
          display: none;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .description {
        grid-column: 1 / 2;
        grid-row: 1 / 2;
        font-size: 1.4rem;
        height: 10rem;

        display: flex;
        align-items: center;

        &.hide {
          display: none;
        }
      }
    }
    .title {
      font-size: 1.8rem;
      font-weight: 500;
    }

    .attributes {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 0.5rem;
      // border: 1px solid red;
      font-size: 1.3rem;

      .item {
        display: flex;

        .terms {
          font-weight: 500;
        }
      }
    }
  }

  .bottom {
    display: flex;
    align-items: center;
    gap: 2rem;

    .price {
      .regular-price {
        color: $slate-400;
        &.strikeout {
          text-decoration: line-through;
        }
      }
    }

    .quantity-selector {
      position: relative;
      .btn {
        background-color: $green-700;
        padding: 1rem;
        border-radius: 3px;

        svg {
          fill: $slate-50;
        }
      }
      .quantity-selector {
        position: absolute;
        top: -196px;
        left: 50%;
        width: 215px;
        height: 180px;
        // border: 1px solid green;
        transform: translateX(-50%);
        background-color: $stone-200;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 1rem;
        border-radius: 3px;
        z-index: 9;

        &.below {
          top: 130%;

          &::before {
            top: -20px;
            border-color: transparent transparent $stone-200 transparent;
          }
        }

        &::before {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 10px;
          border-style: solid;
          border-color: $stone-200 transparent transparent transparent;
        }
        // padding: 2rem;
        // display: flex;
        // justify-content: center;
        // align-content: flex-start;
        ul {
          width: 100%;
          display: flex;
          // justify-content: center;
          align-items: flex-start;
          flex-wrap: wrap;
          // border: 1px solid red;

          // gap:1rem;

          li {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.2rem;
            width: 40px;
            height: 40px;
            margin-left: -1px;
            margin-top: -1px;
            cursor: pointer;
            border-right: 1px solid $stone-400;
            span {
              padding: 0.5rem;
              border-radius: 3px;
              width: 30px;
              height: 30px;
              text-align: center;
            }

            &:hover {
              span {
                border: 1px solid $stone-400;
              }
            }

            &:nth-of-type(5n) {
              border-right: none;
            }
            // }
          }
        }

        .cart-quantity {
          width: 100%;
          // border:1px solid red;
          display: flex;
          // align-items: center;
          input {
            flex: 1;
            height: 4rem;
            border: $stone-400;
            padding: 0 1rem;
            font-size: 1.2rem;
          }

          .btn {
            color: $slate-50;
          }
        }
      }
    }
  }
}
</style>
