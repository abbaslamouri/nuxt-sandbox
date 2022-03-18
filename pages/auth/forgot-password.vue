<script setup>
const { forgotPassword } = useAuth()
const { message, errorMsg } = useFactory()

const email = ref('lamouri@genvac.com')

const handleForgotPassword = async () => {
  errorMsg.value = null
  message.value = null
  const response = await forgotPassword(email.value)
  console.log(response)
  if (response.ok !== false) return (message.value = 'Please check your email for instructions to reset your password.')
  errorMsg.value = response.errorMsg

  // appMessage.snackbar.show = false
  // await auth.forgotPassword({ email: email.value })
  // if (auth.message) {
  // appMessage.setSnackbar(true, auth.message, 'Success')
  router.push({ name: 'index' })
  // }
  // if (auth.errorMsg) appMessage.setSnackbar(true, auth.errorMsg, 'Error')
}
</script>

<template>
  <div class="h100vh bg-slate-900 flex-row justify-center items-start pt10">
    <form class="bg-slate-50 p4 br3 flex-col gap2" @submit.prevent="handleForgotPassword">
      <h2>Forgot you password?</h2>
      <FormsBaseInput
        type="email"
        label="Email Address"
        placeholder="Email Address"
        v-model="email"
        :required="true"
        minlength="8"
        maxlength="25"
      />
      <p class="text-xs">
        We will send you an email with a link to assist you with resetting your password. Check your spam folder for an
        email from: identification@nespresso.com.
      </p>
      <p class="text-sm">If you have questions, please call customer service at 1-800-555-5555.</p>

      <button class="btn btn__primary py05 px1 items-self-end">Reset Password<IconsChevronRight /></button>
    </form>
  </div>
</template>

<style lang="scss" scoped></style>
