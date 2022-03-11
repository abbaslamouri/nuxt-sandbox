<script setup>
const store = inject('store')
</script>

<template>
  <section class="shadow-md wfull bg-white p2 br5" id="price">
    <div class="flex-row items-center justify-between text-sm mb1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb05">Price</div>
      <div></div>
    </div>
    <div class="flex-col gap2">
      <div><FormsBaseInput label="Price" required currency v-model="store.doc.price" /></div>
      <div><FormsBaseInput label="Sale Price" currency v-model="store.doc.salePrice" /></div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
</style>
