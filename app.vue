<script setup>
// import { useCart } from '~/store/useCart'
// import { useStore } from '~/store/useStore'
// import { useMessage } from '~/store/useMessage'
// const store = useStore()
// const cart = useCart()
// const appMessage = useMessage()

const { store } = useStore()
// const {store} = useStore()

const hideSnackbar = () => {
  store.value.errorMsg = null
  store.value.message = null
  // if (process.client && localStorage.getItem('cart')) cart= localStorage.getItem('cart')
  // console.log('CC', cart)
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
        :show="!!store.errorMsg || !!store.message"
        :message="store.errorMsg ? store.errorMsg : store.message ? store.message : ''"
        :snackbarType="store.errorMsg ? 'Error' : 'Success'"
        duration="5"
        @hideSnackbar="hideSnackbar"
      />

      <!-- <SnackBar
				:show="!!store.message"
				:message="store.message"
				snackbarType="Success"
				duration="0"
				@hideSnackbar="store.message = null"
			/> -->

      <Alert
        v-if="store.showAlert"
        @ok="store.showAlert = 'ok'"
        @cancel="store.showAlert = false"
        :showCancelBtn="store.showAlertCancelBtn"
      >
        <h3>{{ store.alertHeading }}</h3>
        <p>{{ store.alertParagraph }}</p>
      </Alert>

      <div class="media-selector" v-if="store.showMediaSelector">
        <LazyMediaUploader @mediaSelectCancel="store.showMediaSelector = false" />
      </div>
    </NuxtLayout>
  </div>
</template>
