import { DummyDataProvider } from '@/api/dummy_data';
import { BoatApiData, ResponseWrapper } from '@/utils/types';
import { AxiosResponse } from 'axios';
import http from './axios';

export default class BoatsApiProvider {
  dev = new DummyDataProvider();

  async post(data: BoatApiData): Promise<ResponseWrapper<BoatApiData>> {
    try {
      const response: AxiosResponse<ResponseWrapper<BoatApiData>> = await http.post('/api/boats/', data);
      return { message: response.data.message, data: response.data.data, isError: false };
    } catch (error: any) {
      console.log('error', error);
      return { message: error.response ? error.response.data.message : error.message, isError: true };
    }
  }

  static async all(): Promise<ResponseWrapper<BoatApiData[]>> {
    try {
      const response: AxiosResponse<ResponseWrapper<BoatApiData[]>> = await http.get('/api/boats/');
      return { message: response.data.message, data: response.data.data, isError: false };
    } catch (error: any) {
      console.log('error', error);
      return { message: error.response ? error.response.data.message : error.message, isError: true };
    }
  }

  async get(id: number) {
    console.log('id: ', id);
  }

  async delete(id: number) {
    console.log('id: ', id);
  }

  async update(data: BoatApiData, id: number): Promise<BoatApiData> {
    console.log('Data, ', data, 'Id, ', id);
    return data;
  }
}
