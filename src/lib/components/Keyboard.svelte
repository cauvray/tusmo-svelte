<script lang="ts">
	import { PositionEnum } from '$lib/models/positionEnum';
	import type { IState } from '$lib/models/tusmo';
	import { createEventDispatcher } from 'svelte';

	export let tusmo: IState;

	const dispatch =
		createEventDispatcher<Record<'update' | 'remove' | 'enter', string | undefined>>();
</script>

<div class="flex flex-col gap-1">
	{#each ['AZERTYUIOP', 'QSDFGHJKLM', 'WXCVBN'] as row}
		<div class="flex gap-1 justify-center">
			{#each row as letter}
				{@const missing = tusmo.keyboard.get(letter) === PositionEnum.MISSING}
				{@const exact = tusmo.keyboard.get(letter) === PositionEnum.EXACT}
				{@const close = tusmo.keyboard.get(letter) === PositionEnum.CLOSE}
				<button
					class={`p-2 w-8 ${exact ? 'hover:bg-primary-dark' : 'hover:bg-slate-200'} duration-200 ${exact ? 'bg-primary text-white' : 'bg-white'} ${close && 'border-2 border-primary'} ${missing && 'bg-slate-200 text-slate-400'}`}
					aria-label={letter}
					on:click|preventDefault={() => dispatch('update', letter)}
				>
					{letter}
				</button>
			{/each}
		</div>
	{/each}

	<div class="flex gap-1 mx-auto">
		<button
			class="text-xs bg-white p-2 hover:bg-slate-200 duration-200"
			aria-label={'Back'}
			on:click|preventDefault={() => dispatch('remove')}
		>
			BACK ←
		</button>
		<button
			class="text-xs bg-white p-2 hover:bg-slate-200 duration-200"
			aria-label={'Enter'}
			on:click|preventDefault={() => dispatch('enter')}
		>
			ENTER &#x21A9;
		</button>
	</div>
</div>
