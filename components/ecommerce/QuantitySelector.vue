<script setup>
import { useCart } from '~/store/useCart'
import { useMessage } from '~/store/useMessage'

const props = defineProps({
  // item: {
  //   type: Object,
  //   // required: true,
  // },
  btnText: {
    type: [String, Number],
  },

  showSelectQty: {
    type: Boolean,
  },
})

const emit = defineEmits(['okBtnClicked'])
const cart = useCart()

const quantity = ref(null)
const showQuantitySelector = ref(false)
const quantitySelectorPosition = ref(null)

const setQuantitySelectorPosition = (event) => {
  const position = event.target.getBoundingClientRect().y
  if (position < 320) quantitySelectorPosition.value = 'below'
  else quantitySelectorPosition.value = null
  showQuantitySelector.value = true
  emit('okBtnClicked', { status: !props.showSelectQty, quantity: null })
}

const handleQuantityBtnClick = (qty) => {
  emit('okBtnClicked', { status: false, quantity: qty })
  // if (quantity === null) return
  // cart.updateItemQuantity(props.item, quantity.value)
  // if (quantity.value === 0) cart.items.splice(props.index, 1)
  // else cart.items[props.index].quantity = quantity.value
  quantity.value = null
}

// const handleQuantityBoxClick = (n) => {
//   quantity.value = (n - 1) * 10
//   emit('okBtnClicked', false)
//   // cart.updateItemQuantity(props.item, (n - 1) * 10)

//   // if (quantity.value === 0) cart.items.splice(props.index, 1)
//   // else cart.items[props.index].quantity = quantity.value
//   quantity.value = null
// }
</script>

<template>
  <div class="quantity-selector">
    <button class="btn btn secondary" @click="setQuantitySelectorPosition">
      <div class="btn-text" v-if="btnText">{{ btnText }}</div>
      <IconsPlus v-else />
    </button>
    <div class="selector" :class="quantitySelectorPosition" v-if="showSelectQty">
      <ul>
        <li v-for="n in 15" :key="`predefined-quantity-${n}`" @click="handleQuantityBtnClick((n - 1) * 10)">
          <span>
            {{ (n - 1) * 10 }}
          </span>
        </li>
      </ul>
      <div class="cart-quantity">
        <input
          type="text"
          v-model="quantity"
          placeholder="Add custom quantity"
          @change="handleQuantityBtnClick(quantity)"
        />
        <button class="btn btn-secondary" @click="handleQuantityBtnClick(quantity)">OK</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
.quantity-selector {
  position: relative;
  .btn {
    background-color: $green-700;
    padding: 1rem;
    border-radius: 3px;
    width: 5rem;
    height: 5rem;
    .btn-text {
      color: $slate-50;
      font-size: 1.2rem;
    }

    svg {
      fill: $slate-50;
    }
  }
  .selector {
    position: absolute;
    top: -196px;
    left: 50%;
    width: 215px;
    height: 200px;
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
      align-items: center;
      input {
        flex: 1;
        height: 100%;
        border: $stone-400;
        padding: 0 1rem;
        font-size: 1.2rem;
      }

      .btn {
        color: $slate-50;
      }
    }
  }

  &.cart {
    .selector {
      top: -60px;
      left: -115px;

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 210px;
        transform: translateY(-50%);
        border-width: 10px;
        border-style: solid;
        border-color: transparent transparent transparent $stone-200;
      }
    }
  }
}
</style>
