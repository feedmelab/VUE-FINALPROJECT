<script setup>
	import { reactive } from "vue";
	import Email from "../components/FormFields/Email.vue";
	import Password from "../components/FormFields/Password.vue";
	import useFormValidation from "../modules/useFormValidation";
	import useSubmitButtonState from "../modules/useSubmitButtonState";
	import { useUserStore } from "../stores/user";
	import { useRouter } from "vue-router";

	let user = reactive({
		email: "",
		password: "",
	});

	const redirect = useRouter();
	const { errors } = useFormValidation();
	const { isSignupButtonDisabled } = useSubmitButtonState(user, errors);

	const loginButtonPressed = async () => {
		try {
			await useUserStore().signIn(user.email, user.password);
			redirect.push({ path: "/" });
		} catch (error) {
			console.error(error);
			alert(error.error_description || error.message);
		}
	};
</script>
<template>
	<div class="bg-white p-16 rounded shadow-2xl w-1/2 max-w-sm">
		<h2 class="font-muntsa text-3xl font-bold mb-10 text-gray-800">Introduce your credentials</h2>
		<form @submit.prevent novalidate class="space-y-5">
			<Email v-model="user.email" />
			<Password v-model="user.password" />

			<button
				:disabled="isSignupButtonDisabled"
				class="font-bold trasition duration-300 hover:text-yellow-800 hover:bg-yellow-300 block bg-yellow-400 w-full py-4 rounded text-yellow-900"
				@click="loginButtonPressed"
			>
				Sign Up
			</button>
		</form>
	</div>
</template>
