export interface IState {
	guesses: string[];
	answers: string[];
	answer: string;
	nbOfTry: number;
	wordLength: number;
	keyboard: Map<string, string>;
}
