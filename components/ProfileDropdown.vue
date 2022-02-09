<script setup>
	import { storeToRefs } from 'pinia'

	import { useAuth } from '~/store/useAuth'

	// const cart = useCart()
	const auth = useAuth()
	const { user: currentUser } = storeToRefs(auth)
	const showAuthDropdown = ref(false)

	const route = useRoute()
	const router = useRouter()

	const handleSignout = async () => {
		// const cartCustomer = useCookie('cartCustomer').value
		// cartCustomer._id = null
		// console.log(cartCustomer)
		// cart.updateCustomerInfo(cartCustomer)
		await auth.logout()
		// currentUser = {}
		// auth.token = null
		// Cookies.remove('user')
		// Cookies.remove('token')
		// window.location.reload(true)
		// window.location.assign('/')
		showAuthDropdown.value = false
	}
</script>

<template>
	<div class="profile-dropdown">
		<div class="header" v-bind:class="{ selected: showAuthDropdown }">
			<IconsPersonFill />
			<h3 @click="showAuthDropdown = !showAuthDropdown">Welcome {{ currentUser.name }}</h3>
		</div>
		<div v-if="showAuthDropdown" class="menu flex flex-col">
			<h3 class="">My Accoun</h3>
			<ul>
				<li v-if="currentUser.role === 'admin'">
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
			<button class="btn btn-primary" @click="handleSignout">Sign out</button>
		</div>
		<div class="overlay" v-if="showAuthDropdown" @click="showAuthDropdown = !showAuthDropdown"></div>
	</div>
</template>

<style lang="scss" scoped>
	@import '@/assets/scss/variables';

	.profile-dropdown {
		position: relative;

		.header {
			display: flex;
			align-items: center;
			gap: 1rem;
			position: relative;
			z-index: 99;
			font-size: 1.2rem;
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

		.menu {
			position: absolute;
			display: flex;
			flex-direction: column;
			gap: 2rem;
			padding: 2rem 2rem;
			z-index: 99;
			background-color: white;
			color: $slate-800;
			width: 100%;
			font-size: 1.2rem;
			border-radius: 0 0 3px 3px;

			ul {
				li {
					padding: 0.5rem 0;
					border-top: 1px solid $slate-400;
					text-transform: capitalize;

					&:last-child {
						border-bottom: 1px solid $slate-400;
					}
				}
			}

			.btn {
				background-color: transparent;
				border: none;
				color: $yellow-800;
				justify-content: flex-start;
				font-size: 1.3rem;

				&:hover {
					color: $yellow-600;
				}
			}
		}
	}
</style>
