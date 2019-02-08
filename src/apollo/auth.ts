import { EventEmitter } from 'events';
import decode from 'jwt-decode';

export const AUTH_TOKEN_KEY = 'retro_token';

class Auth extends EventEmitter {
  get authTokenHeader() {
    return localStorage.getItem(AUTH_TOKEN_KEY)
      ? `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`
      : '';
  }

  get rawAuthToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  get decodedToken() {
    const raw = this.rawAuthToken;
    if (raw) {
      return decode(raw);
    }
    return raw;
  }

  storeAuthToken = token => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    const decoded = decode(token);
    this.emit('CHANGED', decoded);
  };
}

export default new Auth();
