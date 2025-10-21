export type GameState = "sign-in" | "currently-testing" | "finished";

export interface Question {
  question: string;
  choices: number[];
  answer: number;
  points: number;
}

export interface CreateFormProps {
    questionInput: any;
    index: number;
}