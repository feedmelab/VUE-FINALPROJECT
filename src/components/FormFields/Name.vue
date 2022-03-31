<template>
	<div>
		<div class="field">
			<div class="ui left icon input big">
				<label for="name" class="block mb-1 font-bold text-gray-700">Name: </label>
				<input
					type="text"
					placeholder="Full Name"
					autocomplete="off"
					v-model="input"
					@keyup="validateInput"
					@blur="validateInput"
					@input="$emit('update:modelValue', $event.target.value)"
					class="outline-none focus:border-yellow-500 p-3 border-2 rounded w-full border-gray-200"
				/>
			</div>
			<div class="ui basic label pointing red" v-if="errors.name">
				{{ errors.name }}
			</div>
		</div>
	</div>
</template>
<script>
	import { ref } from "vue";
	import useFormValidation from "../../modules/useFormValidation";
	export default {
		setup() {
			let input = ref("");
			const { validateNameField, errors } = useFormValidation();
			const validateInput = () => {
				validateNameField("name", input.value);
			};
			return { input, errors, validateInput };
		},
	};
</script>
