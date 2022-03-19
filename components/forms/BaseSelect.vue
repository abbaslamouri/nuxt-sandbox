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
const emit = defineEmits(['update:modelValue'])

const errorMsg = ref('')
const uuid = useUniqueId().getId()
const selectRef = ref('inputRef')
const showDropdown = ref(false)

if (process.client) {
  document.addEventListener('click', (event) => {
    if (!event.target.closest(`.base-select-${uuid}`)) showDropdown.value = false
  })
}

const handleChange = (event) => {
  console.log(event.target.value)
}

const handleMousedown = (event) => {
  showDropdown.value = true
}

const handleSelect = (event) => {
  console.log(event.target.getAttribute('data-selectedOption'))
  emit('update:modelValue', event.target.getAttribute('data-selectedOption'))
  showDropdown.value = false
}
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <label :class="`base-select base-select-${uuid}`" v-if="label" :for="`base-select-${uuid}`" @change="handleChange">
    {{ label }}
    <select
      ref="selectRef"
      :value="modelValue"
      :class="`base-select-${uuid}`"
      :aria-describedby="errorMsg ? `base-input-error-${uuid}` : null"
      :aria-invalid="errorMsg ? true : null"
      :aria-readonly="typeof $attrs.readonly != undefined ? true : null"
      :aria-required="typeof $attrs.required != undefined ? true : null"
      @mousedown.prevent="handleMousedown"
    >
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
    <ul v-show="showDropdown" @click.stop="handleSelect">
      <li v-for="option in options" :key="option.key" :disabled="option.disabled" :data-selectedOption="option.key">
        {{ option.name }}
      </li>
    </ul>
  </label>
</template>

<style lang="scss" scoped>
// @import '@/assets/scss/variables';

// .base-select {
//   position: relative;
//   --size: 0.5em;
//   border-radius: 0.25rem;
//   height: 4.5rem;
//   border: 1px solid $slate-200;
//   background-color: white;
//   overflow: hidden;
//   color: $slate-800;

//   width: 100%;

//   box-shadow: 0 4px 3px rgb(0 0 0 / 0.07), 0 2px 2px rgb(0 0 0 / 0.06);

//   label {
//     position: absolute;
//     top: 0.2rem;
//     left: 2rem;
//     font-size: 80%;
//     color: lighten($color: $color-primary, $amount: 50);
//   }

//   select {
//     padding: 2rem 0.75rem 1rem 2rem;

//     appearance: none;
//     width: 100%;
//     height: 100%;
//     background-color: transparent;
//     cursor: pointer;
//     border: none;
//     z-index: 999;

//     &.centered {
//       padding: 1rem 0.75rem 1rem 2rem;
//     }
//   }

//   &::before {
//     content: '';
//     position: absolute;
//     top: 0;
//     right: 0;
//     bottom: 0;
//     pointer-events: none;
//     background-color: transparent;
//     width: 4em;
//   }
//   &::after {
//     position: absolute;
//     content: '';
//     width: var(--size);
//     height: 0;
//     height: 0;
//     pointer-events: none;
//     box-sizing: border-box;
//     right: 2rem;
//     top: 50%;
//     transform: translate(-50%, -30%);
//     border: var(--size) solid transparent;
//     border-top: var(--size) solid $slate-400;
//     pointer-events: none;
//   }
// }
</style>
