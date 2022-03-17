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

const storageValue = localStorage.getItem(AuthConfig.TOKEN) || '{}';
const payloadToken = JSON.parse(storageValue);

const defaultState: IAuthState = {
  token: payloadToken.token,
  expired_at: payloadToken.expired_at,
  user: null,
};

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => defaultState,
  getters: {
    isLoggedIn: state => {
      return !!state.token 
        && !!state.expired_at
        && state.expired_at > Date.now();
    },
    timeout: state => {
      if (!state.expired_at) {
        return 0;
      }
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
      if (!payload) {
        throw new Error('Payload is not valid');
      }

      localStorage.setItem(AuthConfig.TOKEN, JSON.stringify(payload));

      const { token, expired_at } = payload;
      // TODO verify token
      this.token = token;
      this.expired_at = expired_at;

      this.registerAuthorizonzationHeader(token);
    },
    registerAuthorizonzationHeader(token: string | null) {
      // Set to local storage and axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
    async refresh() {
      if (this.expired_at && this.expired_at > Date.now()) {
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
      localStorage.removeItem(AuthConfig.TOKEN);
      this.$reset();

      // TODO redirect user to login page
    },
    async getUser() {
      this.user = await axios.get('user');
    },
  },
});
