<script setup>
	const props = defineProps({
		showSlideout: {
			type: Boolean,
			default: false,
		},
	})
</script>

<template>
	<div class="slideout">
		<div class="overlay"></div>
		<transition name="slide">
			<div class="dialog shadow-md" v-show="showSlideout">
				<slot name="header"></slot>
				<slot></slot>
				<slot name="footer"></slot>
			</div>
		</transition>
	</div>
</template>

<style lang="scss" scoped>
	@import '@/assets/scss/variables';

	// .slideout {
	//   .dialog {
	//     position: fixed;
	//     top: 0;
	//     right: 0;
	//     min-height: 100vh;
	//     width: 100vw;
	//     max-width: 1040px;
	//     background-color: $slate-100;
	//     z-index: 99;

	//     .backdrop {
	//       opacity: 0.8;
	//     }
	//   }
	// }

	// .slide-enter-from,
	// .slide-leave-to {
	//   transform: translateX(100%);
	//   opacity: 0;
	// }

	// .slide-enter-to,
	// .slide-leave-from {
	//   transform: translateX(0);
	//   opacity: 1;
	// }

	// .slide-enter-active,
	// .slide-leave-active {
	//   transition: all 0.3s ease;
	// }
</style>
