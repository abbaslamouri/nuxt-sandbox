<script setup>
	import { useCart } from '~/store/useCart'

	import { useMessage } from '~/store/useMessage'
	const cart = useCart()
	const appMessage = useMessage()

	// watch(appMessage.errorMsg, (current, old) => {
	//   console.log(current)
	//   console.log(old)
	//   if (current) appMessage.setSnackbar(true, errorMsg, 'Error', 5)
	// })

	// watch(appMessage.successMsg, (current, old) => {
	//   console.log(current)
	//   console.log(old)
	//   if (current) appMessage.setSnackbar(true, successMsg, 'Success', 5)
	// })
</script>

<template>
	<div>
		<NuxtLayout>
			<NuxtPage />
			<transition name="slideout">
				<EcommerceCart v-if="cart.showCartSlideout" />
			</transition>
			<SnackBar
				:show="!!appMessage.errorMsg"
				:message="appMessage.errorMsg"
				snackbarType="Error"
				duration="5"
				@hideSnackbar="appMessage.errorMsg = null"
			/>
			<SnackBar
				:show="!!appMessage.successMsg"
				:message="appMessage.successMsg"
				snackbarType="Success"
				duration="0"
				@hideSnackbar="appMessage.successMsg = null"
			/>
			<Alert
				v-if="appMessage.showAlert"
				@ok="appMessage.showAlert = 'ok'"
				@cancel="appMessage.showAlert = false"
				:showCancelBtn="appMessage.showAlertCancelBtn"
			>
				<h3>{{ appMessage.alertHeading }}</h3>
				<p>{{ appMessage.alertParagraph }}</p>
			</Alert>
		</NuxtLayout>
	</div>
</template>
