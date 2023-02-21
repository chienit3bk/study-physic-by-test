import { defineStore } from 'pinia';

// interface ISendAHeartModalState {
//   activeModal: boolean,
//   activeStatusDot: boolean,
// }

// const defaultState: ISendAHeartModalState = {
//   activeModal: false,
//   activeStatusDot: false,
// };

const defaultState = {
  email: 'chienit3bk@gmail.com',
  name: 'Nguyễn Văn Chiến',
  isAdmin: true,
}

export const authStore = defineStore({
  id: 'auth',

  state: () => { return defaultState; },

  actions: {
  },

  getters: {
  },
});
