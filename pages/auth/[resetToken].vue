<script setup>
// import { useAuth } from '~/store/useAuth'
// import { useMessage } from '~/store/useMessage'

// const router = useRouter()
// const route = useRoute()
// const auth = useAuth()
// const appMessage = useMessage()
// const password = ref('')

const resetPassword = async () => {
  // appMessage.errorMsg = null
  // appMessage.successMsg = null
  // try {
  //   const response = await $fetch('/api/v1/auth/reset-password', {
  //     method: 'PATCH',
  //     body: { password: password.value, resetToken: route.params.resetToken },
  //   })
  //   // console.log(response)
  //   auth.user = response.user
  //   auth.token = response.token
  //   appMessage.successMsg = 'Password reset succesful, You are now logged in'
  //   router.push({ name: 'index' })
  // } catch (error) {
  //   appMessage.errorMsg = error.data
  // }
}

const getNewToken = async () => {
  router.push({ name: 'auth-forgot-password' })
  showAuthForm.value = false
}
</script>

<template>
  <main class="reset-password">
    <form @submit.prevent="resetPassword">
      <header>
        <h2>Reset Password</h2>
      </header>
      <main>
        <FormsBaseInput
          type="password"
          label="Password"
          placeholder="Password"
          v-model="password"
          :required="true"
          minlength="8"
          maxlength="25"
        />
        <!-- <div class="invalid-token" v-if="auth.errorMsg">
          <p>{{ auth.errorMsg }}</p>
          <button class="btn btn-primary" @click.prevent="getNewToken">
            <p>Click Here to get a new token</p>
          </button>
        </div> -->
      </main>
      <footer>
        <button class="btn btn-primary">Reset Password</button>
      </footer>
    </form>
  </main>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
.reset-password {
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
    width: 70%;
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

      .invalid-token {
        margin-top: 2rem;
        border-radius: 5px;
        background-color: $amber-200;
        padding: 4rem 2rem;
        line-height: 3rem;
      }
    }

    footer {
      border: 1px solid $slate-200;
      display: flex;
      justify-content: flex-end;
      padding: 2rem 4rem;
      align-items: center;
    }

    .btn {
      font-size: 1.2rem;
      padding: 1rem 2rem;
      border-radius: 5px;
      letter-spacing: 0.1rem;
    }
  }
}
</style>
