import { ResponseWrapper, UserForm } from '@/utils/types';
import parseJwt from '../utils/parse_jwt';
import axios from './axios';
export class AuthenticationApiProvider {
  static isAuthenticated(): boolean {
    const userToken = localStorage.getItem('veda_access_token');

    if (!userToken) {
      return false;
    }

    if (!parseJwt(userToken)) {
      return true;
    }
    return false;
  }

  async login(form: UserForm): Promise<ResponseWrapper<UserForm>> {
    try {
      const response = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + 'api/auth/signin/', form);
      console.log('response', response);
      console.log('{ message: response.response.data.message }', { message: response.response.data.message });
      return { message: response.response.data.message };
    } catch (error: any) {
      console.log(error);
      console.log('{ message: response.response.data.message }', { message: error.response.data.message });
      return { message: error.response.data.message, isError: true };
    }
  }

  isUser() {
    return false;
  }
}
