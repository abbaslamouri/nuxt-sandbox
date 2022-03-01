<script setup>
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

const emit = defineEmits(['selectQuantityBtnClicked', 'closeSelectQuantity'])

const hide = ref(true)
const quantity = ref(null)
const showQuantitySelector = ref(false)
const quantitySelectorPosition = ref(null)

const setQuantitySelectorPosition = (event) => {
  // console.log(event.target)
  const position = event.target.getBoundingClientRect().y
  // console.log(position)
  if (position < 320) quantitySelectorPosition.value = 'below'
  else quantitySelectorPosition.value = null
  showQuantitySelector.value = true
  emit('selectQuantityBtnClicked', !props.showSelectQty)
}

const addToCart = () => {
  console.log(props.product)
  console.log(quantity.value)
  emit('selectQuantityBtnClicked', !props.showSelectQty)
  const cartProduct = {
    _id: props.product._id,
    name: props.product.name,
    slug: props.product.slug,
    description: props.product.description,
    price: props.product.price,
    salePrice: props.product.salePrice,
    thumb: {
      filename: props.product.gallery[1].filename,
      slug: props.product.gallery[1].slug,
      path: props.product.gallery[1].path,
    },
  }

  console.log(cartProduct)
}
</script>

<template>
  <div class="product" :class="{ tile: listType === 'tile', list: listType === 'list' }">
    {{ quantity }}
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
      <div class="attributes">
        <div
          class="item"
          v-for="attribute in product.attributes.filter((a) => a.enabled && !a.variantion)"
          :key="attribute._id"
        >
          <!-- <div class="attribute">{{ attribute.attribute.name }}:</div> -->
          <div class="terms">
            <span v-for="term in attribute.terms" :key="term._id">
              <EcommerceRichness :richness="term.name * 1" :total="13" v-if="attribute.attribute.name === `Richness`" />
              <div v-else>{{ term.name }}</div>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="price">
        <div class="regular-price">{{ product.price }}</div>
        <div class="sale-price">{{ product.salePrice }}</div>
      </div>
      <div class="add-to-bag">
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
        text-decoration: line-through;
        color: $slate-400;
      }
    }

    .add-to-bag {
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
