<script setup>
const { category } = useStore()
</script>

<template>
  <section class="shadow-md w-full bg-white p2 br5" id="details">
    <div class="flex-row items-center justify-between text-sm mb1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb05">Details</div>
      <div></div>
    </div>
    <div class="flex-col gap2">
      <div class="flex-row gap2">
        <div class="flex-1">
          <FormsBaseInput label="Name" placeholder="Name" required v-model="category.name" />
        </div>
        <div class="flex-1">
          <FormsBaseInput label="Permalink" placeholder="Permalink" v-model="category.permalink" />
        </div>
        <div class="flex-1">
          <FormsBaseInput label="Order" placeholder="Order" v-model="category.order" />
        </div>
      </div>
      <FormsBaseTextarea label="Description" placeholder="Description" v-model="category.description" />
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
