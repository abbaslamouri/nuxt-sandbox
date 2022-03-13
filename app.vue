<script setup>
// import { useCart } from '~/store/useCart'
// import { useStore } from '~/store/useStore'
// import { useMessage } from '~/store/useMessage'
// const store = useStore()
// const cart = useCart()
// const appMessage = useMessage()

const { store } = useStore()
const { message, errorMsg, alert, showMediaSelector } = useFactory()
// const {store} = useStore()

const hideSnackbar = () => {
  errorMsg.value = null
  message.value = null
}

const cancelAlert = () => {
  alert.value = { show: false, heading: '', paragraph: '', action: '' }
}

const proceedAlert = () => {
  // alert.value = { show: 'ok', heading: '', paragraph: '', action: alert.value.action }
}

// const setSelectedMedia = (event) => {
// 	console.log('DDDDDDD')
// 	store.selectedMedia = event
// 	store.showMediaSelector = false
// }

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
        <EcommerceCheckoutCart v-if="store.showCartSlideout" />
      </transition>
      <client-only></client-only>
      <SnackBar
        :show="!!errorMsg || !!message"
        :message="errorMsg ? errorMsg : message ? message : ''"
        :snackbarType="errorMsg ? 'Error' : 'Success'"
        duration="0"
        @hideSnackbar="hideSnackbar"
      />

      <!-- <SnackBar
				:show="!!message"
				:message="message"
				snackbarType="Success"
				duration="0"
				@hideSnackbar="message = null"
			/> -->

      <Alert v-if="alert.show" @ok="alert.show = 'ok'" @cancel="cancelAlert" :showCancelBtn="alert.showCancelBtn">
        <h3>{{ alert.heading }}</h3>
        <p>{{ alert.paragraph }}</p>
      </Alert>

      <div class="media-selector" v-if="showMediaSelector">
        <LazyMediaUploader @mediaSelectCancel="showMediaSelector = false" />
      </div>
    </NuxtLayout>
  </div>
</template>
