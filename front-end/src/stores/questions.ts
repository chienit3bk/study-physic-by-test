import { defineStore } from 'pinia';
import axios from '@/bootstrap/api-interceptor';

const defaultState = {
  questions: [] as Record<string, any>[],
}

export const useQuestionStore = defineStore({
  id: 'questions',

  state: () => ( defaultState ),

  actions: {
    setquestionstore(questions: Record<string, any>[]) {
      this.questions = [...questions];
    },

    async getQuestions() {
      await axios.get('/api/questions', {
        // params: {
        //   page: 1,
        // }
      })
        .then((res: any) => {
          this.setquestionstore(res);
        })
        .catch((error: Error) => {
          alert('Lấy dữ liệu thất bại');
        })
    }
  },

  getters: {
    questionToManage(): Record<string, any>[] {
      return this.questions.map((question: Record<string, any>) => {
        question.Tags = question.Tags.map((tag: any) => tag.id);
        return question;
      }).filter((question: Record<string, any>) => {
        return question.verify;
      })
    },

    questionFromUser(): Record<string, any>[] {
      return this.questions.map((question: Record<string, any>) => {
        question.Tags = question.Tags.map((tag: any) => tag.id);
        return question;
      }).filter((question: Record<string, any>) => {
        return !question.verify;
      })
    }
  },
});
