<script setup>
	const emit = defineEmits(['uploadItemsSelected', 'fileUploadBtnClicked'])

	const fileRef = ref(null)
	const dragged = ref(false)
	const itemsToUpload = ref([])

	const handleItemsDropped = (event) => {
		dragged.value = false
		itemsToUpload.value = Array.from(event.dataTransfer.files).map((item) => item)
		emit('uploadItemsSelected', itemsToUpload.value)
	}

	const handleItemsSelected = (event) => {
		// console.log(event.target.files)
		itemsToUpload.value = Array.from(event.target.files).map((item) => item)
		emit('uploadItemsSelected', itemsToUpload.value)
	}
</script>
<template>
	<div
		class="dropzone"
		:class="{ 'dragged-over': dragged }"
		@dragover.prevent="dragged = true"
		@dragleave.prevent="dragged = false"
		@drop.prevent="handleItemsDropped"
	>
		<IconsBackupFill />
		<a class="heading" href="#" @click="fileRef.click()">Or click here to choose your files</a>
		<form enctype="multipart/form-data">
			<input
				id="upload"
				type="file"
				accept="image/*, application/pdf"
				:multiple="true"
				ref="fileRef"
				@change="handleItemsSelected"
				style="display: none"
			/>
		</form>
		<button class="btn" @click="$emit('fileUploadBtnClicked')">
			<span>Cancel</span>
		</button>
	</div>
</template>

<style lang="scss">
	@import '@/assets/scss/variables';

	.dropzone {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		height: 20rem;
		border: 1px solid $slate-300;
		border-radius: 5px;

		.heading {
			color: $sky-900;
			font-weight: 600;
			font-size: 1.8rem;
		}
	}
</style>
