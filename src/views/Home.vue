<script setup>
	import { ref, computed, onMounted } from "vue";
	import { useTaskStore } from "../stores/task";
	import { useUserStore } from "../stores/user";

	const User = useUserStore();
	const tasks = useTaskStore();
	const newTodo = ref("");
	const newEditTodo = ref("");
	const todos = ref([]);
	const editing = ref([]);
	const addTodo = async (todo) => {
		const task = {
			user_id: User.user.id,
			title: newTodo.value,
			is_complete: false,
		};
		try {
			await useTaskStore().createTasks(task);
			await useTaskStore().fetchTasks();
			editing.value.push({ id: id, editing: false });
		} catch (e) {
			console.error(e.message);
		} finally {
			todos.value = tasks.tasks;
		}
	};

	const setCompleteTodo = async (id, value) => {
		await useTaskStore().setCompletedTask(id, value);
		await useTaskStore().fetchTasks();
		todos.value = tasks.tasks;
		console.log(id);
	};
	const editTodo = (id, value) => {
		newEditTodo.value = value;
		editing.value.filter((ed) => ed);
		// editing.value.push({ id: id, editing: false });
		// console.log(editing.value);
		// showEditSplash(id);
	};
	const showEditSplash = (id) => {
		console.log("Id: ", id);
		editing.value.filter((e) => {
			e.id === id ? (e.editing = true) : null;
		});

		console.log(editing.value);
		//editing.value.id = !editing[id];
	};
	const removeTodo = (todoId) => {
		todos.value.splice(todoId, 1);
	};
	const clearAll = () => {
		todos.value = "";
	};

	const pending = computed(() => {
		return todos.value.filter((todo) => !todo.is_complete);
	});
	const completed = computed(() => {
		return todos.value.filter((todo) => todo.is_complete);
	});

	onMounted(async () => {
		await tasks.fetchTasks();
		todos.value = await useTaskStore().tasks;

		//console.log(todos.value[0]);
	});
