<script lang="ts">
	import { PositionEnum } from '$lib/models/positionEnum';
	import type { IState } from '$lib/models/tusmo';
	import { getWord } from '$lib/utils/getWord';
	import { Confetti } from 'svelte-confetti';

	const wordLength = 5;

	const initialState: IState = {
		guesses: Array(6).fill(''),
		answers: [],
		answer: getWord(),
		nbOfTry: 6,
		keyboard: new Map()
	};

	$: tusmo = structuredClone(initialState);

	$: selectedRow = 0;
	$: selectedIndex = 0;

	$: won = tusmo.answers.at(-1) === PositionEnum.EXACT.repeat(wordLength);
	$: failed = tusmo.answers.length === tusmo.nbOfTry && !won;

	const isLetter = (keyCode: number) => {
		return keyCode > 64 && keyCode < 91;
	};

	const keydown = (event: KeyboardEvent) => {
		if (event.metaKey || failed || won) return;

		if (event.key === 'Enter') {
			enter();
		} else if (event.key === 'Backspace') {
			removeLetter();
		} else if (isLetter(event.keyCode)) {
			updateLetter(event.key);
		}
	};

	const updateLetter = (letter: string) => {
		if (tusmo.guesses[selectedRow].length === wordLength) {
			return;
		}
		tusmo.guesses[selectedRow] += letter.toLocaleUpperCase();
		if (selectedIndex < wordLength - 1) {
			selectedIndex += 1;
		}
	};
	const removeLetter = () => {
		const value = tusmo.guesses[selectedRow].slice(0, -1);
		tusmo.guesses[selectedRow] = value;
		if (selectedIndex !== 0) {
			selectedIndex -= 1;
		}
	};

	const enter = () => {
		if (tusmo.guesses[selectedRow].length === wordLength) {
			const guessWord = tusmo.guesses[selectedRow];
			const letters: string[] = Array.from(guessWord);
			//TODO: check if word exist

			const available = Array.from(tusmo.answer);
			const answer = Array(wordLength).fill('_');
			const mapForKeyboard = new Map<string, string>();

			// first, find exact matches
			for (let i = 0; i < wordLength; i += 1) {
				if (letters[i] === available[i]) {
					answer[i] = PositionEnum.EXACT;
					available[i] = ' ';
					mapForKeyboard.set(letters[i], PositionEnum.EXACT);
				}
			}

			// then find close matches (this has to happen
			// in a second step, otherwise an early close
			// match can prevent a later exact match)
			for (let i = 0; i < wordLength; i += 1) {
				if (answer[i] === '_') {
					const index = available.indexOf(letters[i]);
					if (index !== -1) {
						answer[i] = PositionEnum.CLOSE;
						available[index] = ' ';
						if (!mapForKeyboard.get(letters[i])) {
							mapForKeyboard.set(letters[i], PositionEnum.CLOSE);
						}
					} else {
						if (!mapForKeyboard.get(letters[i])) {
							mapForKeyboard.set(letters[i], PositionEnum.MISSING);
						}
					}
				}
			}
			tusmo = {
				...tusmo,
				answers: [...tusmo.answers, answer.join('')],
				keyboard: new Map([...tusmo.keyboard, ...mapForKeyboard])
			};

			console.log(tusmo);
			selectedRow += 1;
			selectedIndex = 0;
		}
	};

	const reset = () => {
		tusmo = structuredClone(initialState);
		tusmo.answer = getWord();
		selectedIndex = 0;
		selectedRow = 0;
	};
</script>

<svelte:window on:keydown={keydown} />

<svelte:head>
	<title>Tusmo</title>
	<meta name="description" content="A Wordle clone written in SvelteKit" />
</svelte:head>

<div class="flex flex-col gap-4">
	{#each Array.from(Array(tusmo.nbOfTry).keys()) as row (row)}
		<div class="flex gap-1 justify-center items-center">
			{#each Array.from(Array(wordLength).keys()) as column (column)}
				{@const currentRow = row === selectedRow}
				{@const answer = tusmo.answers[row]?.[column]}
				{@const selected = selectedRow === row && selectedIndex === column}
				{@const exact = answer === PositionEnum.EXACT}
				{@const close = answer === PositionEnum.CLOSE}

				<div
					class={`w-8 h-8 flex items-center justify-center rounded-md 
					${selected && ' border-2 border-orange-500'} 
					${exact ? 'bg-blue-900 text-white' : 'bg-white'} 
					${close && 'border-2 border-blue-900'} 
					${currentRow && 'drop-shadow-md'} 
					${won && row >= tusmo.answers.length && 'hidden'}
					duration-200`}
				>
					{tusmo.guesses[row]?.[column] ?? ''}
				</div>
			{/each}
		</div>
	{/each}
	{#if failed}
		<div class="text-red-500 text-center">Perdu ! La réponse était {tusmo.answer}</div>
	{/if}
	{#if won}
		<div class="text-green-500 text-center">Gagné !</div>
		<div class="mx-auto">
			<Confetti x={[-1, 1]} infinite cone />
		</div>
	{/if}
	{#if won || failed}
		<button
			class="mx-auto w-fit p-2 rounded-md bg-blue-900 text-white hover:bg-blue-950 duration-200"
			on:click={reset}>Rejouer</button
		>
	{/if}
	<div class="flex flex-col gap-1">
		{#each ['azertyuiop', 'qsdfghjklm', 'wxcvbn'] as row}
			<div class="flex gap-1 justify-center">
				{#each row as letter}
					{@const missing = tusmo.keyboard.get(letter.toLocaleUpperCase()) === PositionEnum.MISSING}
					{@const exact = tusmo.keyboard.get(letter.toLocaleUpperCase()) === PositionEnum.EXACT}
					{@const close = tusmo.keyboard.get(letter.toLocaleUpperCase()) === PositionEnum.CLOSE}
					<button
						class={`p-2 w-6 hover:bg-slate-200 duration-200 ${exact ? 'bg-blue-900 text-white' : 'bg-white'} ${close && 'border-2 border-blue-900'} ${missing && 'bg-slate-200 text-slate-400'}`}
						aria-label={letter}
						on:click|preventDefault={() => updateLetter(letter)}
						disabled={failed || won}
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
				on:click|preventDefault={removeLetter}
				disabled={failed || won}
			>
				BACK ←
			</button>
			<button
				class="text-xs bg-white p-2 hover:bg-slate-200 duration-200"
				aria-label={'Enter'}
				on:click|preventDefault={enter}
				disabled={failed || won}
			>
				ENTER &#x21A9;
			</button>
		</div>
	</div>
</div>
