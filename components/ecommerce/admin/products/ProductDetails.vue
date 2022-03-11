<script setup>
const store = inject('store')
</script>

<template>
  <section class="shadow-md wfull bg-white p2 br5" id="details">
    <div class="flex-row items-center justify-between text-sm mb1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb05">details</div>
      <div></div>
    </div>
    <div class="flex-col gap2">
      <FormsBaseTextarea v-model="store.doc.excerpt" label="Excerpt" placeholder="Excerpt" rows="2" />
      <FormsBaseTextarea v-model="store.doc.description" label="Description" placeholder="Description" rows="4" />
      <div class="flex-row gap2">
        <div>
          <FormsBaseInput type="number" label="Intensity" placeholder="Intensity" v-model="store.doc.intensity" />
        </div>
        <div class="flex1">
          <FormsBaseInput label="Roastiness" placeholder="Roastiness" v-model="store.doc.roastiness" />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
