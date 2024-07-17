<script lang="ts">
	import type { Setting } from '$lib/models/Setting';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<Record<'start', Setting>>();

	$: form = {
		wordlength: 5,
		nbOfTry: 6
	};
	const submit = () => {
		dispatch('start', { ...form });
	};
</script>

<form class="mx-auto flex flex-col gap-6" on:submit|preventDefault={submit} method="POST">
	<div class="flex gap-4">
		<div class="flex flex-col">
			<label for="wordLength">Longeur du mot</label>
			<input
				class="text-center"
				type="number"
				name="wordLength"
				min={4}
				max={5}
				bind:value={form.wordlength}
			/>
		</div>

		<div class="flex flex-col">
			<label for="lineNumber">Nombre d'essais</label>
			<input
				class="text-center"
				type="number"
				name="lineNumber"
				min={1}
				max={10}
				bind:value={form.nbOfTry}
			/>
		</div>
	</div>

	<button
		disabled={Object.values(form).some((value) => !value)}
		type="submit"
		class="mx-auto w-fit py-2 px-6 rounded-md bg-secondary text-white hover:bg-secondary-dark duration-200 disabled:bg-slate-300"
		>Start</button
	>
</form>