</script>
<template>
	<div class="font-muntsa min-h-screen flex flex-col items-center justify-start bg-blue-200">
		<div class="container flex flex-row items-center justify-center bg-gray-900 sweeted">
			<h2>FEEDMELAB</h2>
		</div>
		<div class="container flex flex-row justify-end caixa_user p-2">
			<p>
				Logged as: <span>{{ User.user.email.split("@")[0] }}</span> | <a href>logout</a>
			</p>
		</div>
		<div class="container flex flex-col items-center justify-center bg-gray-100 topsweeted">
			<h3>THE TODO APP</h3>
			<div>
				<div id="app" class="flex w-screen h-auto p-4">
					<div class="w-1/4 h-full w-full bg-grey-darkest"></div>
					<div class="flex flex-col justify-between w-full h-full bg-grey-lightest rounded-lg p-2 shadow-md">
						<div class="flex-col me-15 mt-5 w-full h-full bg-gray-200 rounded-lg p-2 shadow-md">
							<Transition tag="div" name="fade" class="new-todo" appear>
								<div class="new-todo flex items-center border-b border-b-2 border-teal py-2 my-10">
									<textarea
										class="font-sans font-thin text-1x2 appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none"
										type="text"
										placeholder="New Todo"
										aria-label="Full name"
										v-model="newTodo"
										@keypress.enter="addTodo(newTodo)"
									/>
									<button
										class="flex-no-shrink bg-purple hover:bg-purple-dark border-purple hover:border-purple-dark text-sm border-4 text-blue-900 p-1 px-2 rounded"
										type="button"
										@click="addTodo(newTodo)"
									>
										Añadir Tarea
									</button>
									<button
										class="flex-no-shrink border-transparent border-4 text-red hover:text-teal-darker text-sm py-1 px-2 rounded"
										type="button"
										@click="cancelTodo()"
									>
										Cancel
									</button>
								</div>
							</Transition>
						</div>
						<template v-if="todos.value">
							<h4 class="flex-1 font-sans font-thin text-center text-3xl text-grey-darker bg-teal-lighter p-4 m-1">No todos yet</h4>
						</template>
						<template v-else>
							<div class="grid grid-cols-2 mt-10">
								<div class="todo-cards w-full flex flex-col justify-start">
									<span class="text-2/1 text-gray-500">Pendientes</span>
									<div class="flex flex-row w-full h-auto flex-col p-1 mt-4 rounded-lg" v-for="todo in pending" :key="todo.user_id">
										<TransitionGroup tag="div" name="fade" class="container" appear>
											<div
												class="flex flex-row font-sans font-light h-24 text-1 text-center bg-gray-500 p-3 shadow-md rounded-lg"
												:key="todo.user_id"
											>
												<template v-if="!editing.value"
													><svg
														xmlns="http://www.w3.org/2000/svg"
														class="h-6 w-6"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
														stroke-width="2"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
														/>
													</svg>
													<div class="w-full p-2 grid justify-items-stretch">
														<p class="text-left w-full"><span>Task: </span>{{ todo.title }}</p>
														<div class="extra-info justify-self-start mb-0">
															<p class="w-full" v-if="todo.inserted_at"><span>Started at:</span> {{ todo.inserted_at.split(".", 1) }}</p>
															<p class="w-full" v-if="todo.updated_at"><span>Edited at:</span> {{ todo.updated_at.split(".", 1) }}</p>
														</div>
													</div>
													<div class="w-full border-dark text-right">
														<button @click="setCompleteTodo(todo.id, true)">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-6 w-6"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
																stroke-width="2"
															>
																<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
															</svg>
														</button>
														<button @click="editTodo(todo.id, todo.title)">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-6 w-6"
																fill="none"
																viewBox="0 0 24 24"
																stroke="white"
																stroke-width="2"
															>
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
																/>
															</svg>
														</button>
														<button class="bg-red hover:bg-red text-blue-900 text-sm rounded" aria-hidden="true" @click="removeTodo(index)">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-6 w-6"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
																stroke-width="2"
															>
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
																/>
															</svg>
														</button>
													</div>
												</template>
												<template v-else>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														class="h-6 w-6"
														fill="none"
														viewBox="0 0 24 24"
														stroke="red"
														stroke-width="2"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
														/>
													</svg>
													<div class="w-full p-2">
														<div class="grid grid-cols-3 gap-2">
															<div>
																<textarea
																	type="text"
																	class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
																	id="formControlTextarea"
																	rows="3"
																	v-model="newEditTodo"
																/>
															</div>
															<div>
																<button>
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		class="h-6 w-6"
																		fill="none"
																		viewBox="0 0 24 24"
																		stroke="currentColor"
																		stroke-width="2"
																	>
																		<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
																	</svg>
																</button>
															</div>
															<div>
																<button @click="showEditSplash">
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		class="h-6 w-6"
																		fill="none"
																		viewBox="0 0 24 24"
																		stroke="currentColor"
																		stroke-width="2"
																	>
																		<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
																	</svg>
																</button>
															</div>
														</div>
													</div>
												</template>
											</div>
										</TransitionGroup>
									</div>
									<button class="clear-all rounded" @click="clearAll()">CLEAR ALL</button>
								</div>
								<div class="todo-cards w-full flex flex-col justify-start">
									<span class="text-2/1 text-blue-400">Completados</span>
									<div class="flex flex-row w-full h-auto flex-col p-1 mt-4 rounded-lg" v-for="todo in completed" :key="todo.user_id">
										<TransitionGroup tag="div" name="fade" class="container" appear>
											<div
												class="flex flex-row font-sans font-light h-24 text-1 text-center bg-blue-500 p-3 shadow-md rounded-lg"
												:key="todo.user_id"
											>
												<div class="w-8">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														class="h-6 w-6"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
														stroke-width="2"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
														/>
													</svg>
												</div>
												<div class="w-full p-2 grid justify-items-stretch">
													<p class="text-left w-full"><span>Task: </span>{{ todo.title }}</p>
													<div class="extra-info justify-self-start mb-0">
														<p class="w-full" v-if="todo.inserted_at"><span>Started at:</span> {{ todo.inserted_at.split(".", 1) }}</p>
														<p class="w-full" v-if="todo.updated_at"><span>Edited at:</span> {{ todo.updated_at.split(".", 1) }}</p>
														<p class="w-full" v-if="todo.completed_at"><span>Completed at:</span> {{ todo.completed_at.split(".", 1) }}</p>
													</div>
												</div>

												<div class="flex flex-col align-left justify-between w-1/10">
													<button @click="setCompleteTodo(todo.id, false)">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															class="h-6 w-6"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
															stroke-width="2"
														>
															<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
														</svg>
													</button>

													<button class="bg-red hover:bg-red text-blue-900 text-sm rounded" aria-hidden="true" @click="removeTodo(index)">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															class="h-6 w-6"
															fill="none"
															viewBox="0 0 24 24"
															stroke="white"
															stroke-width="2"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
															/>
														</svg>
													</button>
												</div>
											</div>
										</TransitionGroup>
									</div>
									<button class="clear-all rounded" @click="clearAll()">CLEAR ALL</button>
								</div>
							</div>
						</template>
					</div>
					<!-- <div class="flex-col w-1/2 h-full bg-grey-lightest rounded-lg p-2 shadow-md">
						<div class="flex items-center border-b border-b-2 border-teal py-2">
							<input
								class="font-sans font-thin text-1x2 appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none"
								type="text"
								placeholder="New Todo"
								aria-label="Full name"
								v-model="newTodo"
								@keypress.enter="addTodo(newTodo)"
							/>
							<button
								class="flex-no-shrink bg-purple hover:bg-purple-dark border-purple hover:border-purple-dark text-sm border-4 text-blue-900 py-1 px-2 rounded"
								type="button"
								@click="addTodo(newTodo)"
							>
								Add
							</button>
							<button
								class="flex-no-shrink border-transparent border-4 text-red hover:text-teal-darker text-sm py-1 px-2 rounded"
								type="button"
								@click="cancelTodo()"
							>
								Cancel
							</button>
						</div>
					</div> -->

					<div class="w-1/4 h-full bg-grey-darkest"></div>
				</div>
			</div>
		</div>
	</div>
