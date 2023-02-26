import { defineStore } from 'pinia';

interface IAuthStore {
  email: string,
  name: string,
  isAdmin: boolean,
  token: string,
  refeshToken: string,
}

const defaultState: IAuthStore = {
  email: '',
  name: '',
  isAdmin: false,
  token: '',
  refeshToken: '',
}

export const authStore = defineStore({
  id: 'auth',

  state: () => (defaultState),

  actions: {
    setDefaultToken() {
      const storateToken = localStorage.getItem('session_token') || '';
      if (storateToken) {
        const data = parseJwt(storateToken);
        const { email, name, role } = data.payload;

        this.email = email;
        this.name = name;
        this.isAdmin = role === 'admin';
        this.token = storateToken;
      }

      return;
    },
    setAuthStore(token: string) {
      const data = parseJwt(token);
      const { email, name, role } = data.payload;

      this.email = email;
      this.name = name;
      this.isAdmin = role === 'admin';
      this.token = token;
    }
  },

  getters: {
  },
});

function parseJwt (token: string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}
