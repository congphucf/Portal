import { defineStore } from 'pinia';
import type {
  IUser,
  ILoginOAuthData,
} from '@/models/Auth';
import axios from '@/bootstrap/api-interceptor';
import AuthConfig from '@/configs/auth';

export interface IAuthState {
  token: null | string;
  expired_at: null | number;
  user: null | IUser;
}

const payloadToken = JSON.parse(localStorage.getItem(AuthConfig.TOKEN));

const defaultState: IAuthState = {
  token: payloadToken ? payloadToken.token : null,
  expired_at: payloadToken ? payloadToken.expired_at : null,
  user: null,
};

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => defaultState,
  getters: {
    isLoggedIn: state => {
      return !!state.token && state.expired_at > Date.now();
    },
    timeout: state => {
      return Math.round((state.expired_at - Date.now()) / 1000);
    },
    isReady: state => {
      return (route: any) => {
        const isUserRoute = route.matched
          .some((rc: any) => rc.meta.auth && rc.meta.auth !== false);

        if (isUserRoute) {
          return !!state.token;
        }

        return true;
      };
    },
  },
  actions: {
    /**
     * OAuth with token
     */
    async login(payload: ILoginOAuthData) {
      localStorage.setItem(AuthConfig.TOKEN, JSON.stringify(payload));

      const { token, expired_at } = payload;
      // TODO verify token
      this.token = token;
      this.expired_at = expired_at;

      this.registerAuthorizonzationHeader(token);
    },
    registerAuthorizonzationHeader(token: string) {
      // Set to local storage and axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
    async refresh() {
      if (this.expired_at > Date.now()) {
        this.registerAuthorizonzationHeader(this.token);
      } else {
        await axios
          .post('token/refresh', { token: this.token })
          .then(({ data }) => {
            this.login(data);
          });
      }
    },
    async logout() {
      await axios.post('logout');
      localStorage.removeItem(AuthConfig.TOKEN);
      this.$reset();

      // TODO redirect user to login page
    },
    async getUser() {
      this.user = await axios.get('user');
    },
  },
});
