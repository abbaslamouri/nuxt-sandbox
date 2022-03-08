<script setup>
import { useCart } from '~/store/useCart'
import { useStore } from '~/store/useStore'
import { useMessage } from '~/store/useMessage'
const store = useStore()
const cart = useCart()
const appMessage = useMessage()

onMounted(() => {
  // if (process.client && localStorage.getItem('cart')) cart= localStorage.getItem('cart')
  // console.log('CC', cart)
})

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
        <EcommerceCheckoutCart v-if="appMessage.showCartSlideout" />
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
      <div class="media-selector" v-if="store.showMediaSelector">
        <LazyMediaUploader @mediaSelectCancel="store.showMediaSelector = false" />
      </div>
    </NuxtLayout>
  </div>
</template>
