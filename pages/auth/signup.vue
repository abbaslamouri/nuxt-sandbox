<script setup>
// import { useAuth } from '~/store/useAuth'
// import { useMessage } from '~/store/useMessage'

// useMeta({
//   title: 'Categories | YRL',
// })

// const router = useRouter()
// const route = useRoute()
// const auth = useAuth()
// const appMessage = useMessage()
// const formMsg = ref('')
// const formMsgType = ref('error')
// const user = reactive({
//   name: 'Abbas Lamouri',
//   email: 'lamouri@genvac.com',
//   password: 'arar0714',
// })
// console.log(route)

// router.push(route.query.redirect || '/admin')

const signup = async () => {
  // appMessage.errorMsg = null
  // appMessage.successMsg = null
  // try {
  //   const response = await $fetch('/api/v1/auth/signup', {
  //     method: 'POST',
  //     body: user,
  //   })
  //   // console.log(response)
  //   appMessage.successMsg = response.message
  //   formMsg.value = response.message
  //   formMsgType.value = 'success'
  // } catch (error) {
  //   appMessage.errorMsg = error.data
  //   formMsg.value = appMessage.errorMsg
  //   if (formMsg.value.includes('Email must be unique.'))
  //     formMsg.value += '\nPlease click the link below to reset your password.'
  // }
  // appMessage.snackbar.show = false
  // await auth.signup(user)
  // if (auth.message) {
  //   appMessage.setSnackbar(true, auth.message, 'Success')
  //   router.push({ name: 'index' })
  // }
  // if (auth.errorMsg) appMessage.setSnackbar(true, auth.errorMsg, 'Error')
}
</script>
<!-- Must have at least 8 characters, a number, a capital letter. Cannot use a previous password. -->
<!-- PLease correct the highlighted fields before proceeding -->

<template>
  <div class="signup">
    <!-- <form @submit.prevent="signup">
      <div class="message" :class="{ error: formMsgType === 'error' }" v-if="formMsg">
        <p>{{ formMsg }}</p>
        <NuxtLink
          class="link"
          :to="{ name: 'auth-forgot-password' }"
          v-if="formMsg.includes('Email must be unique.')"
        >
          <button class="btn btn-primary">
            <IconsPlus />
            <span>Reset Password</span>
          </button>
        </NuxtLink>
      </div>
      <p>Please fill the form below. Fields marked with * are required.</p>
      <FormsBaseInput v-model="user.name" label="Name" placeholder="name" />
      <FormsBaseInput type="email" v-model="user.email" label="Email" placeholder="Email" />
      <p>By clicking on “continue” I have read and agree with Nespresso Privacy Notice & Terms of Service.</p>
      <button class="btn btn-primary">Continue</button>
    </form> -->
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
.signup {
  height: 100vh;
  background-color: #111;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 5rem;

  .message {
    background-color: $green-100;
    padding: 1rem 2rem;
    border-radius: 0 5px 5px 0;
    border-left: 5px solid $green-800;

    &.error {
      background-color: $red-100;
      border-left: 5px solid $red-800;
    }

    .link {
      margin-top: 2rem;
      display: inline-block;
    }
  }

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
