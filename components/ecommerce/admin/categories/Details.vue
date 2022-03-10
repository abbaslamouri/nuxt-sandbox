<script setup>
	const state = inject('state')
</script>

<template>
	<section class="details shadow-md bg-white br5 px2 py2">
		<header class="admin-section-header">Details</header>
		<div class="main flex-col gap3">
			<div class="flex-row gap2 items-center">
				<div class="flex1">
					<FormsBaseInput label="Name" placeholder="Name" required v-model="state.doc.name" />
				</div>
				<div class="flex1">
					<FormsBaseInput label="Permalink" placeholder="Permalink" v-model="state.doc.permalink" />
				</div>
			</div>
			<div class="base-textarea">
				<textarea v-model="state.doc.description" label="Description" placeholder="Description" rows="5"></textarea>
				<label>Description</label>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped></style>
