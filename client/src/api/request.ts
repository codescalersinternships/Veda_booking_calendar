import { AxiosResponse } from 'axios';
import { RequestAPIData, ResponseWrapper } from '@/utils/types';
import http from './axios';

export default class RequestBoatAPIProvider {
  static async put(_request: RequestAPIData): Promise<ResponseWrapper<RequestAPIData>> {
    try {
      const response: AxiosResponse<ResponseWrapper<RequestAPIData>> = await http.put(
        `/api/requests/${_request.id}/`,
        _request,
      );
      return { message: response.data.message, data: response.data.data, isError: false };
    } catch (error: any) {
      console.log('error', error);
      return { message: error.response ? error.response.data.message : error.message, isError: true };
    }
  }
  static async post(_request: RequestAPIData): Promise<ResponseWrapper<RequestAPIData>> {
    try {
      const response: AxiosResponse<ResponseWrapper<RequestAPIData>> = await http.post('/api/requests/', _request);
      return { message: response.data.message, data: response.data.data, isError: false };
    } catch (error: any) {
      console.log('error', error);
      return { message: error.response ? error.response.data.message : error.message, isError: true };
    }
  }

  static async get(id: number): Promise<ResponseWrapper<RequestAPIData>> {
    try {
      const response: AxiosResponse<ResponseWrapper<RequestAPIData>> = await http.get(`/api/requests/${id}`);
      return { message: response.data.message, data: response.data.data, isError: false };
    } catch (error: any) {
      console.log('error', error);
      return { message: error.response ? error.response.data.message : error.message, isError: true };
    }
  }

  static async all(): Promise<ResponseWrapper<RequestAPIData[]>> {
    try {
      const response: AxiosResponse<ResponseWrapper<RequestAPIData[]>> = await http.get('/api/requests/');
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
