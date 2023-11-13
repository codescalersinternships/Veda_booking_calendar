import { AxiosResponse } from 'axios';
import { UserAuthFormResponse, ResponseWrapper, UserRole } from '@/utils/types';
import parseJwt from '../utils/parse_jwt';
import http from './axios';

export class UserApiProvider {
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

  async getRequestedUser(): Promise<ResponseWrapper<UserAuthFormResponse>> {
    try {
      const userresponse: AxiosResponse<ResponseWrapper<UserAuthFormResponse>> = await http.get(
        import.meta.env.VITE_SERVER_DOMAIN + 'api/users/me/',
      );
      sessionStorage.setItem('vedaUserRole', userresponse.data.data?.role || '');
      return { message: userresponse.data.message, data: userresponse.data.data, isError: false };
    } catch (error: any) {
      return { message: error.response ? error.response.data.message : error.message, isError: true };
    }
  }

  async isAdmin() {
    return sessionStorage.getItem('vedaUserRole') === UserRole.ADMIN ? true : false;
  }

  async isUser() {
    return sessionStorage.getItem('vedaUserRole') === UserRole.USER ? true : false;
  }
}
