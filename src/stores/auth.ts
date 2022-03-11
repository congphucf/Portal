import { defineStore } from 'pinia';
import type {
  IUser,
  ILoginOAuthData,
} from '@/models/Auth';
import axios from '@/bootstrap/api-interceptor';

export interface IAuthState {
  token: string;
  user: null | IUser;
}

const defaultState: IAuthState = {
  token: '',
  user: null,
};

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => defaultState,
  getters: {
    isLoggedIn: state => !!state.token,
  },
  actions: {
    /**
     * OAuth with token
     */
    async login(payload: ILoginOAuthData) {
      const { token } = payload;
      console.log('login', token);
      // TODO verify token
      this.token = token;

      // Set to local storage and axios
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = token;
    },
    async logout() {
      await axios.post('logout');
      localStorage.removeItem('token');
      this.$reset();

      // TODO redirect user to login page
    },
    async getUser() {
      this.user = await axios.get('user');
    },
  },
});
