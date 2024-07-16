export interface IState {
	guesses: string[];
	answers: string[];
	answer: string;
	nbOfTry: number;
	keyboard: Map<string, string>;
}
