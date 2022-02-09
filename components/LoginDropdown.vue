<script setup>
	import { useAuth } from '~/store/useAuth'

	const auth = useAuth()

	const showAuthForm = ref(false)

	const user = reactive({
		email: '',
		password: '',
	})

	const handleSignin = async () => {
		try {
			// // const appError = useError()
			// this.errorMsg = ''
			// try {
			//   const response = await http.post('v1/auth/login', payload)
			//   // console.log(response.data)
			//   // this.auth = response.data
			//   this.user = response.data.user
			//   this.token = response.data.token
			// } catch (err) {
			//   console.log('MyERROR', err.response)
			//   this.errorMsg = err.response.data.message || err.response.data.statusMessage
			//   // appError.setSnackbar(true, this.errorMsg)
			// }
			const response = await $fetch('/api/v1/auth/login', { method: 'POST', body: user })
			console.log(response)
		} catch (error) {
			console.log(error.data)
		}
		// console.log(user);
		// mainStore.setSnackbar({ show: false })
		// await auth.login(user)
		// if (!auth.errorMsg) {
		// router.push(route.path || '/admin')
		// } else {
		//   mainStore.setSnackbar({ show: true, message: auth.errorMsg })
		// }
		showAuthForm.value = false
	}

	const handleSignup = async () => {
		// console.log(user);
		// mainStore.setSnackbar({ show: false })
		await auth.login(user)
		if (!auth.errorMsg) {
			// router.push(route.path || '/admin')
			// } else {
			//   mainStore.setSnackbar({ show: true, message: auth.errorMsg })
		}
		showAuthForm.value = false
	}
</script>

<template>
	<div class="login-dropdown">
		<div class="header" :class="{ selected: showAuthForm }" @click="showAuthForm = !showAuthForm">
			<IconsPersonFill />
			<h3>Sign in / Create acount</h3>
		</div>
		<form class="shadow-md" v-if="showAuthForm">
			<h3 class="title">Sin in</h3>
			<p class="description">Access your account and place an order:</p>
			<div class="inputs">
				<FormsBaseInput label="Email" type="email" v-model="user.email" required />
				<FormsBaseInput label="Password" type="password" v-model="user.password" required />
			</div>

			<div>
				<!-- <NuxtLink class="forgot-password" :to="{ name: `auth-forgot-password` }">Forgot Password?</NuxtLink> -->
			</div>
			<button class="btn btn-primary flex" @click.prevent="handleSignin">
				<p>Sign in</p>
				<IconsChevronRight />
			</button>
			<p class="new-user">New User?</p>
			<button class="btn btn-primary flex" @click.prevent="handleSignup">
				<p>Create an account</p>
				<IconsChevronRight />
			</button>
		</form>
		<div class="overlay" v-if="showAuthForm" @click="showAuthForm = !showAuthForm"></div>
	</div>
</template>

<style lang="scss" scoped>
	@import '@/assets/scss/variables';

	.login-dropdown {
		position: relative;

		.header {
			display: flex;
			align-items: center;
			gap: 1rem;
			position: relative;
			z-index: 99;
			font-size: 1.1rem;
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

		form {
			position: absolute;
			border: 1px solid $slate-200;
			color: $slate-800;
			display: flex;
			flex-direction: column;
			gap: 2rem;
			background-color: white;
			width: 100%;
			padding: 2rem 2rem;
			z-index: 9;
			border-radius: 0 0 3px 3px;

			.description {
				font-size: 1.2rem;
			}
			.inputs {
				display: flex;
				flex-direction: column;
				gap: 3rem;
				margin-bottom: 2rem;
			}

			.forgot-password,
			.new-user {
				text-transform: uppercase;
				font-size: 1.2rem;
			}

			.btn {
				justify-content: space-between;
				background-color: $slate-50;
				color: $slate-800;
				border-radius: 3px;
			}
		}
	}
</style>
