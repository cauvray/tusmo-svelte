import { writable } from 'svelte/store';
import { Theme } from './models/ThemeEnum';

const theme = writable(Theme.BLUE);

export { theme };
