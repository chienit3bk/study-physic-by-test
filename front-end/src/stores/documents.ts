import { defineStore } from 'pinia';
import axios from '@/bootstrap/api-interceptor';

const defaultState = {
  documents: [] as Record<string, any>[],
}

export const useDocumentStore = defineStore({
  id: 'documents',

  state: () => ( defaultState ),

  actions: {
    setDocumentStore(documents: Record<string, any>[]) {
      this.documents = documents;
    },

    getDocuments() {
      axios
        .get('/api/documents')
        .then((res: any) => {
          this.setDocumentStore(res);
        })
        // .catch((error: Error) => {
        //   alert('Lấy dữ liệu thất bại');
        // })
    }
  },

  getters: {

  },
});
