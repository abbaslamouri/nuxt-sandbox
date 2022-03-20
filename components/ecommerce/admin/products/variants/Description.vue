<script setup>
defineProps({
  index: {
    type: Number,
  },
})

const { variants } = useStore()
</script>

<template>
  <section class="shadow-md w-full bg-white p2 br5" id="details">
    <div class="flex-row items-center justify-between text-sm mb1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb05">Description</div>
      <div></div>
    </div>
    <div class="flex-col gap2">
      <div class="flex-row gap2">
        <FormsBaseInput label="Description" placeholder="Description" v-model="variants[index].description" />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
