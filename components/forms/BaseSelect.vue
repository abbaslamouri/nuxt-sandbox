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
  // inheritAttrs: false,
}
</script>

<template>
  <div class="base-select">
    <!-- {{options}} -->
    <!-- <div class="custom-select"> -->
    <select
      :class="{ centered: !label }"
      ref="selectRef"
      :value="modelValue"
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

.base-select {
  position: relative;
  --size: 0.5em;
  border-radius: 0.25rem;
  height: 4.5rem;
  border: 1px solid $slate-200;
  background-color: white;
  overflow: hidden;
  // width: 100%;
  // height: 100%;
  // width: min-content;
  // display: flex;
  // align-items: center;
  // gap: 1rem;
  // cursor: pointer;
  // padding: 2rem 0 0rem 0;
  width: 100%;

  // padding: 1.5rem 2.5rem;
  box-shadow: 0 4px 3px rgb(0 0 0 / 0.07), 0 2px 2px rgb(0 0 0 / 0.06);

  // border: 1px solid red;

  // .custom-select {
  // position: relative;
  // cursor: pointer;

  label {
    position: absolute;
    top: 0.2rem;
    left: 2rem;
    // border: 1px solid red;
    font-size: 80%;
    // font-weight: 600;
    color: lighten($color: $color-primary, $amount: 50);
  }

  select {
    // padding: 0 4rem 0 2rem;
    padding: 2rem 0.75rem 1rem 2rem;

    appearance: none;
    width: 100%;
    height: 100%;
    background-color: transparent;
    cursor: pointer;
    // outline: none;
    border: none;

    &.centered {
      padding: 1rem 0.75rem 1rem 2rem;
    }
    // border: 2px solid green;
    // padding: 0 6rem 0 2rem;
    // transform: translateY(1rem);

    // & > option {
    // 	padding: 2rem;
    // 	color: red;
    // 	height: 1rem;
    // 	display: inline-block;
    // }

    // cursor: pointer;
    // padding: 0 4rem 0 0;
    // border: none;
    // outline: none;
    // height: 100%;
    // appearance: none;
    // background-color: transparent;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    background-color: transparent;
    width: 4em;
    // padding: 2rem;
    // background-color: red;
  }
  &::after {
    position: absolute;
    content: '';
    width: var(--size);
    height: 0;
    height: 0;
    pointer-events: none;
    box-sizing: border-box;
    right: 2rem;
    top: 50%;
    transform: translate(-50%, -30%);
    border: var(--size) solid transparent;
    border-top: var(--size) solid $slate-400;
    pointer-events: none;
  }

  // &::before,
  // &::after {
  //   position: absolute;
  //   content: '';
  //   width: var(--size);
  //   height: 0;
  //   height: 0;
  //   pointer-events: none;
  //   border: var(--size) solid transparent;
  //   box-sizing: border-box;
  // }
  // &::before {
  //   top: 95%;
  //   right: 0;
  //   transform: translateY(-50%);
  //   border-top: var(--size) solid $slate-400;
  // }

  // &::after {
  //   top: 25%;
  //   right: 0%;
  //   transform: translateY(-50%);
  //   border-bottom: var(--size) solid $slate-400;
  // }
  // }
}
</style>
