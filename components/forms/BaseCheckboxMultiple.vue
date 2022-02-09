<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  value: {
    type: [String, Number],
  },
  label: {
    type: String,
    default: '',
  },
  hint: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <span class="base-select">
    <input
      type="checkbox"
      :value="value"
      :checked="modelValue"
      v-bind="$attrs"
      @change="$emit('update:modelValue', value)"
    />
    <label :for="$attrs.id" v-if="label">
      {{ label }}
    </label>
  </span>
</template>

<style scoped lang="scss"></style>
