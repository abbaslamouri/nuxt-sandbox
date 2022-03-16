<script setup>
defineProps({
  attribute: {
    type: Object,
    default: [],
  },
  allAttributes: {
    type: Array,
    default: [],
  },
  allAttributeTerms: {
    type: Array,
    default: [],
  },
})

defineEmits(['updateAttribute'])

const { product } = useStore()
</script>

<template>
  <div class="attribute td">
    <div class="border border-slate-300 p1">
      <select
        @change="
          $emit('updateAttribute', { attributeId: attribute.attribute._id, newAttributeId: $event.target.value })
        "
        class="text-xs"
      >
        <option value="">Select Attribute</option>
        <option
          v-for="option in allAttributes.map((a) => {
            return { key: a._id, name: a.name }
          })"
          :key="option.key"
          :value="option.key"
          :selected="attribute.attribute._id == option.key"
          :disabled="product.attributes.find((a) => a.attribute._id == option.key)"
        >
          {{ option.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
