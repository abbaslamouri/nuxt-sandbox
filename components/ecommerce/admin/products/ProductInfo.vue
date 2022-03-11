<script setup>
const store = inject('store')
</script>

<template>
  <section class="shadow-md wfull bg-white p2 br5" id="info">
    <div class="flex-row items-center justify-between text-sm mb1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb05">Info</div>
      <div></div>
    </div>
    <div class="flex-col gap2">
      <FormsBaseInput label="Name" placeholder="Name" required v-model="store.doc.name" />
      <FormsBaseSelect
        nullOption="Select Product Type"
        label="Product Type"
        :options="[
          { key: 'variable', name: 'Variable' },
          { key: 'simple', name: 'Simple' },
        ]"
        v-model="store.doc.productType"
      />
      <div class="flex-row gap2 items-center">
        <div class="flex1">
          <FormsBaseInput label="SKU" placeholder="SKU" v-model="store.doc.sku" />
        </div>
        <div class="text-sm">
          <div class="flex-row gap1">
            <h4>Available Stock:</h4>
            <span>{{ store.doc.stockQty || 0 }}</span>
          </div>
          <FormsBaseToggle v-model="store.doc.manageInventory" label="Manage Inventory" />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
