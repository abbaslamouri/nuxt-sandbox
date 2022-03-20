<script setup>
const { cart, updateItemQuantity } = useCart()

const showSelectQtyKeys = ref([])

const resetSelectQtyKeys = () => {
  for (const prop in cart.value.items) {
    showSelectQtyKeys.value[prop] = false
  }
}

const handleOkBtnClicked = (event, index) => {
  resetSelectQtyKeys()
  showSelectQtyKeys.value[index] = event.status
  updateItemQuantity(cart.value.items[index], event.quantity)
}
</script>

<template>
  <div class="cart-item-list">
    <div
      class="cart-items__item flex-row gap2 items-center justify-between py1 mt-1"
      v-for="(item, index) in cart.items"
      :key="`cart-item-${index}`"
    >
      <div class="flex-row gap2 items-center">
        <div class="w5 h5">
          <img class="w-full contain" :src="item.thumb.path || '/placeholder.png'" />
        </div>
        <div class="flex-col text-sm">
          <div class="font-bold">{{ item.name }}</div>
          <div class="text-yellow-700">${{ item.price }}</div>
        </div>
      </div>
      <EcommerceCheckoutQuantitySelector
        parentComponent="cart"
        :minVal="0"
        :maxVal="140"
        :stepVal="10"
        :item="item"
        :showSelectQty="showSelectQtyKeys[index]"
        :btnText="item.quantity"
        @okBtnClicked="handleOkBtnClicked($event, index)"
        @cancel="resetSelectQtyKeys"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.cart-item-list {
  &__item {
    border-top: 1px solid $stone-300;
    border-bottom: 1px solid $stone-300;
  }
}
</style>
