import { defineStore } from 'pinia';
interface IuseAuthStore {
  id: number,
  email: string,
  name: string,
  isAdmin: boolean,
  token: string,
  refeshToken: string,
}

const defaultState: IuseAuthStore = {
  email: '',
  name: '',
  isAdmin: false,
  token: '',
  refeshToken: '',
  id: 0,
}

export const useAuthStore = defineStore({
  id: 'auth',

  state: () => (defaultState),

  actions: {
    setuseAuthStore(token: string) {
      const data = parseJwt(token);
      const { email, name, role, id } = data.payload;
      this.id = id;
      this.email = email;
      this.name = name;
      this.isAdmin = role === 'admin';
      this.token = token;
    }
  },

  getters: {
    isAdminUser(): boolean {
      return this.isAdmin;
    }
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
