<script setup>
defineProps({
  index: {
    type: Number,
  },
})

const { product, variants } = useStore()
</script>

<template>
  <section class="shadow-md wfull bg-white p2 br5" id="details">
    <div class="flex-row items-center justify-between text-sm mb1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb05">Stock Management</div>
      <div></div>
    </div>
    <div class="flex-col gap2">
      <div class="flex-row gap2">
        <div class="flex1">
          <FormsBaseInput label="SKU" placeholder="SKU" v-model="variants[index].sku" />
        </div>
        <div class="flex1 flex-col gap1">
          <FormsBaseInput
            label="Stck Qty"
            placeholder="Stock Qty"
            v-model="variants[index].stockQty"
            :readonly="!product.manageInventory"
          />
          <div>Enable product manageInventory to set Stock Qty.</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
