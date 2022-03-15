<script setup>
	const props = defineProps({
		index: {
			type: Number,
		},
		// showActions: {
		//   type: Boolean,
		// },
		allAttributes: {
			type: Array,
			default: [],
		},
		allAttributeTerms: {
			type: Array,
			default: [],
		},
	})

	const { product } = useStore()
	console.log(product.value)

	const updateAttribute = (event) => {
		product.value.attributes[props.index].attribute = props.allAttributes.find((a) => a._id == event.target.value)
		product.value.attributes[props.index].terms = []
		product.value.attributes[props.index].defaultTerm = props.allAttributeTerms.filter(
			(t) => t.parent._id == event.target.value
		)[0]
	}
</script>

<template>
	<div class="attribute td">
		<div class="border border-slate-300 p1">
			<select @change="updateAttribute" class="text-xs">
				<option value="">Select Attribute</option>
				<option
					v-for="option in allAttributes.map((a) => {
						return { key: a._id, name: a.name }
					})"
					:key="option.key"
					:value="option.key"
					:selected="product.attributes[index].attribute._id == option.key"
					:disabled="product.attributes.find((a) => a.attribute._id == option.key)"
				>
					{{ option.name }}
				</option>
			</select>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
