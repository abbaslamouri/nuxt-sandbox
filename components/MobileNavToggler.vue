<script setup>
// defineProps({
//   mobile: {
//     type: Boolean,
//   },
// });
defineEmits(['hideAdminSidebar']);
// const sidebarRef = ref('');

// const toggleTranslate = () => {};

// import { useAuth } from '~/pinia/useAuth'
// const authStore = useAuth()
// const router = useRouter()
// router.beforeEach((to, from) => {
// 	if (to.name.includes('admin') && !authStore.token) {
// 		return '/auth/login'
// 	}
// })

// import { useError } from '~/pinia/useError'
// const error = useError()

// const snackbar = computed(() => error.snackbar)
</script>

<template>
  <div class="mobile-nav-toggler">
    <button @click="$emit('hideAdminSidebar')">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
      </svg>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.mobile-nav-toggler {
  // background-color: #000;
  // color: white;
  // padding: 1rem 2rem;\
  button {
    cursor: pointer;
    svg {
      width: 2rem;
      height: 2rem;
      fill: $slate-400;
    }

    @media only screen and (min-width: 768px) {
      display: none;
    }
  }
}
</style>
