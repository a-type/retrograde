export const AUTH_TOKEN_KEY = 'retro_token';

export const authTokenHeader = () =>
  localStorage.getItem(AUTH_TOKEN_KEY)
    ? `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`
    : '';

export const storeAuthToken = token =>
  localStorage.setItem(AUTH_TOKEN_KEY, token);
