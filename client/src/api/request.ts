import { AxiosResponse } from 'axios';
import { RequestAPIData, ResponseWrapper } from '@/utils/types';
import http from './axios';

export default class RequestBoatAPIProvider {
  static async put(_request: RequestAPIData): Promise<ResponseWrapper<RequestAPIData>> {
    console.log('Put', _request);
    try {
      const response: AxiosResponse<ResponseWrapper<RequestAPIData>> = await http.put(
        import.meta.env.VITE_SERVER_DOMAIN + `api/requests/${_request.id}/`,
        _request,
      );
      return { message: response.data.message, data: response.data.data, isError: false };
    } catch (error: any) {
      console.log('error', error);
      return { message: error.response ? error.response.data.message : error.message, isError: true };
    }
  }
  static async post(_request: RequestAPIData): Promise<ResponseWrapper<RequestAPIData>> {
    console.log('Post', _request);
    try {
      const response: AxiosResponse<ResponseWrapper<RequestAPIData>> = await http.post(
        import.meta.env.VITE_SERVER_DOMAIN + 'api/requests/',
        _request,
      );
      return { message: response.data.message, data: response.data.data, isError: false };
    } catch (error: any) {
      console.log('error', error);
      return { message: error.response ? error.response.data.message : error.message, isError: true };
    }
  }

  static async get(id: number): Promise<ResponseWrapper<RequestAPIData>> {
    try {
      const response: AxiosResponse<ResponseWrapper<RequestAPIData>> = await http.get(
        import.meta.env.VITE_SERVER_DOMAIN + `api/requests/${id}`,
      );
      return { message: response.data.message, data: response.data.data, isError: false };
    } catch (error: any) {
      console.log('error', error);
      return { message: error.response ? error.response.data.message : error.message, isError: true };
    }
  }

  static async all(): Promise<ResponseWrapper<RequestAPIData[]>> {
    try {
      const response: AxiosResponse<ResponseWrapper<RequestAPIData[]>> = await http.get(
        import.meta.env.VITE_SERVER_DOMAIN + 'api/requests/',
      );
      return { message: response.data.message, data: response.data.data, isError: false };
    } catch (error: any) {
      console.log('error', error);
      return { message: error.response ? error.response.data.message : error.message, isError: true };
    }
  }

  async delete(id: number) {
    console.log('id: ', id);
  }

  async update(data: RequestAPIData, id: number): Promise<RequestAPIData> {
    console.log('Data, ', data, 'Id, ', id);
    return data;
  }
}
