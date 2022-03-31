import { faArrowsToDot } from "@fortawesome/free-solid-svg-icons";
import { defineStore } from "pinia";
import { supabase } from "../supabase";
import { useUserStore } from "../stores/user";

export const useTaskStore = defineStore("tasks", {
	state: () => ({
		tasks: null,
	}),
	actions: {
		async fetchTasks() {
			try {
				const { data: tasks } = await supabase.from("tasks").select("*").order("id", { ascending: true });
				this.tasks = tasks;
			} catch (error) {
				console.error(error);
			}
		},
		async createTasks(item) {
			const { data, error } = await supabase.from("tasks").insert([
				{
					user_id: item.user_id,
					title: item.title,
					is_complete: item.is_complete,
				},
			]);
			if (error) throw error;
			this.fetchTasks();
		},
		async setCompletedTask(id_task, value) {
			const { data, error } = await supabase
				.from("tasks")
				.update({ is_complete: value, completed_at: value ? new Date().toUTCString() : null })
				.match({ id: id_task });
			this.fetchTasks();
			if (data) return data;
			if (error) throw error;
		},
		async updateTask(id_task, value) {
			const { data, error } = await supabase.from("tasks").update({ title: value }).match({ id: id_task });
			this.fetchTasks();
			if (data) return data;
			if (error) throw error;
		},
	},
});