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
		<div class="error">vvvvv</div>
	</div>
</template>

<style scoped lang="scss">
	@import '@/assets/scss/variables';

	.base-input {
		input {
			&::placeholder {
				color: v-bind(placeholderColor);
			}
		}
	}
</style>
