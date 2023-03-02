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

    async getquestions() {
      await axios.get('/api/questions')
        .then((res: any) => {
          this.setquestionstore(res);
        })
        .catch((error: Error) => {
          alert('Lấy dữ liệu thất bại');
        })
    }
  },

  getters: {
    tagOptions(): Record<string, any>[] {
      return this.questions.map((tag: Record<string, any>) => {
        return {
          label: tag.content,
          value: tag.id,
        }
      })
    }
  },
});
