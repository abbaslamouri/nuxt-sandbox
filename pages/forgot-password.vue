<script setup>
const email = ref('lamouri@genvac.com')

const forgotPassword = async () => {
  appMessage.snackbar.show = false
  await auth.forgotPassword(user)
  if (auth.message) {
    appMessage.setSnackbar(true, auth.message, 'Success')
    router.push({ name: 'index' })
  }
  if (auth.errorMsg) appMessage.setSnackbar(true, auth.errorMsg, 'Error')
}
</script>

<template>
  <main class="forgot-password">
    <h3>Forgot you password?</h3>
    <form class="login" @submit.prevent="forgotPassword">
      <FormsBaseInput
        type="email"
        label="Email Address"
        placeholder="Email Address"
        v-model="email"
        :required="true"
        minlength="8"
        maxlength="25"
      />
      <!-- <FormGroup type="email" label="Email" icon="envelope" v-model="email" /> -->
      <button class="btn btn-primary">Reset Password</button>
    </form>
    <p>
      We will send you an email with a link to assist you with resetting your password. Check your spam folder for an
      email from: identification@nespresso.com.
    </p>
  </main>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
.forgot-password {
  height: 100vh;
  background-color: #111;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 5rem;

  form {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4rem;
    background-color: $slate-50;
    max-width: 70%;
    height: 70%;
    padding: 3rem 4rem;
    border-radius: 5px;

    .btn {
      align-self: flex-end;
      font-size: 1.4rem;
      padding: 1rem 2rem;
      border-radius: 5px;
      letter-spacing: 0.1rem;
    }
  }
}
</style>
