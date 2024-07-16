<script lang="ts">
	import { PositionEnum } from '$lib/models/positionEnum';
	import type { IState } from '$lib/models/tusmo';

	export let nbOfTry = 6;
	export let wordLength = 5;
	export let selectedRow: number;
	export let selectedIndex: number;
	export let tusmo: IState;
	export let won: boolean;
</script>

{#each Array.from(Array(nbOfTry).keys()) as row (row)}
	<div class="flex gap-1 justify-center items-center">
		{#each Array.from(Array(wordLength).keys()) as column (column)}
			{@const currentRow = row === selectedRow}
			{@const answer = tusmo.answers[row]?.[column]}
			{@const selected = selectedRow === row && selectedIndex === column}
			{@const exact = answer === PositionEnum.EXACT}
			{@const close = answer === PositionEnum.CLOSE}

			<div
				class={`w-8 h-8 flex items-center justify-center rounded-md 
					${selected && ' border-2 border-secondary'} 
					${exact ? 'bg-primary text-white' : 'bg-white'} 
					${close && 'border-2 border-primary'} 
					${currentRow && 'drop-shadow-md'} 
					${won && row >= tusmo.answers.length && 'hidden'}
					duration-200`}
			>
				{tusmo.guesses[row]?.[column] ?? ''}
			</div>
		{/each}
	</div>
{/each}
