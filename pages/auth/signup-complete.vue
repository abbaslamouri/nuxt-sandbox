<script setup>
import { useAuth } from '~/store/useAuth'
import { useMessage } from '~/store/useMessage'

const router = useRouter()
const route = useRoute()
const auth = useAuth()
const appMessage = useMessage()

const user = reactive({
  email: 'lamouri@genvac.com',
  password: 'adrar0714',
})

const signupComplete = async () => {
  appMessage.errorMsg = null
  appMessage.successMsg = null
  try {
    const response = await $fetch('/api/v1/auth/signup-complete', {
      method: 'PATCH',
      params: { token: route.query.token },
      body: { ...user },
    })
    // console.log(response)
    auth.user = response.user
    auth.token = response.token
    appMessage.successMsg = 'Registration successfull.  You are now logged in.'
    router.push({ name: 'index' })
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

const getNewToken = async () => {
  router.push({ name: 'auth-forgot-password' })
  showAuthForm.value = false
}
</script>

<template>
  <main class="signup-complete">
    <form @submit.prevent="signupComplete">
      <h2>Complete Registration</h2>
      <FormsBaseInput type="email" label="Email" placeholder="Email" v-model="user.email" :required="true" />
      <FormsBaseInput
        type="password"
        label="Password"
        placeholder="Password"
        v-model="user.password"
        :required="true"
        minlength="8"
      />
      <div class="invalid-token" v-if="auth.errorMsg">
        <p>{{ auth.errorMsg }}</p>
        <button class="btn btn-primary" @click.prevent="getNewToken">
          <p>Click Here to get a new token</p>
        </button>
      </div>
      <button class="btn btn-primary">Sign Up</button>
    </form>
  </main>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
.signup-complete {
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
    height: 50%;
    padding: 3rem 4rem;
    border-radius: 5px;

    .invalid-token {
      margin-top: 2rem;
      border-radius: 5px;
      background-color: $amber-200;
      padding: 4rem 2rem;
      line-height: 3rem;
    }

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
