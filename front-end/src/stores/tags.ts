import { defineStore } from 'pinia';
import axios from '@/bootstrap/api-interceptor';

const defaultState = {
  tags: [] as Record<string, any>[],
}

export const useTagStore = defineStore({
  id: 'tags',

  state: () => ( defaultState ),

  actions: {
    setTagStore(tags: Record<string, any>[]) {
      this.tags = [...tags];
    },

    async getTags(filterValue?: string, page?: number) {
      await axios.get(`/api/tags`, {
        // params: {
        //   page: 1,
        // }
      })
        .then((res: any) => {
          let tags = res;
          if (filterValue) {
            tags = res.filter((tag: Record<string, any>) => tag.content.toLowerCase().includes(filterValue.toLowerCase()));
          }
          this.setTagStore(tags);
        })
        // .catch((error: Error) => {
        //   alert('Lấy dữ liệu thất bại');
        // })
    }
  },

  getters: {
    tagOptions(): Record<string, any>[] {
      return this.tags.map((tag: Record<string, any>) => {
        return {
          label: tag.content,
          value: tag.id,
        }
      })
    },
    tagOptionsLabel(): Record<string, any>[] {
      return this.tags.map((tag: Record<string, any>) => {
        return {
          label: tag.content,
          value: tag.content,
        }
      })
    }

  },
});
