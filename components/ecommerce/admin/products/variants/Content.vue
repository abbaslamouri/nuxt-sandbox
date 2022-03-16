<script setup>
	defineEmits(['showVariantsSlideout'])
	const { product, variants } = useStore()
</script>

<template>
	<section class="shadow-md wfull bg-white p2 br5" id="variants">
		<div class="flex-row items-center justify-between text-sm mb1">
			<div class="uppercase inline-block border-b-stone-300 font-bold pb05">Variant</div>
			<button class="btn btn-heading" @click="$emit('showVariantsSlideout', true)">
				<span v-show="!variants.length">Add</span>
				<span v-show="variants.length">Edit</span>
			</button>
		</div>
		<div class="flex-col gap2 items-center">
			<div class="text-sm" v-if="!variants.length">Different types of this product (e.g. size, color)</div>
			<table class="text-xs maxw40" v-else>
				<colgroup>
					<col span="1" style="width: 20%" />
					<col span="1" style="width: 40%" />
					<col span="1" style="width: 40%" />
				</colgroup>
				<thead>
					<tr>
						<th class="text-center">Variant</th>
						<!-- <th class="text-center" v-for="term in variants[0].attrTerms" :key="term._id">
              {{ product.attributes.find((a) => a.attribute._id == term.parent._id).attribute.name }}
            </th> -->
					</tr>
				</thead>
				<tbody>
					<tr v-for="(variant, index) in variants" :key="`variant-${index}`">
						<td class="text-center">{{ index + 1 }}</td>
						<td class="text-center" v-for="term in variant.attrTerms" :key="term._id">
							{{ term.name }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>
</template>

<style lang="scss" scoped></style>
