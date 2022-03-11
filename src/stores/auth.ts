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
      // TODO verify token
      this.token = token;

      // Set to local storage and axios
      localStorage.setItem('token', JSON.stringify(payload));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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
