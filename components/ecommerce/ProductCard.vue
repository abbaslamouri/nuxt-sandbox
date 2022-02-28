<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
  },
  listType: {
    type: String,
  },
})

const hide = ref(true)
const showQuantitySelector = ref(false)
const quantitySelectorPosition = ref(null)

const setQuantitySelectorPosition = (event) => {
  console.log(event.target)
  const position = event.target.getBoundingClientRect().y
  console.log(position)
  if (position > 800) quantitySelectorPosition.value = null
  else quantitySelectorPosition.value = 'bottom'
  showQuantitySelector.value = true
}
</script>

<template>
  <div class="product" :class="{ tile: listType === 'tile', list: listType === 'list' }">
    <div class="top">
      <div class="thumb-description" @mouseenter="hide = false" @mouseleave="hide = true">
        <div class="thumb" :class="{ hide: !hide }">
          <img :src="product.gallery[1].path" :alt="`${product.gallery[1].name} Image`" />
        </div>
        <div class="description" :class="{ hide: hide }">{{ product.description }}</div>
      </div>
      <div class="title">
        {{ product.name }}
      </div>
    </div>
    <div class="bottom">
      <div class="price">
        <div class="price">{{ product.price }}</div>
        <div class="sale-price">{{ product.salePrice }}</div>
      </div>
      <div class="add-to-bag">
        <button class="btn btn secondary" @click="setQuantitySelectorPosition"><IconsPlus /></button>
        <div class="quantity-selector" :class="quantitySelectorPosition" v-if="showQuantitySelector">
          <ul>
            <li v-for="n in 15" :key="`predefined-quantity-${n}`">{{ (n - 1) * 10 }}</li>
          </ul>
        </div>
      </div>
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
  gap: 1rem;
  width: 25%;
  height: 275px;
  border: 1px solid $slate-300;
  padding: 1rem 2rem;
  margin-left: -1px;
  margin-top: -1px;

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
  }

  .bottom {
    display: flex;
    align-items: center;
    gap: 2rem;

    .price-add-to-bag {
      .price {
      }
    }
    .add-to-bag {
      position: relative;
      .btn {
        background-color: $green-600;
        padding: 1rem;
        border-radius: 3px;

        svg {
          fill: $slate-50;
        }
      }
      .quantity-selector {
        position: absolute;
        top: -215px;
        left: 50%;
        width: 200px;
        height: 200px;
        border: 1px solid green;
        transform: translateX(-50%);
        background-color: $slate-200;

        &.bottom {
          top: 130%;

          &::before {
            top: -20px;
            border-color: transparent transparent $slate-600 transparent;
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
          border-color: $slate-600 transparent transparent transparent;
        }
        // padding: 2rem;
        // display: flex;
        // justify-content: center;
        // align-content: flex-start;
        ul {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          border: 1px solid red;

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

            // &:nth-of-type(4n) {
            border-right: 1px solid $slate-400;
            // }
          }
        }
      }

      // .quantity-selector {
      //   position: absolute;
      //   top: 130%;
      //   left: 50%;
      //   width: 200px;
      //   height: 200px;
      //   border: 1px solid green;
      //   transform: translateX(-50%);
      //   background-color: $slate-200;

      //   &::before {
      //     content: '';
      //     position: absolute;
      //     top: -10%;
      //     left: 50%;
      //     transform: translateX(-50%);
      //     border-width: 10px;
      //     border-style: solid;
      //     border-color: transparent transparent $slate-600 transparent;
      //   }
      //   // padding: 2rem;
      //   // display: flex;
      //   // justify-content: center;
      //   // align-content: flex-start;
      //   ul {
      //     width: 100%;
      //     display: flex;
      //     justify-content: center;
      //     align-items: center;
      //     flex-wrap: wrap;
      //     border: 1px solid red;

      //     // gap:1rem;

      //     li {
      //       display: flex;
      //       justify-content: center;
      //       align-items: center;
      //       font-size: 1.2rem;
      //       width: 40px;
      //       height: 40px;
      //       margin-left: -1px;
      //       margin-top: -1px;

      //       // &:nth-of-type(4n) {
      //       border-right: 1px solid $slate-400;
      //       // }
      //     }
      //   }
      // }
    }
  }
}
</style>
