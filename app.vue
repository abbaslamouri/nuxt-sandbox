<script setup>
import { useMessage } from '~/store/useMessage'
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
        duration="5"
        @hideSnackbar="appMessage.successMsg = null"
      />
    </NuxtLayout>
  </div>
</template>
