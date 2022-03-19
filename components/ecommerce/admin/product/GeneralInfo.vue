<script setup>
const { product } = useStore()
</script>

<template>
  <section class="shadow-md wfull bg-white p2 br5" id="general-info">
    <div class="flex-row items-center justify-between text-sm mb1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb05">General</div>
      <div></div>
    </div>
    <div class="flex-col gap2">
      <FormsBaseInput label="Name" placeholder="Name" :required="true" v-model="product.name" />
      <FormsBaseSelect
        nullOption="Select Product Type"
        label="Product Type"
        :options="[
          { key: 'variable', name: 'Variable' },
          { key: 'simple', name: 'Simple' },
        ]"
        v-model="product.productType"
      />
      <!-- <FormsBaseInput label="SKU" placeholder="SKU" v-model="product.sku" />
      <div class="flex-row gap2 items-center">
        <div class="flex-row gap1">
          <FormsBaseInput
            label="Available Stock"
            placeholder="Available Stock"
            v-model="product.stockQty"
            :readonly="!product.manageInventory"
          />
        </div>
        <FormsBaseToggle v-model="product.manageInventory" label="Manage Inventory" />
      </div> -->
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
