<script setup>
import { useAuth } from '~/store/useAuth'
import { useCart } from '~/store/useCart'

const route = useRoute()
const auth = useAuth()
const cart = useCart()

// console.log(route.name)

// console.log(useCookie('auth'))
// import { useAuth } from '~/pinia/useAuth'
// const authStore = useAuth()
// const router = useRouter()
// router.beforeEach((to, from) => {
// 	if (to.name === 'auth-login' && authStore.token) {
// 		return '/shop'
// 	}
// })

// const categoryStore = useCategory()
// categoryStore.fetchAll()
</script>

<template>
  <div class="app">
    <header>
      <!-- <FreeShipping /> -->
      <div class="header">
        <div class="branding-profile">
          <Branding />
          <div class="profile-cart">
            <div class="profile">
              <!-- <LoginDropdown v-if="!auth.authenticated" /> -->
              <!-- <ProfileDropdown v-else /> -->
            </div>
            <EcommerceCheckoutNavCart v-show="route.name != 'checkout' && route.name != 'shipping'" />
            <!-- <EcommerceCartSlideout /> -->
          </div>
        </div>
      </div>
      <nav class="nav">
        <!-- <MainNav /> -->
      </nav>
    </header>

    <main>
      <!-- <div class="main"> -->
      <slot />
      <!-- </div> -->
    </main>
    <footer><Footer /></footer>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.app {
  header {
    position: sticky;
    top: 0;
    z-index: 9;
    .header {
      background-color: $slate-900;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      height: 6rem;
      padding: 0 2rem;

      .branding-profile {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 996px;

        .profile-cart {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
      }
    }
  }

  main {
    min-height: 90vh;
    display: flex;
    flex-direction: column;
    // border: 10px solid teal;
  }

  footer {
    height: 6rem;
    background-color: $slate-800;
    color: $slate-50;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
