// Response data
export interface IAuthResponseData {
  access_token: string;
}

export interface IUser {
  email: string;
  name: string;
}

export interface ILoginOAuthData {
  token: string;
  expired_at: number;
}
