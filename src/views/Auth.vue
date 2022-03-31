<script setup>
	import { defineAsyncComponent, ref, computed } from "vue";
	import { useUserStore } from "../stores/user";
	import JSConfetti from "js-confetti";

	const SignInC = defineAsyncComponent(() => import("../components/SignIn.vue"));
	const SignUpC = defineAsyncComponent(() => import("../components/SignUp.vue"));
	const signedIn = ref(false);
	const signIn = ref(true);
	const signUp = ref(false);
	const User = useUserStore();

	const toggleSign = async (wich) => {
		//await showConfetti();
		if (wich > 0) {
			signIn.value = true;
			signUp.value = false;
		} else {
			signUp.value = true;
			signIn.value = false;
		}
	};

	//burradas a mover a un componente
	const jsConfetti = new JSConfetti();
	const showConfetti = async () => {
		await jsConfetti.addConfetti({
			emojis: ["😉", "👌", "🎉"],
			emojiSize: 20,
			confettiNumber: 300,
			confettiColors: ["#ff0a54", "#ff477e", "#ff7096", "#ff85a1", "#fbb1bd", "#f9bec7"],
		});
	};
	const x = ref(0);
	function onMousemove(e) {
		x.value = e.clientX;
	}
	function subscribeUser() {
		console.log("form submitted! do something");
		toggleSign(1);
		showConfetti();
	}
	const createBackgroundString = computed(() => {
		return `linear-gradient(${x.value}deg, rgba(96, 165, 250 ,${x.value}), rgb(17, 24, 39))`;
	});
	//fin burradas
</script>

<template>
	<div
		class="home min-h-screen flex flex-col items-center justify-start bg-blue-400"
		@mousemove="onMousemove"
		:style="{ backgroundImage: createBackgroundString }"
	>
		<div
			class="m-10 p-10 w-1/2 max-w-sm mx-auto bg-white rounded shadow-lg flex items-center space-x-4"
			@mousemove="onMousemove"
			:style="{ backgroundColor: `hsl(${x}, 80%, 50%)` }"
		>
			<div class="shrink-0">
				<img class="h-12 w-12" src="/img/logo.png" alt="FeedMeLab Logo" />
			</div>
			<div>
				<div class="text-xl font-medium text-black">Welcome to Feed Me Lab</div>
				<p class="text-white">
					<a href="#" v-if="!signedIn" @click="toggleSign(1)">Sign In</a><a @click="signOut()" v-else>Sign Out</a> |
					<a href="#" @click="toggleSign(0)">Sign Up</a>
				</p>
			</div>
		</div>
		<!-- <SignInC /> -->

		<SignInC v-if="signIn" />

		<SignUpC v-if="signUp" @subscribe="subscribeUser" />
	</div>
</template>
<style scoped>
	.home {
		background: linear-gradient(rgb(96, 165, 250), rgb(17, 24, 39));
	}
</style>
