<script setup>
const { user, token, isAuthenticated, logout } = useAuth()
const { errorMsg, message } = useAppState()
const showProfileDropdown = ref(false)

const signout = async () => {
  showProfileDropdown.value = false

  const response = await logout()
  errorMsg.value = null
  message.value = null
  if (response.ok === false) return (errorMsg.value = response.errorMsg)
  token.value = null
  isAuthenticated.value = false
  if (process.client) localStorage.removeItem('cart')
  message.value = 'You are logged out'
}
</script>

<template>
  <div class="profile-dropdown relative">
    <div
      class="header flex-row items-center gap1 text-xs border border-slate-50 py05 px1 cursor-pointer br3 relative z-99"
      v-bind:class="{ selected: showProfileDropdown }"
    >
      <IconsPersonFill class="fill-slate-50" />
      <h3 class="font-light uppercase" @click="showProfileDropdown = !showProfileDropdown">Welcome {{ user.name }}</h3>
    </div>
    <div
      v-if="showProfileDropdown"
      class="menu absolute flex-col gap2 p2 bg-slate-50 z-99 text-slate-800 w-full text-xs"
    >
      <h3 class="">My Accoun</h3>
      <ul>
        <li v-if="user.role === 'admin'">
          <NuxtLink :to="{ name: `admin` }">Admin</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{ name: `admin` }">Order History</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{ name: `admin` }">Account Information?</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{ name: `admin` }">Addresses?</NuxtLink>
        </li>
      </ul>
      <button class="btn btn__secondary py05 px1" @click="signout">Sign out</button>
    </div>
    <div class="overlay" v-if="showProfileDropdown" @click="showProfileDropdown = !showProfileDropdown"></div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.header {
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

li {
  padding: 0.5rem 0;
  border-top: 1px solid $slate-400;
  text-transform: capitalize;

  &:last-child {
    border-bottom: 1px solid $slate-400;
  }
}
</style>
