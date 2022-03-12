<script setup>
const props = defineProps({
  index: {
    type: Number,
  },
  allAttributeTerms: {
    type: Array,
    default: [],
  },
})

const { product } = useStore()

const setDefaultTerm = (event) => {
  const term = props.allAttributeTerms.find((t) => t._id == event.target.value)
  if (term) product.value.attributes[props.index].defaultTerm = term
}
</script>

<template>
  <div class="default-term td">
    <div class="base-select border border-slate-300 p1" v-if="Object.keys(product.attributes[index].attribute).length">
      <select @change="setDefaultTerm" :disabled="!product.attributes[index].enabled">
        <option value="">Select Default Term</option>
        <option
          v-for="option in allAttributeTerms
            .filter((t) => t.parent._id == product.attributes[index].attribute._id)
            .map((t) => {
              return { key: t._id, name: t.name }
            })"
          :key="option.key"
          :value="option.key"
          :selected="product.attributes[index].defaultTerm._id == option.key"
        >
          {{ option.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.admin-product-attribute {
  border: 1px solid $slate-200;
  border-radius: 3px;
  padding: 1rem;

  .id {
    background-color: $slate-300;
    padding: 1rem;
    border-radius: 3px;
  }
}
</style>
