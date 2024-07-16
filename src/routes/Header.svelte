<script>
	import logo from '$lib/images/svelte-logo.svg';
	import github from '$lib/images/github.svg';
	import { theme } from '$lib/store';
	import { Theme } from '$lib/models/ThemeEnum';

	const themes = [
		{ color: 'bg-blue-900', value: Theme.BLUE },
		{ color: 'bg-purple-800', value: Theme.PURPLE },
		{ color: 'bg-teal-600', value: Theme.TEAL },
		{ color: 'bg-pink-700', value: Theme.PINK },
		{ color: 'bg-amber-700', value: Theme.AMBER },
		{ color: 'bg-yellow-500', value: Theme.YELLOW }
	];
</script>

<header>
	<div class="corner">
		<a href="https://kit.svelte.dev">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div>

	<nav class="flex justify-center p-2 gap-2 bg-white/70 h-fit">
		{#each themes as t (t.value)}
			<button
				class={`hover:scale-125 rounded-full h-4 w-4 duration-200 ${t.color} ${t.value === $theme && 'scale-125'}`}
				on:click={() => theme.set(t.value)}
			></button>
		{/each}
	</nav>

	<div class="corner">
		<a href="https://github.com/cauvray">
			<img src={github} alt="GitHub" />
		</a>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}
</style>
