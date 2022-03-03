<script setup>
import { useCart } from '~/store/useCart'
import { useMessage } from '~/store/useMessage'

const props = defineProps({
  btnText: {
    type: [String, Number],
  },
  // listType: {
  //   type: String,
  // },
  showSelectQty: {
    type: Boolean,
  },
})

const emit = defineEmits(['quantitySelected', 'selectQuantityBtnClicked', 'closeSelectQuantity'])

const quantity = ref(null)
const showQuantitySelector = ref(false)
const quantitySelectorPosition = ref(null)

const setQuantitySelectorPosition = (event) => {
  const position = event.target.getBoundingClientRect().y
  if (position < 320) quantitySelectorPosition.value = 'below'
  else quantitySelectorPosition.value = null
  showQuantitySelector.value = true
  emit('selectQuantityBtnClicked', !props.showSelectQty)
}
</script>

<template>
  <div class="quantity-selector">
    <button class="btn btn secondary" @click="setQuantitySelectorPosition">
      <div class="btn-text" v-if="btnText">{{ btnText }}</div>
      <IconsPlus v-else />
    </button>
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
        <button class="btn btn-secondary" @click="$emit('quantitySelected', quantity)">OK</button>
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

    &.cart {
      left: 100%;
    }
  }
}
</style>
