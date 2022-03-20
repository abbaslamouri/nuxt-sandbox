<script setup>
defineEmits(['showAttributesSlideout'])
const { product } = useStore()
</script>

<template>
  <section class="shadow-md w-full bg-white p2 br5" id="attributes">
    <div class="flex-row items-center justify-between text-sm mb1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb05">Attributes</div>
      <button class="btn btn-heading" @click="$emit('showAttributesSlideout', true)">
        <span v-show="!product.attributes.length">Add</span>
        <span v-show="product.attributes.length">Edit</span>
      </button>
    </div>
    <div class="flex-col gap2">
      <div class="content flex-col gap1">
        <div>Different attributes for this product (e.g. size, color)</div>
        <div class="attributes flex-col gap1">
          <div
            class="attribute text-xs flex-row gap1"
            v-for="attribute in product.attributes"
            :key="attribute.attribute._id"
          >
            <p class="attribute-name">{{ attribute.attribute.name }}:</p>
            <div class="terms flex-1 flex-row gap1">
              <div class="term bg-slate-500 py02 px1 text-slate-50 br5" v-for="term in attribute.terms" :key="term._id">
                <span class="term-name">{{ term.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
