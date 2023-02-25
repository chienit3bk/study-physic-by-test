export type QuestionType = {
  id: string,
  answers: string[],
  question?: string,
  true_answer?: string,
  instructions?: string,
  level?: string,
  tags?: string[],
  average_time?: number,
  current_answer?: string,
};
