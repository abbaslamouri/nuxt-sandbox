<script setup>
defineEmits(['showVariantsSlideout'])
const { variants } = useStore()
</script>

<template>
  <section class="shadow-md wfull bg-white p2 br5" id="variants">
    <div class="flex-row items-center justify-between text-sm mb1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb05">Variant</div>
      <button class="btn btn-heading" @click="$emit('showVariantsSlideout', true)">
        <span v-show="!variants.length">Add</span>
        <span v-show="variants.length">Edit</span>
      </button>
    </div>
    <div class="flex-col gap2">
      <div class="content flex-col gap1">
        <div>Different types of this product (e.g. size, color)</div>
        <div class="variants"></div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
