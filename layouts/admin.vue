<script setup>
import { useAuth } from '~/store/useAuth'
const auth = useAuth()
const showAdminSidebar = ref(true)

const checkScreen = () => {
  if (process.client) {
    if (window.innerWidth < 768) showAdminSidebar.value = false
    if (window.innerWidth >= 768) showAdminSidebar.value = true
  }
}

if (process.client) {
  window.addEventListener('resize', checkScreen)
  checkScreen()
}
</script>

<template>
  <div class="app admin flex-row">
    <transition name="admin-nav">
      <aside class="bg-slate-900" v-show="showAdminSidebar">
        <Branding />
        <AdminNav />
      </aside>
    </transition>
    <main class="flex1" :class="{ full: !showAdminSidebar }">
      <header class="flex-row items-center justify-between px2 text-slate-50">
        <MobileNavToggler @hideAdminSidebar="showAdminSidebar = !showAdminSidebar" />
        <div class="profile-cart">
          <div class="profile">
            <LoginDropdown v-if="!auth.authenticated" />
            <ProfileDropdown v-else />
          </div>
          <!-- <NavCart /> -->
        </div>
      </header>
      <div class="content">
        <slot />
      </div>
      <footer class="text-slate-50"><AdminFooter /></footer>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.app.admin {
  aside {
    position: sticky;
    top: 0;
    height: 100vh;
    transition: all 0.2s ease-in-out;
    min-width: 25rem;
  }

  main {
    transition: all 0.2s ease;
    // border: 1px solid red;
    header {
      position: sticky;
      top: 0;
      height: 6rem;
      background-color: $stone-900;
    }

    .content {
      flex: 1;
      min-height: 90vh;
      background-color: $slate-100;
      // border: 10px solid yellow;
      display: flex;
    }

    footer {
      background-color: $stone-900;
      height: 6rem;
    }
  }

  .admin-nav-enter-from,
  .admin-nav-leave-to {
    transform: translateX(-100%);
    opacity: 0;
  }

  .admin-nav-enter-to,
  .admin-nav-leave-from {
    transform: translateX(0);
    opacity: 1;
  }

  .admin-nav-enter-active,
  .admin-nav-leave-active {
    transition: all 0.2s ease;
  }
}
</style>
