<script setup>
const router = useRouter()
const route = useRoute()
const { user, token, isAuthenticated, login } = useAuth()
const { errorMsg, message } = useFactory()
const showAuthDropdown = ref(false)
const formUser = reactive({
  email: '',
  password: '',
})

const register = async () => {
  router.push({ name: 'auth-signup', query: { redirect: route.name } })
  showAuthDropdown.value = false
}

const signin = async () => {
  showAuthDropdown.value = false

  const response = await login(formUser)
  if (response.ok === false) return (errorMsg.value = response.errorMsg)
  message.value = 'Login successful'
  user.value = response.user
  token.value = response.token
  isAuthenticated.value = true
}

const forgotPassword = async () => {
  router.push({ name: 'auth-forgot-password' })
  showAuthDropdown.value = false
}
</script>

<template>
  <div class="relative">
    <div class="overlay" v-if="showAuthDropdown" @click="showAuthDropdown = !showAuthDropdown"></div>
    <div class=" ">
      <div
        class="header flex-row items-center gap1 text-xs border border-slate-50 py05 px1 cursor-pointer br3 relative z-99"
        :class="{ selected: showAuthDropdown }"
        @click="showAuthDropdown = !showAuthDropdown"
      >
        <IconsPersonFill class="fill-slate-50" />
        <h3 class="font-light uppercase">Sign in / Create acount</h3>
      </div>
      <form class="shadow-md flex-col gap2 bg-slate-50 p2 absolute z-99 text-slate-800" v-if="showAuthDropdown">
        <h3 class="title">Sin in</h3>
        <p class="text-xs">Access your account and place an order:</p>
        <div class="flex-col gap1">
          <FormsBaseInput label="Email" type="email" v-model="formUser.email" required />
          <FormsBaseInput label="Password" type="password" v-model="formUser.password" required />
        </div>

        <div>
          <button class="btn btn__secondary wfull justify-between px1 py05 text-xs" @click.prevent="forgotPassword">
            <p>Forgot Password?</p>
            <IconsChevronRight />
          </button>
        </div>
        <button class="btn btn__secondary wfull flex-row justify-between px1 py05 text-xs" @click.prevent="signin">
          <p>Sign in</p>
          <IconsChevronRight />
        </button>
        <p class="text-sm">New User?</p>
        <button class="btn btn__secondary wfull justify-between px1 py05 text-xs" @click.prevent="register">
          <p>Create an account</p>
          <IconsChevronRight />
        </button>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.header {
  &:hover,
  &.selected {
    background-color: $slate-50;
    color: $slate-800;
    border-radius: 3px 3px 0 0;

    svg {
      fill: $slate-800;
    }
  }
}
</style>
