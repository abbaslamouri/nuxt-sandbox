<script setup>
import { useAuth } from '~/store/useAuth'
import { useMessage } from '~/store/useMessage'

const router = useRouter()
const route = useRoute()
const auth = useAuth()
const appMessage = useMessage()
const showAuthDropdown = ref(false)
const user = reactive({
  email: '',
  password: '',
})

const register = async () => {
  router.push({ name: 'auth-signup', query: { redirect: route.name } })
  showAuthDropdown.value = false
}

const signin = async () => {
  appMessage.errorMsg = null
  appMessage.successMsg = null
  try {
    const response = await $fetch('/api/v1/auth/login', {
      method: 'POST',
      body: user,
    })
    // console.log(response)
    auth.user = response.user
    auth.token = response.token
    showAuthDropdown.value = false
    appMessage.successMsg = 'Login successful'
  } catch (error) {
    appMessage.errorMsg = error.data
  }
}

const forgotPassword = async () => {
  router.push({ name: 'auth-forgot-password' })
  showAuthDropdown.value = false
}
</script>

<template>
  <div class="login-dropdown">
    <div class="header" :class="{ selected: showAuthDropdown }" @click="showAuthDropdown = !showAuthDropdown">
      <IconsPersonFill />
      <h3>Sign in / Create acount</h3>
    </div>
    <form class="shadow-md" v-if="showAuthDropdown">
      <h3 class="title">Sin in</h3>
      <p class="description">Access your account and place an order:</p>
      <div class="inputs">
        <FormsBaseInput label="Email" type="email" v-model="user.email" required />
        <FormsBaseInput label="Password" type="password" v-model="user.password" required />
      </div>

      <div>
        <button class="btn btn-primary" @click.prevent="forgotPassword">
          <p>Forgot Password?</p>
          <IconsChevronRight />
        </button>
        <!-- <NuxtLink class="link btn" :to="{ name: `forgot-password` }">Forgot Password?</NuxtLink> -->
      </div>
      <button class="btn btn-primary" @click.prevent="signin">
        <p>Sign in</p>
        <IconsChevronRight />
      </button>
      <p class="new-user">New User?</p>
      <button class="btn btn-primary" @click.prevent="register">
        <p>Create an account</p>
        <IconsChevronRight />
      </button>
      <!-- <NuxtLink class="link btn" :to="{ name: `register` }">
        <p>Create an account</p>
        <IconsChevronRight />
      </NuxtLink> -->
    </form>
    <div class="overlay" v-if="showAuthDropdown" @click="showAuthDropdown = !showAuthDropdown"></div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.login-dropdown {
  position: relative;

  .header {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
    z-index: 99;
    font-size: 1.1rem;
    height: 3rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 3px;
    border: 1px solid $slate-50;

    svg {
      width: 3rem;
      height: 3rem;
      fill: white;
    }

    h3 {
      font-weight: 300;
      text-transform: uppercase;
    }

    &:hover,
    &.selected {
      background-color: white;
      color: $slate-800;
      border-radius: 3px 3px 0 0;

      svg {
        fill: $slate-800;
      }
    }
  }

  form {
    position: absolute;
    border: 1px solid $slate-200;
    color: $slate-800;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: white;
    width: 100%;
    padding: 2rem 2rem;
    z-index: 99;
    border-radius: 0 0 3px 3px;

    .description {
      font-size: 1.2rem;
    }
    .inputs {
      display: flex;
      flex-direction: column;
      gap: 3rem;
      margin-bottom: 2rem;
    }

    // .forgot-password,
    // .new-user {
    //   text-transform: uppercase;
    //   font-size: 1.2rem;
    // }

    .btn {
      justify-content: space-between;
      background-color: $slate-50;
      color: $slate-800;
      border-radius: 3px;
      width: 100%;

      svg {
        fill: $slate-800;
      }
    }
  }
}
</style>
