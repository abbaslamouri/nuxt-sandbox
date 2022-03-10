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
  <div class="app admin">
    <transition name="admin-nav">
      <aside class="bg-slate-900" v-show="showAdminSidebar">
        <Branding />
        <AdminNav />
      </aside>
    </transition>
    <main :class="{ full: !showAdminSidebar }">
      <header>
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
      <footer><Footer /></footer>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.app.admin {
  display: flex;

  aside {
    position: sticky;
    top: 0;
    height: 100vh;
    transition: all 0.2s ease-in-out;
    // color: white;
    // font-size: 1.4rem;
    min-width: 25rem;
    // border: 1px solid teal;

    .nav-branding {
      // display: flex;
      // align-items: center;
      // height: 6rem;
      // padding: 0 1rem;
      // border-bottom: 1px solid $slate-400;
      // gap: 1rem;

      // svg {
      //   width: 2rem;
      //   height: 2rem;
      //   fill: white;
      //   cursor: pointer;
      // }
    }
  }

  main {
    flex: 1;
    transition: all 0.2s ease;
    width: 100%;
    min-height: 88vh;
    // border: 1px solid red;
    display: flex;
    flex-direction: column;
    // gap: 2rem;

    header {
      position: sticky;
      top: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 6rem;
      background-color: #222;
      color: white;
      padding: 0 2rem;
      z-index: 1;
    }

    .content {
      flex: 1;
      background-color: $slate-100;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    footer {
      background-color: #000;
      color: white;
      padding: 1rem 2rem;
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
