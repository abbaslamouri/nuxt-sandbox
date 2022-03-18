<script setup>
const router = useRouter()
const route = useRoute()
const { user, token, isAuthenticated, finishSignup } = useAuth()
const { errorMsg, message } = useFactory()

const formUser = reactive({
  email: 'lamouri@genvac.com',
  password: 'adrar0714',
})

const completeSignup = async () => {
  errorMsg.value = null
  message.value = null
  const response = await finishSignup(formUser, route.query.token)
  if (response.ok === false) return (errorMsg.value = response.errorMsg)
  message.value = 'Registration successfull.  You are now logged in.'
  user.value = response.user
  token.value = response.token
  isAuthenticated.value = true
  router.push({ name: 'index' })
}

const getNewToken = async () => {
  router.push({ name: 'auth-forgot-password' })
  showAuthForm.value = false
}
</script>

height: 100vh; background-color: #111; display: flex; justify-content: center; align-items: flex-start; padding-top:
5rem;

<template>
  <main class="h100vh bg-slate-900 flex-row justify-center items-start pt10">
    <form class="bg-slate-50 p4 br3 flex-col gap2" @submit.prevent="completeSignup">
      <h2>Complete Registration</h2>
      <div class="bg-red-100 p2 br3 text-xs flex-col gap2" v-if="errorMsg">
        <p>{{ errorMsg }}</p>
        <button class="btn btn__primary py05 px2 text-xs" @click.prevent="getNewToken">
          <p>Click Here to get a new token</p>
        </button>
      </div>
      <FormsBaseInput type="email" label="Email" placeholder="Email" v-model="formUser.email" :required="true" />
      <FormsBaseInput
        type="password"
        label="Password"
        placeholder="Password"
        v-model="formUser.password"
        :required="true"
        minlength="8"
      />
      <button class="btn btn__primary py05 px2 items-self-end">Sign Up<IconsChevronRight /></button>
    </form>
  </main>
</template>

<style lang="scss" scoped></style>
