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
// const products = inject('product')
</script>

<template>
  <div class="product" :class="{ tile: listType === 'tile', list: listType === 'list' }">
    <div class="thumb-description" @mouseenter="hide = false" @mouseleave="hide = true">
      <div class="thumb" :class="{ hide: !hide }">
        <img :src="product.gallery[1].path" :alt="`${product.gallery[1].name} Image`" />
      </div>
      <div class="description" :class="{ hide: hide }">{{ product.description }}</div>
    </div>

    <div class="title">
      {{ product.name }}
    </div>
    <div class="price">{{ product.price }}</div>
    <div class="sale-price">{{ product.salePrice }}</div>
    <!-- <Search v-model="state.query.keyword" @handleSubmit="handleSearch" /> <ProductsAdminProductList /> -->
    <!-- <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1" /> -->
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.product {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  width: 20rem;
  border: 1px solid $slate-300;
  padding: 1rem 2rem;

  .thumb-description {
    border: 1px solid red;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
    width: 100%;
    height: 12rem;
    cursor: pointer;
    text-align: center;
    align-items: center;

    .thumb {
      grid-column: 1 / 2;
      grid-row: 1 / 2;

      &.hide {
        display: none;
      }
    }

    .description {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
      font-size: 1.4rem;
      display: flex;

      &.hide {
        display: none;
      }
    }
  }
}
</style>
