<script setup>
const { product } = useStore()
</script>

<template>
  <section class="shadow-md w-full bg-white p2 br5" id="general-info">
    <div class="flex-row items-center justify-between text-sm mb1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb05">Stock</div>
      <div></div>
    </div>
    <div class="flex-col gap2">
      <FormsBaseInput label="SKU" placeholder="SKU" v-model="product.sku" />

      <div class="flex-row gap2 items-center">
        <div class="flex-1">
          <FormsBaseToggle v-model="product.manageInventory" label="Manage Inventory" />
        </div>
        <div class="flex-row gap1">
          <FormsBaseInput
            label="Available Stock"
            placeholder="Available Stock"
            v-model="product.stockQty"
            :readonly="!product.manageInventory"
          />
        </div>
      </div>
      <FormsBaseSelect
        label="Allow Backorders"
        :options="[
          { key: 'allow', name: 'Allow' },
          { key: 'disallow', name: 'Do not allow' },
          { key: 'notify', name: 'Allow, but notify customer' },
        ]"
        v-model="product.allowBackorders"
      />
      <FormsBaseInput
        label="Low Stock Threshold"
        placeholder="Low stock Threshold"
        :required="true"
        v-model="product.lowStockThreshold"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
