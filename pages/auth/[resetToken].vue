<script setup>
const router = useRouter()
const route = useRoute()
const { user, token, isAuthenticated, resetPassword } = useAuth()
const { message, errorMsg } = useFactory()
const password = ref('adrar0714')

const handleResetPassword = async () => {
  errorMsg.value = null
  message.value = null
  const response = await resetPassword({ password: password.value, resetToken: route.params.resetToken })
  console.log(response)
  if (response.ok === false) return (errorMsg.value = response.errorMsg)
  user.value = response.user
  token.value = response.token
  isAuthenticated.value = true
  router.push({ name: 'index' })
}

// const getNewToken = async () => {
//   router.push({ name: 'auth-forgot-password' })
//   showAuthForm.value = false
// }
</script>

<template>
  <main class="h100vh bg-slate-900 flex-row justify-center items-start pt10">
    <form class="bg-slate-50 p4 br3 flex-col gap2 minw-sm" @submit.prevent="handleResetPassword">
      <h2>Reset Password</h2>
      <div class="bg-red-100 p2 br3 text-xs flex-col gap2" v-if="errorMsg">
        <p>{{ errorMsg }}</p>
        <NuxtLink class="link items-self-end" :to="{ name: 'auth-forgot-password' }">
          <span>Reset Password</span>
          <IconsChevronRight />
        </NuxtLink>
        <!-- <a href="#" class="link text-sm items-self-end" @click.prevent="getNewToken">
          Click Here to get a new token<IconsChevronRight />
        </a> -->
      </div>
      <FormsBaseInput
        type="password"
        label="Password"
        placeholder="Password"
        v-model="password"
        :required="true"
        minlength="8"
        maxlength="25"
      />

      <button class="btn btn__primary py05 px2 items-self-end">Reset Password<IconsChevronRight /></button>
    </form>
  </main>
</template>

<style lang="scss" scoped></style>
