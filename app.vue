<script setup>
// const { showCartSlideout } = useStore()
// const { ,  } = useFactory()
const { message, errorMsg, showCartSlideout, alert, showMediaSelector } = useAppState()

const hideSnackbar = () => {
  errorMsg.value = null
  message.value = null
}

const cancelAlert = () => {
  alert.value = { show: false, heading: '', paragraph: '', action: '' }
}
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
      <transition name="slideout">
        <EcommerceCheckoutCart v-if="showCartSlideout" />
      </transition>

      <SnackBar
        :show="errorMsg ? true : message ? true : false"
        :message="errorMsg ? errorMsg : message ? message : ''"
        :snackbarType="errorMsg ? 'Error' : 'Success'"
        duration="0"
        @hideSnackbar="hideSnackbar"
      />

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
