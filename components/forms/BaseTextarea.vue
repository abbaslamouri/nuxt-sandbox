<script setup>
const props = defineProps({
  modelValue: {
    type: String,
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
})
defineEmits(['update:modelValue'])

// const attrs = useAttrs();
const inputRef = ref('')
const errorMsg = ref('')
const uuid = useUniqueId().getId()

const placeholderColor = props.label ? 'transparent' : 'inherit'

onMounted(() => {
  // if (!props.modelValue) inputRef.value.focus();
})

// watch(
//   () => inputRef,
//   (current, prev) => {
//     console.log('PPPPP', inputRef.value)

//     // if (current) inputRef.value.focus()
//   }
// )
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div class="base-textarea">
    <textarea
      ref="inputRef"
      :placeholder="placeholder"
      v-bind="$attrs"
      :value="modelValue"
      :id="`base-input-${uuid}`"
      @input="$emit('update:modelValue', $event.target.value)"
      :aria-describedby="errorMsg ? `base-input-error-${uuid}` : null"
      :aria-invalid="errorMsg ? true : null"
      :aria-readonly="typeof $attrs.readonly != undefined ? true : null"
      :aria-required="typeof $attrs.required != undefined ? true : null"
    >
    </textarea>
    <label :for="`base-input-${uuid}`" v-if="label">
      <span>
        {{ label }}
      </span>
      <span v-if="$attrs.required !== undefined">(required)</span>
    </label>
    <!-- <div class="error">vvvvv</div> -->
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/variables';

// .base-textarea {
//   position: relative;
//   --size: 0.5em;
//   border-radius: 0.25rem;
//   // height: 6rem;
//   border: 1px solid $slate-200;
//   box-shadow: 0 4px 3px rgb(0 0 0 / 0.07), 0 2px 2px rgb(0 0 0 / 0.06);
//   background-color: white;
//   // margin-bottom: 2rem;
//   // overflow: hidden;

//   // border: 3px solid red;
//   // .custom-select {
//   // position: relative;
//   // cursor: pointer;

//   cursor: text;
//   // width: 100%;

//   .currency {
//     position: absolute;
//     top: 2rem;
//     font-size: 80%;
//     left: 2rem;
//   }

//   textarea {
//     border: none;
//     outline: none;
//     display: inline-block;
//     // appearance: none;
//     // display: flex;
//     // border: 3px solid $slate-900;
//     // padding: 0 0 0 2rem;
//     padding: 2rem 1rem 1rem 2rem;
//     width: 100%;
//     height: 100%;
//     // border: 1px solid red;
//     background-color: transparent;
//     // transform: translateY(1rem);
//     // border: 1px solid teal;

//     &.currency-input {
//       padding: 2rem 1rem 1rem 3rem;
//     }

//     &.invalid {
//       &:focus {
//         border: 3px solid $red-200;
//       }
//     }

//     &:focus {
//       border: 3px solid $sky-200;

//       &:placeholder-shown + label {
//         transform: translateY(-0.5rem);
//         font-size: 80%;
//       }

//       & + label {
//         transform: translateY(-0.5rem);
//         font-size: 80%;
//       }
//     }

//     &::placeholder {
//       color: v-bind(placeholderColor);
//     }

//     &:placeholder-shown + label {
//       transform: translateY(0.75rem); //lllllllll
//     }
//   }

//   label {
//     position: absolute;
//     top: 0.75rem;
//     left: 2rem;
//     // border: 1px solid red;
//     font-size: 80%;
//     // font-weight: 600;
//     color: lighten($color: $color-primary, $amount: 50);
//     // position: absolute;
//     // top: 0.1rem;
//     // left: 0;
//     transition: all 0.3s ease;
//     // display: block;
//     // margin-left: 1.7rem;
//     transform: translateY(-0.5rem);
//     cursor: text;

//     // font-size: 80%;

//     // absolute -top-0 left-3 text-xs text-gray-400 peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-3 peer-placeholder-shown:text-sm peer-focus:-top-0 transition-all peer-focus:text-xs
//   }

//   .error {
//     position: absolute;
//     color: $red-600;
//     bottom: -2rem;
//     left: 1rem;
//     font-size: 80%;
//   }
// }
</style>
