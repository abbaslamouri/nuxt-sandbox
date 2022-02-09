<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
});
defineEmits(['update:modelValue']);
const attrs = useAttrs();
</script>

<script>
export default {
  inheritAttrs: false,
};
</script>

<template>
  <div class="base-checkbox flex items-center gap-4">
    <input
      class=""
      type="checkbox"
      :checked="modelValue"
      v-bind="$attrs"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <label :for="$attrs.id" v-if="label">
      {{ label }}
    </label>
  </div>
</template>

<style scoped lang="scss"></style>
