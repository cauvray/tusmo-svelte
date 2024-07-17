import { words } from './words';

export const getWord = (wordLength: number): string => {
	const list = words.get(wordLength) as string[];
	const index = Math.floor(Math.random() * list.length);
	return list[index];
};