</template>
<style scoped>
	.caixa_user p {
		color: rgba(30, 2, 77, 0.5);
	}
	.caixa_user span {
		color: rgb(0, 0, 0);
	}
	.sweeted {
		border-bottom-left-radius: 0.4rem;
		border-bottom-right-radius: 0.4rem;
		display: flex;
		justify-content: center;
	}
	.todo-cards {
		border-bottom: 0.1rem solid rgb(155, 149, 149);

		/* text-align: center; */
		/* margin: 0.4rem; */
	}
	h3,
	span,
	h4 {
		font-weight: bold;
		/* color: rgb(11, 3, 34); */
	}
	.topsweeted {
		border-top-left-radius: 0.4rem;
		border-top-right-radius: 0.4rem;
		display: flex;
		justify-content: center;
		min-height: 50vh;
	}
	h2 {
		font-size: 1.3rem;
		font-weight: bold;
		margin: 0;
		margin-top: 5rem;
		margin-bottom: 2.5rem;
		color: white;
	}
	h3 {
		font-size: 1.3rem;
		font-weight: bold;
		margin: 0;
		margin-bottom: 2rem;
		margin-bottom: 2.5rem;
		color: rgb(11, 3, 34);
	}
	p {
		font-size: 0.7rem;
		color: rgb(255, 255, 255);
	}
	button {
		border: 0px solid rgba(255, 0, 0, 0.178);
		padding: 0.15rem;
		margin: 0;
		padding: 0;
		/* font-size: 0.8rem;
		width: 8rem; */
	}
	.new-todo button {
		font-size: 0.8rem;
		width: 8rem;
	}
	.new-todo textarea {
		height: 3rem;
		width: 4rem;
		background: #f3f3f3;
	}
	.shadow-inner {
		/* text-shadow: 0px 2px 3px rgba(255, 255, 255, 0.8); */
		-webkit-background-clip: text;
		-moz-background-clip: text;
		background-clip: text;
	}
	.extra-info p {
		font-size: 0.55rem !important;
		color: rgb(0, 0, 0);
	}
	.extra-info span {
		font-weight: normal;
	}
	.container {
		position: relative;
		padding: 0;
	}

	.item {
		width: 100%;
		height: 30px;
		background-color: #f3f3f3;
		border: 1px solid #666;
		box-sizing: border-box;
	}

	/* 1. declare transition */
	.fade-move,
	.fade-enter-active,
	.fade-leave-active {
		transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
	}

	/* 2. declare enter from and leave to state */
	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
		transform: scaleY(0.01) translate(30px, 0);
	}

	/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
	.fade-leave-active {
		position: absolute;
	}
</style>
