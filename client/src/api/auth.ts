import { ResponseWrapper, UserLoginForm, UserAuthFormResponse, UserRegisterForm } from '@/utils/types';
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
      return false;
    }
    return true;
  }

  async login(form: UserLoginForm): Promise<ResponseWrapper<UserAuthFormResponse>> {
    try {
      const response: AxiosResponse<ResponseWrapper<UserAuthFormResponse>> = await http.post('/api/auth/signin/', form);
      localStorage.setItem('vedaAccessToken', response.data.data!.vedaAccessToken);
      return { message: response.data.message, data: response.data.data, isError: false };
    } catch (error: any) {
      console.log('error', error);
      return { message: error.response ? error.response.data.message : error.message, isError: true };
    }
  }

  async register(form: UserRegisterForm): Promise<ResponseWrapper<UserAuthFormResponse>> {
    try {
      const response: AxiosResponse<ResponseWrapper<UserAuthFormResponse>> = await http.post('/api/auth/signup/', form);
      localStorage.setItem('vedaAccessToken', response.data.data!.vedaAccessToken);
      return { message: response.data.message, data: response.data.data, isError: false };
    } catch (error: any) {
      console.log('error', error);
      return { message: error.response ? error.response.data.message : error.message, isError: true };
    }
  }

  static logout() {
    sessionStorage.removeItem('vedaUserRole');
    localStorage.removeItem('vedaAccessToken');
  }
}
