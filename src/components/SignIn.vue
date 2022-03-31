<script setup>
	import { reactive } from "vue";
	import Email from "../components/FormFields/Email.vue";
	import Password from "../components/FormFields/Password.vue";
	import useFormValidation from "../modules/useFormValidation";
	import useSubmitButtonState from "../modules/useSubmitButtonState";
	import { useUserStore } from "../stores/user";

	let user = reactive({
		email: "",
		password: "",
	});

	const { errors } = useFormValidation();
	const { isSignupButtonDisabled } = useSubmitButtonState(user, errors);

	const loginButtonPressed = async () => {
		try {
			await useUserStore().signIn(user.email, user.password);
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

<!-- <script>
// 	import { defineAsyncComponent, ref } from "vue";
// 	import { reactive } from "@vue/reactivity";
// 	import useFormValidation from "../modules/useFormValidation";
// 	import useSubmitButtonState from "../modules/useSubmitButtonState";

// 	const Email = defineAsyncComponent(() => import("./FormFields/Email.vue"));
// 	const Password = defineAsyncComponent(() => import("./FormFields/Password.vue"));

// 	export default {
// 		components: {
// 			Email,
// 			Password,
// 		},
// 		setup() {
// 			let user = reactive({
// 				email: "",
// 				password: "",
// 			});

// 			const { error } = useFormValidation();
// 			const { isSignupButtonDisabled } = useSubmitButtonState(user, error);

// 			const loginButtonPressed = () => {
// 				console.log(user);
// 			};

// 			return {
// 				user,
// 				isSignupButtonDisabled,
// 				loginButtonPressed,
// 			};
// 		},
// 	};
// </script>
// <template>
// 	<div class="bg-white p-16 rounded shadow-2xl w-1/2 max-w-sm">
// 		<h2 class="font-muntsa text-3xl font-bold mb-10 text-gray-800">Introduce your credentials</h2>
// 		<form class="space-y-5" @submit.prevent>
// 			<Email v-model="user.email" />
// 			<Password v-model="user.password" />

// 			<button
// 				:disabled="isSignupButtonDisabled"
// 				class="font-bold trasition duration-300 hover:text-yellow-800 hover:bg-yellow-300 block bg-yellow-400 w-full py-4 rounded text-yellow-900"
// 				@click="signUpButtonPressed"
// 			>
// 				Sign Up
// 			</button>
// 		</form>
// 	</div>
// </template>
// <style>
// 	.fade-enter-active,
// 	.fade-leave-active {
// 		transition: opacity 0.5s ease;
// 	}

// 	.fade-enter-from,
// 	.fade-leave-to {
// 		opacity: 0;
// 	}
// 	.slide-fade-enter-active {
// 		transition: all 0.3s ease-out;
// 	}

// 	.slide-fade-leave-active {
// 		transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
// 	}

// 	.slide-fade-enter-from,
// 	.slide-fade-leave-to {
// 		transform: translateX(20px);
// 		opacity: 0;
// 	}
// </style>-->
