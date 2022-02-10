<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  currency: {
    type: Boolean,
    default: false,
  },
  // focus: {
  //   type: Boolean,
  //   default: false,
  // },
})
defineEmits(['update:modelValue'])

// const attrs = useAttrs();
const inputRef = ref('')
const errorMsg = ref('')
const uuid = useUniqueId().getId()

const placeholderColor = props.label ? 'transparent' : 'inherit'
const inputWidth = props.type === 'password' ? '50%' : '100%'

onMounted(() => {
  // if (!props.modelValue) inputRef.value.focus();
})

watch(
  () => inputRef,
  (current, prev) => {
    console.log('PPPPP', inputRef.value)

    // if (current) inputRef.value.focus()
  }
)
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div class="base-input">
    <div class="currency" v-if="currency">$</div>
    <input
      ref="inputRef"
      :type="type"
      :class="{ 'currency-input': currency }"
      :placeholder="placeholder"
      :value="modelValue"
      v-bind="$attrs"
      :id="`base-input-${uuid}`"
      @input="$emit('update:modelValue', $event.target.value)"
      :aria-describedby="errorMsg ? `base-input-error-${uuid}` : null"
      :aria-invalid="errorMsg ? true : null"
      :aria-readonly="typeof $attrs.readonly != undefined ? true : null"
      :aria-required="typeof $attrs.required != undefined ? true : null"
    />
    <label :for="`base-input-${uuid}`" v-if="label">
      <span>
        {{ label }}
      </span>
      <span v-if="$attrs.required !== undefined">(required)</span>
    </label>

    <div class="password-strength" v-if="type === 'password'">
      <div class="strength">Strength</div>
      <div class="reasons">Reasons</div>
    </div>
    <div class="error" v-else>error</div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/variables';

.base-input {
  width: v-bind(inputWidth);

  input {
    &::placeholder {
      color: v-bind(placeholderColor);
    }
  }
}
</style>
