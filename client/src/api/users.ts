import { AxiosResponse } from 'axios';
import { UserAuthFormResponse, ResponseWrapper, UserRole } from '@/utils/types';
import http from './axios';
export class UserApiProvider {
  isAuthenticated(): boolean {
    const userToken = localStorage.getItem('vedaAccessToken');
    if (userToken) {
      return true;
    }
    return false;
  }

  async getRequestedUser(): Promise<ResponseWrapper<UserAuthFormResponse>> {
    try {
      const userresponse: AxiosResponse<ResponseWrapper<UserAuthFormResponse>> = await http.get(
        import.meta.env.VITE_SERVER_DOMAIN + 'api/users/1/',
      );
      return { message: userresponse.data.message, data: userresponse.data.data, isError: false };
    } catch (error: any) {
      console.log('error', error);
      return { message: error.response ? error.response.data.message : error.message, isError: true };
    }
  }

  async isAdmin() {
    const user = await this.getRequestedUser();
    return user.data?.role === UserRole.ADMIN ? true : false;
  }

  async isUser() {
    const user = await this.getRequestedUser();
    return user.data?.role === UserRole.USER ? true : false;
  }
}
