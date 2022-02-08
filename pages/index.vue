<script setup>
	// const data = await $fetch('/api/v1/categories', { method: 'POST', body: { id: 1 } })
	let data = []

	try {
		data = await $fetch('/api/v1/categories/61ff01236543ad8f41ddd645')
		// console.log(data)
	} catch (error) {
		console.log('BROWSER', error.data)
	}
</script>

<template>
	<div>
		Home
		<pre>{{ data }}</pre>
	</div>
</template>

<style lang=""></style>
