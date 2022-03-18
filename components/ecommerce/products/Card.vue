<script setup>
import { useCart } from '~/store/useCart'

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

const { products, variants } = useStore()
const { fetchAll } = useStore()
const cart = useCart()
const hide = ref(true)
// const variants = ref([])

// variants.value = props.product._id
//   ? await fetchAll('variants', {
//       fields: 'product, attrattributeTerms, gallery',
//       product: props.product._id,
//     })
//   : []

// console.log(variants.value)

// const response = await fetchVariants(props.product._id)
// if (state.errorMsg) {
//   cart.errorMsg = state.errorMsg
//   variants.value = []
// } else {
//   variants.value = response.docs
// }
</script>

<template>
  <div
    class="product-card flex-col items-center justify-between gap1 py1 mt-1 ml-1"
    :class="{ tile: listType === 'tile', list: listType === 'list' }"
  >
    <div class="product-details flex-col items-center justify-center gap2">
      <div class="thumb-and-description" @mouseenter="hide = false" @mouseleave="hide = true">
        <div class="thumb" :class="{ hide: !hide }" v-if="product.gallery.length > 1">
          <img class="wfull hfull contain" :src="product.gallery[1].path" :alt="`${product.gallery[1].name} Image`" />
        </div>
        <div class="description flex-row items-center" :class="{ hide: hide }">{{ product.excerpt }}</div>
      </div>
      <div class="font-bold">{{ product.name }}</div>
      <div class="roastiness">{{ product.roastiness }}</div>
      <div class="intensity">
        <EcommerceProductsCoffeeIntensity :intensity="product.intensity" :total="13" v-if="product.intensity" />
      </div>
    </div>
    <div class="flex-row items-center gap2">
      <div class="price">
        <div class="text-slate-400 line-through" :class="{ strikeout: product.salePrice }">${{ product.price }}</div>
        <div class="sale-price" v-if="product.salePrice">${{ product.salePrice }}</div>
      </div>
      <EcommerceCheckoutQuantitySelector
        v-if="product.productType === 'simple'"
        :minVal="0"
        :maxVal="140"
        :stepVal="10"
        :showSelectQty="showSelectQty"
        @okBtnClicked="$emit('itemQuantitySelected', $event)"
      />
      <div v-if="product.productType === 'variable'">
        <NuxtLink
          class="link items-self-end"
          :to="{ name: 'ecommerce-productSlug', params: { productSlug: product.slug } }"
        >
          <button class="btn btn__primary py05 px2 text-xs">Select Options</button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.product-card {
  width: 25%;
  height: 300px;
  border: 1px solid $slate-300;

  .product-details {
    .thumb-and-description {
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
      }

      .description {
        grid-column: 1 / 2;
        grid-row: 1 / 2;
        font-size: 1.4rem;
        height: 10rem;

        &.hide {
          display: none;
        }
      }
    }
  }
}
</style>
