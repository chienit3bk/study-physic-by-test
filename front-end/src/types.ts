export type QuestionType = {
  id: string,
  number: string,
  question: string,
  answers: string[],
  true_answer: string,
  instructions: string,
  level: string,
  tags: string[],
  average_time: number,
  have_answer: boolean,
};
