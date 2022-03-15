<script setup>
defineProps({
  index: {
    type: Number,
  },
})

const { variants } = useStore()
</script>

<template>
  <section class="shadow-md wfull bg-white p2 br5" id="details">
    <div class="flex-row items-center justify-between text-sm mb1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb05">Price</div>
      <div></div>
    </div>
    <div class="flex-col gap2">
      <div class="flex-row gap2">
        <FormsBaseInput label="Price" placeholder="Price" currency v-model="variants[index].price" />
        <FormsBaseInput label="Sale Price" placeholder="Sale Price" currency v-model="variants[index].salePrice" />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
