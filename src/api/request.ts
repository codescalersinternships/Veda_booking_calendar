import { requests } from '@/api/dummy_data';
import { RequestAPIData } from '@/utils/types';

export default class RequestBoatAPIProvider {
  async post(_request: RequestAPIData): Promise<RequestAPIData> {
    console.log('_request: ', _request);
    requests.value.push(_request);
    return _request;
  }

  async get(id: number): Promise<RequestAPIData> {
    console.log('id: ', id);
    return requests.value.filter((request: RequestAPIData) => request.id === id)[0];
  }

  async all(): Promise<RequestAPIData[]> {
    return requests.value;
  }

  async delete(id: number) {
    console.log('id: ', id);
  }

  async update(data: RequestAPIData, id: number): Promise<RequestAPIData> {
    console.log('Data, ', data, 'Id, ', id);
    return data;
  }
}
