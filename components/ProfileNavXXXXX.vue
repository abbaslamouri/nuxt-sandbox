<script setup>
// import Cookies from 'js-cookie'

// import { useCart } from '~/pinia/useCart'
// import { storeToRefs } from 'pinia';

// import { useAuth } from '~/pinia/useAuth'

// const cart = useCart()
// const auth = useAuth()
// const { user: currentUser } = storeToRefs(auth);

// const route = useRoute();
// const router = useRouter();
// console.log('R', route)

// const showAuthForm = ref(false);
// const showAuthDropdown = ref(false);

// const handleSignout = async () => {
//   // const cartCustomer = useCookie('cartCustomer').value
//   // cartCustomer._id = null
//   // console.log(cartCustomer)
//   // cart.updateCustomerInfo(cartCustomer)
//   await auth.logout();
//   // currentUser = {}
//   // auth.token = null
//   // Cookies.remove('user')
//   // Cookies.remove('token')
//   // window.location.reload(true)
//   // window.location.assign('/')
//   showAuthDropdown.value = false;
// };

// onMounted(() => {
// 	if (process.client) {
// 		cart.cart = JSON.parse(localStorage.getItem('cart'))
// 	}
// })
</script>

<template>
  <div class="profile">
    pppp
    <!-- <LoginDropdown v-if="!auth.authenticated" /> -->
    <!-- <ProfileDropdown v-else /> -->

    <!-- backdrop fixed w-[50vw] h-[50vh] top-0 left-0  bg-gray-400 -->
    <!-- <div class="profile-nav flex items-center gap-2 px-3 py-2 rounded text-sm uppercase border border-white bg-white text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
        </svg>
        <h3>Sign in / Create acount</h3>
      </div> -->

    <!-- <div class="auth">
        <div class="profile-nav flex items-center gap-2 px-3 py-2 rounded text-sm uppercase border border-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
          <h3>Sign in / Create acount</h3>
        </div>
      </div> -->

    <!-- <div v-if="!auth.authenticated" class="nav-links">
			<NuxtLink class="link" :to="{ name: 'auth-login' }">
				<IconsPersonFill />
				<span>Login</span>
			</NuxtLink>
			<NuxtLink class="link" :to="{ name: 'auth-register' }">
				<IconsHttpsFill />
				<span>Register</span>
			</NuxtLink>
		</div>
		<div v-else class="nav-links">
			<a href="#" @click="handleLogout" class="link">Logout</a>
			<div class="nav-user">
				<img
					v-if="currentUser.avatar && currentUser.avatar.path"
					:src="`${currentUser.avatar.path}`"
					:alt="`${currentUser.name} Photo`"
				/>
				<img v-else src="/user-placeholder.jpg" :alt="`${currentUser.name} Photo`" />
				<div @mouseenter="showUserSubmenu = true" @mouseleave="showUserSubmenu = false">
					{{ currentUser.name.split(' ')[0] }} -->
    <!-- <ul v-if="showUserSubmenu">
						<li>
							<NuxtLink class="link" :to="{ name: 'shop' }">
								<IconsCartFill />
								<span>Shop</span>
							</NuxtLink>
						</li>
						<li>
							<NuxtLink class="link" :to="{ name: 'shop-cart' }">
								<IconsCartFill />
								<span>Cart</span>
							</NuxtLink>
						</li>
					</ul> -->
    <!-- </div>
			</div>
		</div> -->
    <!-- </client-only> -->
    <!-- {{ useCookie('token') }} -->
    <!-- {{currentUser}} -->
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.profile {
  border: 1px solid $slate-400;

  // border: 1px solid white;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // gap: 1rem;
  // padding: 0.5rem 2rem;
  border-radius: 3px;

  // &__authenticated {
  //   position: relative;
  //   z-index: 999;
  // }
}

//  px-4 py-1 rounded-t uppercase border border-white hover:bg-white hover:text-gray-800 cursor-pointer

// .dropdown-bg {
//   background-color: white;
//   color: black;
// }

// .auth-dropdown {
//   width: 100%;
// }
// .profile-nav {
// 	// padding: 1rem 2rem;
// 	// box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
// 	font-size: 1.2rem;
// 	text-transform: uppercase;
// 	display: flex;
// 	// justify-content: flex-end;
// 	gap: 1rem;

// 	.cart {
// 		a {
// 			display: flex;
// 			align-items: center;

// 			.badge {
// 				display: flex;
// 				align-items: center;
// 				justify-content: center;
// 				background-color: #f02020;
// 				color: #fff;
// 				border-radius: 50%;
// 				width: 2.5rem;
// 				height: 2.5rem;
// 				// padding: 0.3rem 0.7rem;
// 				font-size: 1.4rem;
// 				align-self: flex-start;
// 			}
// 		}
// 	}

// 	.nav-links {
// 		display: flex;
// 		align-items: center;
// 		justify-content: flex-end;
// 		gap: 2rem;

// 		.link {
// 			display: flex;
// 			align-items: center;
// 			gap: 0.3rem;

// 			svg {
// 				width: 1.5rem;
// 			}

// 			&.router-link-active {
// 				color: green;
// 			}
// 		}

// 		.nav-user {
// 			display: flex;
// 			align-items: center;
// 			gap: 1rem;
// 			margin-left: 2rem;

// 			img {
// 				border-radius: 50%;
// 				width: 3rem;
// 			}
// 		}
// 	}
// }
</style>
