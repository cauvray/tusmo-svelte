<script lang="ts">
	import GameSettings from '$lib/components/GameSettings.svelte';
	import Keyboard from '$lib/components/Keyboard.svelte';
	import TusmoGrid from '$lib/components/TusmoGrid.svelte';
	import { PositionEnum } from '$lib/models/positionEnum';
	import type { Setting } from '$lib/models/Setting';
	import type { IState } from '$lib/models/tusmo';
	import { getWord } from '$lib/utils/getWord';
	import { Confetti } from 'svelte-confetti';

	const initialState: IState = {
		guesses: Array(6).fill(''),
		answers: [],
		answer: '',
		nbOfTry: 6,
		wordLength: 5,
		keyboard: new Map()
	};

	$: tusmo = structuredClone(initialState);

	$: gameIsStarted = false;
	$: selectedRow = 0;
	$: selectedIndex = 0;

	$: won = tusmo.answers.at(-1) === PositionEnum.EXACT.repeat(tusmo.wordLength);
	$: failed = tusmo.answers.length === tusmo.nbOfTry && !won;

	const isLetter = (keyCode: number) => {
		return keyCode > 64 && keyCode < 91;
	};

	const keydown = (event: KeyboardEvent) => {
		if (!gameIsStarted || event.metaKey || failed || won) return;

		if (event.key === 'Enter') {
			enter();
		} else if (event.key === 'Backspace') {
			removeLetter();
		} else if (isLetter(event.keyCode)) {
			updateLetter(event.key);
		}
	};

	const updateLetter = (letter: string) => {
		if (tusmo.guesses[selectedRow].length === tusmo.wordLength) {
			return;
		}
		tusmo.guesses[selectedRow] += letter.toLocaleUpperCase();
		if (selectedIndex < tusmo.wordLength - 1) {
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
		if (tusmo.guesses[selectedRow].length === tusmo.wordLength) {
			const guessWord = tusmo.guesses[selectedRow];
			const letters: string[] = Array.from(guessWord);
			//TODO: check if word exist

			const available = Array.from(tusmo.answer);
			const answer = Array(tusmo.wordLength).fill('_');
			const mapForKeyboard = new Map<string, string>();

			// first, find exact matches
			for (let i = 0; i < tusmo.wordLength; i += 1) {
				if (letters[i] === available[i]) {
					answer[i] = PositionEnum.EXACT;
					available[i] = ' ';
					mapForKeyboard.set(letters[i], PositionEnum.EXACT);
				}
			}

			// then find close matches (this has to happen
			// in a second step, otherwise an early close
			// match can prevent a later exact match)
			for (let i = 0; i < tusmo.wordLength; i += 1) {
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

	const startGame = (e: CustomEvent<Setting>) => {
		gameIsStarted = true;
		tusmo.wordLength = e.detail.wordlength;
		tusmo.nbOfTry = e.detail.nbOfTry;
		tusmo.answer = getWord(tusmo.wordLength);
	};
	const reset = () => {
		gameIsStarted = false;
		tusmo = structuredClone(initialState);
		tusmo.answer = getWord(tusmo.wordLength);
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
	{#if !gameIsStarted}
		<GameSettings on:start={startGame} />
	{:else}
		<TusmoGrid {selectedIndex} {selectedRow} {tusmo} {won} />
	{/if}

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
			class="mx-auto w-fit p-2 rounded-md bg-secondary text-white hover:bg-secondary-dark duration-200"
			on:click={reset}>Rejouer</button
		>
	{:else if gameIsStarted && !won && !failed}
		<Keyboard
			{tusmo}
			on:update={(e) => {
				if (e.detail) {
					updateLetter(e.detail);
				}
			}}
			on:remove={removeLetter}
			on:enter={enter}
		/>
	{/if}
</div>
