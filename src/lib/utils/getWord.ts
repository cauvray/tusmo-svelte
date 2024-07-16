import { words5letters } from './words';

export const getWord = (): string => {
	const index = Math.floor(Math.random() * words5letters.length);
	return words5letters[index];
};
