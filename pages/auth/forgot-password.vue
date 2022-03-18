<script setup>
// import { useAuth } from '~/store/useAuth'
// import { useMessage } from '~/store/useMessage'

// const router = useRouter()
// const auth = useAuth()
// const appMessage = useMessage()

const email = ref('lamouri@genvac.com')

const forgotPassword = async () => {
  // appMessage.errorMsg = null
  // appMessage.successMsg = null
  // try {
  //   const response = await $fetch('/api/v1/auth/forgot-password', {
  //     method: 'POST',
  //     body: { email: email.value },
  //   })
  //   // console.log(response)
  //   appMessage.successMsg = response.message
  //   // router.push({ name: 'index' })
  // } catch (error) {
  //   appMessage.errorMsg = error.data
  // }
  // appMessage.snackbar.show = false
  // await auth.forgotPassword({ email: email.value })
  // if (auth.message) {
  //   appMessage.setSnackbar(true, auth.message, 'Success')
  //   router.push({ name: 'index' })
  // }
  // if (auth.errorMsg) appMessage.setSnackbar(true, auth.errorMsg, 'Error')
}
</script>

<template>
  <div class="forgot-password">
    <form @submit.prevent="forgotPassword">
      <header>
        <h3>Forgot you password?</h3>
      </header>
      <main>
        <FormsBaseInput
          type="email"
          label="Email Address"
          placeholder="Email Address"
          v-model="email"
          :required="true"
          minlength="8"
          maxlength="25"
        />
        <p>
          We will send you an email with a link to assist you with resetting your password. Check your spam folder for
          an email from: identification@nespresso.com.
        </p>
        <p>If you have questions, please call customer service at 1-800-555-5555.</p>
      </main>

      <footer>
        <button class="btn btn-primary">Reset Password</button>
      </footer>
    </form>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
.forgot-password {
  height: 100vh;
  background-color: #111;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10rem;

  form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
    background-color: $slate-50;
    max-width: 70%;
    border-radius: 5px;
    overflow: hidden;

    header {
      padding: 2rem;
    }

    main {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 4rem;
      padding: 3rem 4rem;
    }

    footer {
      border: 1px solid $slate-200;
      display: flex;
      justify-content: flex-end;
      padding: 2rem 4rem;
      align-items: center;

      .btn {
        font-size: 1.2rem;
        padding: 1rem 2rem;
        border-radius: 5px;
        letter-spacing: 0.1rem;
      }
    }
  }
}
</style>
