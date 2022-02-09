<script setup>
// const prodState = inject('prodState')

defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  nullOption: {
    type: String,
    defualt: 'Select Option',
  },
  hint: {
    type: String,
    default: '',
  },
})
defineEmits(['update:modelValue'])

const errorMsg = ref('')
const uuid = useUniqueId().getId()
const selectRef = ref('inputRef')
// const attrs = useAttrs();
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div class="base-select">
    <!-- <div class="custom-select"> -->
    <select
      :class="{ centered: !label }"
      ref="selectRef"
      :value="modelValue"
      v-bind="$attrs"
      :id="`base-select-${uuid}`"
      :aria-describedby="errorMsg ? `base-input-error-${uuid}` : null"
      :aria-invalid="errorMsg ? true : null"
      :aria-readonly="typeof $attrs.readonly != undefined ? true : null"
      :aria-required="typeof $attrs.required != undefined ? true : null"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="" disabled :selected="modelValue === ''">{{ nullOption }}</option>
      <option
        v-for="option in options"
        :key="option.key"
        :value="option.key"
        :selected="modelValue === option.key"
        :disabled="option.disabled || option.disabledIf"
      >
        {{ option.name }}
      </option>
    </select>
    <label v-if="label" :for="`base-select-${uuid}`">{{ label }}</label>

    <!-- </div> -->
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
</style>
