export type QuestionType = {
  id: string,
  number: string,
  question: string,
  answers: string[],
  true_answer: string,
  instructions: string,
  level: number,
  tags: string[],
  average_time: number,
  have_answer: boolean,
};
