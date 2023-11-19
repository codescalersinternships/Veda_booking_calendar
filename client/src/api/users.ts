import { AxiosResponse } from 'axios';
import { UserAuthFormResponse, ResponseWrapper, UserRole } from '@/utils/types';
import http from './axios';

export class UserApiProvider {
  async getRequestedUser(): Promise<ResponseWrapper<UserAuthFormResponse>> {
    try {
      const userresponse: AxiosResponse<ResponseWrapper<UserAuthFormResponse>> = await http.get('/api/users/me/');
      sessionStorage.setItem('vedaUserRole', userresponse.data.data?.role || '');
      return { message: userresponse.data.message, data: userresponse.data.data, isError: false };
    } catch (error: any) {
      return { message: error.response ? error.response.data.message : error.message, isError: true };
    }
  }

  static isAdmin() {
    return sessionStorage.getItem('vedaUserRole') === UserRole.ADMIN ? true : false;
  }

  static isUser() {
    return sessionStorage.getItem('vedaUserRole') === UserRole.USER ? true : false;
  }
}
