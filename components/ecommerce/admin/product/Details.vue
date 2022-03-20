<script setup>
const { product } = useStore()
</script>

<template>
  <section class="shadow-md w-full bg-white p2 br5" id="details">
    <div class="flex-row items-center justify-between text-sm mb1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb05">details</div>
      <div></div>
    </div>
    <div class="flex-col gap2">
      <FormsBaseTextarea v-model="product.excerpt" label="Excerpt" placeholder="Excerpt" rows="2" />
      <FormsBaseTextarea v-model="product.description" label="Description" placeholder="Description" rows="4" />
      <div class="flex-row gap2">
        <div>
          <FormsBaseInput type="number" label="Intensity" placeholder="Intensity" v-model="product.intensity" />
        </div>
        <div class="flex-1">
          <FormsBaseInput label="Roastiness" placeholder="Roastiness" v-model="product.roastiness" />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
