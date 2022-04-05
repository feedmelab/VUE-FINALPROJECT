<script setup>
	import { ref, computed, onMounted } from "vue";
	import { useTaskStore } from "../stores/task";
	import { useUserStore } from "../stores/user";

	const x = ref(0);
	const User = useUserStore();
	const tasks = useTaskStore();
	const newTodo = ref("");
	const newEditTodo = ref("");
	const todos = ref([]);
	const el = ref();

	const addTodo = async (todo) => {
		const task = {
			user_id: User.user.id,
			title: newTodo.value,
			is_complete: false,
		};
		try {
			await useTaskStore().createTasks(task);
			await useTaskStore().fetchTasks();
			newTodo.value = "";
		} catch (e) {
			console.error(e.message);
		} finally {
			todos.value = tasks.tasks;
			newTodo.value = "";
			beforeEnter();
		}
	};

	const logout = async () => {
		await useUserStore().signOut();
	};

	const onMousemove = (e) => {
		x.value = e.clientX;
	};

	const setCompleteTodo = async (id, value) => {
		await useTaskStore().setCompletedTask(id, value);
		await useTaskStore().fetchTasks();
		todos.value = tasks.tasks;
		beforeEnter();
	};

	const editTodo = (id, value) => {
		newEditTodo.value = value;
		todos.value.filter((t) => {
			if (t.id === id) t.editing = true;
		});
	};
	const setUpdateTodo = async (id, value) => {
		await useTaskStore().setUpdateTask(id, value);
		showEditSplash(id);
		await useTaskStore().fetchTasks();
		todos.value = tasks.tasks;
		beforeEnter();
	};
	const showEditSplash = (id) => {
		todos.value.filter((t) => {
			t.id === id ? (t.editing = !t.editing) : null;
		});
	};
	const removeTodo = async (id) => {
		await useTaskStore().removeTask(id);
		await useTaskStore().fetchTasks();
		todos.value = tasks.tasks;
	};

	const pending = computed(() => {
		return todos.value.filter((todo) => !todo.is_complete);
	});

	const completed = computed(() => {
		return todos.value.filter((todo) => todo.is_complete);
	});

	const removeAll = async (estado) => {
		await useTaskStore().removeAll(estado);
		await useTaskStore().fetchTasks();
		todos.value = tasks.tasks;
	};
	const beforeEnter = () => {
		el.value.scrollIntoView({ behavior: "smooth" });
	};
	onMounted(async () => {
		await tasks.fetchTasks();
		todos.value = await useTaskStore().tasks;
	});
