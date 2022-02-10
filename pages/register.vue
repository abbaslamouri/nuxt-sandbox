<script setup>
	import { useAuth } from '~/store/useAuth'

	const router = useRouter()
	const auth = useAuth()
	const user = reactive({
		name: 'AXL Lamouri',
		email: 'lamouri@genvac.com',
		password: 'arar0714',
	})

	const signup = async () => {
		await auth.signup(user)
		if (!auth.errorMsg) {
			console.log('All is good')
		}
	}
</script>
<!-- Must have at least 8 characters, a number, a capital letter. Cannot use a previous password. -->
<!-- PLease correct the highlighted fields before proceeding -->

<template>
	<div class="register">
		<form @submit.prevent="signup">
			<p>Please fill the form below. Fields marked with * are required.</p>
			<FormsBaseInput v-model="user.name" label="Name" placeholder="name" />
			<FormsBaseInput type="email" v-model="user.email" label="Email" placeholder="Email" />
			<FormsBaseInput type="password" v-model="user.password" label="Password" placeholder="Password" />
			<p>By clicking on “continue” I have read and agree with Nespresso Privacy Notice & Terms of Service.</p>
			<button class="btn btn-primary">Continue</button>
		</form>
	</div>
</template>

<style lang="scss" scoped>
	@import '@/assets/scss/variables';
	.register {
		height: 100vh;
		background-color: #111;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding-top: 5rem;

		form {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			gap: 4rem;
			background-color: $slate-50;
			max-width: 70%;
			height: 70%;
			padding: 3rem 4rem;
			border-radius: 5px;

			.btn {
				align-self: flex-end;
				font-size: 1.4rem;
				padding: 1rem 2rem;
				border-radius: 5px;
				letter-spacing: 0.1rem;
			}
		}
	}
</style>
