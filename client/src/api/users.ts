import { AxiosResponse } from 'axios';
import { UserAuthFormResponse, ResponseWrapper, UserRole } from '@/utils/types';
import http from './axios';
export class UserApiProvider {
  private userResponse = this.getRequestedUser();
  async isAuthenticated(): Promise<boolean> {
    return (await this.userResponse).isError ? false : true;
  }

  async getRequestedUser(): Promise<ResponseWrapper<UserAuthFormResponse>> {
    try {
      const userresponse: AxiosResponse<ResponseWrapper<UserAuthFormResponse>> = await http.get(
        import.meta.env.VITE_SERVER_DOMAIN + 'api/users/me/',
      );
      return { message: userresponse.data.message, data: userresponse.data.data, isError: false };
    } catch (error: any) {
      return { message: error.response ? error.response.data.message : error.message, isError: true };
    }
  }

  async isAdmin() {
    return (await this.userResponse).data?.role === UserRole.ADMIN ? true : false;
  }

  async isUser() {
    return (await this.userResponse).data?.role === UserRole.USER ? true : false;
  }
}
