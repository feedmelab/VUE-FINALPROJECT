import { defineStore } from "pinia";
import { supabase } from "../supabase";
import router from "../router";
export const useUserStore = defineStore("user", {
	state: () => ({
		user: null,
	}),
	actions: {
		async fetchUser() {
			const user = supabase.auth.user();
			this.user = user;
		},
		async signUp(email, password, name) {
			console.log(email, password, name);
			const { user, error } = await supabase.auth.signUp({
				email: email,
				password: password,
			});
			if (error) throw error;
			if (user) {
				this.user = user;

				console.log(this.user);
			}
		},
		async signIn(email, password) {
			const { user, error } = await supabase.auth.signIn({
				email: email,
				password: password,
			});
			if (error) throw error;
			if (user) {
				this.user = user;
				console.log(this.user);
			}
		},
		async signOut() {
			let { error } = await supabase.auth.signOut();
			router.push("/auth");
			if (error) throw error;
			else router.push("/auth");
		},
		persist: {
			enabled: true,
			strategies: [
				{
					key: "user",
					storage: localStorage,
				},
			],
		},
	},
});
