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
  rows: {
    type: String,
    default: '5',
  },
  cols: {
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
      @change="$emit('update:modelValue', $event.target.value)"
      :aria-describedby="errorMsg ? `base-input-error-${uuid}` : null"
      :aria-invalid="errorMsg ? true : null"
      :aria-readonly="typeof $attrs.readonly != undefined ? true : null"
      :aria-required="typeof $attrs.required != undefined ? true : null"
      :rows="rows"
      :cols="cols"
    />
    <!-- </textarea> -->
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

.base-textarea {
  // position: relative;
  --size: 0.5em;
  border-radius: 0.25rem;
  border: 1px solid $slate-200;
  box-shadow: 0 4px 3px rgb(0 0 0 / 0.07), 0 2px 2px rgb(0 0 0 / 0.06);
  width: 100%;
  background-color: white;
  // height: 5rem;

  cursor: text;

  // .currency {
  // 	position: absolute;
  // 	top: 2rem;
  // 	font-size: 80%;
  // 	left: 2rem;
  // }

  textarea {
    display: inline-block;
    padding: 2rem 1rem 1rem 2rem;
    width: 100%;
    height: 100%;
    background-color: transparent;
    // border: 1px solid red;

    // &.currency-input {
    // 	padding: 2rem 1rem 1rem 3rem;
    // }

    // &.invalid {
    // 	&:focus {
    // 		border: 3px solid $red-200;
    // 	}
    // }

    &:focus {
      border: 3px solid $sky-200;

      &:placeholder-shown + label {
        transform: translateY(-0.5rem);
        font-size: 80%;
      }

      & + label {
        transform: translateY(-0.5rem);
        font-size: 80%;
      }
    }

    &::placeholder {
      color: v-bind(placeholderColor);
    }

    // &::placeholder {
    //   color: v-bind(placeholderColor);
    // }

    &:placeholder-shown + label {
      transform: translateY(0.75rem);
    }
  }

  label {
    // position: absolute;
    top: 0.75rem;
    left: 2rem;
    font-size: 80%;
    color: lighten($color: $color-primary, $amount: 50);
    transition: all 0.3s ease;
    transform: translateY(-0.5rem);
    cursor: text;
    // color: transparent;
  }

  // .error {
  // 	position: absolute;
  // 	color: $red-600;
  // 	bottom: -2rem;
  // 	left: 1rem;
  // 	font-size: 80%;
  // }
}
</style>
