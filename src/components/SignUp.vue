<script setup>
	import { defineAsyncComponent, ref } from "vue";

	import { reactive } from "@vue/reactivity";
	import useFormValidation from "../modules/useFormValidation";
	import useSubmitButtonState from "../modules/useSubmitButtonState";
	import { useUserStore } from "../stores/user";

	const Name = defineAsyncComponent(() => import("./FormFields/Name.vue"));
	const Email = defineAsyncComponent(() => import("./FormFields/Email.vue"));
	const Password = defineAsyncComponent(() => import("./FormFields/Password.vue"));

	const emit = defineEmits(["subscribe"]);
	const subscribe = () => emit("subscribe");

	let user = reactive({
		name: "",
		email: "",
		password: "",
	});

	const { errors } = useFormValidation();
	const { isSignupButtonDisabled } = useSubmitButtonState(user, errors);
	const passUserToDB = async () => {
		try {
			console.log(user.email, user.password, user.name);
			await useUserStore().signUp(user.email, user.password, user.name);
			subscribe();
		} catch (error) {
			console.error(error);
		}
	};
</script>
<template>
	<div class="bg-white p-16 rounded shadow-2xl w-1/2 max-w-sm">
		<h2 class="font-muntsa text-3xl font-bold mb-10 text-gray-800">Create your account</h2>
		<form class="space-y-5" @submit.prevent>
			<Name v-model="user.name" />
			<Email v-model="user.email" />
			<Password v-model="user.password" />

			<button
				@subscribe="subscribe"
				:disabled="isSignupButtonDisabled"
				class="font-bold trasition duration-300 hover:text-yellow-800 hover:bg-yellow-300 block bg-yellow-400 w-full py-4 rounded text-yellow-900"
				@click="passUserToDB"
			>
				Sign Up
			</button>
		</form>
	</div>
</template>
