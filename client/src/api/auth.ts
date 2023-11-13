import { ResponseWrapper, UserForm, UserFormResponse } from '@/utils/types';
import parseJwt from '../utils/parse_jwt';
import http from './axios';
import { AxiosResponse } from 'axios';

export class AuthenticationApiProvider {
  static isAuthenticated(): boolean {
    const accessToken = localStorage.getItem('vedaAccessToken');
    if (!accessToken) {
      return false;
    }

    if (!parseJwt(accessToken)) {
      return true;
    }
    return false;
  }

  async login(form: UserForm): Promise<ResponseWrapper<UserFormResponse>> {
    try {
      const response: AxiosResponse<ResponseWrapper<UserFormResponse>> = await http.post(
        import.meta.env.VITE_SERVER_DOMAIN + 'api/auth/signin/',
        form,
      );

      localStorage.setItem('vedaAccessToken', response.data.data!.vedaAccessToken);

      const userresponse = await http.get(import.meta.env.VITE_SERVER_DOMAIN + 'api/users/1/');

      console.log('response', response);
      console.log('userresponse', userresponse);

      return { message: response.data.message, data: response.data.data, isError: false };
    } catch (error: any) {
      console.log('error', error);
      return { message: error.response ? error.response.data.message : error.message, isError: true };
    }
  }

  isUser() {
    return false;
  }
}
