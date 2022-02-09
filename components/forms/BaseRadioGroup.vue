<script setup>
import BaseRadio from './BaseRadio.vue'
const props = defineProps({
  modelValue: {
    type: [String, Number],
    // required: true,
  },
  label: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  vertical: {
    type: Boolean,
    default: false,
  },
})
defineEmits(['update:modelValue'])
const attrs = useAttrs()
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div class="base-radio-group">
    <span class="group-label">{{ label }}</span>
    <component
      :is="vertical ? 'div' : 'span'"
      v-for="option in options"
      :key="option._value"
      class="base-radio"
      :class="{ horizontal: !vertical }"
    >
      <BaseRadio
        :id="option._value"
        :label="option.label"
        :value="option.value"
        :name="name"
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
      />
    </component>
  </div>
</template>

<style scoped lang="scss">
.base-radio-group {
  // border: 1px solid red;

  &.horizontal {
    display: inline-block;

    margin-right: 2rem;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