</script>
<template>
	<div class="home font-muntsa min-h-screen flex flex-col items-center justify-start bg-blue-200">
		<div class="container flex flex-row items-center justify-center bg-gray-900 sweeted">
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
				</div>
			</div>
		</div>
		<div class="container flex flex-row justify-end caixa_user p-2" v-if="User.user.email">
			<p>
				Logged as: <span>{{ User.user.email ? User.user.email.split("@")[0] : null }}</span> | <a href="#" @click="logout()">logout</a>
			</p>
		</div>
		<div class="container flex flex-col items-center justify-center bg-gray-light pt-5 topsweeted">
			<h3 class="mt-3">THE TODO APP</h3>
			<div>
				<div id="app" class="flex w-screen h-auto p-4">
					<div class="w-1/4 h-full w-full bg-grey-darkest"></div>
					<div class="flex flex-col justify-between w-full h-full bg-grey-lightest rounded-lg p-2 shadow-md">
						<div class="flex-col me-15 mt-5 w-full h-full bg-gray-200 rounded-lg p-2 shadow-md">
							<Transition tag="div" name="fade" class="new-todo" appear>
								<div class="new-todo flex items-center border-b border-b-2 border-teal py-2 my-10">
									<textarea
										class="textsarea mr-3 py-1 px-2"
										type="text"
										placeholder="New Todo"
										aria-label="Full name"
										v-model="newTodo"
										required
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
										class="cancel flex-no-shrink border-transparent border-4 text-red hover:text-teal-darker text-sm py-1 px-2 rounded"
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
						<!-- PENDIENTES -->
						<template v-else>
							<div class="grid grid-cols-2 mt-10">
								<div class="todo-cards w-full flex flex-col justify-start">
									<span class="text-3 text-red-500">Pendientes</span>
									<template v-if="pending.length">
										<div class="flex flex-row w-full h-auto flex-col p-1 mt-4 rounded-lg" v-for="todo in pending" :key="todo.id">
											<TransitionGroup tag="div" name="fade" class="container" appear>
												<div
													class="flex flex-row font-sans font-light h-24 text-1 text-center bg-gray-500 p-3 shadow-md rounded-lg"
													:key="todo.id"
												>
													<!-- STD VIEW -->
													<template v-if="!todo.editing">
														<!-- PRIMERA ICONA -->
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
														<!-- FIN PRIMERA ICONA -->
														<!-- CAJA TEXTO CENTRAL -->
														<div class="w-full p-2 grid justify-items-stretch">
															<p class="text-left bloque-texto w-full"><span>Task: </span>{{ todo.title }}</p>
															<div class="extra-info justify-self-start mb-0 mt-2">
																<p class="w-full" v-if="todo.inserted_at"><span>Started at:</span> {{ todo.inserted_at.split(".", 1) }}</p>
																<p class="w-full" v-if="todo.updated_at"><span>Edited at:</span> {{ todo.updated_at.split(".", 1) }}</p>
															</div>
														</div>
														<!-- FIN CAJA -->
														<!-- BOTONERA LATERAL -->
														<div class="flex flex-col align-left justify-between w-1/10">
															<button @click="setCompleteTodo(todo.id, true)">
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	class="h-6 w-6"
																	fill="none"
																	viewBox="0 0 24 24"
																	stroke="green"
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
															<button
																class="bg-red hover:bg-red text-blue-900 text-sm rounded"
																aria-hidden="true"
																@click="removeTodo(todo.id)"
															>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	class="h-6 w-6"
																	fill="none"
																	viewBox="0 0 24 24"
																	stroke="yellow"
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
														<!-- FIN BOTONERA LATERAL -->
													</template>

													<!-- PENDIENTE EDITVIEW -->
													<template v-else-if="todo.editing">
														<div class="w-8">
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
														</div>
														<div class="w-full p-2 flex flex-row justify-items-stretch">
															<div class="w-full grid grid-cols-3">
																<div class="w-56">
																	<textarea type="text" class="textsarea" id="formControlTextarea" v-model="newEditTodo" />
																</div>
															</div>
															<div class="w-8 border-dark text-right">
																<div>
																	<button @click="setUpdateTodo(todo.id, newEditTodo)">
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			class="h-6 w-6"
																			fill="none"
																			viewBox="0 0 24 24"
																			stroke="green"
																			stroke-width="2"
																		>
																			<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
																		</svg>
																	</button>
																</div>
																<div>
																	<button @click="showEditSplash(todo.id)">
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			class="h-6 w-6"
																			fill="none"
																			viewBox="0 0 24 24"
																			stroke="red"
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
										<div class="w-full flex flex-row justify-end mt-1 mb-5">
											<button class="clear-all rounded" v-if="pending.length && pending.length > 1" @click="removeAll(false)">
												Remove All
											</button>
										</div>
									</template>
									<template v-else><p class="nothing">No tasks pending yet</p></template>
								</div>

								<div class="todo-cards w-full flex flex-col justify-start">
									<span class="text-2/1 text-blue-400">Completados</span>
									<div ref="el"></div>
									<template v-if="completed.length">
										<div
											class="completed flex flex-row w-full h-auto flex-col p-1 mt-4 rounded-lg"
											v-for="todo in completed"
											:key="todo.id"
										>
											<div ref="el"></div>
											<TransitionGroup tag="div" name="fade" class="container" appear v-on:before-enter="beforeEnter(todo.id)">
												<div
													class="flex flex-row font-sans font-light h-24 text-1 text-center bg-blue-500 p-3 shadow-md rounded-lg"
													:key="todo.id"
													:id="todo.id"
												>
													<!-- first icon -->
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
													<!-- end first icon -->
													<!-- start text -->
													<div class="w-full p-2 grid justify-items-stretch">
														<p class="text-left w-full bloque-texto mb-2"><span>Task: </span>{{ todo.title }}</p>
														<div class="text-left flex flex-row extra-info">
															<p class="w-full" v-if="todo.inserted_at"><span>Started at:</span> {{ todo.inserted_at.split(".", 1) }}</p>
															<p class="w-full" v-if="todo.updated_at"><span>Edited at:</span> {{ todo.updated_at.split(".", 1) }}</p>
															<p class="w-full" v-if="todo.completed_at">
																<span>Completed at:</span> {{ todo.completed_at.split(".", 1) }}
															</p>
														</div>
													</div>
													<!-- end text -->

													<!-- start buttons -->
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

														<button
															class="bg-red hover:bg-red text-blue-900 text-sm rounded"
															aria-hidden="true"
															@click="removeTodo(todo.id)"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-6 w-6"
																fill="none"
																viewBox="0 0 24 24"
																stroke="yellow"
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
													<!-- end  buttons -->
												</div>
											</TransitionGroup>
										</div>
										<div class="w-full flex flex-row justify-end mt-1 mb-5">
											<button class="clear-all rounded" v-if="completed.length && completed.length > 1" @click="removeAll(true)">
												Remove All
											</button>
										</div>
									</template>
									<template v-else><p class="nothing">No tasks pending yet</p></template>
								</div>
							</div>
						</template>
					</div>
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
		font-size: 0.7rem;
		margin-right: 0.4rem;
		width: 10rem;
		height: 2rem;
		color: white;
		background-color: #150136;
		border: 1px solid rgba(21, 1, 54, 0.17);
	}
	button.cancel {
		font-size: 0.7rem;
		margin-right: 0.4rem;
		width: 10rem;
		height: 2rem;
		color: white;
		background-color: #df0000;
		border: 1px solid rgba(21, 1, 54, 0.17);
	}
	.new-todo textarea {
		height: 3rem;
		width: 100%;
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
		text-align: left;
	}
	.extra-info span {
		font-weight: bold;
		margin-left: 0px;
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
	.bloque-texto {
		display: flex;
		width: 100%;
		overflow-y: auto;
		height: auto;
		border-bottom: 1px solid rgba(82, 75, 75, 0.3) !important;
	}
	.bloque-texto span {
		margin-right: 0.5rem;
	}
	.textsarea {
		display: flex;
		width: 100%;
		font-size: 0.8rem;
		overflow-y: auto;
		height: auto;
		padding: 0.6rem;
		border-bottom: 1px solid rgba(82, 75, 75, 0.3) !important;
	}
	.nothing {
		color: rgb(11, 3, 34);
	}
	.clear-all {
		font-size: 0.6rem;
		justify-self: center;
		width: 25%;
		color: white;
		background-color: rgba(247, 0, 0, 0.801);
		border: 1px solid rgba(11, 3, 34, 0.12);
	}
	.home {
		background: linear-gradient(rgb(191, 219, 254), rgb(17, 24, 39));
	}
</style>
