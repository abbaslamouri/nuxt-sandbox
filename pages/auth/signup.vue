<script setup>
useMeta({
  title: 'Signup | YRL',
})

const { signup } = useAuth()
const { message, errorMsg } = useFactory()
const user = reactive({
  name: 'Abbas Lamouri',
  email: 'lamouri@genvac.com',
  password: 'arar0714',
})

const register = async () => {
  errorMsg.value = null
  message.value = null
  const response = await signup(user)
  console.log(response)
  if (response.ok !== false)
    return (message.value = 'Please follow the link in your email to complete the registration')
  errorMsg.value = response.errorMsg
  if (errorMsg.value.includes('Email must be unique.'))
    errorMsg.value += '\nPlease click the link below to reset your password.'
}
</script>

<template>
  <div class="h100vh bg-slate-900 flex-row justify-center items-start pt10">
    <form class="bg-slate-50 p4 br3 flex-col gap2" @submit.prevent="register">
      <h2>Complete Registration</h2>
      <div class="bg-red-100 p2 br3 text-xs flex-col gap2" v-if="errorMsg">
        <p>{{ errorMsg }}</p>
        <NuxtLink class="link items-self-end" :to="{ name: 'auth-forgot-password' }">
          <span>Reset Password</span>
          <IconsChevronRight />
        </NuxtLink>
      </div>
      <p class="text-sm">Please fill the form below. Fields marked with * are required.</p>
      <FormsBaseInput v-model="user.name" label="Name" placeholder="name" />
      <FormsBaseInput type="email" v-model="user.email" label="Email" placeholder="Email" />
      <p class="text-xs">
        By clicking on “continue” I have read and agree with Nespresso Privacy Notice & Terms of Service.
      </p>
      <button class="btn btn__primary py05 px1 items-self-end">Continue<IconsChevronRight /></button>
    </form>
  </div>
</template>

<style lang="scss" scoped></style>
