<script setup>
import { useMessage } from '~/store/useMessage'
const appMessage = useMessage()
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
      <SnackBar
        :show="appMessage.snackbar.show"
        :message="appMessage.snackbar.message"
        :snackbarType="appMessage.snackbar.type"
        :duration="appMessage.snackbar.duration"
        :position="appMessage.snackbar.position"
        @hideSnackbar="appMessage.snackbar.show = false"
      />
    </NuxtLayout>
  </div>
</template>
