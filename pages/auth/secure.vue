<script setup>
	import { useAuth } from '~/store/useAuth'
	import { useCart } from '~/store/useCart'
	import { useMessage } from '~/store/useMessage'

	const router = useRouter()

	const auth = useAuth()
	const cart = useCart()
	const appMessage = useMessage()

	const user = reactive({
		email: 'lamouri@genvac.com',
		password: 'adrar0714',
	})

	const signin = async () => {
		appMessage.errorMsg = null
		appMessage.successMsg = null
		try {
			let response = await $fetch('/api/v1/auth/login', {
				method: 'POST',
				body: user,
			})
			auth.user = response.user
			auth.token = response.token

			appMessage.showCartSlideout = false
			// if (auth.authenticated) {
			appMessage.errorMsg = null
			// try {
			response = await $fetch('/api/v1/users', { params: { id: auth.user._id } })
			cart.updateCartCustomer(response)
			// } catch (error) {
			//   appMessage.errorMsg = error.data
			//   return false
			// }
			router.push({ name: 'checkout' })
			// } else {
			//   router.push({ name: 'auth-secure' })
			// }
			// const dbCart = cart.cart
			// dbCart.customer = { ...cart.cart.customer, ...response.user }
			// dbCart.cartTotal = cart.total
			// response = await $fetch('/api/v1/cart', {
			//   method: 'POST',
			//   body: dbCart,
			// })
			// console.log('RES', response)
		} catch (error) {
			appMessage.errorMsg = error.data
		}
		// router.push({ name: 'checkout' })
	}
</script>

<template>
	<div class="secure wfull flex1 bg-slate-900 flex-row justify-center">
		<div class="content flex-row items-start gap2 w996">
			<div class="flex1 bg-slate-50 h30 mt4">
				<h3>I am a Returning Customers</h3>
				<form @submit.prevent="handleLogin" class="main p2 flex-col items-center gap2">
					<FormsBaseInput type="email" label="Email" v-model="user.email" :required="true" />
					<FormsBaseInput type="password" label="Password" v-model="user.password" :required="true" />
					<button class="btn items-self-end" @click="signin">Sign In <IconsChevronRight /></button>
					<NuxtLink class="link items-self-start" :to="{ name: `auth-forgot-password` }">Forgot Password?</NuxtLink>
				</form>
			</div>
			<div class="flex1 bg-slate-50 h30 mt4">
				<h3>I am a New Customers</h3>
				<div class="main p2 fles-col items-center gap1">
					<h4 class="text-center">Create a YRL account</h4>
					<p class="text-center">and receive these great benefits</p>
					<div class="promos flex-row justify-evenly my4 wfull">
						<div class="promo">
							<IconsWelcomeGift />
							<p>Welcome</p>
							<p>Gift</p>
						</div>
						<div class="promo">
							<IconsFirstClass />
							<p>Early Coffee</p>
							<p>Access</p>
						</div>
						<div class="promo">
							<IconsShoppingBag />
							<p>Exclusive</p>
							<p>Promotions</p>
						</div>
						<div class="promo">
							<IconsShoppingCartCheckout />
							<p>Express</p>
							<p>Checkout</p>
						</div>
					</div>
					<div class="actions items-self-end flex-row gap2">
						<NuxtLink class="btn btn__checkout text-xs" :to="{ name: 'auth-signup' }">
							<span>Create an Accoun</span>
						</NuxtLink>
						<NuxtLink class="link" :to="{ name: 'checkout' }">
							<span>Checkout as a guest</span>
							<IconsChevronRight />
						</NuxtLink>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@import '@/assets/scss/variables';
	.secure {
		h3 {
			background-color: $stone-200;
			padding: 1rem 2rem;
			text-transform: uppercase;
			font-size: 1.4rem;
			letter-spacing: 0.1rem;
		}

		.promo {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 0.25rem;
			font-size: 1.4rem;

			p {
				font-weight: bold;
			}
		}
	}
</style>
